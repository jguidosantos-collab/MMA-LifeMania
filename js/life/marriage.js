// ============================================================
// MMA LIFE DYNASTY
// LIFE — MARRIAGE
// ============================================================
// Sistema de casamento e relacionamentos conjugais.
//
// Responsabilidades:
// - Iniciar casamento
// - Compatibilidade
// - Qualidade da relação
// - Felicidade conjugal
// - Lealdade
// - Conflitos
// - Separação
// - Divórcio
// - Viúvez
// - Evolução do casamento ao longo do tempo
//
// IMPORTANTE:
// Este módulo NÃO cria filhos e NÃO controla herança.
// A integração com filhos ficará no sistema DYNASTY/LIFE.
// ============================================================

const MARRIAGE_VERSION = 1;

// ------------------------------------------------------------
// STATUS
// ------------------------------------------------------------

const MARRIAGE_STATUS = {
    DATING: "dating",
    SERIOUS: "serious",
    ENGAGED: "engaged",
    MARRIED: "married",
    SEPARATED: "separated",
    DIVORCED: "divorced",
    WIDOWED: "widowed"
};

// ------------------------------------------------------------
// LIMITES
// ------------------------------------------------------------

const MARRIAGE_LIMITS = {
    MIN_COMPATIBILITY: 0,
    MAX_COMPATIBILITY: 100,

    MIN_HAPPINESS: 0,
    MAX_HAPPINESS: 100,

    MIN_LOYALTY: 0,
    MAX_LOYALTY: 100,

    MIN_TRUST: 0,
    MAX_TRUST: 100,

    MIN_SATISFACTION: 0,
    MAX_SATISFACTION: 100,

    MIN_STABILITY: 0,
    MAX_STABILITY: 100,

    MIN_CONFLICT: 0,
    MAX_CONFLICT: 100
};

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function clone(value) {
    if (value === undefined || value === null) {
        return value;
    }

    return JSON.parse(JSON.stringify(value));
}

function normalizeId(value) {
    if (value === undefined || value === null) {
        return null;
    }

    return String(value).trim().toLowerCase();
}

function clamp(value, min, max) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.max(min, Math.min(max, number));
}

function randomId(prefix = "marriage") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 9)
    );
}

// ------------------------------------------------------------
// ESTADO
// ------------------------------------------------------------

function ensureMarriageState(state) {
    if (!state || typeof state !== "object") {
        return null;
    }

    if (!state.life) {
        state.life = {};
    }

    if (!state.life.marriage) {
        state.life.marriage = null;
    }

    if (!Array.isArray(state.life.marriageHistory)) {
        state.life.marriageHistory = [];
    }

    return state.life.marriage;
}

// ------------------------------------------------------------
// CRIAÇÃO
// ------------------------------------------------------------

