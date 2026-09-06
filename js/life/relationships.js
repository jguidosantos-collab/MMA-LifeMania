// ============================================================
// MMA LIFE DYNASTY
// LIFE — RELATIONSHIPS
// ============================================================
// Sistema de relacionamentos do personagem.
//
// Responsabilidades:
// - Criar e gerenciar relacionamentos
// - Amizades
// - Romance
// - Família
// - Afinidade
// - Confiança
// - Respeito
// - Conflitos
// - Evolução das relações ao longo do tempo
// - Consultas para outros sistemas
//
// Este módulo não controla casamento, filhos ou herança.
// Esses sistemas serão conectados posteriormente ao LIFE/DYNASTY.
// ============================================================

const RELATIONSHIPS_VERSION = 1;

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

const RELATIONSHIP_TYPES = {
    STRANGER: "stranger",
    ACQUAINTANCE: "acquaintance",
    FRIEND: "friend",
    BEST_FRIEND: "best_friend",
    RIVAL: "rival",
    ENEMY: "enemy",

    ROMANTIC_INTEREST: "romantic_interest",
    PARTNER: "partner",
    EX_PARTNER: "ex_partner",

    FAMILY: "family",
    PARENT: "parent",
    CHILD: "child",
    SIBLING: "sibling",
    GRANDPARENT: "grandparent",
    GRANDCHILD: "grandchild"
};

// ------------------------------------------------------------
// NÍVEIS DE RELACIONAMENTO
// ------------------------------------------------------------

const RELATIONSHIP_LEVELS = {
    STRANGER: 0,
    ACQUAINTANCE: 1,
    FRIEND: 2,
    CLOSE_FRIEND: 3,
    BEST_FRIEND: 4,

    ROMANTIC_INTEREST: 3,
    PARTNER: 5,

    RIVAL: -3,
    ENEMY: -5
};

// ------------------------------------------------------------
// LIMITES
// ------------------------------------------------------------

const RELATIONSHIP_LIMITS = {
    MIN_SCORE: -100,
    MAX_SCORE: 100,

    MIN_AFFINITY: 0,
    MAX_AFFINITY: 100,

    MIN_TRUST: 0,
    MAX_TRUST: 100,

    MIN_RESPECT: 0,
    MAX_RESPECT: 100,

    MIN_CLOSENESS: 0,
    MAX_CLOSENESS: 100
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

function randomId(prefix = "relation") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 9)
    );
}

// ------------------------------------------------------------
// CRIAÇÃO
// ------------------------------------------------------------

function createRelationship(data = {}) {
    const now = new Date().toISOString();

    const relationship = {
        id: data.id || randomId(),

        characterId:
            data.characterId ??
            data.playerId ??
            null,

        targetId:
            data.targetId ??
            data.personId ??
            null,

        type:
            data.type ||
            RELATIONSHIP_TYPES.ACQUAINTANCE,

        score: clamp(
            data.score ?? 0,
            RELATIONSHIP_LIMITS.MIN_SCORE,
            RELATIONSHIP_LIMITS.MAX_SCORE
        ),

        affinity: clamp(
            data.affinity ?? 50,
            RELATIONSHIP_LIMITS.MIN_AFFINITY,
            RELATIONSHIP_LIMITS.MAX_AFFINITY
        ),

        trust: clamp(
            data.trust ?? 50,
            RELATIONSHIP_LIMITS.MIN_TRUST,
            RELATIONSHIP_LIMITS.MAX_TRUST
        ),

        respect: clamp(
            data.respect ?? 50,
            RELATIONSHIP_LIMITS.MIN_RESPECT,
            RELATIONSHIP_LIMITS.MAX_RESPECT
        ),

        closeness: clamp(
            data.closeness ?? 0,
            RELATIONSHIP_LIMITS.MIN_CLOSENESS,
            RELATIONSHIP_LIMITS.MAX_CLOSENESS
        ),

        attraction: clamp(
            data.attraction ?? 0,
            0,
            100
        ),

        loyalty: clamp(
            data.loyalty ?? 50,
            0,
            100
        ),

        interactionCount:
            Number(data.interactionCount) || 0,

        positiveInteractions:
            Number(data.positiveInteractions) || 0,

        negativeInteractions:
            Number(data.negativeInteractions) || 0,

        conflicts:
            Number(data.conflicts) || 0,

        milestones:
            Array.isArray(data.milestones)
                ? clone(data.milestones)
                : [],

        history:
            Array.isArray(data.history)
                ? clone(data.history)
                : [],

        tags:
            Array.isArray(data.tags)
                ? [...data.tags]
                : [],

        notes:
            data.notes || "",

        active:
            data.active !== false,

        createdAt:
            data.createdAt || now,

        updatedAt:
            data.updatedAt || now
    };

    relationship.level =
        calculateRelationshipLevel(relationship);

    return relationship;
}

