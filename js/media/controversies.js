/*
============================================================
MMA LIFE DYNASTY
MEDIA — CONTROVERSIES
============================================================
Responsabilidade:
- Sistema de controvérsias e polêmicas
- Gravidade das controvérsias
- Impacto em fama, reputação, popularidade e seguidores
- Impacto comercial e em patrocinadores
- Notícias relacionadas
- Recuperação de imagem
- Histórico
- Estatísticas
- Integração com database.media.controversies
Arquivo:
js/media/controversies.js
IMPORTANTE:
- Arquivo independente
- Não depende de outros módulos
- Compatível com o database global do projeto
============================================================
*/
const CONTROVERSIES_VERSION = 1;
const CONTROVERSIES_CONFIG = {
    maxActive: 100,
    maxHistory: 1000,
    severity: {
        minimum: 1,
        maximum: 100,
        starting: 10
    },
    recovery: {
        weeklyDecay: 3,
        apology: 12,
        goodBehavior: 5,
        interview: 4,
        charity: 6,
        victory: 3,
        titleWin: 5,
        retirement: 2
    },
    reputationImpact: {
        minor: -2,
        moderate: -5,
        major: -10,
        severe: -18,
        scandal: -30
    },
    fameImpact: {
        minor: 1,
        moderate: 2,
        major: 4,
        severe: 6,
        scandal: 10
    },
    popularityImpact: {
        minor: 0,
        moderate: -2,
        major: -5,
        severe: -8,
        scandal: -15
    },
    followerImpact: {
        minor: 0,
        moderate: -50,
        major: -250,
        severe: -1000,
        scandal: -5000
    }
};
const CONTROVERSY_TYPES = {
    trashTalk: "trash_talk",
    socialMedia: "social_media",
    interview: "interview",
    confrontation: "confrontation",
    unsportsmanlike: "unsportsmanlike",
    doping: "doping",
    illegalAction: "illegal_action",
    suspension: "suspension",
    contract: "contract",
    promoter: "promoter",
    teammate: "teammate",
    coach: "coach",
    rival: "rival",
    referee: "referee",
    judging: "judging",
    personal: "personal",
    legal: "legal",
    gambling: "gambling",
    lifestyle: "lifestyle",
    sponsorship: "sponsorship",
    retirement: "retirement",
    comeback: "comeback",
    family: "family",
    media: "media",
    other: "other"
};
const CONTROVERSY_LEVELS = {
    minor: {
        min: 1,
        max: 20,
        label: "Polêmica Leve"
    },
    moderate: {
        min: 21,
        max: 40,
        label: "Polêmica Moderada"
    },
    major: {
        min: 41,
        max: 60,
        label: "Polêmica Grave"
    },
    severe: {
        min: 61,
        max: 80,
        label: "Polêmica Severa"
    },
    scandal: {
        min: 81,
        max: 100,
        label: "Grande Escândalo"
    }
};
const CONTROVERSY_EVENTS = {
    statement: "statement",
    interview: "interview",
    socialPost: "social_post",
    trashTalk: "trash_talk",
    confrontation: "confrontation",
    incident: "incident",
    accusation: "accusation",
    investigation: "investigation",
    suspension: "suspension",
    apology: "apology",
    clarification: "clarification",
    charity: "charity",
    goodBehavior: "good_behavior",
    victory: "victory",
    titleWin: "title_win",
    inactivity: "inactivity",
    retirement: "retirement",
    comeback: "comeback"
};
function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function safeString(value, fallback = "") {
    return value === null || value === undefined || value === ""
        ? fallback
        : String(value);
}
function createId(prefix = "controversy") {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}
function nowISO() {
    return new Date().toISOString();
}
function getDatabase(database) {
    if (database && typeof database === "object") {
        return database;
    }
    if (typeof globalThis !== "undefined" && globalThis.database) {
        return globalThis.database;
    }
    return null;
}
function getPlayer(database) {
    const db = getDatabase(database);
    if (!db) {
        return null;
    }
    return db.player || null;
}
function getFighterId(fighter) {
    if (!fighter) return null;
    return (
        fighter.id ||
        fighter.fighterId ||
        fighter.playerId ||
        fighter.characterId ||
        null
    );
}
function getFighterName(fighter) {
    if (!fighter) {
        return "Desconhecido";
    }
    return (
        fighter.name ||
        fighter.fullName ||
        fighter.displayName ||
        fighter.nickname ||
        "Desconhecido"
    );
}
function getPlayerId(database) {
    const player = getPlayer(database);
    return player ? getFighterId(player) : null;
}
function ensureMedia(database) {
    const db = getDatabase(database);
    if (!db) {
        return null;
    }
    if (!db.media) {
        db.media = {};
    }
    return db.media;
}
function createControversiesState() {
    return {
        version: CONTROVERSIES_VERSION,
        active: [],
        history: [],
        events: [],
        statistics: {
            total: 0,
            active: 0,
            resolved: 0,
            minor: 0,
            moderate: 0,
            major: 0,
            severe: 0,
            scandal: 0,
            apologies: 0,
            investigations: 0,
            suspensions: 0,
            reputationLost: 0,
            fameGained: 0,
            followersLost: 0
        },
        lastUpdated: nowISO()
    };
}
function ensureControversies(database) {
    const media = ensureMedia(database);
    if (!media) {
        return null;
    }
    if (!media.controversies) {
        media.controversies = createControversiesState();
    }
    const state = media.controversies;
    if (!Array.isArray(state.active)) {
        state.active = [];
    }
    if (!Array.isArray(state.history)) {
        state.history = [];
    }
    if (!Array.isArray(state.events)) {
        state.events = [];
    }
    if (!state.statistics) {
        state.statistics = createControversiesState().statistics;
    }
    state.lastUpdated = nowISO();
    return state;
}
function getSeverityLevel(severity) {
    const value = clamp(severity, 1, 100);
    if (value <= 20) return "minor";
    if (value <= 40) return "moderate";
    if (value <= 60) return "major";
    if (value <= 80) return "severe";
    return "scandal";
}
function getSeverityLabel(severity) {
    const level = getSeverityLevel(severity);
    return CONTROVERSY_LEVELS[level]?.label || "Polêmica";
}
function normalizeType(type) {
    if (!type) {
        return CONTROVERSY_TYPES.other;
    }
    const value = String(type).toLowerCase();
    const valid = Object.values(CONTROVERSY_TYPES);
    if (valid.includes(value)) {
        return value;
    }
    return CONTROVERSY_TYPES.other;
}
function calculateInitialSeverity(type = CONTROVERSY_TYPES.other) {
    const base = {
        [CONTROVERSY_TYPES.trashTalk]: 15,
        [CONTROVERSY_TYPES.socialMedia]: 20,
        [CONTROVERSY_TYPES.interview]: 18,
        [CONTROVERSY_TYPES.confrontation]: 35,
        [CONTROVERSY_TYPES.unsportsmanlike]: 45,
        [CONTROVERSY_TYPES.doping]: 85,
        [CONTROVERSY_TYPES.illegalAction]: 65,
        [CONTROVERSY_TYPES.suspension]: 70,
        [CONTROVERSY_TYPES.contract]: 30,
        [CONTROVERSY_TYPES.promoter]: 30,
        [CONTROVERSY_TYPES.teammate]: 30,
        [CONTROVERSY_TYPES.coach]: 25,
        [CONTROVERSY_TYPES.rival]: 20,
        [CONTROVERSY_TYPES.referee]: 25,
        [CONTROVERSY_TYPES.judging]: 35,
        [CONTROVERSY_TYPES.personal]: 35,
        [CONTROVERSY_TYPES.legal]: 70,
        [CONTROVERSY_TYPES.gambling]: 75,
        [CONTROVERSY_TYPES.lifestyle]: 20,
        [CONTROVERSY_TYPES.sponsorship]: 25,
        [CONTROVERSY_TYPES.retirement]: 15,
        [CONTROVERSY_TYPES.comeback]: 10,
        [CONTROVERSY_TYPES.family]: 25,
        [CONTROVERSY_TYPES.media]: 20,
        [CONTROVERSY_TYPES.other]: 15
    };
    const value = base[type] ?? 15;
    return clamp(value + randomInt(-5, 8), 1, 100);
}
function calculateReputationImpact(severity) {
    const level = getSeverityLevel(severity);
    return CONTROVERSIES_CONFIG.reputationImpact[level] ?? -2;
}
function calculateFameImpact(severity) {
    const level = getSeverityLevel(severity);
    return CONTROVERSIES_CONFIG.fameImpact[level] ?? 0;
}
function calculatePopularityImpact(severity) {
    const level = getSeverityLevel(severity);
    return CONTROVERSIES_CONFIG.popularityImpact[level] ?? 0;
}
function calculateFollowerImpact(severity) {
    const level = getSeverityLevel(severity);
    return CONTROVERSIES_CONFIG.followerImpact[level] ?? 0;
}
function getControversyTitle(type, level) {
    const titles = {
        trash_talk: "Declaração polêmica antes da luta",
        social_media: "Post polêmico nas redes sociais",
        interview: "Entrevista gera repercussão",
        confrontation: "Confronto fora do octógono",
        unsportsmanlike: "Atitude antidesportiva gera críticas",
        doping: "Acusação de doping causa repercussão",
        illegal_action: "Ação ilegal gera controvérsia",
        suspension: "Suspensão gera repercussão",
        contract: "Disputa contratual ganha destaque",
        promoter: "Conflito com a organização",
        teammate: "Conflito com companheiro de equipe",
        coach: "Conflito com treinador",
        rival: "Conflito com rival",
        referee: "Críticas à arbitragem",
        judging: "Críticas à decisão dos juízes",
        personal: "Polêmica pessoal ganha destaque",
        legal: "Questão legal chama atenção",
        gambling: "Polêmica envolvendo apostas",
        lifestyle: "Comportamento fora do cage gera críticas",
        sponsorship: "Polêmica envolvendo patrocinador",
        retirement: "Declaração sobre aposentadoria gera debate",
        comeback: "Retorno gera repercussão",
        family: "Questão familiar vira notícia",
        media: "Declaração contra a imprensa",
        other: "Polêmica ganha repercussão"
    };
    const base = titles[type] || titles.other;
    if (level === "scandal") {
        return `GRANDE ESCÂNDALO: ${base}`;
    }
    if (level === "severe") {
        return `Polêmica grave: ${base}`;
    }
    return base;
}
function getDefaultDescription(type, fighterName, severity) {
    const descriptions = {
        trash_talk:
            `${fighterName} fez declarações fortes e gerou debate entre fãs e imprensa.`,
        social_media:
            `${fighterName} publicou conteúdo nas redes sociais que provocou reações negativas e grande discussão.`,
        interview:
            `${fighterName} chamou atenção durante uma entrevista após declarações consideradas controversas.`,
        confrontation:
            `${fighterName} se envolveu em uma discussão que acabou ganhando repercussão no mundo do MMA.`,
        unsportsmanlike:
            `${fighterName} foi criticado por uma atitude considerada antidesportiva.`,
        doping:
            `Uma acusação envolvendo ${fighterName} provocou forte repercussão no cenário do MMA.`,
        illegal_action:
            `${fighterName} esteve envolvido em uma situação relacionada a uma ação considerada ilegal.`,
        suspension:
            `Uma suspensão envolvendo ${fighterName} provocou ampla repercussão entre fãs e imprensa.`,
        contract:
            `Uma disputa contratual envolvendo ${fighterName} ganhou destaque na mídia.`,
        promoter:
            `${fighterName} entrou em conflito com representantes da organização.`,
        teammate:
            `${fighterName} teve um desentendimento com um companheiro de equipe.`,
        coach:
            `${fighterName} entrou em conflito com seu treinador.`,
        rival:
            `${fighterName} protagonizou uma nova discussão com um rival.`,
        referee:
            `${fighterName} criticou a arbitragem após um episódio controverso.`,
        judging:
            `${fighterName} questionou a decisão dos juízes e gerou debate entre os fãs.`,
        personal:
            `Uma questão pessoal envolvendo ${fighterName} ganhou repercussão pública.`,
        legal:
            `Uma questão legal envolvendo ${fighterName} chamou a atenção da imprensa.`,
        gambling:
            `Uma situação relacionada a apostas envolvendo ${fighterName} gerou forte repercussão.`,
        lifestyle:
            `O comportamento de ${fighterName} fora do cage gerou críticas e discussão.`,
        sponsorship:
            `Uma situação envolvendo ${fighterName} e patrocinadores ganhou repercussão.`,
        retirement:
            `Declarações de ${fighterName} sobre aposentadoria provocaram debate entre os fãs.`,
        comeback:
            `O retorno de ${fighterName} gerou opiniões divididas e grande repercussão.`,
        family:
            `Uma questão familiar envolvendo ${fighterName} chamou a atenção do público.`,
        media:
            `${fighterName} fez críticas à imprensa e provocou forte reação.`,
        other:
            `Uma situação envolvendo ${fighterName} ganhou repercussão no mundo do MMA.`
    };
    const description = descriptions[type] || descriptions.other;
    if (severity >= 80) {
        return `${description} O episódio rapidamente se transformou em uma das principais polêmicas da carreira.`;
    }
    return description;
}
function createControversy(database, options = {}) {
    const state = ensureControversies(database);
    if (!state) {
        return null;
    }
    if (state.active.length >= CONTROVERSIES_CONFIG.maxActive) {
        return null;
    }
    const fighter =
        options.fighter ||
        getPlayer(database);
    const fighterId =
        options.fighterId ||
        getFighterId(fighter) ||
        getPlayerId(database);
    const fighterName =
        options.fighterName ||
        getFighterName(fighter);
    const type = normalizeType(options.type);
    const severity = clamp(
        options.severity ?? calculateInitialSeverity(type),
        1,
        100
    );
    const level = getSeverityLevel(severity);
    const controversy = {
        id: options.id || createId(),
        fighterId,
        fighterName,
        type,
        level,
        severity,
        title:
            options.title ||
            getControversyTitle(type, level),
        description:
            options.description ||
            getDefaultDescription(type, fighterName, severity),
        source:
            options.source ||
            "MMA Life News",
        relatedFighterId:
            options.relatedFighterId ||
            null,
        relatedFighterName:
            options.relatedFighterName ||
            null,
        relatedEventId:
            options.relatedEventId ||
            null,
        relatedPromotionId:
            options.relatedPromotionId ||
            null,
        active: true,
        resolved: false,
        investigation: Boolean(options.investigation),
        suspension: Boolean(options.suspension),
        apologyMade: false,
        clarificationMade: false,
        createdAt: nowISO(),
        updatedAt: nowISO(),
        resolvedAt: null,
        durationWeeks:
            options.durationWeeks ||
            Math.max(1, Math.ceil(severity / 12)),
        weeksActive: 0,
        reputationImpact:
            options.reputationImpact ??
            calculateReputationImpact(severity),
        fameImpact:
            options.fameImpact ??
            calculateFameImpact(severity),
        popularityImpact:
            options.popularityImpact ??
            calculatePopularityImpact(severity),
        followerImpact:
            options.followerImpact ??
            calculateFollowerImpact(severity),
        commercialImpact:
            options.commercialImpact ??
            Math.round(-severity * 0.35),
        sponsorRisk:
            options.sponsorRisk ??
            Math.round(severity * 0.5),
        mediaAttention:
            options.mediaAttention ??
            clamp(
                severity +
                randomInt(0, 15),
                1,
                100
            ),
        events: []
    };
    state.active.push(controversy);
    state.history.push(controversy);
    state.statistics.total += 1;
    state.statistics.active += 1;
    if (state.statistics[level] !== undefined) {
        state.statistics[level] += 1;
    }
    state.statistics.reputationLost += Math.abs(
        controversy.reputationImpact
    );
    state.statistics.fameGained += Math.max(
        0,
        controversy.fameImpact
    );
    state.statistics.followersLost += Math.max(
        0,
        Math.abs(controversy.followerImpact)
    );
    addControversyEvent(
        database,
        controversy.id,
        CONTROVERSY_EVENTS.statement,
        {
            severity,
            description: controversy.description
        }
    );
    trimControversies(database);
    return controversy;
}
function findControversyById(database, controversyId) {
    const state = ensureControversies(database);
    if (!state || !controversyId) {
        return null;
    }
    return (
        state.active.find(
            item => item.id === controversyId
        ) ||
        state.history.find(
            item => item.id === controversyId
        ) ||
        null
    );
}
function getActiveControversies(database) {
    const state = ensureControversies(database);
    return state ? state.active.filter(item => item.active) : [];
}
function getPlayerControversies(database) {
    const state = ensureControversies(database);
    if (!state) {
        return [];
    }
    const playerId = getPlayerId(database);
    return state.history.filter(
        item =>
            item.fighterId === playerId
    );
}
function getCurrentPlayerControversies(database) {
    const state = ensureControversies(database);
    if (!state) {
        return [];
    }
    const playerId = getPlayerId(database);
    return state.active.filter(
        item =>
            item.active &&
            item.fighterId === playerId
    );
}
function addControversyEvent(
    database,
    controversyId,
    eventType,
    options = {}
) {
    const state = ensureControversies(database);
    if (!state) {
        return null;
    }
    const controversy = findControversyById(
        database,
        controversyId
    );
    const event = {
        id: createId("controversy_event"),
        controversyId,
        type: eventType,
        severityChange:
            Number(options.severityChange) || 0,
        description:
            options.description ||
            "Novo acontecimento relacionado à controvérsia.",
        timestamp: nowISO()
    };
    state.events.push(event);
    if (controversy) {
        controversy.events.push(event);
        controversy.severity = clamp(
            controversy.severity +
            event.severityChange,
            1,
            100
        );
        controversy.level =
            getSeverityLevel(controversy.severity);
        controversy.updatedAt = nowISO();
    }
    return event;
}
function increaseControversySeverity(
    database,
    controversyId,
    amount,
    eventType = CONTROVERSY_EVENTS.incident,
    description = "A controvérsia ganhou força."
) {
    const controversy = findControversyById(
        database,
        controversyId
    );
    if (!controversy || !controversy.active) {
        return null;
    }
    const change = Math.max(
        0,
        Number(amount) || 0
    );
    addControversyEvent(
        database,
        controversyId,
        eventType,
        {
            severityChange: change,
            description
        }
    );
    recalculateControversy(database, controversyId);
    return controversy;
}
function decreaseControversySeverity(
    database,
    controversyId,
    amount,
    eventType = CONTROVERSY_EVENTS.goodBehavior,
    description = "A controvérsia começou a perder força."
) {
    const controversy = findControversyById(
        database,
        controversyId
    );
    if (!controversy || !controversy.active) {
        return null;
    }
    const change = Math.max(
        0,
        Number(amount) || 0
    );
    addControversyEvent(
        database,
        controversyId,
        eventType,
        {
            severityChange: -change,
            description
        }
    );
    recalculateControversy(database, controversyId);
    return controversy;
}
function recalculateControversy(
    database,
    controversyId
) {
    const controversy = findControversyById(
        database,
        controversyId
    );
    if (!controversy) {
        return null;
    }
    controversy.severity = clamp(
        controversy.severity,
        1,
        100
    );
    controversy.level =
        getSeverityLevel(
            controversy.severity
        );
    controversy.reputationImpact =
        calculateReputationImpact(
            controversy.severity
        );
    controversy.fameImpact =
        calculateFameImpact(
            controversy.severity
        );
    controversy.popularityImpact =
        calculatePopularityImpact(
            controversy.severity
        );
    controversy.followerImpact =
        calculateFollowerImpact(
            controversy.severity
        );
    controversy.commercialImpact =
        Math.round(
            -controversy.severity * 0.35
        );
    controversy.sponsorRisk =
        Math.round(
            controversy.severity * 0.5
        );
    controversy.mediaAttention =
        clamp(
            controversy.severity + 10,
            1,
            100
        );
    controversy.updatedAt = nowISO();
    return controversy;
}
function triggerStatement(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.media
    });
}
function triggerSocialMediaControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.socialMedia
    });
}
function triggerInterviewControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.interview
    });
}
function triggerTrashTalkControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.trashTalk
    });
}
function triggerConfrontationControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.confrontation
    });
}
function triggerDopingControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.doping,
        severity:
            options.severity ??
            randomInt(80, 100),
        investigation: true
    });
}
function triggerLegalControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.legal,
        severity:
            options.severity ??
            randomInt(60, 90),
        investigation: true
    });
}
function triggerContractControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.contract
    });
}
function triggerSponsorshipControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.sponsorship
    });
}
function triggerJudgingControversy(
    database,
    options = {}
) {
    return createControversy(database, {
        ...options,
        type: CONTROVERSY_TYPES.judging
    });
}
function makeApology(
    database,
    controversyId
) {
    const controversy = findControversyById(
        database,
        controversyId
    );
    if (!controversy || !controversy.active) {
        return null;
    }
    if (controversy.apologyMade) {
        return controversy;
    }
    controversy.apologyMade = true;
    decreaseControversySeverity(
        database,
        controversyId,
        CONTROVERSIES_CONFIG.recovery.apology,
        CONTROVERSY_EVENTS.apology,
        "O lutador pediu desculpas publicamente pelo episódio."
    );
    const state = ensureControversies(database);
    if (state) {
        state.statistics.apologies += 1;
    }
    return controversy;
}
function makeClarification(
    database,
    controversyId
) {
    const controversy = findControversyById(
        database,
        controversyId
    );
    if (!controversy || !controversy.active) {
        return null;
    }
    if (controversy.clarificationMade) {
        return controversy;
    }
    controversy.clarificationMade = true;
    decreaseControversySeverity(
        database,
        controversyId,
        7,
        CONTROVERSY_EVENTS.clarification,
        "O lutador apresentou uma explicação sobre o episódio."
    );
    return controversy;
}
function addGoodBehavior(
    database,
    controversyId
) {
    return decreaseControversySeverity(
        database,
        controversyId,
        CONTROVERSIES_CONFIG.recovery.goodBehavior,
        CONTROVERSY_EVENTS.goodBehavior,
        "O comportamento positivo ajudou a reduzir a repercussão."
    );
}
function addCharityAction(
    database,
    controversyId
) {
    return decreaseControversySeverity(
        database,
        controversyId,
        CONTROVERSIES_CONFIG.recovery.charity,
        CONTROVERSY_EVENTS.charity,
        "Uma ação beneficente ajudou a melhorar a percepção pública."
    );
}
function processVictory(
    database,
    controversyId
) {
    return decreaseControversySeverity(
        database,
        controversyId,
        CONTROVERSIES_CONFIG.recovery.victory,
        CONTROVERSY_EVENTS.victory,
        "Uma vitória importante ajudou a mudar o foco da mídia."
    );
}
function processTitleWin(
    database,
    controversyId
) {
    return decreaseControversySeverity(
        database,
        controversyId,
        CONTROVERSIES_CONFIG.recovery.titleWin,
        CONTROVERSY_EVENTS.titleWin,
        "A conquista do título ajudou a recuperar a imagem pública."
    );
}
function startInvestigation(
    database,
    controversyId
) {
    const controversy = findControversyById(
        database,
        controversyId
    );
    if (!controversy) {
        return null;
    }
    controversy.investigation = true;
    const state = ensureControversies(database);
    if (state) {
        state.statistics.investigations += 1;
    }
    addControversyEvent(
        database,
        controversyId,
        CONTROVERSY_EVENTS.investigation,
        {
            severityChange: 8,
            description:
                "Uma investigação oficial foi iniciada."
        }
    );
    return controversy;
}
function applySuspension(
    database,
    controversyId,
    weeks = 1
) {
    const controversy = findControversyById(
        database,
        controversyId
    );
    if (!controversy) {
        return null;
    }
    controversy.suspension = true;
    controversy.suspensionWeeks =
        Math.max(1, Number(weeks) || 1);
    const state = ensureControversies(database);
    if (state) {
        state.statistics.suspensions += 1;
    }
    addControversyEvent(
        database,
        controversyId,
        CONTROVERSY_EVENTS.suspension,
        {
            severityChange: 5,
            description:
                `O lutador recebeu uma suspensão de ${controversy.suspensionWeeks} semana(s).`
        }
    );
    return controversy;
}
function resolveControversy(
    database,
    controversyId,
    reason = "A controvérsia foi encerrada."
) {
    const state = ensureControversies(database);
    if (!state) {
        return null;
    }
    const controversy = findControversyById(
        database,
        controversyId
    );
    if (!controversy) {
        return null;
    }
    if (!controversy.active) {
        return controversy;
    }
    controversy.active = false;
    controversy.resolved = true;
    controversy.resolvedAt = nowISO();
    controversy.updatedAt = nowISO();
    addControversyEvent(
        database,
        controversyId,
        CONTROVERSY_EVENTS.clarification,
        {
            severityChange: -controversy.severity,
            description: reason
        }
    );
    state.active = state.active.filter(
        item => item.id !== controversyId
    );
    state.statistics.active =
        state.active.length;
    state.statistics.resolved += 1;
    return controversy;
}
function processWeeklyControversies(database) {
    const state = ensureControversies(database);
    if (!state) {
        return [];
    }
    const processed = [];
    for (const controversy of [...state.active]) {
        if (!controversy.active) {
            continue;
        }
        controversy.weeksActive += 1;
        decreaseControversySeverity(
            database,
            controversy.id,
            CONTROVERSIES_CONFIG.recovery.weeklyDecay,
            CONTROVERSY_EVENTS.inactivity,
            "A repercussão da controvérsia diminuiu com o passar do tempo."
        );
        processed.push(controversy);
        if (
            controversy.severity <= 3 ||
            controversy.weeksActive >=
                controversy.durationWeeks
        ) {
            resolveControversy(
                database,
                controversy.id,
                "A repercussão perdeu força e a controvérsia foi encerrada."
            );
        }
    }
    state.statistics.active =
        state.active.length;
    state.lastUpdated = nowISO();
    return processed;
}
function getMostSevereControversy(
    database
) {
    const active =
        getActiveControversies(database);
    if (!active.length) {
        return null;
    }
    return [...active].sort(
        (a, b) =>
            b.severity - a.severity
    )[0];
}
function getHighestMediaAttention(
    database
) {
    const active =
        getActiveControversies(database);
    if (!active.length) {
        return null;
    }
    return [...active].sort(
        (a, b) =>
            b.mediaAttention -
            a.mediaAttention
    )[0];
}
function getControversiesByType(
    database,
    type
) {
    const state = ensureControversies(database);
    if (!state) {
        return [];
    }
    const normalized =
        normalizeType(type);
    return state.history.filter(
        item =>
            item.type === normalized
    );
}
function getControversiesByLevel(
    database,
    level
) {
    const state = ensureControversies(database);
    if (!state) {
        return [];
    }
    return state.history.filter(
        item =>
            item.level === level
    );
}
function getRecentControversies(
    database,
    limit = 10
) {
    const state = ensureControversies(database);
    if (!state) {
        return [];
    }
    return [...state.history]
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(
            0,
            Math.max(1, Number(limit) || 10)
        );
}
function getControversyRisk(
    database
) {
    const active =
        getActiveControversies(database);
    if (!active.length) {
        return 0;
    }
    const total =
        active.reduce(
            (sum, item) =>
                sum + item.severity,
            0
        );
    return clamp(
        total / active.length,
        0,
        100
    );
}
function getSponsorRisk(
    database
) {
    const active =
        getActiveControversies(database);
    if (!active.length) {
        return 0;
    }
    return clamp(
        active.reduce(
            (sum, item) =>
                sum + item.sponsorRisk,
            0
        ) / active.length,
        0,
        100
    );
}
function getCommercialPenalty(
    database
) {
    const active =
        getActiveControversies(database);
    if (!active.length) {
        return 0;
    }
    return Math.round(
        active.reduce(
            (sum, item) =>
                sum + item.commercialImpact,
            0
        )
    );
}
function getMediaAttention(
    database
) {
    const active =
        getActiveControversies(database);
    if (!active.length) {
        return 0;
    }
    return Math.round(
        active.reduce(
            (sum, item) =>
                sum + item.mediaAttention,
            0
        ) / active.length
    );
}
function calculateControversyImpact(
    database,
    controversy
) {
    if (!controversy) {
        return {
            fame: 0,
            reputation: 0,
            popularity: 0,
            followers: 0,
            commercial: 0,
            sponsorRisk: 0,
            mediaAttention: 0
        };
    }
    return {
        fame: controversy.fameImpact,
        reputation: controversy.reputationImpact,
        popularity: controversy.popularityImpact,
        followers: controversy.followerImpact,
        commercial: controversy.commercialImpact,
        sponsorRisk: controversy.sponsorRisk,
        mediaAttention: controversy.mediaAttention
    };
}
function getTotalActiveImpact(database) {
    const active =
        getActiveControversies(database);
    return active.reduce(
        (total, controversy) => {
            total.fame +=
                controversy.fameImpact || 0;
            total.reputation +=
                controversy.reputationImpact || 0;
            total.popularity +=
                controversy.popularityImpact || 0;
            total.followers +=
                controversy.followerImpact || 0;
            total.commercial +=
                controversy.commercialImpact || 0;
            total.sponsorRisk +=
                controversy.sponsorRisk || 0;
            total.mediaAttention +=
                controversy.mediaAttention || 0;
            return total;
        },
        {
            fame: 0,
            reputation: 0,
            popularity: 0,
            followers: 0,
            commercial: 0,
            sponsorRisk: 0,
            mediaAttention: 0
        }
    );
}
function canCreateControversy(
    database,
    severity = 10
) {
    const state = ensureControversies(database);
    if (!state) {
        return false;
    }
    if (
        state.active.length >=
        CONTROVERSIES_CONFIG.maxActive
    ) {
        return false;
    }
    const normalizedSeverity =
        clamp(severity, 1, 100);
    return normalizedSeverity >= 1;
}
function generateRandomControversy(
    database,
    fighter = null
) {
    const types =
        Object.values(CONTROVERSY_TYPES);
    const type =
        types[randomInt(0, types.length - 1)];
    return createControversy(database, {
        fighter:
            fighter ||
            getPlayer(database),
        type
    });
}
function trimControversies(database) {
    const state = ensureControversies(database);
    if (!state) {
        return;
    }
    if (
        state.history.length >
        CONTROVERSIES_CONFIG.maxHistory
    ) {
        state.history =
            state.history.slice(
                -CONTROVERSIES_CONFIG.maxHistory
            );
    }
    if (
        state.events.length >
        CONTROVERSIES_CONFIG.maxHistory * 2
    ) {
        state.events =
            state.events.slice(
                -CONTROVERSIES_CONFIG.maxHistory * 2
            );
    }
    state.active =
        state.active
            .filter(
                item => item && item.active
            )
            .slice(
                -CONTROVERSIES_CONFIG.maxActive
            );
    state.statistics.active =
        state.active.length;
}
function getStatistics(database) {
    const state = ensureControversies(database);
    if (!state) {
        return null;
    }
    const history = state.history;
    const averageSeverity =
        history.length
            ? history.reduce(
                  (sum, item) =>
                      sum + item.severity,
                  0
              ) / history.length
            : 0;
    const highestSeverity =
        history.length
            ? Math.max(
                  ...history.map(
                      item =>
                          item.severity
                  )
              )
            : 0;
    return {
        ...state.statistics,
        active:
            state.active.length,
        history:
            history.length,
        averageSeverity:
            Math.round(
                averageSeverity * 10
            ) / 10,
        highestSeverity,
        risk:
            getControversyRisk(database),
        sponsorRisk:
            getSponsorRisk(database),
        commercialPenalty:
            getCommercialPenalty(database),
        mediaAttention:
            getMediaAttention(database)
    };
}
function getProfile(database) {
    const state = ensureControversies(database);
    if (!state) {
        return null;
    }
    const playerControversies =
        getPlayerControversies(database);
    const active =
        getCurrentPlayerControversies(database);
    return {
        activeCount:
            active.length,
        totalCount:
            playerControversies.length,
        risk:
            getControversyRisk(database),
        sponsorRisk:
            getSponsorRisk(database),
        commercialPenalty:
            getCommercialPenalty(database),
        mediaAttention:
            getMediaAttention(database),
        mostSevere:
            active.length
                ? [...active].sort(
                      (a, b) =>
                          b.severity -
                          a.severity
                  )[0]
                : null,
        recent:
            playerControversies
                .slice(-5)
                .reverse(),
        statistics:
            getStatistics(database)
    };
}
function getSummary(database) {
    const profile =
        getProfile(database);
    if (!profile) {
        return null;
    }
    return {
        activeControversies:
            profile.activeCount,
        totalControversies:
            profile.totalCount,
        risk:
            profile.risk,
        sponsorRisk:
            profile.sponsorRisk,
        commercialPenalty:
            profile.commercialPenalty,
        mediaAttention:
            profile.mediaAttention,
        mostSevereTitle:
            profile.mostSevere
                ? profile.mostSevere.title
                : null,
        mostSevereLevel:
            profile.mostSevere
                ? profile.mostSevere.level
                : null
    };
}
function createNewsPayload(
    database,
    controversy
) {
    if (!controversy) {
        return null;
    }
    return {
        type: "controversy",
        category: "controversy",
        title:
            controversy.title,
        body:
            controversy.description,
        importance:
            controversy.severity >= 80
                ? "critical"
                : controversy.severity >= 60
                ? "high"
                : controversy.severity >= 40
                ? "medium"
                : "low",
        fighterId:
            controversy.fighterId,
        fighterName:
            controversy.fighterName,
        controversyId:
            controversy.id,
        severity:
            controversy.severity,
        timestamp:
            controversy.createdAt
    };
}
function getNewsImpact(
    database,
    controversy
) {
    const player = getPlayer(database);
    const fame =
        Number(
            player?.fame ??
            database?.media?.fame?.value ??
            0
        );
    const popularity =
        Number(
            player?.popularity ??
            database?.media?.popularity?.value ??
            0
        );
    const followers =
        Number(
            player?.followers ??
            database?.media?.followers?.total ??
            0
        );
    const marketability =
        Number(
            database?.media?.marketability?.overall ??
            0
        );
    const base =
        controversy?.mediaAttention || 0;
    const audienceBonus =
        fame * 0.2 +
        popularity * 0.2 +
        Math.min(
            followers / 100000,
            20
        ) +
        marketability * 0.15;
    return clamp(
        base + audienceBonus,
        0,
        100
    );
}
function recordExternalNews(
    database,
    controversyId
) {
    const controversy =
        findControversyById(
            database,
            controversyId
        );
    if (!controversy) {
        return null;
    }
    const payload =
        createNewsPayload(
            database,
            controversy
        );
    payload.reach =
        getNewsImpact(
            database,
            controversy
        );
    return payload;
}
function validateControversies(database) {
    const state = ensureControversies(database);
    if (!state) {
        return {
            valid: false,
            errors: ["Database não encontrado."]
        };
    }
    const errors = [];
    if (!Array.isArray(state.active)) {
        errors.push(
            "active precisa ser um array."
        );
    }
    if (!Array.isArray(state.history)) {
        errors.push(
            "history precisa ser um array."
        );
    }
    if (!Array.isArray(state.events)) {
        errors.push(
            "events precisa ser um array."
        );
    }
    for (const controversy of state.history) {
        if (!controversy.id) {
            errors.push(
                "Controvérsia sem ID encontrada."
            );
        }
        if (
            typeof controversy.severity !==
            "number"
        ) {
            errors.push(
                `Controvérsia ${controversy.id} possui severity inválida.`
            );
        }
        if (
            controversy.severity < 1 ||
            controversy.severity > 100
        ) {
            errors.push(
                `Controvérsia ${controversy.id} possui severity fora do intervalo.`
            );
        }
        if (
            !Object.values(
                CONTROVERSY_TYPES
            ).includes(
                controversy.type
            )
        ) {
            errors.push(
                `Controvérsia ${controversy.id} possui tipo inválido.`
            );
        }
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
function snapshot(database) {
    const state = ensureControversies(database);
    if (!state) {
        return null;
    }
    return JSON.parse(
        JSON.stringify(state)
    );
}
function resetControversies(database) {
    const media = ensureMedia(database);
    if (!media) {
        return null;
    }
    media.controversies =
        createControversiesState();
    return media.controversies;
}
const controversiesAPI = {
    CONTROVERSIES_VERSION,
    CONTROVERSIES_CONFIG,
    CONTROVERSY_TYPES,
    CONTROVERSY_LEVELS,
    CONTROVERSY_EVENTS,
    createControversiesState,
    ensureControversies,
    getSeverityLevel,
    getSeverityLabel,
    normalizeType,
    calculateInitialSeverity,
    calculateReputationImpact,
    calculateFameImpact,
    calculatePopularityImpact,
    calculateFollowerImpact,
    createControversy,
    findControversyById,
    getActiveControversies,
    getPlayerControversies,
    getCurrentPlayerControversies,
    addControversyEvent,
    increaseControversySeverity,
    decreaseControversySeverity,
    recalculateControversy,
    triggerStatement,
    triggerSocialMediaControversy,
    triggerInterviewControversy,
    triggerTrashTalkControversy,
    triggerConfrontationControversy,
    triggerDopingControversy,
    triggerLegalControversy,
    triggerContractControversy,
    triggerSponsorshipControversy,
    triggerJudgingControversy,
    makeApology,
    makeClarification,
    addGoodBehavior,
    addCharityAction,
    processVictory,
    processTitleWin,
    startInvestigation,
    applySuspension,
    resolveControversy,
    processWeeklyControversies,
    getMostSevereControversy,
    getHighestMediaAttention,
    getControversiesByType,
    getControversiesByLevel,
    getRecentControversies,
    getControversyRisk,
    getSponsorRisk,
    getCommercialPenalty,
    getMediaAttention,
    calculateControversyImpact,
    getTotalActiveImpact,
    canCreateControversy,
    generateRandomControversy,
    createNewsPayload,
    getNewsImpact,
    recordExternalNews,
    getStatistics,
    getProfile,
    getSummary,
    trimControversies,
    validateControversies,
    snapshot,
    resetControversies
};
export {
    CONTROVERSIES_VERSION,
    CONTROVERSIES_CONFIG,
    CONTROVERSY_TYPES,
    CONTROVERSY_LEVELS,
    CONTROVERSY_EVENTS,
    createControversiesState,
    ensureControversies,
    getSeverityLevel,
    getSeverityLabel,
    normalizeType,
    calculateInitialSeverity,
    calculateReputationImpact,
    calculateFameImpact,
    calculatePopularityImpact,
    calculateFollowerImpact,
    createControversy,
    findControversyById,
    getActiveControversies,
    getPlayerControversies,
    getCurrentPlayerControversies,
    addControversyEvent,
    increaseControversySeverity,
    decreaseControversySeverity,
    recalculateControversy,
    triggerStatement,
    triggerSocialMediaControversy,
    triggerInterviewControversy,
    triggerTrashTalkControversy,
    triggerConfrontationControversy,
    triggerDopingControversy,
    triggerLegalControversy,
    triggerContractControversy,
    triggerSponsorshipControversy,
    triggerJudgingControversy,
    makeApology,
    makeClarification,
    addGoodBehavior,
    addCharityAction,
    processVictory,
    processTitleWin,
    startInvestigation,
    applySuspension,
    resolveControversy,
    processWeeklyControversies,
    getMostSevereControversy,
    getHighestMediaAttention,
    getControversiesByType,
    getControversiesByLevel,
    getRecentControversies,
    getControversyRisk,
    getSponsorRisk,
    getCommercialPenalty,
    getMediaAttention,
    calculateControversyImpact,
    getTotalActiveImpact,
    canCreateControversy,
    generateRandomControversy,
    createNewsPayload,
    getNewsImpact,
    recordExternalNews,
    getStatistics,
    getProfile,
    getSummary,
    trimControversies,
    validateControversies,
    snapshot,
    resetControversies
};
export default controversiesAPI;
