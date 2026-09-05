// ============================================================
// MMA LIFE DYNASTY
// PLAYER — PERSONALITY
// ============================================================
//
// Responsabilidade:
// - Criar e armazenar a personalidade do personagem
// - Representar comportamento dentro e fora do cage
// - Classificar arquétipos comportamentais
// - Controlar confiança, moral, estresse e maturidade
// - Fornecer modificadores para outros sistemas
// - Preparar integração futura com treino, mídia, carreira,
//   negócios, relacionamentos e decisões
//
// IMPORTANTE:
// Personalidade NÃO substitui atributos de luta.
//
// A personalidade influencia comportamento e decisões.
// Ela não determina automaticamente a qualidade do lutador.
// ============================================================


// ============================================================
// TRAÇOS DE PERSONALIDADE
// ============================================================

export const PERSONALITY_TRAITS = {

    discipline: "discipline",
    ambition: "ambition",
    confidence: "confidence",
    aggression: "aggression",
    composure: "composure",
    adaptability: "adaptability",
    professionalism: "professionalism",
    charisma: "charisma",
    sociability: "sociability",
    loyalty: "loyalty",
    patience: "patience",
    resilience: "resilience",
    riskTaking: "riskTaking",
    humility: "humility",
    ego: "ego",
    competitiveness: "competitiveness",
    impulsiveness: "impulsiveness",
    workEthic: "workEthic",
    mediaSavvy: "mediaSavvy",
    leadership: "leadership"
};


export const ALL_PERSONALITY_TRAITS =
    Object.values(PERSONALITY_TRAITS);


// ============================================================
// RÓTULOS
// ============================================================

export const PERSONALITY_LABELS = {

    discipline: "Discipline",
    ambition: "Ambition",
    confidence: "Confidence",
    aggression: "Aggression",
    composure: "Composure",
    adaptability: "Adaptability",
    professionalism: "Professionalism",
    charisma: "Charisma",
    sociability: "Sociability",
    loyalty: "Loyalty",
    patience: "Patience",
    resilience: "Resilience",
    riskTaking: "Risk Taking",
    humility: "Humility",
    ego: "Ego",
    competitiveness: "Competitiveness",
    impulsiveness: "Impulsiveness",
    workEthic: "Work Ethic",
    mediaSavvy: "Media Savvy",
    leadership: "Leadership"
};


// ============================================================
// LIMITES
// ============================================================

const MIN_VALUE = 1;
const MAX_VALUE = 100;


// ============================================================
// FUNÇÕES AUXILIARES
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
// GERAÇÃO DE PERSONALIDADE
// ============================================================

function generateTraitValue() {

    const roll =
        Math.random();

    // Extremamente baixo
    if (roll < 0.03) {
        return randomInt(10, 24);
    }

    // Baixo
    if (roll < 0.15) {
        return randomInt(25, 39);
    }

    // Médio
    if (roll < 0.70) {
        return randomInt(40, 69);
    }

    // Alto
    if (roll < 0.92) {
        return randomInt(70, 84);
    }

    // Muito alto
    if (roll < 0.98) {
        return randomInt(85, 94);
    }

    // Excepcional
    return randomInt(95, 100);
}


// ============================================================
// ARQUÉTIPOS
// ============================================================

export const PERSONALITY_ARCHETYPES = {

    DISCIPLINED_PROFESSIONAL: {
        id: "disciplined_professional",
        label: "Disciplined Professional"
    },

    NATURAL_LEADER: {
        id: "natural_leader",
        label: "Natural Leader"
    },

    WARRIOR: {
        id: "warrior",
        label: "Warrior"
    },

    SHOWMAN: {
        id: "showman",
        label: "Showman"
    },

    COMPETITOR: {
        id: "competitor",
        label: "Competitor"
    },

    QUIET_WORKER: {
        id: "quiet_worker",
        label: "Quiet Worker"
    },

    REBEL: {
        id: "rebel",
        label: "Rebel"
    },

    STRATEGIST: {
        id: "strategist",
        label: "Strategist"
    },

    HOTHEAD: {
        id: "hothead",
        label: "Hothead"
    },

    BALANCED: {
        id: "balanced",
        label: "Balanced"
    }
};


// ============================================================
// CRIAR PERSONALIDADE
// ============================================================