// ------------------------------------------------------------
// NORMALIZAÇÃO
// ------------------------------------------------------------

function normalizeRelationship(relationship) {
    if (!relationship) {
        return null;
    }

    const normalized = createRelationship({
        ...relationship,
        id: relationship.id
    });

    return normalized;
}

// ------------------------------------------------------------
// NÍVEL
// ------------------------------------------------------------

function calculateRelationshipLevel(relationship) {
    if (!relationship) {
        return RELATIONSHIP_LEVELS.STRANGER;
    }

    const type = relationship.type;

    if (type === RELATIONSHIP_TYPES.ENEMY) {
        return RELATIONSHIP_LEVELS.ENEMY;
    }

    if (type === RELATIONSHIP_TYPES.RIVAL) {
        return RELATIONSHIP_LEVELS.RIVAL;
    }

    if (type === RELATIONSHIP_TYPES.PARTNER) {
        return RELATIONSHIP_LEVELS.PARTNER;
    }

    if (
        type === RELATIONSHIP_TYPES.ROMANTIC_INTEREST
    ) {
        return RELATIONSHIP_LEVELS.ROMANTIC_INTEREST;
    }

    const score = Number(relationship.score) || 0;

    if (score >= 80) {
        return RELATIONSHIP_LEVELS.BEST_FRIEND;
    }

    if (score >= 55) {
        return RELATIONSHIP_LEVELS.CLOSE_FRIEND;
    }

    if (score >= 25) {
        return RELATIONSHIP_LEVELS.FRIEND;
    }

    if (score >= 0) {
        return RELATIONSHIP_LEVELS.ACQUAINTANCE;
    }

    if (score <= -80) {
        return RELATIONSHIP_LEVELS.ENEMY;
    }

    if (score <= -40) {
        return RELATIONSHIP_LEVELS.RIVAL;
    }

    return RELATIONSHIP_LEVELS.STRANGER;
}

function getRelationshipLevel(relationship) {
    return calculateRelationshipLevel(relationship);
}

function getRelationshipLevelName(level) {
    switch (level) {
        case RELATIONSHIP_LEVELS.BEST_FRIEND:
            return "Melhor Amigo";

        case RELATIONSHIP_LEVELS.CLOSE_FRIEND:
            return "Amigo Próximo";

        case RELATIONSHIP_LEVELS.FRIEND:
            return "Amigo";

        case RELATIONSHIP_LEVELS.ACQUAINTANCE:
            return "Conhecido";

        case RELATIONSHIP_LEVELS.RIVAL:
            return "Rival";

        case RELATIONSHIP_LEVELS.ENEMY:
            return "Inimigo";

        default:
            return "Desconhecido";
    }
}

// ------------------------------------------------------------
// SCORE
// ------------------------------------------------------------

function calculateRelationshipScore(relationship) {
    if (!relationship) {
        return 0;
    }

    const affinity =
        Number(relationship.affinity) || 0;

    const trust =
        Number(relationship.trust) || 0;

    const respect =
        Number(relationship.respect) || 0;

    const closeness =
        Number(relationship.closeness) || 0;

    const loyalty =
        Number(relationship.loyalty) || 0;

    const positive =
        affinity * 0.30 +
        trust * 0.20 +
        respect * 0.20 +
        closeness * 0.15 +
        loyalty * 0.15;

    return clamp(
        Math.round(positive),
        0,
        100
    );
}

// ------------------------------------------------------------
// ESTADO
// ------------------------------------------------------------

function ensureRelationshipsState(state) {
    if (!state || typeof state !== "object") {
        return null;
    }

    if (!state.life) {
        state.life = {};
    }

    if (!Array.isArray(state.life.relationships)) {
        state.life.relationships = [];
    }

    return state.life.relationships;
}

// ------------------------------------------------------------
// BUSCA
// ------------------------------------------------------------

function getRelationships(state) {
    const relationships =
        ensureRelationshipsState(state);

    if (!relationships) {
        return [];
    }

    return relationships.map(clone);
}