function createMarriage(data = {}) {
    const now = new Date().toISOString();

    const marriage = {
        id:
            data.id ||
            randomId(),

        characterId:
            data.characterId ??
            data.playerId ??
            null,

        partnerId:
            data.partnerId ??
            data.targetId ??
            null,

        partnerName:
            data.partnerName ||
            "",

        status:
            data.status ||
            MARRIAGE_STATUS.DATING,

        relationshipId:
            data.relationshipId ||
            null,

        compatibility:
            clamp(
                data.compatibility ?? 50,
                0,
                100
            ),

        happiness:
            clamp(
                data.happiness ?? 50,
                0,
                100
            ),

        loyalty:
            clamp(
                data.loyalty ?? 70,
                0,
                100
            ),

        trust:
            clamp(
                data.trust ?? 60,
                0,
                100
            ),

        satisfaction:
            clamp(
                data.satisfaction ?? 60,
                0,
                100
            ),

        stability:
            clamp(
                data.stability ?? 60,
                0,
                100
            ),

        conflict:
            clamp(
                data.conflict ?? 10,
                0,
                100
            ),

        romance:
            clamp(
                data.romance ?? 60,
                0,
                100
            ),

        communication:
            clamp(
                data.communication ?? 60,
                0,
                100
            ),

        financialCompatibility:
            clamp(
                data.financialCompatibility ?? 50,
                0,
                100
            ),

        lifestyleCompatibility:
            clamp(
                data.lifestyleCompatibility ?? 50,
                0,
                100
            ),

        careerSupport:
            clamp(
                data.careerSupport ?? 50,
                0,
                100
            ),

        childrenCount:
            Number(data.childrenCount) || 0,

        durationWeeks:
            Number(data.durationWeeks) || 0,

        conflictsCount:
            Number(data.conflictsCount) || 0,

        reconciliations:
            Number(data.reconciliations) || 0,

        milestones:
            Array.isArray(data.milestones)
                ? clone(data.milestones)
                : [],

        history:
            Array.isArray(data.history)
                ? clone(data.history)
                : [],

        separationReason:
            data.separationReason ||
            null,

        divorceReason:
            data.divorceReason ||
            null,

        startedAt:
            data.startedAt ||
            now,

        marriedAt:
            data.marriedAt ||
            null,

        endedAt:
            data.endedAt ||
            null,

        updatedAt:
            data.updatedAt ||
            now,

        active:
            data.active !== false
    };

    marriage.quality =
        calculateMarriageQuality(marriage);

    return marriage;
}

// ------------------------------------------------------------
// COMPATIBILIDADE
// ------------------------------------------------------------

function calculateCompatibility(data = {}) {
    const values = [
        Number(data.personalityCompatibility ?? 50),
        Number(data.lifestyleCompatibility ?? 50),
        Number(data.financialCompatibility ?? 50),
        Number(data.careerCompatibility ?? 50),
        Number(data.socialCompatibility ?? 50),
        Number(data.familyCompatibility ?? 50),
        Number(data.communication ?? 50)
    ];

    const validValues =
        values.filter(Number.isFinite);

    if (!validValues.length) {
        return 50;
    }

    const average =
        validValues.reduce(
            (sum, value) => sum + value,
            0
        ) / validValues.length;

    return Math.round(
        clamp(
            average,
            0,
            100
        )
    );
}

// ------------------------------------------------------------
// QUALIDADE
// ------------------------------------------------------------

function calculateMarriageQuality(marriage) {
    if (!marriage) {
        return 0;
    }

    const compatibility =
        Number(marriage.compatibility) || 0;

    const happiness =
        Number(marriage.happiness) || 0;

    const loyalty =
        Number(marriage.loyalty) || 0;

    const trust =
        Number(marriage.trust) || 0;

    const satisfaction =
        Number(marriage.satisfaction) || 0;

    const stability =
        Number(marriage.stability) || 0;

    const romance =
        Number(marriage.romance) || 0;

    const communication =
        Number(marriage.communication) || 0;

    const conflict =
        Number(marriage.conflict) || 0;

    const score =
        compatibility * 0.18 +
        happiness * 0.16 +
        loyalty * 0.12 +
        trust * 0.12 +
        satisfaction * 0.14 +
        stability * 0.10 +
        romance * 0.08 +
        communication * 0.10 -
        conflict * 0.15;

    return Math.round(
        clamp(
            score,
            0,
            100
        )
    );
}

// ------------------------------------------------------------
// CLASSIFICAÇÃO
// ------------------------------------------------------------

function getMarriageQualityLabel(quality) {
    const value =
        Number(quality) || 0;

    if (value >= 90) {
        return "Excelente";
    }

    if (value >= 75) {
        return "Muito bom";
    }

    if (value >= 60) {
        return "Bom";
    }

    if (value >= 45) {
        return "Instável";
    }

    if (value >= 30) {
        return "Ruim";
    }

    return "Crítico";
}

// ------------------------------------------------------------
// CRIAR RELACIONAMENTO
// ------------------------------------------------------------