export function createPersonality(
    overrides = {}
) {

    const traits = {};

    for (
        const trait
        of ALL_PERSONALITY_TRAITS
    ) {

        if (
            overrides[trait] !== undefined
        ) {

            traits[trait] =
                clamp(
                    overrides[trait]
                );

        } else {

            traits[trait] =
                generateTraitValue();
        }
    }


    const personality = {

        traits,

        archetype:
            overrides.archetype ||
            null,

        stability:
            overrides.stability !== undefined
                ? clamp(
                    overrides.stability
                )
                : 70,

        maturity:
            overrides.maturity !== undefined
                ? clamp(
                    overrides.maturity
                )
                : 50,

        stress:
            overrides.stress !== undefined
                ? clamp(
                    overrides.stress
                )
                : 0,

        morale:
            overrides.morale !== undefined
                ? clamp(
                    overrides.morale
                )
                : 70,

        confidence:
            traits.confidence,

        lastChange: null,

        history:
            Array.isArray(
                overrides.history
            )
                ? [
                    ...overrides.history
                ]
                : []
    };


    updatePersonalityDerivedValues(
        personality
    );


    return personality;
}


// ============================================================
// OBTER TRAÇO
// ============================================================

export function getTrait(
    personality,
    trait
) {

    if (
        !personality ||
        !ALL_PERSONALITY_TRAITS.includes(
            trait
        )
    ) {
        return 0;
    }

    return clamp(
        personality.traits?.[trait] ?? 0
    );
}


// ============================================================
// DEFINIR TRAÇO
// ============================================================

export function setTrait(
    personality,
    trait,
    value,
    reason = "unknown"
) {

    if (
        !personality ||
        !ALL_PERSONALITY_TRAITS.includes(
            trait
        )
    ) {
        return false;
    }


    const oldValue =
        getTrait(
            personality,
            trait
        );


    const newValue =
        clamp(value);


    personality.traits[trait] =
        newValue;


    const change = {

        trait,

        oldValue,

        newValue,

        difference:
            newValue -
            oldValue,

        reason,

        date:
            new Date().toISOString()
    };


    personality.lastChange =
        change;


    if (
        !Array.isArray(
            personality.history
        )
    ) {

        personality.history = [];
    }


    personality.history.push(
        change
    );


    // Evita crescimento infinito
    // do histórico.
    if (
        personality.history.length > 100
    ) {

        personality.history =
            personality.history.slice(-100);
    }


    updatePersonalityDerivedValues(
        personality
    );


    return true;
}


// ============================================================
// MODIFICAR TRAÇO
// ============================================================

export function modifyTrait(
    personality,
    trait,
    amount,
    reason = "unknown"
) {

    const current =
        getTrait(
            personality,
            trait
        );


    return setTrait(
        personality,
        trait,
        current +
        safeNumber(amount),
        reason
    );
}


// ============================================================
// MODIFICAR VÁRIOS TRAÇOS
// ============================================================

export function modifyTraits(
    personality,
    changes = {},
    reason = "unknown"
) {

    if (!personality) {
        return false;
    }


    for (
        const trait
        of Object.keys(changes)
    ) {

        if (
            !ALL_PERSONALITY_TRAITS.includes(
                trait
            )
        ) {
            continue;
        }


        modifyTrait(
            personality,
            trait,
            changes[trait],
            reason
        );
    }


    updatePersonalityDerivedValues(
        personality
    );


    return true;
}


// ============================================================
// VALORES DERIVADOS
// ============================================================

export function updatePersonalityDerivedValues(
    personality
) {

    if (!personality) {
        return null;
    }


    personality.confidence =
        getTrait(
            personality,
            "confidence"
        );


    personality.archetype =
        getPersonalityArchetype(
            personality
        ).id;


    return personality;
}


// ============================================================
// MÉDIA DE PERSONALIDADE
// ============================================================

export function calculatePersonalityAverage(
    personality
) {

    if (!personality) {
        return 0;
    }


    if (
        !ALL_PERSONALITY_TRAITS.length
    ) {
        return 0;
    }


    let total = 0;


    for (
        const trait
        of ALL_PERSONALITY_TRAITS
    ) {

        total +=
            getTrait(
                personality,
                trait
            );
    }


    return Math.round(
        total /
        ALL_PERSONALITY_TRAITS.length
    );
}


// ============================================================
// DETERMINAR ARQUÉTIPO
// ============================================================