function getRelationship(state, relationshipId) {
    const relationships =
        ensureRelationshipsState(state);

    if (!relationships) {
        return null;
    }

    const id = normalizeId(relationshipId);

    const relationship =
        relationships.find(
            item =>
                normalizeId(item.id) === id
        );

    return relationship
        ? clone(relationship)
        : null;
}

function findRelationship(
    state,
    characterId,
    targetId
) {
    const relationships =
        ensureRelationshipsState(state);

    if (!relationships) {
        return null;
    }

    const character =
        normalizeId(characterId);

    const target =
        normalizeId(targetId);

    const relationship =
        relationships.find(item =>
            normalizeId(item.characterId) === character &&
            normalizeId(item.targetId) === target
        );

    return relationship
        ? clone(relationship)
        : null;
}

// ------------------------------------------------------------
// FILTROS
// ------------------------------------------------------------

function getRelationshipsByType(
    state,
    type
) {
    const relationships =
        ensureRelationshipsState(state);

    if (!relationships) {
        return [];
    }

    return relationships
        .filter(
            item =>
                item.type === type &&
                item.active !== false
        )
        .map(clone);
}

function getFriends(state) {
    return getRelationships(state)
        .filter(item =>
            item.type === RELATIONSHIP_TYPES.FRIEND ||
            item.type === RELATIONSHIP_TYPES.BEST_FRIEND
        );
}

function getFamilyRelationships(state) {
    return getRelationships(state)
        .filter(item =>
            item.type === RELATIONSHIP_TYPES.FAMILY ||
            item.type === RELATIONSHIP_TYPES.PARENT ||
            item.type === RELATIONSHIP_TYPES.CHILD ||
            item.type === RELATIONSHIP_TYPES.SIBLING ||
            item.type === RELATIONSHIP_TYPES.GRANDPARENT ||
            item.type === RELATIONSHIP_TYPES.GRANDCHILD
        );
}

function getRomanticRelationships(state) {
    return getRelationships(state)
        .filter(item =>
            item.type ===
                RELATIONSHIP_TYPES.ROMANTIC_INTEREST ||
            item.type ===
                RELATIONSHIP_TYPES.PARTNER ||
            item.type ===
                RELATIONSHIP_TYPES.EX_PARTNER
        );
}

function getRivals(state) {
    return getRelationships(state)
        .filter(item =>
            item.type === RELATIONSHIP_TYPES.RIVAL ||
            item.type === RELATIONSHIP_TYPES.ENEMY
        );
}

// ------------------------------------------------------------
// ADICIONAR
// ------------------------------------------------------------

function addRelationship(
    state,
    data
) {
    const relationships =
        ensureRelationshipsState(state);

    if (!relationships) {
        return null;
    }

    const relationship =
        createRelationship(data);

    relationships.push(relationship);

    return clone(relationship);
}

// ------------------------------------------------------------
// ATUALIZAR
// ------------------------------------------------------------

function updateRelationship(
    state,
    relationshipId,
    updates = {}
) {
    const relationships =
        ensureRelationshipsState(state);

    if (!relationships) {
        return null;
    }

    const id =
        normalizeId(relationshipId);

    const index =
        relationships.findIndex(
            item =>
                normalizeId(item.id) === id
        );

    if (index === -1) {
        return null;
    }

    relationships[index] = {
        ...relationships[index],
        ...clone(updates),
        updatedAt:
            new Date().toISOString()
    };

    relationships[index].score =
        clamp(
            relationships[index].score,
            RELATIONSHIP_LIMITS.MIN_SCORE,
            RELATIONSHIP_LIMITS.MAX_SCORE
        );

    relationships[index].level =
        calculateRelationshipLevel(
            relationships[index]
        );

    return clone(relationships[index]);
}

// ------------------------------------------------------------
// REMOVER
// ------------------------------------------------------------

function removeRelationship(
    state,
    relationshipId
) {
    const relationships =
        ensureRelationshipsState(state);

    if (!relationships) {
        return false;
    }

    const id =
        normalizeId(relationshipId);

    const index =
        relationships.findIndex(
            item =>
                normalizeId(item.id) === id
        );

    if (index === -1) {
        return false;
    }

    relationships.splice(index, 1);

    return true;
}

// ------------------------------------------------------------
// ALTERAÇÃO DE ATRIBUTOS
// ------------------------------------------------------------