function startDating(
    state,
    characterId,
    partnerId,
    data = {}
) {
    const current =
        ensureMarriageState(state);

    if (current && current.active) {
        return {
            success: false,
            reason:
                "O personagem já possui um relacionamento ativo."
        };
    }

    const dating =
        createMarriage({
            ...data,

            characterId,
            partnerId,

            status:
                MARRIAGE_STATUS.DATING
        });

    state.life.marriage = dating;

    return {
        success: true,
        relationship: clone(dating)
    };
}

// ------------------------------------------------------------
// RELACIONAMENTO SÉRIO
// ------------------------------------------------------------

function makeRelationshipSerious(
    state,
    data = {}
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return {
            success: false,
            reason:
                "Nenhum relacionamento ativo."
        };
    }

    marriage.status =
        MARRIAGE_STATUS.SERIOUS;

    marriage.compatibility =
        data.compatibility !== undefined
            ? clamp(
                data.compatibility,
                0,
                100
            )
            : marriage.compatibility;

    marriage.updatedAt =
        new Date().toISOString();

    marriage.quality =
        calculateMarriageQuality(
            marriage
        );

    return {
        success: true,
        relationship: clone(marriage)
    };
}

// ------------------------------------------------------------
// NOIVADO
// ------------------------------------------------------------

function engage(
    state,
    data = {}
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return {
            success: false,
            reason:
                "Nenhum relacionamento ativo."
        };
    }

    if (
        marriage.status !==
            MARRIAGE_STATUS.DATING &&
        marriage.status !==
            MARRIAGE_STATUS.SERIOUS
    ) {
        return {
            success: false,
            reason:
                "O relacionamento não pode ser convertido em noivado."
        };
    }

    if (
        marriage.compatibility < 50
    ) {
        return {
            success: false,
            reason:
                "Compatibilidade insuficiente."
        };
    }

    marriage.status =
        MARRIAGE_STATUS.ENGAGED;

    marriage.updatedAt =
        new Date().toISOString();

    return {
        success: true,
        relationship: clone(marriage)
    };
}

// ------------------------------------------------------------
// CASAMENTO
// ------------------------------------------------------------

function marry(
    state,
    data = {}
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return {
            success: false,
            reason:
                "Nenhum relacionamento ativo."
        };
    }

    if (
        marriage.status !==
            MARRIAGE_STATUS.ENGAGED &&
        marriage.status !==
            MARRIAGE_STATUS.SERIOUS
    ) {
        return {
            success: false,
            reason:
                "O relacionamento ainda não está pronto para casamento."
        };
    }

    if (
        marriage.compatibility < 40
    ) {
        return {
            success: false,
            reason:
                "Compatibilidade muito baixa para casamento."
        };
    }

    const now =
        new Date().toISOString();

    marriage.status =
        MARRIAGE_STATUS.MARRIED;

    marriage.marriedAt =
        data.marriedAt ||
        now;

    marriage.startedAt =
        marriage.startedAt ||
        now;

    marriage.active = true;

    marriage.updatedAt = now;

    marriage.quality =
        calculateMarriageQuality(
            marriage
        );

    return {
        success: true,
        marriage: clone(marriage)
    };
}

// ------------------------------------------------------------
// ATUALIZAÇÃO
// ------------------------------------------------------------

function updateMarriage(
    state,
    updates = {}
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return null;
    }

    Object.assign(
        marriage,
        clone(updates)
    );

    marriage.compatibility =
        clamp(
            marriage.compatibility,
            0,
            100
        );

    marriage.happiness =
        clamp(
            marriage.happiness,
            0,
            100
        );

    marriage.loyalty =
        clamp(
            marriage.loyalty,
            0,
            100
        );

    marriage.trust =
        clamp(
            marriage.trust,
            0,
            100
        );

    marriage.satisfaction =
        clamp(
            marriage.satisfaction,
            0,
            100
        );

    marriage.stability =
        clamp(
            marriage.stability,
            0,
            100
        );

    marriage.conflict =
        clamp(
            marriage.conflict,
            0,
            100
        );

    marriage.romance =
        clamp(
            marriage.romance,
            0,
            100
        );

    marriage.communication =
        clamp(
            marriage.communication,
            0,
            100
        );

    marriage.financialCompatibility =
        clamp(
            marriage.financialCompatibility,
            0,
            100
        );

    marriage.lifestyleCompatibility =
        clamp(
            marriage.lifestyleCompatibility,
            0,
            100
        );

    marriage.careerSupport =
        clamp(
            marriage.careerSupport,
            0,
            100
        );

    marriage.quality =
        calculateMarriageQuality(
            marriage
        );

    marriage.updatedAt =
        new Date().toISOString();

    return clone(marriage);
}