export function getPersonalityArchetype(
    personality
) {

    if (!personality) {

        return {
            ...PERSONALITY_ARCHETYPES.BALANCED
        };
    }


    const discipline =
        getTrait(
            personality,
            "discipline"
        );

    const professionalism =
        getTrait(
            personality,
            "professionalism"
        );

    const leadership =
        getTrait(
            personality,
            "leadership"
        );

    const aggression =
        getTrait(
            personality,
            "aggression"
        );

    const competitiveness =
        getTrait(
            personality,
            "competitiveness"
        );

    const charisma =
        getTrait(
            personality,
            "charisma"
        );

    const mediaSavvy =
        getTrait(
            personality,
            "mediaSavvy"
        );

    const impulsiveness =
        getTrait(
            personality,
            "impulsiveness"
        );

    const workEthic =
        getTrait(
            personality,
            "workEthic"
        );

    const adaptability =
        getTrait(
            personality,
            "adaptability"
        );

    const confidence =
        getTrait(
            personality,
            "confidence"
        );

    const ambition =
        getTrait(
            personality,
            "ambition"
        );

    const composure =
        getTrait(
            personality,
            "composure"
        );

    const patience =
        getTrait(
            personality,
            "patience"
        );

    const ego =
        getTrait(
            personality,
            "ego"
        );


    // --------------------------------------------------------
    // PROFISSIONAL DISCIPLINADO
    // --------------------------------------------------------

    if (
        discipline >= 85 &&
        professionalism >= 85 &&
        workEthic >= 80
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .DISCIPLINED_PROFESSIONAL
        };
    }


    // --------------------------------------------------------
    // LÍDER
    // --------------------------------------------------------

    if (
        leadership >= 85 &&
        charisma >= 75 &&
        confidence >= 70
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .NATURAL_LEADER
        };
    }


    // --------------------------------------------------------
    // GUERREIRO
    // --------------------------------------------------------

    if (
        aggression >= 85 &&
        competitiveness >= 80 &&
        confidence >= 75
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .WARRIOR
        };
    }


    // --------------------------------------------------------
    // SHOWMAN
    // --------------------------------------------------------

    if (
        charisma >= 85 &&
        mediaSavvy >= 80
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .SHOWMAN
        };
    }


    // --------------------------------------------------------
    // COMPETIDOR
    // --------------------------------------------------------

    if (
        competitiveness >= 90 &&
        ambition >= 80
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .COMPETITOR
        };
    }


    // --------------------------------------------------------
    // TRABALHADOR SILENCIOSO
    // --------------------------------------------------------

    if (
        workEthic >= 85 &&
        discipline >= 80 &&
        charisma < 60
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .QUIET_WORKER
        };
    }


    // --------------------------------------------------------
    // REBELDE
    // --------------------------------------------------------

    if (
        impulsiveness >= 85 &&
        ego >= 75
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .REBEL
        };
    }


    // --------------------------------------------------------
    // ESTRATEGISTA
    // --------------------------------------------------------

    if (
        adaptability >= 85 &&
        composure >= 80 &&
        patience >= 75
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .STRATEGIST
        };
    }


    // --------------------------------------------------------
    // CABEÇA QUENTE
    // --------------------------------------------------------

    if (
        impulsiveness >= 85 &&
        aggression >= 80 &&
        composure <= 40
    ) {

        return {
            ...PERSONALITY_ARCHETYPES
                .HOTHEAD
        };
    }


    // --------------------------------------------------------
    // EQUILIBRADO
    // --------------------------------------------------------

    return {
        ...PERSONALITY_ARCHETYPES
            .BALANCED
    };
}


// ============================================================
// TENDÊNCIAS COMPORTAMENTAIS
// ============================================================

export function getBehaviorTendencies(
    personality
) {

    if (!personality) {
        return {};
    }


    const trait =
        name =>
            getTrait(
                personality,
                name
            );


    return {

        trainingDiscipline:
            Math.round(
                (
                    trait("discipline") +
                    trait("workEthic") +
                    trait("professionalism")
                ) / 3
            ),

        fightAggression:
            Math.round(
                (
                    trait("aggression") +
                    trait("competitiveness")
                ) / 2
            ),

        composure:
            trait("composure"),

        mediaPotential:
            Math.round(
                (
                    trait("charisma") +
                    trait("mediaSavvy") +
                    trait("sociability")
                ) / 3
            ),

        leadership:
            Math.round(
                (
                    trait("leadership") +
                    trait("confidence") +
                    trait("charisma")
                ) / 3
            ),

        risk:
            Math.round(
                (
                    trait("riskTaking") +
                    trait("impulsiveness")
                ) / 2
            ),

        resilience:
            Math.round(
                (
                    trait("resilience") +
                    trait("patience") +
                    trait("composure")
                ) / 3
            ),

        loyalty:
            trait("loyalty"),

        ambition:
            trait("ambition"),

        ego:
            trait("ego"),

        adaptability:
            trait("adaptability")
    };
}


// ============================================================
// MODIFICADOR DE TREINO
// ============================================================