function modifyRelationship(
    state,
    relationshipId,
    changes = {}
) {
    const relationship =
        getRelationship(
            state,
            relationshipId
        );

    if (!relationship) {
        return null;
    }

    const updates = {};

    if (changes.score !== undefined) {
        updates.score =
            clamp(
                relationship.score +
                    Number(changes.score),
                RELATIONSHIP_LIMITS.MIN_SCORE,
                RELATIONSHIP_LIMITS.MAX_SCORE
            );
    }

    if (changes.affinity !== undefined) {
        updates.affinity =
            clamp(
                relationship.affinity +
                    Number(changes.affinity),
                0,
                100
            );
    }

    if (changes.trust !== undefined) {
        updates.trust =
            clamp(
                relationship.trust +
                    Number(changes.trust),
                0,
                100
            );
    }

    if (changes.respect !== undefined) {
        updates.respect =
            clamp(
                relationship.respect +
                    Number(changes.respect),
                0,
                100
            );
    }

    if (changes.closeness !== undefined) {
        updates.closeness =
            clamp(
                relationship.closeness +
                    Number(changes.closeness),
                0,
                100
            );
    }

    if (changes.attraction !== undefined) {
        updates.attraction =
            clamp(
                relationship.attraction +
                    Number(changes.attraction),
                0,
                100
            );
    }

    if (changes.loyalty !== undefined) {
        updates.loyalty =
            clamp(
                relationship.loyalty +
                    Number(changes.loyalty),
                0,
                100
            );
    }

    return updateRelationship(
        state,
        relationshipId,
        updates
    );
}

// ------------------------------------------------------------
// INTERAÇÕES
// ------------------------------------------------------------

function recordInteraction(
    state,
    relationshipId,
    interaction = {}
) {
    const relationship =
        getRelationship(
            state,
            relationshipId
        );

    if (!relationship) {
        return null;
    }

    const positive =
        interaction.positive === true;

    const negative =
        interaction.negative === true;

    const intensity =
        Number(interaction.intensity) || 1;

    const scoreChange =
        Number(interaction.scoreChange) ||
        (
            positive
                ? 3 * intensity
                : negative
                    ? -3 * intensity
                    : 0
        );

    const updates = {
        interactionCount:
            relationship.interactionCount + 1,

        score:
            clamp(
                relationship.score +
                    scoreChange,
                -100,
                100
            )
    };

    if (positive) {
        updates.positiveInteractions =
            relationship.positiveInteractions + 1;
    }

    if (negative) {
        updates.negativeInteractions =
            relationship.negativeInteractions + 1;

        updates.conflicts =
            relationship.conflicts + 1;
    }

    const historyEntry = {
        date: new Date().toISOString(),

        type:
            interaction.type ||
            "interaction",

        positive,
        negative,
        intensity,
        scoreChange,

        note:
            interaction.note ||
            ""
    };

    updates.history = [
        ...relationship.history,
        historyEntry
    ].slice(-100);

    return updateRelationship(
        state,
        relationshipId,
        updates
    );
}

// ------------------------------------------------------------
// AMIZADE
// ------------------------------------------------------------

function becomeFriends(
    state,
    characterId,
    targetId,
    data = {}
) {
    const existing =
        findRelationship(
            state,
            characterId,
            targetId
        );

    if (existing) {
        return updateRelationship(
            state,
            existing.id,
            {
                type:
                    data.type ||
                    RELATIONSHIP_TYPES.FRIEND,

                score:
                    Math.max(
                        existing.score,
                        30
                    ),

                closeness:
                    Math.max(
                        existing.closeness,
                        30
                    )
            }
        );
    }

    return addRelationship(
        state,
        {
            ...data,

            characterId,
            targetId,

            type:
                data.type ||
                RELATIONSHIP_TYPES.FRIEND,

            score:
                data.score ?? 30,

            affinity:
                data.affinity ?? 65,

            trust:
                data.trust ?? 55,

            respect:
                data.respect ?? 55,

            closeness:
                data.closeness ?? 35
        }
    );
}

// ------------------------------------------------------------
// RIVALIDADE
// ------------------------------------------------------------