// ------------------------------------------------------------
// MODIFICAR ATRIBUTOS
// ------------------------------------------------------------

function modifyMarriage(
    state,
    changes = {}
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return null;
    }

    const updates = {};

    const fields = [
        "compatibility",
        "happiness",
        "loyalty",
        "trust",
        "satisfaction",
        "stability",
        "conflict",
        "romance",
        "communication",
        "financialCompatibility",
        "lifestyleCompatibility",
        "careerSupport"
    ];

    for (const field of fields) {
        if (changes[field] !== undefined) {
            updates[field] =
                Number(marriage[field] || 0) +
                Number(changes[field] || 0);
        }
    }

    if (changes.childrenCount !== undefined) {
        updates.childrenCount =
            Math.max(
                0,
                Number(changes.childrenCount)
            );
    }

    if (changes.conflictsCount !== undefined) {
        updates.conflictsCount =
            Math.max(
                0,
                Number(changes.conflictsCount)
            );
    }

    return updateMarriage(
        state,
        updates
    );
}

// ------------------------------------------------------------
// EVENTO DO RELACIONAMENTO
// ------------------------------------------------------------

function recordMarriageEvent(
    state,
    event = {}
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return null;
    }

    const positive =
        event.positive === true;

    const negative =
        event.negative === true;

    const intensity =
        Number(event.intensity) || 1;

    const historyEntry = {
        date:
            new Date().toISOString(),

        type:
            event.type ||
            "relationship_event",

        positive,
        negative,
        intensity,

        note:
            event.note ||
            ""
    };

    marriage.history.push(
        historyEntry
    );

    if (positive) {
        modifyMarriage(
            state,
            {
                happiness:
                    3 * intensity,

                trust:
                    2 * intensity,

                satisfaction:
                    3 * intensity,

                romance:
                    2 * intensity,

                communication:
                    1 * intensity,

                conflict:
                    -2 * intensity
            }
        );
    }

    if (negative) {
        marriage.conflictsCount += 1;

        modifyMarriage(
            state,
            {
                happiness:
                    -4 * intensity,

                trust:
                    -3 * intensity,

                satisfaction:
                    -4 * intensity,

                stability:
                    -2 * intensity,

                romance:
                    -2 * intensity,

                communication:
                    -2 * intensity,

                conflict:
                    5 * intensity
            }
        );
    }

    marriage.updatedAt =
        new Date().toISOString();

    return clone(marriage);
}

// ------------------------------------------------------------
// CONFLITO
// ------------------------------------------------------------

function createConflict(
    state,
    severity = 1,
    reason = ""
) {
    const intensity =
        clamp(
            Number(severity) || 1,
            1,
            10
        );

    return recordMarriageEvent(
        state,
        {
            type: "conflict",

            negative: true,

            intensity,

            note:
                reason ||
                "Conflito no relacionamento."
        }
    );
}

// ------------------------------------------------------------
// RECONCILIAÇÃO
// ------------------------------------------------------------

function reconcile(
    state,
    intensity = 1
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return null;
    }

    const value =
        clamp(
            Number(intensity) || 1,
            1,
            10
        );

    marriage.reconciliations += 1;

    return recordMarriageEvent(
        state,
        {
            type: "reconciliation",

            positive: true,

            intensity: value,

            note:
                "O casal se reconciliou."
        }
    );
}

// ------------------------------------------------------------
// SEPARAÇÃO
// ------------------------------------------------------------

