/*
============================================================
MMA LIFE DYNASTY
MMA STYLES SYSTEM
============================================================
Responsabilidade:
- Definir estilos de luta
- Definir especialidades
- Definir atributos prioritários
- Definir vantagens e desvantagens
- Calcular compatibilidade entre estilos
- Calcular modificadores de matchup
- Servir de base para:
  - Fight Engine
  - Gameplan
  - Treinamento
  - Scouting
  - Matchmaking
  - Desenvolvimento do lutador
IMPORTANTE:
Este arquivo NÃO simula uma luta.
A simulação será responsabilidade do:
js/mma/fightEngine.js
============================================================
*/
/* ============================================================
   STYLE TYPES
============================================================ */
const MMA_STYLES = Object.freeze({
    STRIKER: "Striker",
    WRESTLER: "Wrestler",
    GRAPPLER: "Grappler",
    BALANCED: "Balanced",
    BOXER_WRESTLER: "Boxer-Wrestler",
    KICKBOXER_WRESTLER: "Kickboxer-Wrestler",
    MUAY_THAI_WRESTLER: "Muay Thai-Wrestler",
    WRESTLER_GRAPPLER: "Wrestler-Grappler",
    KICKBOXER_GRAPPLER: "Kickboxer-Grappler",
    COMPLETE_MMA: "Complete MMA"
});
/* ============================================================
   STYLE CATEGORIES
============================================================ */
const STYLE_CATEGORIES = Object.freeze({
    STRIKING: "striking",
    WRESTLING: "wrestling",
    GRAPPLING: "grappling",
    HYBRID: "hybrid",
    COMPLETE: "complete"
});
/* ============================================================
   STYLE PROFILES
============================================================ */
const STYLE_PROFILES = Object.freeze({
    [MMA_STYLES.STRIKER]: {
        id: "striker",
        name: "Striker",
        category:
            STYLE_CATEGORIES.STRIKING,
        description:
            "Lutador focado principalmente em combate em pé.",
        primaryAttributes: [
            "punching",
            "kicking",
            "strikingPower",
            "strikingAccuracy",
            "speed",
            "timing"
        ],
        secondaryAttributes: [
            "footwork",
            "headMovement",
            "defense",
            "cardio"
        ],
        strengths: [
            "distancia",
            "velocidade",
            "precisao",
            "potencia"
        ],
        weaknesses: [
            "wrestling",
            "takedownDefense",
            "groundControl"
        ],
        preferredRange:
            "standing",
        preferredPhase:
            "striking"
    },
    [MMA_STYLES.WRESTLER]: {
        id: "wrestler",
        name: "Wrestler",
        category:
            STYLE_CATEGORIES.WRESTLING,
        description:
            "Lutador especializado em quedas, controle e pressão.",
        primaryAttributes: [
            "takedowns",
            "takedownDefense",
            "wrestling",
            "strength",
            "control"
        ],
        secondaryAttributes: [
            "cardio",
            "topControl",
            "groundAndPound",
            "clinch"
        ],
        strengths: [
            "quedas",
            "pressao",
            "controle",
            "groundAndPound"
        ],
        weaknesses: [
            "longaDistancia",
            "submissions",
            "striking"
        ],
        preferredRange:
            "clinch",
        preferredPhase:
            "wrestling"
    },
    [MMA_STYLES.GRAPPLER]: {
        id: "grappler",
        name: "Grappler",
        category:
            STYLE_CATEGORIES.GRAPPLING,
        description:
            "Lutador especializado em luta de solo e finalizações.",
        primaryAttributes: [
            "submissions",
            "submissionDefense",
            "bjj",
            "groundControl",
            "transitions"
        ],
        secondaryAttributes: [
            "takedowns",
            "scrambling",
            "fightIQ",
            "patience"
        ],
        strengths: [
            "finalizacoes",
            "transicoes",
            "solo",
            "scrambles"
        ],
        weaknesses: [
            "striking",
            "takedownDefense",
            "distancia"
        ],
        preferredRange:
            "ground",
        preferredPhase:
            "grappling"
    },
    [MMA_STYLES.BALANCED]: {
        id: "balanced",
        name: "Balanced",
        category:
            STYLE_CATEGORIES.HYBRID,
        description:
            "Lutador sem uma especialidade extrema, com habilidades equilibradas.",
        primaryAttributes: [
            "striking",
            "wrestling",
            "grappling",
            "defense",
            "cardio",
            "fightIQ"
        ],
        secondaryAttributes: [
            "speed",
            "strength",
            "adaptability"
        ],
        strengths: [
            "versatilidade",
            "adaptacao",
            "consistencia"
        ],
        weaknesses: [
            "especializacao"
        ],
        preferredRange:
            "mixed",
        preferredPhase:
            "mixed"
    },
    [MMA_STYLES.BOXER_WRESTLER]: {
        id: "boxerWrestler",
        name: "Boxer-Wrestler",
        category:
            STYLE_CATEGORIES.HYBRID,
        description:
            "Boxe combinado com wrestling e controle.",
        primaryAttributes: [
            "punching",
            "boxing",
            "takedowns",
            "takedownDefense",
            "clinch",
            "cardio"
        ],
        secondaryAttributes: [
            "strikingPower",
            "footwork",
            "groundAndPound",
            "defense"
        ],
        strengths: [
            "boxe",
            "quedas",
            "clinch",
            "pressao"
        ],
        weaknesses: [
            "chutes",
            "finalizacoes"
        ],
        preferredRange:
            "mixed",
        preferredPhase:
            "mixed"
    },
    [MMA_STYLES.KICKBOXER_WRESTLER]: {
        id: "kickboxerWrestler",
        name: "Kickboxer-Wrestler",
        category:
            STYLE_CATEGORIES.HYBRID,
        description:
            "Kickboxing combinado com wrestling.",
        primaryAttributes: [
            "kicking",
            "punching",
            "takedowns",
            "takedownDefense",
            "distanceManagement",
            "cardio"
        ],
        secondaryAttributes: [
            "strikingPower",
            "clinch",
            "footwork",
            "defense"
        ],
        strengths: [
            "chutes",
            "distancia",
            "quedas",
            "pressao"
        ],
        weaknesses: [
            "finalizacoes",
            "solo"
        ],
        preferredRange:
            "mixed",
        preferredPhase:
            "mixed"
    },
    [MMA_STYLES.MUAY_THAI_WRESTLER]: {
        id: "muayThaiWrestler",
        name: "Muay Thai-Wrestler",
        category:
            STYLE_CATEGORIES.HYBRID,
        description:
            "Muay Thai, clinch e wrestling.",
        primaryAttributes: [
            "muayThai",
            "kicking",
            "clinch",
            "takedowns",
            "takedownDefense",
            "strength"
        ],
        secondaryAttributes: [
            "knees",
            "elbows",
            "cardio",
            "groundAndPound"
        ],
        strengths: [
            "clinch",
            "joelhadas",
            "cotoveladas",
            "quedas"
        ],
        weaknesses: [
            "boxe puro",
            "finalizacoes"
        ],
        preferredRange:
            "clinch",
        preferredPhase:
            "mixed"
    },
    [MMA_STYLES.WRESTLER_GRAPPLER]: {
        id: "wrestlerGrappler",
        name: "Wrestler-Grappler",
        category:
            STYLE_CATEGORIES.HYBRID,
        description:
            "Wrestling para levar a luta ao solo e grappling para finalizar.",
        primaryAttributes: [
            "takedowns",
            "wrestling",
            "submissions",
            "groundControl",
            "transitions",
            "scrambling"
        ],
        secondaryAttributes: [
            "takedownDefense",
            "strength",
            "cardio",
            "fightIQ"
        ],
        strengths: [
            "quedas",
            "controle",
            "finalizacoes",
            "scrambles"
        ],
        weaknesses: [
            "striking",
            "longaDistancia"
        ],
        preferredRange:
            "ground",
        preferredPhase:
            "wrestling"
    },
    [MMA_STYLES.KICKBOXER_GRAPPLER]: {
        id: "kickboxerGrappler",
        name: "Kickboxer-Grappler",
        category:
            STYLE_CATEGORIES.HYBRID,
        description:
            "Kickboxing combinado com grappling.",
        primaryAttributes: [
            "kicking",
            "punching",
            "submissions",
            "groundControl",
            "transitions",
            "distanceManagement"
        ],
        secondaryAttributes: [
            "takedowns",
            "footwork",
            "fightIQ",
            "defense"
        ],
        strengths: [
            "distancia",
            "chutes",
            "finalizacoes",
            "transicoes"
        ],
        weaknesses: [
            "wrestling",
            "pressao"
        ],
        preferredRange:
            "mixed",
        preferredPhase:
            "mixed"
    },
    [MMA_STYLES.COMPLETE_MMA]: {
        id: "completeMMA",
        name: "Complete MMA",
        category:
            STYLE_CATEGORIES.COMPLETE,
        description:
            "Lutador completo e altamente adaptável em todas as áreas.",
        primaryAttributes: [
            "striking",
            "wrestling",
            "grappling",
            "defense",
            "cardio",
            "fightIQ",
            "adaptability"
        ],
        secondaryAttributes: [
            "speed",
            "strength",
            "timing",
            "composure"
        ],
        strengths: [
            "versatilidade",
            "adaptacao",
            "equilibrio",
            "fightIQ"
        ],
        weaknesses: [],
        preferredRange:
            "mixed",
        preferredPhase:
            "mixed"
    }
});
/* ============================================================
   STYLE IDs
============================================================ */
function getStyleId(
    style
) {
    const profile =
        STYLE_PROFILES[style];
    if (profile) {
        return profile.id;
    }
    const normalized =
        String(
            style || ""
        )
            .trim()
            .toLowerCase();
    const found =
        Object.values(
            STYLE_PROFILES
        ).find(
            profile =>
                profile.id.toLowerCase() ===
                    normalized ||
                profile.name.toLowerCase() ===
                    normalized
        );
    return found
        ? found.id
        : null;
}
/* ============================================================
   GET STYLE
============================================================ */
function getStyleProfile(
    style
) {
    if (!style) {
        return null;
    }
    if (
        STYLE_PROFILES[style]
    ) {
        return STYLE_PROFILES[style];
    }
    const normalized =
        String(
            style
        )
            .trim()
            .toLowerCase();
    return (
        Object.values(
            STYLE_PROFILES
        ).find(
            profile =>
                profile.id.toLowerCase() ===
                    normalized ||
                profile.name.toLowerCase() ===
                    normalized
        ) ||
        null
    );
}
/* ============================================================
   LIST STYLES
============================================================ */
function getAllStyles() {
    return Object.values(
        STYLE_PROFILES
    );
}
function getStylesByCategory(
    category
) {
    return Object.values(
        STYLE_PROFILES
    ).filter(
        profile =>
            profile.category ===
            category
    );
}
/* ============================================================
   ATTRIBUTE PRIORITY
============================================================ */
function getPrimaryAttributes(
    style
) {
    const profile =
        getStyleProfile(
            style
        );
    return profile
        ? [...profile.primaryAttributes]
        : [];
}
function getSecondaryAttributes(
    style
) {
    const profile =
        getStyleProfile(
            style
        );
    return profile
        ? [...profile.secondaryAttributes]
        : [];
}
/* ============================================================
   STYLE SPECIALIZATION SCORE
============================================================ */
function calculateStyleSpecialization(
    fighter,
    style
) {
    if (!fighter) {
        return 0;
    }
    const profile =
        getStyleProfile(
            style
        );
    if (!profile) {
        return 0;
    }
    const attributes =
        fighter.attributes ||
        fighter;
    const primary =
        profile.primaryAttributes;
    const secondary =
        profile.secondaryAttributes;
    if (
        !primary.length
    ) {
        return 0;
    }
    let primaryTotal = 0;
    let primaryCount = 0;
    for (
        const attribute of primary
    ) {
        const value =
            Number(
                attributes[attribute]
            );
        if (
            Number.isFinite(
                value
            )
        ) {
            primaryTotal +=
                value;
            primaryCount++;
        }
    }
    let secondaryTotal = 0;
    let secondaryCount = 0;
    for (
        const attribute of secondary
    ) {
        const value =
            Number(
                attributes[attribute]
            );
        if (
            Number.isFinite(
                value
            )
        ) {
            secondaryTotal +=
                value;
            secondaryCount++;
        }
    }
    const primaryAverage =
        primaryCount > 0
            ? primaryTotal /
              primaryCount
            : 0;
    const secondaryAverage =
        secondaryCount > 0
            ? secondaryTotal /
              secondaryCount
            : primaryAverage;
    return Math.round(
        (
            primaryAverage *
            0.70
        ) +
        (
            secondaryAverage *
            0.30
        )
    );
}
/* ============================================================
   STYLE LEVEL
============================================================ */
function getStyleLevel(
    specialization
) {
    const value =
        Number(
            specialization
        );
    if (
        !Number.isFinite(
            value
        )
    ) {
        return "Unknown";
    }
    if (
        value >= 90
    ) {
        return "Elite";
    }
    if (
        value >= 80
    ) {
        return "Advanced";
    }
    if (
        value >= 70
    ) {
        return "Strong";
    }
    if (
        value >= 60
    ) {
        return "Developing";
    }
    if (
        value >= 45
    ) {
        return "Basic";
    }
    return "Weak";
}
/* ============================================================
   STYLE COMPATIBILITY MATRIX
============================================================ */
/*
Valores positivos:
- vantagem
Valores negativos:
- desvantagem
0:
- matchup neutro
A escala é propositalmente moderada.
O Fight Engine adicionará:
- atributos
- gameplan
- cardio
- alcance
- força
- fight IQ
- resistência
- RNG
*/
const STYLE_MATCHUPS = Object.freeze({
    [MMA_STYLES.STRIKER]: {
        [MMA_STYLES.STRIKER]: 0,
        [MMA_STYLES.WRESTLER]: -8,
        [MMA_STYLES.GRAPPLER]: -5,
        [MMA_STYLES.BALANCED]: 0,
        [MMA_STYLES.BOXER_WRESTLER]: -4,
        [MMA_STYLES.KICKBOXER_WRESTLER]: -5,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: -5,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -8,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: -3,
        [MMA_STYLES.COMPLETE_MMA]: -2
    },
    [MMA_STYLES.WRESTLER]: {
        [MMA_STYLES.STRIKER]: 8,
        [MMA_STYLES.WRESTLER]: 0,
        [MMA_STYLES.GRAPPLER]: 3,
        [MMA_STYLES.BALANCED]: 2,
        [MMA_STYLES.BOXER_WRESTLER]: 1,
        [MMA_STYLES.KICKBOXER_WRESTLER]: 1,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: 0,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -2,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 5,
        [MMA_STYLES.COMPLETE_MMA]: -1
    },
    [MMA_STYLES.GRAPPLER]: {
        [MMA_STYLES.STRIKER]: 5,
        [MMA_STYLES.WRESTLER]: -3,
        [MMA_STYLES.GRAPPLER]: 0,
        [MMA_STYLES.BALANCED]: 2,
        [MMA_STYLES.BOXER_WRESTLER]: 3,
        [MMA_STYLES.KICKBOXER_WRESTLER]: 3,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: 3,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -1,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 1,
        [MMA_STYLES.COMPLETE_MMA]: 0
    },
    [MMA_STYLES.BALANCED]: {
        [MMA_STYLES.STRIKER]: 0,
        [MMA_STYLES.WRESTLER]: -2,
        [MMA_STYLES.GRAPPLER]: -2,
        [MMA_STYLES.BALANCED]: 0,
        [MMA_STYLES.BOXER_WRESTLER]: 0,
        [MMA_STYLES.KICKBOXER_WRESTLER]: 0,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: 0,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -1,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 0,
        [MMA_STYLES.COMPLETE_MMA]: -2
    },
    [MMA_STYLES.BOXER_WRESTLER]: {
        [MMA_STYLES.STRIKER]: 4,
        [MMA_STYLES.WRESTLER]: -1,
        [MMA_STYLES.GRAPPLER]: -3,
        [MMA_STYLES.BALANCED]: 0,
        [MMA_STYLES.BOXER_WRESTLER]: 0,
        [MMA_STYLES.KICKBOXER_WRESTLER]: 1,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: 1,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -2,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 2,
        [MMA_STYLES.COMPLETE_MMA]: 0
    },
    [MMA_STYLES.KICKBOXER_WRESTLER]: {
        [MMA_STYLES.STRIKER]: 5,
        [MMA_STYLES.WRESTLER]: -1,
        [MMA_STYLES.GRAPPLER]: -3,
        [MMA_STYLES.BALANCED]: 0,
        [MMA_STYLES.BOXER_WRESTLER]: -1,
        [MMA_STYLES.KICKBOXER_WRESTLER]: 0,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: 1,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -2,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 2,
        [MMA_STYLES.COMPLETE_MMA]: 0
    },
    [MMA_STYLES.MUAY_THAI_WRESTLER]: {
        [MMA_STYLES.STRIKER]: 5,
        [MMA_STYLES.WRESTLER]: 0,
        [MMA_STYLES.GRAPPLER]: -3,
        [MMA_STYLES.BALANCED]: 0,
        [MMA_STYLES.BOXER_WRESTLER]: -1,
        [MMA_STYLES.KICKBOXER_WRESTLER]: -1,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: 0,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -1,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 2,
        [MMA_STYLES.COMPLETE_MMA]: 0
    },
    [MMA_STYLES.WRESTLER_GRAPPLER]: {
        [MMA_STYLES.STRIKER]: 8,
        [MMA_STYLES.WRESTLER]: 2,
        [MMA_STYLES.GRAPPLER]: 1,
        [MMA_STYLES.BALANCED]: 1,
        [MMA_STYLES.BOXER_WRESTLER]: 2,
        [MMA_STYLES.KICKBOXER_WRESTLER]: 2,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: 1,
        [MMA_STYLES.WRESTLER_GRAPPLER]: 0,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 2,
        [MMA_STYLES.COMPLETE_MMA]: 1
    },
    [MMA_STYLES.KICKBOXER_GRAPPLER]: {
        [MMA_STYLES.STRIKER]: 3,
        [MMA_STYLES.WRESTLER]: -5,
        [MMA_STYLES.GRAPPLER]: -1,
        [MMA_STYLES.BALANCED]: 0,
        [MMA_STYLES.BOXER_WRESTLER]: -2,
        [MMA_STYLES.KICKBOXER_WRESTLER]: -2,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: -2,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -2,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 0,
        [MMA_STYLES.COMPLETE_MMA]: 0
    },
    [MMA_STYLES.COMPLETE_MMA]: {
        [MMA_STYLES.STRIKER]: 2,
        [MMA_STYLES.WRESTLER]: 1,
        [MMA_STYLES.GRAPPLER]: 0,
        [MMA_STYLES.BALANCED]: 2,
        [MMA_STYLES.BOXER_WRESTLER]: 0,
        [MMA_STYLES.KICKBOXER_WRESTLER]: 0,
        [MMA_STYLES.MUAY_THAI_WRESTLER]: 0,
        [MMA_STYLES.WRESTLER_GRAPPLER]: -1,
        [MMA_STYLES.KICKBOXER_GRAPPLER]: 0,
        [MMA_STYLES.COMPLETE_MMA]: 0
    }
});
/* ============================================================
   GET MATCHUP MODIFIER
============================================================ */
function getStyleMatchupModifier(
    attackerStyle,
    opponentStyle
) {
    const attacker =
        getStyleProfile(
            attackerStyle
        );
    const opponent =
        getStyleProfile(
            opponentStyle
        );
    if (
        !attacker ||
        !opponent
    ) {
        return 0;
    }
    return (
        STYLE_MATCHUPS[
            attacker.name
        ]?.[
            opponent.name
        ] ??
        0
    );
}
/* ============================================================
   MATCHUP ANALYSIS
============================================================ */
function analyzeStyleMatchup(
    styleA,
    styleB
) {
    const profileA =
        getStyleProfile(
            styleA
        );
    const profileB =
        getStyleProfile(
            styleB
        );
    if (
        !profileA ||
        !profileB
    ) {
        return {
            valid: false,
            advantageA: 0,
            advantageB: 0,
            winner: "neutral"
        };
    }
    const advantageA =
        getStyleMatchupModifier(
            profileA.name,
            profileB.name
        );
    const advantageB =
        getStyleMatchupModifier(
            profileB.name,
            profileA.name
        );
    const net =
        advantageA -
        advantageB;
    let winner =
        "neutral";
    if (
        net >= 3
    ) {
        winner = "A";
    } else if (
        net <= -3
    ) {
        winner = "B";
    }
    return {
        valid: true,
        styleA:
            profileA.name,
        styleB:
            profileB.name,
        advantageA,
        advantageB,
        net:
            net,
        winner,
        phaseA:
            profileA.preferredPhase,
        phaseB:
            profileB.preferredPhase,
        rangeA:
            profileA.preferredRange,
        rangeB:
            profileB.preferredRange
    };
}
/* ============================================================
   STYLE EVOLUTION
============================================================ */
function calculateStyleEvolution(
    fighter,
    currentStyle,
    trainingFocus = {}
) {
    const profile =
        getStyleProfile(
            currentStyle
        );
    if (
        !profile
    ) {
        return {
            score: 0,
            direction: null
        };
    }
    const attributes =
        fighter?.attributes ||
        fighter ||
        {};
    let score =
        calculateStyleSpecialization(
            fighter,
            currentStyle
        );
    const focusValues =
        Object.values(
            trainingFocus
        );
    if (
        focusValues.length
    ) {
        const averageFocus =
            focusValues.reduce(
                (
                    total,
                    value
                ) =>
                    total +
                    safeNumber(
                        value
                    ),
                0
            ) /
            focusValues.length;
        score +=
            (
                averageFocus -
                50
            ) *
            0.10;
    }
    score =
        clamp(
            score,
            0,
            100
        );
    return {
        style:
            profile.name,
        score:
            Math.round(score),
        level:
            getStyleLevel(
                score
            ),
        direction:
            score >= 80
                ? "specialized"
                : score >= 60
                    ? "developing"
                    : "general"
    };
}
/* ============================================================
   BEST STYLE
============================================================ */
function determineBestStyle(
    fighter
) {
    if (!fighter) {
        return {
            style:
                MMA_STYLES.BALANCED,
            score: 0
        };
    }
    const results =
        getAllStyles()
            .map(
                profile => ({
                    style:
                        profile.name,
                    score:
                        calculateStyleSpecialization(
                            fighter,
                            profile.name
                        )
                })
            )
            .sort(
                (a, b) =>
                    b.score -
                    a.score
            );
    return (
        results[0] || {
            style:
                MMA_STYLES.BALANCED,
            score: 0
        }
    );
}
/* ============================================================
   STYLE CONSISTENCY
============================================================ */
function calculateStyleConsistency(
    fighter,
    style
) {
    const profile =
        getStyleProfile(
            style
        );
    if (
        !profile
    ) {
        return 0;
    }
    const primary =
        profile.primaryAttributes;
    const secondary =
        profile.secondaryAttributes;
    const attributes =
        fighter?.attributes ||
        fighter ||
        {};
    const values = [];
    for (
        const attribute of primary
    ) {
        if (
            Number.isFinite(
                Number(
                    attributes[attribute]
                )
            )
        ) {
            values.push(
                Number(
                    attributes[attribute]
                )
            );
        }
    }
    for (
        const attribute of secondary
    ) {
        if (
            Number.isFinite(
                Number(
                    attributes[attribute]
                )
            )
        ) {
            values.push(
                Number(
                    attributes[attribute]
                )
            );
        }
    }
    if (
        values.length < 2
    ) {
        return 0;
    }
    const average =
        values.reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        ) /
        values.length;
    const variance =
        values.reduce(
            (
                total,
                value
            ) =>
                total +
                Math.pow(
                    value -
                    average,
                    2
                ),
            0
        ) /
        values.length;
    const standardDeviation =
        Math.sqrt(
            variance
        );
    return Math.round(
        clamp(
            100 -
            standardDeviation *
            3,
            0,
            100
        )
    );
}
/* ============================================================
   STYLE SUMMARY
============================================================ */
function getStyleSummary(
    fighter,
    style
) {
    const profile =
        getStyleProfile(
            style
        );
    if (!profile) {
        return null;
    }
    const specialization =
        calculateStyleSpecialization(
            fighter,
            profile.name
        );
    const consistency =
        calculateStyleConsistency(
            fighter,
            profile.name
        );
    return {
        id:
            profile.id,
        name:
            profile.name,
        category:
            profile.category,
        description:
            profile.description,
        specialization,
        level:
            getStyleLevel(
                specialization
            ),
        consistency,
        primaryAttributes:
            [
                ...profile.primaryAttributes
            ],
        secondaryAttributes:
            [
                ...profile.secondaryAttributes
            ],
        strengths:
            [
                ...profile.strengths
            ],
        weaknesses:
            [
                ...profile.weaknesses
            ],
        preferredRange:
            profile.preferredRange,
        preferredPhase:
            profile.preferredPhase
    };
}
/* ============================================================
   SAFE NUMBER
============================================================ */
function safeNumber(
    value,
    fallback = 0
) {
    const number =
        Number(value);
    return Number.isFinite(
        number
    )
        ? number
        : fallback;
}
/* ============================================================
   CLAMP
============================================================ */
function clamp(
    value,
    min,
    max
) {
    const number =
        Number(value);
    if (
        !Number.isFinite(
            number
        )
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
/* ============================================================
   CLONE
============================================================ */
function cloneStyleProfile(
    profile
) {
    if (!profile) {
        return null;
    }
    return JSON.parse(
        JSON.stringify(
            profile
        )
    );
}
/* ============================================================
   VALIDATION
============================================================ */
function isValidStyle(
    style
) {
    return Boolean(
        getStyleProfile(
            style
        )
    );
}
/* ============================================================
   EXPORTS
============================================================ */
export {
    MMA_STYLES,
    STYLE_CATEGORIES,
    STYLE_PROFILES,
    STYLE_MATCHUPS,
    getStyleId,
    getStyleProfile,
    getAllStyles,
    getStylesByCategory,
    getPrimaryAttributes,
    getSecondaryAttributes,
    calculateStyleSpecialization,
    getStyleLevel,
    getStyleMatchupModifier,
    analyzeStyleMatchup,
    calculateStyleEvolution,
    determineBestStyle,
    calculateStyleConsistency,
    getStyleSummary,
    cloneStyleProfile,
    isValidStyle
};
export default {
    MMA_STYLES,
    STYLE_CATEGORIES,
    STYLE_PROFILES,
    STYLE_MATCHUPS,
    getStyleId,
    getStyleProfile,
    getAllStyles,
    getStylesByCategory,
    getPrimaryAttributes,
    getSecondaryAttributes,
    calculateStyleSpecialization,
    getStyleLevel,
    getStyleMatchupModifier,
    analyzeStyleMatchup,
    calculateStyleEvolution,
    determineBestStyle,
    calculateStyleConsistency,
    getStyleSummary,
    cloneStyleProfile,
    isValidStyle
};