function createRivalry(
    state,
    characterId,
    targetId,
    data = {}
) {
    const existing =
        findRelationship(
            state,
            characterId,
            targetId
        );

    if (existing) {
        return updateRelationship(
            state,
            existing.id,
            {
                type:
                    RELATIONSHIP_TYPES.RIVAL,

                score:
                    Math.min(
                        existing.score,
                        -40
                    )
            }
        );
    }

    return addRelationship(
        state,
        {
            ...data,

            characterId,
            targetId,

            type:
                RELATIONSHIP_TYPES.RIVAL,

            score:
                data.score ?? -40,

            affinity:
                data.affinity ?? 20,

            trust:
                data.trust ?? 20,

            respect:
                data.respect ?? 50,

            closeness:
                data.closeness ?? 20
        }
    );
}

// ------------------------------------------------------------
// ROMANCE
// ------------------------------------------------------------

function createRomanticInterest(
    state,
    characterId,
    targetId,
    data = {}
) {
    const existing =
        findRelationship(
            state,
            characterId,
            targetId
        );

    if (existing) {
        return updateRelationship(
            state,
            existing.id,
            {
                type:
                    RELATIONSHIP_TYPES.ROMANTIC_INTEREST,

                attraction:
                    Math.max(
                        existing.attraction,
                        data.attraction ?? 50
                    )
            }
        );
    }

    return addRelationship(
        state,
        {
            ...data,

            characterId,
            targetId,

            type:
                RELATIONSHIP_TYPES.ROMANTIC_INTEREST,

            score:
                data.score ?? 40,

            affinity:
                data.affinity ?? 70,

            trust:
                data.trust ?? 50,

            respect:
                data.respect ?? 50,

            closeness:
                data.closeness ?? 40,

            attraction:
                data.attraction ?? 60
        }
    );
}

// ------------------------------------------------------------
// PARCEIRO
// ------------------------------------------------------------

function setPartner(
    state,
    characterId,
    targetId,
    data = {}
) {
    const existing =
        findRelationship(
            state,
            characterId,
            targetId
        );

    if (existing) {
        return updateRelationship(
            state,
            existing.id,
            {
                ...data,

                type:
                    RELATIONSHIP_TYPES.PARTNER,

                score: 80,

                affinity:
                    Math.max(
                        existing.affinity,
                        80
                    ),

                trust:
                    Math.max(
                        existing.trust,
                        70
                    ),

                closeness:
                    Math.max(
                        existing.closeness,
                        80
                    )
            }
        );
    }

    return addRelationship(
        state,
        {
            ...data,

            characterId,
            targetId,

            type:
                RELATIONSHIP_TYPES.PARTNER,

            score: 80,

            affinity: 85,

            trust: 75,

            respect: 70,

            closeness: 85,

            attraction: 80,

            loyalty: 80
        }
    );
}

// ------------------------------------------------------------
// FAMÍLIA
// ------------------------------------------------------------

function addFamilyRelationship(
    state,
    characterId,
    targetId,
    familyType,
    data = {}
) {
    const validTypes = [
        RELATIONSHIP_TYPES.FAMILY,
        RELATIONSHIP_TYPES.PARENT,
        RELATIONSHIP_TYPES.CHILD,
        RELATIONSHIP_TYPES.SIBLING,
        RELATIONSHIP_TYPES.GRANDPARENT,
        RELATIONSHIP_TYPES.GRANDCHILD
    ];

    const type =
        validTypes.includes(familyType)
            ? familyType
            : RELATIONSHIP_TYPES.FAMILY;

    const existing =
        findRelationship(
            state,
            characterId,
            targetId
        );

    if (existing) {
        return updateRelationship(
            state,
            existing.id,
            {
                ...data,
                type
            }
        );
    }

    return addRelationship(
        state,
        {
            ...data,

            characterId,
            targetId,

            type,

            score:
                data.score ?? 70,

            affinity:
                data.affinity ?? 75,

            trust:
                data.trust ?? 75,

            respect:
                data.respect ?? 70,

            closeness:
                data.closeness ?? 80,

            loyalty:
                data.loyalty ?? 80
        }
    );
}

// ------------------------------------------------------------
// CONVERSÃO DE TIPO
// ------------------------------------------------------------

function promoteRelationship(
    state,
    relationshipId
) {
    const relationship =
        getRelationship(
            state,
            relationshipId
        );

    if (!relationship) {
        return null;
    }

    let newType =
        relationship.type;

    if (
        relationship.type ===
            RELATIONSHIP_TYPES.ACQUAINTANCE &&
        relationship.score >= 25
    ) {
        newType =
            RELATIONSHIP_TYPES.FRIEND;
    } else if (
        relationship.type ===
            RELATIONSHIP_TYPES.FRIEND &&
        relationship.score >= 80
    ) {
        newType =
            RELATIONSHIP_TYPES.BEST_FRIEND;
    }

    return updateRelationship(
        state,
        relationshipId,
        {
            type: newType
        }
    );
}