function separate(
    state,
    reason = ""
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return {
            success: false,
            reason:
                "Nenhum relacionamento ativo."
        };
    }

    if (
        marriage.status !==
            MARRIAGE_STATUS.MARRIED
    ) {
        return {
            success: false,
            reason:
                "Somente um casamento pode ser separado."
        };
    }

    marriage.status =
        MARRIAGE_STATUS.SEPARATED;

    marriage.separationReason =
        reason ||
        "Separação do casal.";

    marriage.updatedAt =
        new Date().toISOString();

    return {
        success: true,
        marriage: clone(marriage)
    };
}

// ------------------------------------------------------------
// DIVÓRCIO
// ------------------------------------------------------------

function divorce(
    state,
    reason = ""
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return {
            success: false,
            reason:
                "Nenhum casamento encontrado."
        };
    }

    if (
        marriage.status !==
            MARRIAGE_STATUS.MARRIED &&
        marriage.status !==
            MARRIAGE_STATUS.SEPARATED
    ) {
        return {
            success: false,
            reason:
                "O relacionamento não está em condição de divórcio."
        };
    }

    const now =
        new Date().toISOString();

    marriage.status =
        MARRIAGE_STATUS.DIVORCED;

    marriage.divorceReason =
        reason ||
        "Divórcio.";

    marriage.endedAt =
        now;

    marriage.active = false;

    marriage.updatedAt =
        now;

    addMarriageHistory(
        state,
        marriage
    );

    return {
        success: true,
        marriage: clone(marriage)
    };
}

// ------------------------------------------------------------
// VIUVEZ
// ------------------------------------------------------------

function becomeWidowed(
    state,
    reason = "Falecimento do parceiro."
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return {
            success: false,
            reason:
                "Nenhum casamento encontrado."
        };
    }

    if (
        marriage.status !==
            MARRIAGE_STATUS.MARRIED
    ) {
        return {
            success: false,
            reason:
                "O personagem não está casado."
        };
    }

    const now =
        new Date().toISOString();

    marriage.status =
        MARRIAGE_STATUS.WIDOWED;

    marriage.endedAt =
        now;

    marriage.separationReason =
        reason;

    marriage.active = false;

    marriage.updatedAt =
        now;

    addMarriageHistory(
        state,
        marriage
    );

    return {
        success: true,
        marriage: clone(marriage)
    };
}

// ------------------------------------------------------------
// HISTÓRICO
// ------------------------------------------------------------

function addMarriageHistory(
    state,
    marriage
) {
    if (!state || !state.life) {
        return;
    }

    if (
        !Array.isArray(
            state.life.marriageHistory
        )
    ) {
        state.life.marriageHistory = [];
    }

    state.life.marriageHistory.push(
        clone(marriage)
    );

    if (
        state.life.marriageHistory.length >
        50
    ) {
        state.life.marriageHistory =
            state.life.marriageHistory.slice(-50);
    }
}

function getMarriageHistory(state) {
    if (
        !state ||
        !state.life ||
        !Array.isArray(
            state.life.marriageHistory
        )
    ) {
        return [];
    }

    return state.life.marriageHistory.map(
        clone
    );
}

// ------------------------------------------------------------
// DURAÇÃO
// ------------------------------------------------------------

function calculateMarriageDurationWeeks(
    marriage,
    currentDate = new Date()
) {
    if (!marriage) {
        return 0;
    }

    const start =
        marriage.marriedAt ||
        marriage.startedAt;

    if (!start) {
        return Number(
            marriage.durationWeeks || 0
        );
    }

    const startDate =
        new Date(start);

    const endDate =
        marriage.endedAt
            ? new Date(marriage.endedAt)
            : new Date(currentDate);

    const milliseconds =
        endDate.getTime() -
        startDate.getTime();

    if (!Number.isFinite(milliseconds)) {
        return 0;
    }

    return Math.max(
        0,
        Math.floor(
            milliseconds /
            (1000 * 60 * 60 * 24 * 7)
        )
    );
}