export function getTrainingModifier(
    personality
) {

    if (!personality) {
        return 1;
    }


    const discipline =
        getTrait(
            personality,
            "discipline"
        );

    const workEthic =
        getTrait(
            personality,
            "workEthic"
        );

    const professionalism =
        getTrait(
            personality,
            "professionalism"
        );


    const average =
        (
            discipline +
            workEthic +
            professionalism
        ) / 3;


    return Number(
        (
            0.70 +
            (
                average / 100
            ) * 0.60
        ).toFixed(3)
    );
}


// ============================================================
// MODIFICADOR DE MÍDIA
// ============================================================

export function getMediaModifier(
    personality
) {

    if (!personality) {
        return 1;
    }


    const charisma =
        getTrait(
            personality,
            "charisma"
        );

    const mediaSavvy =
        getTrait(
            personality,
            "mediaSavvy"
        );

    const sociability =
        getTrait(
            personality,
            "sociability"
        );


    const average =
        (
            charisma +
            mediaSavvy +
            sociability
        ) / 3;


    return Number(
        (
            0.70 +
            (
                average / 100
            ) * 0.60
        ).toFixed(3)
    );
}


// ============================================================
// MODIFICADOR DE NEGOCIAÇÃO
// ============================================================

export function getNegotiationModifier(
    personality
) {

    if (!personality) {
        return 1;
    }


    const confidence =
        getTrait(
            personality,
            "confidence"
        );

    const charisma =
        getTrait(
            personality,
            "charisma"
        );

    const professionalism =
        getTrait(
            personality,
            "professionalism"
        );


    const average =
        (
            confidence +
            charisma +
            professionalism
        ) / 3;


    return Number(
        (
            0.75 +
            (
                average / 100
            ) * 0.50
        ).toFixed(3)
    );
}


// ============================================================
// RESISTÊNCIA À PRESSÃO
// ============================================================

export function getPressureResistance(
    personality
) {

    if (!personality) {
        return 1;
    }


    const composure =
        getTrait(
            personality,
            "composure"
        );

    const resilience =
        getTrait(
            personality,
            "resilience"
        );

    const patience =
        getTrait(
            personality,
            "patience"
        );


    const average =
        (
            composure +
            resilience +
            patience
        ) / 3;


    return Number(
        (
            0.70 +
            (
                average / 100
            ) * 0.60
        ).toFixed(3)
    );
}


// ============================================================
// RESISTÊNCIA PSICOLÓGICA APÓS DERROTA
// ============================================================

export function getLossImpactResistance(
    personality
) {

    if (!personality) {
        return 1;
    }


    const resilience =
        getTrait(
            personality,
            "resilience"
        );

    const composure =
        getTrait(
            personality,
            "composure"
        );

    const humility =
        getTrait(
            personality,
            "humility"
        );


    const average =
        (
            resilience +
            composure +
            humility
        ) / 3;


    return Number(
        (
            0.70 +
            (
                average / 100
            ) * 0.60
        ).toFixed(3)
    );
}


// ============================================================
// VITÓRIA → CONFIANÇA
// ============================================================

export function applyWinConfidence(
    personality,
    intensity = 1
) {

    if (!personality) {
        return false;
    }


    const amount =
        Math.max(
            0,
            Math.min(
                10,
                Number(intensity) * 3
            )
        );


    modifyTrait(
        personality,
        "confidence",
        amount,
        "victory"
    );


    personality.morale =
        clamp(
            personality.morale +
            amount
        );


    return true;
}


// ============================================================
// DERROTA → CONFIANÇA
// ============================================================

export function applyLossConfidence(
    personality,
    intensity = 1
) {

    if (!personality) {
        return false;
    }


    const resistance =
        getLossImpactResistance(
            personality
        );


    const amount =
        Math.max(
            0,
            Math.min(
                12,
                Number(intensity) *
                4 *
                (
                    1.50 -
                    resistance
                )
            )
        );


    modifyTrait(
        personality,
        "confidence",
        -amount,
        "defeat"
    );


    personality.morale =
        clamp(
            personality.morale -
            amount
        );


    return true;
}


// ============================================================
// ESTRESSE
// ============================================================

export function addStress(
    personality,
    amount
) {

    if (!personality) {
        return false;
    }


    personality.stress =
        clamp(
            personality.stress +
            safeNumber(amount)
        );


    return true;
}


// ============================================================
// REDUZIR ESTRESSE
// ============================================================

export function reduceStress(
    personality,
    amount
) {

    if (!personality) {
        return false;
    }


    personality.stress =
        clamp(
            personality.stress -
            Math.abs(
                safeNumber(amount)
            )
        );


    return true;
}