function demoteRelationship(
    state,
    relationshipId
) {
    const relationship =
        getRelationship(
            state,
            relationshipId
        );

    if (!relationship) {
        return null;
    }

    let newType =
        relationship.type;

    if (
        relationship.type ===
            RELATIONSHIP_TYPES.BEST_FRIEND &&
        relationship.score < 80
    ) {
        newType =
            RELATIONSHIP_TYPES.FRIEND;
    } else if (
        relationship.type ===
            RELATIONSHIP_TYPES.FRIEND &&
        relationship.score < 25
    ) {
        newType =
            RELATIONSHIP_TYPES.ACQUAINTANCE;
    } else if (
        relationship.type ===
            RELATIONSHIP_TYPES.ACQUAINTANCE &&
        relationship.score < 0
    ) {
        newType =
            RELATIONSHIP_TYPES.RIVAL;
    }

    return updateRelationship(
        state,
        relationshipId,
        {
            type: newType
        }
    );
}

// ------------------------------------------------------------
// RELACIONAMENTO MAIS FORTE / MAIS FRACO
// ------------------------------------------------------------

function getStrongestRelationship(state) {
    const relationships =
        getRelationships(state);

    if (!relationships.length) {
        return null;
    }

    return clone(
        relationships.sort(
            (a, b) =>
                calculateRelationshipScore(b) -
                calculateRelationshipScore(a)
        )[0]
    );
}

function getWeakestRelationship(state) {
    const relationships =
        getRelationships(state);

    if (!relationships.length) {
        return null;
    }

    return clone(
        relationships.sort(
            (a, b) =>
                calculateRelationshipScore(a) -
                calculateRelationshipScore(b)
        )[0]
    );
}

// ------------------------------------------------------------
// ESTATÍSTICAS
// ------------------------------------------------------------

function getRelationshipStats(state) {
    const relationships =
        getRelationships(state);

    const stats = {
        total: relationships.length,

        active:
            relationships.filter(
                item => item.active !== false
            ).length,

        friends:
            getFriends(state).length,

        family:
            getFamilyRelationships(state).length,

        romantic:
            getRomanticRelationships(state).length,

        rivals:
            getRivals(state).length,

        averageScore: 0,

        averageTrust: 0,

        averageRespect: 0,

        averageCloseness: 0
    };

    if (!relationships.length) {
        return stats;
    }

    stats.averageScore =
        Math.round(
            relationships.reduce(
                (sum, item) =>
                    sum +
                    Number(item.score || 0),
                0
            ) / relationships.length
        );

    stats.averageTrust =
        Math.round(
            relationships.reduce(
                (sum, item) =>
                    sum +
                    Number(item.trust || 0),
                0
            ) / relationships.length
        );

    stats.averageRespect =
        Math.round(
            relationships.reduce(
                (sum, item) =>
                    sum +
                    Number(item.respect || 0),
                0
            ) / relationships.length
        );

    stats.averageCloseness =
        Math.round(
            relationships.reduce(
                (sum, item) =>
                    sum +
                    Number(item.closeness || 0),
                0
            ) / relationships.length
        );

    return stats;
}

// ------------------------------------------------------------
// EVOLUÇÃO PASSIVA
// ------------------------------------------------------------

function applyRelationshipDecay(
    state,
    options = {}
) {
    const relationships =
        ensureRelationshipsState(state);

    if (!relationships) {
        return [];
    }

    const decay =
        Number(options.decay) || 1;

    const results = [];

    for (const relationship of relationships) {
        if (relationship.active === false) {
            continue;
        }

        const next = {
            ...relationship
        };

        if (
            relationship.type ===
                RELATIONSHIP_TYPES.FRIEND ||
            relationship.type ===
                RELATIONSHIP_TYPES.BEST_FRIEND
        ) {
            next.closeness =
                clamp(
                    relationship.closeness - decay,
                    0,
                    100
                );
        }

        if (
            relationship.type ===
                RELATIONSHIP_TYPES.ROMANTIC_INTEREST ||
            relationship.type ===
                RELATIONSHIP_TYPES.PARTNER
        ) {
            next.closeness =
                clamp(
                    relationship.closeness -
                        decay * 0.5,
                    0,
                    100
                );
        }

        next.updatedAt =
            new Date().toISOString();

        next.level =
            calculateRelationshipLevel(next);

        Object.assign(
            relationship,
            next
        );

        results.push(
            clone(relationship)
        );
    }

    return results;
}