// ------------------------------------------------------------
// EVOLUÇÃO SEMANAL
// ------------------------------------------------------------

function processMarriageWeek(
    state,
    options = {}
) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return null;
    }

    if (!marriage.active) {
        return clone(marriage);
    }

    const stabilityFactor =
        Number(
            options.stabilityFactor ?? 1
        );

    const baseDecay =
        Number(
            options.baseDecay ?? 0.25
        );

    marriage.durationWeeks += 1;

    if (
        marriage.status ===
            MARRIAGE_STATUS.MARRIED
    ) {
        marriage.happiness =
            clamp(
                marriage.happiness -
                    baseDecay *
                    stabilityFactor,
                0,
                100
            );

        marriage.satisfaction =
            clamp(
                marriage.satisfaction -
                    baseDecay *
                    0.5 *
                    stabilityFactor,
                0,
                100
            );

        marriage.conflict =
            clamp(
                marriage.conflict +
                    baseDecay *
                    0.25,
                0,
                100
            );
    }

    marriage.quality =
        calculateMarriageQuality(
            marriage
        );

    marriage.updatedAt =
        new Date().toISOString();

    return clone(marriage);
}

// ------------------------------------------------------------
// RISCO DE RUPTURA
// ------------------------------------------------------------

function calculateBreakupRisk(
    marriage
) {
    if (!marriage) {
        return 0;
    }

    if (
        marriage.status !==
            MARRIAGE_STATUS.MARRIED &&
        marriage.status !==
            MARRIAGE_STATUS.SERIOUS &&
        marriage.status !==
            MARRIAGE_STATUS.ENGAGED
    ) {
        return 0;
    }

    const quality =
        calculateMarriageQuality(
            marriage
        );

    const conflict =
        Number(marriage.conflict) || 0;

    const trust =
        Number(marriage.trust) || 0;

    let risk =
        50 -
        quality * 0.45 +
        conflict * 0.40 -
        trust * 0.15;

    return Math.round(
        clamp(
            risk,
            0,
            100
        )
    );
}

// ------------------------------------------------------------
// FELICIDADE
// ------------------------------------------------------------

function calculateMarriageHappiness(
    marriage
) {
    if (!marriage) {
        return 0;
    }

    const quality =
        calculateMarriageQuality(
            marriage
        );

    const romance =
        Number(marriage.romance) || 0;

    const satisfaction =
        Number(marriage.satisfaction) || 0;

    return Math.round(
        clamp(
            quality * 0.5 +
            romance * 0.2 +
            satisfaction * 0.3,
            0,
            100
        )
    );
}

// ------------------------------------------------------------
// STATUS
// ------------------------------------------------------------

function isMarried(state) {
    const marriage =
        ensureMarriageState(state);

    return Boolean(
        marriage &&
        marriage.status ===
            MARRIAGE_STATUS.MARRIED &&
        marriage.active !== false
    );
}

function isInRelationship(state) {
    const marriage =
        ensureMarriageState(state);

    return Boolean(
        marriage &&
        marriage.active !== false
    );
}

// ------------------------------------------------------------
// CONSULTAS
// ------------------------------------------------------------

function getMarriage(state) {
    const marriage =
        ensureMarriageState(state);

    return marriage
        ? clone(marriage)
        : null;
}

function getMarriagePartnerId(state) {
    const marriage =
        ensureMarriageState(state);

    return marriage
        ? marriage.partnerId
        : null;
}

function getMarriageQuality(state) {
    const marriage =
        ensureMarriageState(state);

    if (!marriage) {
        return 0;
    }

    return calculateMarriageQuality(
        marriage
    );
}