// ============================================================
// MATURIDADE
// ============================================================

export function increaseMaturity(
    personality,
    amount = 1
) {

    if (!personality) {
        return false;
    }


    personality.maturity =
        clamp(
            personality.maturity +
            Math.abs(
                safeNumber(amount)
            )
        );


    return true;
}


// ============================================================
// ESTABILIDADE
// ============================================================

export function getPersonalityStability(
    personality
) {

    if (!personality) {
        return 0;
    }


    return clamp(
        personality.stability
    );
}


// ============================================================
// COMPATIBILIDADE DE PERSONALIDADE
// ============================================================
//
// Útil futuramente para:
//
// - amizade
// - relacionamento
// - casamento
// - treinador
// - companheiro de equipe
// - rivalidade
// - negócios
// ============================================================

export function calculatePersonalityCompatibility(
    personalityA,
    personalityB
) {

    if (
        !personalityA ||
        !personalityB
    ) {
        return 0;
    }


    let difference = 0;


    for (
        const trait
        of ALL_PERSONALITY_TRAITS
    ) {

        const a =
            getTrait(
                personalityA,
                trait
            );

        const b =
            getTrait(
                personalityB,
                trait
            );


        difference +=
            Math.abs(
                a - b
            );
    }


    const maximum =
        ALL_PERSONALITY_TRAITS.length *
        100;


    const similarity =
        1 -
        (
            difference /
            maximum
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
// CLONE
// ============================================================

export function clonePersonality(
    personality
) {

    if (!personality) {
        return null;
    }


    return JSON.parse(
        JSON.stringify(
            personality
        )
    );
}


// ============================================================
// SNAPSHOT
// ============================================================

export function createPersonalitySnapshot(
    personality
) {

    if (!personality) {
        return null;
    }


    updatePersonalityDerivedValues(
        personality
    );


    return {

        traits: {
            ...personality.traits
        },

        average:
            calculatePersonalityAverage(
                personality
            ),

        archetype:
            getPersonalityArchetype(
                personality
            ),

        morale:
            personality.morale,

        stress:
            personality.stress,

        maturity:
            personality.maturity,

        stability:
            personality.stability,

        tendencies:
            getBehaviorTendencies(
                personality
            )
    };
}


// ============================================================
// VALIDAÇÃO
// ============================================================

export function validatePersonality(
    personality
) {

    if (
        !personality ||
        typeof personality !== "object"
    ) {
        return false;
    }


    if (
        !personality.traits ||
        typeof personality.traits !== "object"
    ) {
        return false;
    }


    for (
        const trait
        of ALL_PERSONALITY_TRAITS
    ) {

        const value =
            personality.traits[trait];


        if (
            value === undefined ||
            !Number.isFinite(
                Number(value)
            )
        ) {

            return false;
        }


        if (
            Number(value) < MIN_VALUE ||
            Number(value) > MAX_VALUE
        ) {

            return false;
        }
    }


    return true;
}


// ============================================================
// PERSONALIDADE PADRÃO
// ============================================================

export function createDefaultPersonality() {

    return createPersonality({

        discipline: 65,
        ambition: 70,
        confidence: 60,
        aggression: 55,
        composure: 60,
        adaptability: 60,
        professionalism: 65,
        charisma: 50,
        sociability: 55,
        loyalty: 65,
        patience: 55,
        resilience: 65,
        riskTaking: 50,
        humility: 60,
        ego: 45,
        competitiveness: 65,
        impulsiveness: 40,
        workEthic: 70,
        mediaSavvy: 40,
        leadership: 50,

        stability: 70,
        maturity: 50,
        stress: 0,
        morale: 70
    });
}


// ============================================================
// EXPORTAÇÃO PADRÃO
// ============================================================

export default {

    PERSONALITY_TRAITS,

    ALL_PERSONALITY_TRAITS,

    PERSONALITY_LABELS,

    PERSONALITY_ARCHETYPES,

    createPersonality,

    createDefaultPersonality,

    getTrait,

    setTrait,

    modifyTrait,

    modifyTraits,

    updatePersonalityDerivedValues,

    calculatePersonalityAverage,

    getPersonalityArchetype,

    getBehaviorTendencies,

    getTrainingModifier,

    getMediaModifier,

    getNegotiationModifier,

    getPressureResistance,

    getLossImpactResistance,

    applyWinConfidence,

    applyLossConfidence,

    addStress,

    reduceStress,

    increaseMaturity,

    getPersonalityStability,

    calculatePersonalityCompatibility,

    clonePersonality,

    createPersonalitySnapshot,

    validatePersonality
};