// ------------------------------------------------------------
// VALIDAÇÃO
// ------------------------------------------------------------

function validateRelationship(
    relationship
) {
    const errors = [];

    if (!relationship) {
        return {
            valid: false,
            errors: ["Relacionamento inexistente."]
        };
    }

    if (!relationship.id) {
        errors.push(
            "Relacionamento sem ID."
        );
    }

    if (!relationship.characterId) {
        errors.push(
            "Relacionamento sem characterId."
        );
    }

    if (!relationship.targetId) {
        errors.push(
            "Relacionamento sem targetId."
        );
    }

    if (
        !Object.values(
            RELATIONSHIP_TYPES
        ).includes(relationship.type)
    ) {
        errors.push(
            "Tipo de relacionamento inválido."
        );
    }

    if (
        relationship.score < -100 ||
        relationship.score > 100
    ) {
        errors.push(
            "Score fora do intervalo."
        );
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function validateRelationships(
    relationships
) {
    if (!Array.isArray(relationships)) {
        return {
            valid: false,
            errors: [
                "Relationships deve ser um array."
            ]
        };
    }

    const errors = [];

    relationships.forEach(
        (relationship, index) => {
            const result =
                validateRelationship(
                    relationship
                );

            if (!result.valid) {
                errors.push({
                    index,
                    errors: result.errors
                });
            }
        }
    );

    return {
        valid: errors.length === 0,
        errors
    };
}

// ------------------------------------------------------------
// SNAPSHOT
// ------------------------------------------------------------

function getRelationshipsSnapshot(state) {
    return {
        version:
            RELATIONSHIPS_VERSION,

        relationships:
            getRelationships(state),

        stats:
            getRelationshipStats(state)
    };
}

// ------------------------------------------------------------
// API
// ------------------------------------------------------------

const relationshipsAPI = {
    RELATIONSHIPS_VERSION,

    RELATIONSHIP_TYPES,
    RELATIONSHIP_LEVELS,
    RELATIONSHIP_LIMITS,

    createRelationship,
    normalizeRelationship,

    calculateRelationshipLevel,
    getRelationshipLevel,
    getRelationshipLevelName,
    calculateRelationshipScore,

    ensureRelationshipsState,

    getRelationships,
    getRelationship,
    findRelationship,

    getRelationshipsByType,
    getFriends,
    getFamilyRelationships,
    getRomanticRelationships,
    getRivals,

    addRelationship,
    updateRelationship,
    removeRelationship,

    modifyRelationship,
    recordInteraction,

    becomeFriends,
    createRivalry,
    createRomanticInterest,
    setPartner,

    addFamilyRelationship,

    promoteRelationship,
    demoteRelationship,

    getStrongestRelationship,
    getWeakestRelationship,

    getRelationshipStats,

    applyRelationshipDecay,

    validateRelationship,
    validateRelationships,

    getRelationshipsSnapshot
};

export {
    RELATIONSHIPS_VERSION,

    RELATIONSHIP_TYPES,
    RELATIONSHIP_LEVELS,
    RELATIONSHIP_LIMITS,

    createRelationship,
    normalizeRelationship,

    calculateRelationshipLevel,
    getRelationshipLevel,
    getRelationshipLevelName,
    calculateRelationshipScore,

    ensureRelationshipsState,

    getRelationships,
    getRelationship,
    findRelationship,

    getRelationshipsByType,
    getFriends,
    getFamilyRelationships,
    getRomanticRelationships,
    getRivals,

    addRelationship,
    updateRelationship,
    removeRelationship,

    modifyRelationship,
    recordInteraction,

    becomeFriends,
    createRivalry,
    createRomanticInterest,
    setPartner,

    addFamilyRelationship,

    promoteRelationship,
    demoteRelationship,

    getStrongestRelationship,
    getWeakestRelationship,

    getRelationshipStats,

    applyRelationshipDecay,

    validateRelationship,
    validateRelationships,

    getRelationshipsSnapshot,

    relationshipsAPI
};

export default relationshipsAPI;