function getMarriageStats(state) {
    const marriage =
        ensureMarriageState(state);

    const history =
        getMarriageHistory(state);

    return {
        active:
            Boolean(
                marriage &&
                marriage.active !== false
            ),

        status:
            marriage
                ? marriage.status
                : null,

        quality:
            marriage
                ? calculateMarriageQuality(
                    marriage
                )
                : 0,

        qualityLabel:
            marriage
                ? getMarriageQualityLabel(
                    calculateMarriageQuality(
                        marriage
                    )
                )
                : "Nenhum",

        happiness:
            marriage
                ? calculateMarriageHappiness(
                    marriage
                )
                : 0,

        breakupRisk:
            marriage
                ? calculateBreakupRisk(
                    marriage
                )
                : 0,

        durationWeeks:
            marriage
                ? marriage.durationWeeks
                : 0,

        childrenCount:
            marriage
                ? marriage.childrenCount
                : 0,

        previousRelationships:
            history.length
    };
}

// ------------------------------------------------------------
// VALIDAÇÃO
// ------------------------------------------------------------

function validateMarriage(marriage) {
    const errors = [];

    if (!marriage) {
        return {
            valid: false,
            errors: [
                "Casamento inexistente."
            ]
        };
    }

    if (!marriage.id) {
        errors.push(
            "Casamento sem ID."
        );
    }

    if (!marriage.characterId) {
        errors.push(
            "Casamento sem characterId."
        );
    }

    if (!marriage.partnerId) {
        errors.push(
            "Casamento sem partnerId."
        );
    }

    if (
        !Object.values(
            MARRIAGE_STATUS
        ).includes(marriage.status)
    ) {
        errors.push(
            "Status de casamento inválido."
        );
    }

    if (
        marriage.compatibility < 0 ||
        marriage.compatibility > 100
    ) {
        errors.push(
            "Compatibilidade fora do intervalo."
        );
    }

    if (
        marriage.happiness < 0 ||
        marriage.happiness > 100
    ) {
        errors.push(
            "Felicidade fora do intervalo."
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

// ------------------------------------------------------------
// SNAPSHOT
// ------------------------------------------------------------

function getMarriageSnapshot(state) {
    return {
        version:
            MARRIAGE_VERSION,

        marriage:
            getMarriage(state),

        history:
            getMarriageHistory(state),

        stats:
            getMarriageStats(state)
    };
}

// ------------------------------------------------------------
// API
// ------------------------------------------------------------

const marriageAPI = {
    MARRIAGE_VERSION,

    MARRIAGE_STATUS,
    MARRIAGE_LIMITS,

    createMarriage,

    ensureMarriageState,

    calculateCompatibility,
    calculateMarriageQuality,
    getMarriageQualityLabel,
    calculateMarriageHappiness,
    calculateBreakupRisk,
    calculateMarriageDurationWeeks,

    startDating,
    makeRelationshipSerious,
    engage,
    marry,

    updateMarriage,
    modifyMarriage,

    recordMarriageEvent,
    createConflict,
    reconcile,

    separate,
    divorce,
    becomeWidowed,

    addMarriageHistory,
    getMarriageHistory,

    processMarriageWeek,

    isMarried,
    isInRelationship,

    getMarriage,
    getMarriagePartnerId,
    getMarriageQuality,
    getMarriageStats,

    validateMarriage,
    getMarriageSnapshot
};

export {
    MARRIAGE_VERSION,

    MARRIAGE_STATUS,
    MARRIAGE_LIMITS,

    createMarriage,

    ensureMarriageState,

    calculateCompatibility,
    calculateMarriageQuality,
    getMarriageQualityLabel,
    calculateMarriageHappiness,
    calculateBreakupRisk,
    calculateMarriageDurationWeeks,

    startDating,
    makeRelationshipSerious,
    engage,
    marry,

    updateMarriage,
    modifyMarriage,

    recordMarriageEvent,
    createConflict,
    reconcile,

    separate,
    divorce,
    becomeWidowed,

    addMarriageHistory,
    getMarriageHistory,

    processMarriageWeek,

    isMarried,
    isInRelationship,

    getMarriage,
    getMarriagePartnerId,
    getMarriageQuality,
    getMarriageStats,

    validateMarriage,
    getMarriageSnapshot,

    marriageAPI
};

export default marriageAPI;
