/*
============================================================
MMA LIFE DYNASTY
FIGHTERS SYSTEM
============================================================
Responsabilidade:
- Criar lutadores NPC
- Criar lutadores a partir de dados
- Gerenciar identidade do lutador
- Gerenciar atributos
- Gerenciar estilo
- Gerenciar potencial
- Gerenciar recorde
- Gerenciar carreira
- Gerenciar ranking
- Gerenciar status
- Evoluir lutadores
- Gerenciar elenco mundial
Este módulo NÃO simula lutas.
A simulação será responsabilidade do:
js/mma/fightEngine.js
============================================================
*/
import {
    MMA_STYLES,
    getStyleProfile,
    determineBestStyle
} from "./styles.js";
/* ============================================================
   CONSTANTS
============================================================ */
const FIGHTER_STATUS = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    RETIRED: "retired",
    INJURED: "injured",
    SUSPENDED: "suspended",
    DECEASED: "deceased"
});
const FIGHTER_TYPES = Object.freeze({
    PLAYER: "player",
    NPC: "npc",
    LEGEND: "legend",
    CHAMPION: "champion",
    PROSPECT: "prospect"
});
const CAREER_STATUS = Object.freeze({
    AMATEUR: "amateur",
    PROFESSIONAL: "professional",
    RETIRED: "retired"
});
const RESULT_TYPES = Object.freeze({
    WIN: "win",
    LOSS: "loss",
    DRAW: "draw",
    NO_CONTEST: "noContest"
});
const FINISH_METHODS = Object.freeze({
    DECISION: "decision",
    KO: "ko",
    TKO: "tko",
    SUBMISSION: "submission",
    DRAW: "draw",
    NO_CONTEST: "noContest"
});
/* ============================================================
   UTILITIES
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
function clamp(
    value,
    min,
    max
) {
    const number =
        safeNumber(
            value,
            min
        );
    return Math.max(
        min,
        Math.min(
            max,
            number
        )
    );
}
function round(
    value,
    decimals = 2
) {
    const multiplier =
        Math.pow(
            10,
            decimals
        );
    return (
        Math.round(
            safeNumber(value) *
            multiplier
        ) /
        multiplier
    );
}
function createId(
    prefix = "fighter"
) {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );
}
function deepClone(
    value
) {
    if (
        value ===
        null ||
        value ===
        undefined
    ) {
        return value;
    }
    return JSON.parse(
        JSON.stringify(
            value
        )
    );
}
/* ============================================================
   ATTRIBUTE GROUPS
============================================================ */
const STRIKING_ATTRIBUTES = Object.freeze([
    "boxing",
    "punching",
    "kicking",
    "muayThai",
    "strikingPower",
    "strikingAccuracy",
    "speed",
    "timing",
    "footwork",
    "headMovement",
    "distanceManagement"
]);
const GRAPPLING_ATTRIBUTES = Object.freeze([
    "wrestling",
    "takedowns",
    "takedownDefense",
    "clinch",
    "bjj",
    "submissions",
    "submissionDefense",
    "groundControl",
    "transitions",
    "scrambling",
    "groundAndPound"
]);
const PHYSICAL_ATTRIBUTES = Object.freeze([
    "strength",
    "power",
    "explosiveness",
    "speed",
    "agility",
    "cardio",
    "endurance"
]);
const MENTAL_ATTRIBUTES = Object.freeze([
    "fightIQ",
    "composure",
    "discipline",
    "focus",
    "confidence",
    "courage",
    "adaptability",
    "resilience"
]);
const DEFAULT_ATTRIBUTE_VALUES = Object.freeze({
    boxing: 50,
    punching: 50,
    kicking: 50,
    muayThai: 50,
    strikingPower: 50,
    strikingAccuracy: 50,
    speed: 50,
    timing: 50,
    footwork: 50,
    headMovement: 50,
    distanceManagement: 50,
    wrestling: 50,
    takedowns: 50,
    takedownDefense: 50,
    clinch: 50,
    bjj: 50,
    submissions: 50,
    submissionDefense: 50,
    groundControl: 50,
    transitions: 50,
    scrambling: 50,
    groundAndPound: 50,
    strength: 50,
    power: 50,
    explosiveness: 50,
    agility: 50,
    cardio: 50,
    endurance: 50,
    fightIQ: 50,
    composure: 50,
    discipline: 50,
    focus: 50,
    confidence: 50,
    courage: 50,
    adaptability: 50,
    resilience: 50
});
/* ============================================================
   OVR
============================================================ */
function calculateGroupAverage(
    attributes,
    names
) {
    if (
        !attributes ||
        !names ||
        !names.length
    ) {
        return 0;
    }
    const values =
        names
            .map(
                name =>
                    safeNumber(
                        attributes[name],
                        0
                    )
            );
    if (
        !values.length
    ) {
        return 0;
    }
    return round(
        values.reduce(
            (
                total,
                value
            ) =>
                total +
                value,
            0
        ) /
        values.length
    );
}
function calculateFighterOVR(
    attributes = {}
) {
    const striking =
        calculateGroupAverage(
            attributes,
            STRIKING_ATTRIBUTES
        );
    const grappling =
        calculateGroupAverage(
            attributes,
            GRAPPLING_ATTRIBUTES
        );
    const physical =
        calculateGroupAverage(
            attributes,
            PHYSICAL_ATTRIBUTES
        );
    const mental =
        calculateGroupAverage(
            attributes,
            MENTAL_ATTRIBUTES
        );
    const ovr =
        (
            striking * 0.30
        ) +
        (
            grappling * 0.30
        ) +
        (
            physical * 0.20
        ) +
        (
            mental * 0.20
        );
    return Math.round(
        clamp(
            ovr,
            1,
            100
        )
    );
}
/* ============================================================
   RANDOM GENERATION
============================================================ */
function randomInt(
    min,
    max
) {
    return Math.floor(
        Math.random() *
        (
            max -
            min +
            1
        )
    ) + min;
}
function randomName(
    sex = "male"
) {
    const maleFirstNames = [
        "Lucas",
        "Gabriel",
        "Miguel",
        "Rafael",
        "Carlos",
        "João",
        "Pedro",
        "Matheus",
        "Diego",
        "Bruno",
        "André",
        "Victor",
        "Felipe",
        "Leonardo",
        "Daniel",
        "Arthur",
        "Gustavo",
        "Eduardo",
        "Thiago",
        "Henrique"
    ];
    const femaleFirstNames = [
        "Ana",
        "Julia",
        "Mariana",
        "Beatriz",
        "Larissa",
        "Camila",
        "Isabela",
        "Amanda",
        "Laura",
        "Sofia",
        "Gabriela",
        "Manuela",
        "Carolina",
        "Luiza",
        "Helena",
        "Valentina",
        "Alice",
        "Clara",
        "Bianca",
        "Letícia"
    ];
    const surnames = [
        "Silva",
        "Santos",
        "Oliveira",
        "Souza",
        "Costa",
        "Pereira",
        "Almeida",
        "Ferreira",
        "Rodrigues",
        "Martins",
        "Lima",
        "Carvalho",
        "Gomes",
        "Ribeiro",
        "Barbosa",
        "Mendes",
        "Araújo",
        "Cardoso",
        "Teixeira",
        "Moreira"
    ];
    const firstNames =
        String(sex).toLowerCase() ===
        "female"
            ? femaleFirstNames
            : maleFirstNames;
    const first =
        firstNames[
            randomInt(
                0,
                firstNames.length - 1
            )
        ];
    const surname =
        surnames[
            randomInt(
                0,
                surnames.length - 1
            )
        ];
    return {
        firstName: first,
        lastName: surname,
        fullName:
            `${first} ${surname}`
    };
}
/* ============================================================
   RANDOM ATTRIBUTES
============================================================ */
function generateAttributes(
    options = {}
) {
    const min =
        clamp(
            safeNumber(
                options.min,
                35
            ),
            1,
            90
        );
    const max =
        clamp(
            safeNumber(
                options.max,
                75
            ),
            min,
            100
        );
    const variation =
        safeNumber(
            options.variation,
            10
        );
    const attributes = {};
    for (
        const name of Object.keys(
            DEFAULT_ATTRIBUTE_VALUES
        )
    ) {
        let value =
            randomInt(
                min,
                max
            );
        if (
            variation > 0
        ) {
            value +=
                randomInt(
                    -variation,
                    variation
                );
        }
        attributes[name] =
            Math.round(
                clamp(
                    value,
                    1,
                    100
                )
            );
    }
    return attributes;
}
/* ============================================================
   RECORD
============================================================ */
function createRecord(
    data = {}
) {
    return {
        wins:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.wins,
                        0
                    )
                )
            ),
        losses:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.losses,
                        0
                    )
                )
            ),
        draws:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.draws,
                        0
                    )
                )
            ),
        noContests:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.noContests,
                        0
                    )
                )
            ),
        amateurWins:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.amateurWins,
                        0
                    )
                )
            ),
        amateurLosses:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.amateurLosses,
                        0
                    )
                )
            ),
        professionalWins:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.professionalWins,
                        0
                    )
                )
            ),
        professionalLosses:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.professionalLosses,
                        0
                    )
                )
            ),
        koWins:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.koWins,
                        0
                    )
                )
            ),
        submissionWins:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.submissionWins,
                        0
                    )
                )
            ),
        decisionWins:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.decisionWins,
                        0
                    )
                )
            ),
        decisionLosses:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.decisionLosses,
                        0
                    )
                )
            ),
        lastResult:
            data.lastResult ||
            null
    };
}
/* ============================================================
   FIGHT HISTORY
============================================================ */
function createFightHistoryEntry(
    data = {}
) {
    return {
        id:
            data.id ||
            createId(
                "fight"
            ),
        date:
            data.date ||
            null,
        opponentId:
            data.opponentId ||
            null,
        opponentName:
            data.opponentName ||
            null,
        promotionId:
            data.promotionId ||
            null,
        eventId:
            data.eventId ||
            null,
        result:
            data.result ||
            null,
        method:
            data.method ||
            null,
        round:
            safeNumber(
                data.round,
                0
            ),
        time:
            data.time ||
            null,
        titleFight:
            Boolean(
                data.titleFight
            ),
        titleWon:
            Boolean(
                data.titleWon
            ),
        titleLost:
            Boolean(
                data.titleLost
            ),
        weightClass:
            data.weightClass ||
            null,
        purse:
            safeNumber(
                data.purse,
                0
            ),
        bonus:
            safeNumber(
                data.bonus,
                0
            )
    };
}
/* ============================================================
   CAREER
============================================================ */
function createCareer(
    data = {}
) {
    return {
        status:
            data.status ||
            CAREER_STATUS.AMATEUR,
        professional:
            Boolean(
                data.professional
            ),
        debutAge:
            data.debutAge ??
            null,
        professionalDebutAge:
            data.professionalDebutAge ??
            null,
        currentPromotionId:
            data.currentPromotionId ||
            null,
        currentWeightClass:
            data.currentWeightClass ||
            null,
        ranking:
            safeNumber(
                data.ranking,
                null
            ),
        peakRanking:
            safeNumber(
                data.peakRanking,
                null
            ),
        title:
            Boolean(
                data.title
            ),
        titles:
            Array.isArray(
                data.titles
            )
                ? deepClone(
                    data.titles
                )
                : [],
        totalFights:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.totalFights,
                        0
                    )
                )
            ),
        amateurFights:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.amateurFights,
                        0
                    )
                )
            ),
        professionalFights:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.professionalFights,
                        0
                    )
                )
            ),
        lastFightDate:
            data.lastFightDate ||
            null,
        nextFightDate:
            data.nextFightDate ||
            null,
        consecutiveWins:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.consecutiveWins,
                        0
                    )
                )
            ),
        consecutiveLosses:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.consecutiveLosses,
                        0
                    )
                )
            )
    };
}
/* ============================================================
   PHYSICAL DATA
============================================================ */
function createPhysicalProfile(
    data = {}
) {
    return {
        height:
            safeNumber(
                data.height,
                0
            ),
        reach:
            safeNumber(
                data.reach,
                0
            ),
        weight:
            safeNumber(
                data.weight,
                0
            ),
        naturalWeight:
            safeNumber(
                data.naturalWeight ??
                data.weight,
                0
            ),
        weightClass:
            data.weightClass ||
            null,
        stance:
            data.stance ||
            "Orthodox",
        age:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.age,
                        18
                    )
                )
            ),
        birthDate:
            data.birthDate ||
            null
    };
}
/* ============================================================
   FIGHTER CREATION
============================================================ */
function createFighter(
    data = {}
) {
    const sex =
        data.sex ||
        "male";
    const generatedName =
        randomName(
            sex
        );
    const attributes =
        data.attributes
            ? {
                ...DEFAULT_ATTRIBUTE_VALUES,
                ...deepClone(
                    data.attributes
                )
            }
            : generateAttributes(
                data.attributeGeneration
            );
    const style =
        data.style ||
        determineBestStyle({
            attributes
        }).style;
    const ovr =
        data.ovr ??
        calculateFighterOVR(
            attributes
        );
    const age =
        Math.max(
            14,
            Math.floor(
                safeNumber(
                    data.age,
                    randomInt(
                        18,
                        32
                    )
                )
            )
        );
    const physical =
        createPhysicalProfile({
            height:
                data.height ??
                randomInt(
                    165,
                    195
                ),
            reach:
                data.reach ??
                randomInt(
                    165,
                    205
                ),
            weight:
                data.weight ??
                70,
            naturalWeight:
                data.naturalWeight ??
                data.weight ??
                70,
            weightClass:
                data.weightClass,
            stance:
                data.stance,
            age,
            birthDate:
                data.birthDate
        });
    const fighter = {
        id:
            data.id ||
            createId(
                "fighter"
            ),
        type:
            data.type ||
            FIGHTER_TYPES.NPC,
        firstName:
            data.firstName ||
            generatedName.firstName,
        lastName:
            data.lastName ||
            generatedName.lastName,
        fullName:
            data.fullName ||
            (
                data.firstName &&
                data.lastName
                    ? `${data.firstName} ${data.lastName}`
                    : generatedName.fullName
            ),
        nickname:
            data.nickname ||
            "",
        sex,
        nationality:
            data.nationality ||
            "Brazil",
        country:
            data.country ||
            data.nationality ||
            "Brazil",
        city:
            data.city ||
            "",
        gymId:
            data.gymId ||
            null,
        managerId:
            data.managerId ||
            null,
        physical,
        attributes,
        style,
        secondaryStyles:
            Array.isArray(
                data.secondaryStyles
            )
                ? [
                    ...data.secondaryStyles
                ]
                : [],
        ovr:
            clamp(
                safeNumber(
                    ovr,
                    50
                ),
                1,
                100
            ),
        potential:
            clamp(
                safeNumber(
                    data.potential,
                    Math.max(
                        ovr,
                        randomInt(
                            55,
                            90
                        )
                    )
                ),
                1,
                100
            ),
        potentialRevealed:
            Boolean(
                data.potentialRevealed
            ),
        record:
            createRecord(
                data.record
            ),
        career:
            createCareer(
                data.career
            ),
        status:
            data.status ||
            FIGHTER_STATUS.ACTIVE,
        fightHistory:
            Array.isArray(
                data.fightHistory
            )
                ? data.fightHistory.map(
                    entry =>
                        createFightHistoryEntry(
                            entry
                        )
                )
                : [],
        rankings:
            {
                current:
                    safeNumber(
                        data.rankings?.current,
                        null
                    ),
                peak:
                    safeNumber(
                        data.rankings?.peak,
                        null
                    ),
                division:
                    data.rankings?.division ||
                    null
            },
        titles:
            Array.isArray(
                data.titles
            )
                ? deepClone(
                    data.titles
                )
                : [],
        fame:
            clamp(
                safeNumber(
                    data.fame,
                    Math.max(
                        0,
                        ovr - 40
                    )
                ),
                0,
                100
            ),
        followers:
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        data.followers,
                        0
                    )
                )
            ),
        reputation:
            clamp(
                safeNumber(
                    data.reputation,
                    50
                ),
                0,
                100
            ),
        personality:
            data.personality
                ? deepClone(
                    data.personality
                )
                : null,
        genetics:
            data.genetics
                ? deepClone(
                    data.genetics
                )
                : null,
        health:
            data.health
                ? deepClone(
                    data.health
                )
                : {
                    overall: 100,
                    injuries: [],
                    chronic: []
                },
        training:
            data.training
                ? deepClone(
                    data.training
                )
                : {
                    energy: 100,
                    fatigue: 0,
                    sessions: [],
                    weeklyPlan: null,
                    camp: null,
                    weightCut: null
                },
        finances:
            data.finances
                ? deepClone(
                    data.finances
                )
                : {
                    careerEarnings: 0,
                    purse: 0,
                    bonuses: 0
                },
        legacy:
            data.legacy
                ? deepClone(
                    data.legacy
                )
                : {
                    score: 0,
                    hallOfFame: false,
                    championships: 0
                },
        createdAt:
            data.createdAt ||
            new Date().toISOString(),
        updatedAt:
            new Date().toISOString()
    };
    fighter.career.totalFights =
        fighter.record.wins +
        fighter.record.losses +
        fighter.record.draws +
        fighter.record.noContests;
    fighter.career.amateurFights =
        fighter.record.amateurWins +
        fighter.record.amateurLosses;
    fighter.career.professionalFights =
        fighter.record.professionalWins +
        fighter.record.professionalLosses;
    fighter.career.currentWeightClass =
        fighter.physical.weightClass;
    fighter.rankings.division =
        fighter.physical.weightClass;
    return fighter;
}
/* ============================================================
   UPDATE OVR
============================================================ */
function updateFighterOVR(
    fighter
) {
    if (!fighter) {
        return null;
    }
    fighter.ovr =
        calculateFighterOVR(
            fighter.attributes ||
            {}
        );
    fighter.updatedAt =
        new Date().toISOString();
    return fighter.ovr;
}
/* ============================================================
   UPDATE STYLE
============================================================ */
function updateFighterStyle(
    fighter
) {
    if (!fighter) {
        return null;
    }
    const best =
        determineBestStyle(
            fighter
        );
    if (
        best &&
        best.style
    ) {
        fighter.style =
            best.style;
    }
    fighter.updatedAt =
        new Date().toISOString();
    return fighter.style;
}
/* ============================================================
   ATTRIBUTE DEVELOPMENT
============================================================ */
function developFighterAttribute(
    fighter,
    attribute,
    amount
) {
    if (
        !fighter ||
        !fighter.attributes
    ) {
        return null;
    }
    if (
        !Object.prototype.hasOwnProperty.call(
            fighter.attributes,
            attribute
        )
    ) {
        return null;
    }
    const before =
        safeNumber(
            fighter.attributes[
                attribute
            ],
            0
        );
    const potential =
        clamp(
            safeNumber(
                fighter.potential,
                100
            ),
            1,
            100
        );
    const maxAttribute =
        Math.max(
            1,
            potential
        );
    const after =
        clamp(
            before +
            safeNumber(
                amount
            ),
            1,
            maxAttribute
        );
    fighter.attributes[
        attribute
    ] =
        round(after);
    updateFighterOVR(
        fighter
    );
    return {
        attribute,
        before,
        after,
        change:
            round(
                after -
                before
            )
    };
}
/* ============================================================
   DEVELOPMENT
============================================================ */
function developFighter(
    fighter,
    development = {}
) {
    if (!fighter) {
        return null;
    }
    const changes = [];
    for (
        const [
            attribute,
            amount
        ]
        of Object.entries(
            development
        )
    ) {
        const result =
            developFighterAttribute(
                fighter,
                attribute,
                amount
            );
        if (result) {
            changes.push(
                result
            );
        }
    }
    updateFighterOVR(
        fighter
    );
    updateFighterStyle(
        fighter
    );
    fighter.updatedAt =
        new Date().toISOString();
    return {
        fighterId:
            fighter.id,
        changes,
        ovr:
            fighter.ovr,
        style:
            fighter.style
    };
}
/* ============================================================
   RECORD UPDATE
============================================================ */
function registerFightResult(
    fighter,
    resultData = {}
) {
    if (!fighter) {
        return null;
    }
    const result =
        resultData.result;
    if (
        !Object.values(
            RESULT_TYPES
        ).includes(
            result
        )
    ) {
        return null;
    }
    const method =
        resultData.method ||
        null;
    if (
        result ===
        RESULT_TYPES.WIN
    ) {
        fighter.record.wins++;
        if (
            resultData.amateur
        ) {
            fighter.record.amateurWins++;
        } else {
            fighter.record.professionalWins++;
        }
        fighter.career.consecutiveWins++;
        fighter.career.consecutiveLosses =
            0;
        fighter.record.lastResult =
            RESULT_TYPES.WIN;
        if (
            method ===
            FINISH_METHODS.KO ||
            method ===
            FINISH_METHODS.TKO
        ) {
            fighter.record.koWins++;
        }
        if (
            method ===
            FINISH_METHODS.SUBMISSION
        ) {
            fighter.record.submissionWins++;
        }
        if (
            method ===
            FINISH_METHODS.DECISION
        ) {
            fighter.record.decisionWins++;
        }
    }
    if (
        result ===
        RESULT_TYPES.LOSS
    ) {
        fighter.record.losses++;
        if (
            resultData.amateur
        ) {
            fighter.record.amateurLosses++;
        } else {
            fighter.record.professionalLosses++;
        }
        fighter.career.consecutiveLosses++;
        fighter.career.consecutiveWins =
            0;
        fighter.record.lastResult =
            RESULT_TYPES.LOSS;
        if (
            method ===
            FINISH_METHODS.DECISION
        ) {
            fighter.record.decisionLosses++;
        }
    }
    if (
        result ===
        RESULT_TYPES.DRAW
    ) {
        fighter.record.draws++;
        fighter.career.consecutiveWins =
            0;
        fighter.career.consecutiveLosses =
            0;
        fighter.record.lastResult =
            RESULT_TYPES.DRAW;
    }
    if (
        result ===
        RESULT_TYPES.NO_CONTEST
    ) {
        fighter.record.noContests++;
        fighter.record.lastResult =
            RESULT_TYPES.NO_CONTEST;
    }
    const historyEntry =
        createFightHistoryEntry({
            ...resultData,
            opponentName:
                resultData.opponentName ||
                null
        });
    fighter.fightHistory.push(
        historyEntry
    );
    fighter.career.totalFights =
        fighter.record.wins +
        fighter.record.losses +
        fighter.record.draws +
        fighter.record.noContests;
    fighter.career.amateurFights =
        fighter.record.amateurWins +
        fighter.record.amateurLosses;
    fighter.career.professionalFights =
        fighter.record.professionalWins +
        fighter.record.professionalLosses;
    fighter.career.lastFightDate =
        resultData.date ||
        fighter.career.lastFightDate;
    fighter.updatedAt =
        new Date().toISOString();
    return historyEntry;
}
/* ============================================================
   PROFESSIONAL STATUS
============================================================ */
function turnProfessional(
    fighter,
    age = null
) {
    if (!fighter) {
        return false;
    }
    fighter.career.status =
        CAREER_STATUS.PROFESSIONAL;
    fighter.career.professional =
        true;
    fighter.career.professionalDebutAge =
        age ??
        fighter.physical.age;
    fighter.updatedAt =
        new Date().toISOString();
    return true;
}
/* ============================================================
   RETIREMENT
============================================================ */
function retireFighter(
    fighter,
    reason = "retirement"
) {
    if (!fighter) {
        return false;
    }
    fighter.status =
        FIGHTER_STATUS.RETIRED;
    fighter.career.status =
        CAREER_STATUS.RETIRED;
    fighter.career.professional =
        Boolean(
            fighter.career.professional
        );
    fighter.retirement = {
        date:
            new Date().toISOString(),
        reason
    };
    fighter.updatedAt =
        new Date().toISOString();
    return true;
}
/* ============================================================
   RANKING
============================================================ */
function setFighterRanking(
    fighter,
    ranking,
    division = null
) {
    if (!fighter) {
        return null;
    }
    const value =
        ranking === null ||
        ranking === undefined
            ? null
            : Math.max(
                0,
                Math.floor(
                    safeNumber(
                        ranking
                    )
                )
            );
    fighter.rankings.current =
        value;
    fighter.career.ranking =
        value;
    if (
        value !== null
    ) {
        if (
            fighter.rankings.peak ===
                null ||
            fighter.rankings.peak ===
                undefined
        ) {
            fighter.rankings.peak =
                value;
        } else {
            fighter.rankings.peak =
                Math.min(
                    fighter.rankings.peak,
                    value
                );
        }
        if (
            fighter.career.peakRanking ===
                null ||
            fighter.career.peakRanking ===
                undefined
        ) {
            fighter.career.peakRanking =
                value;
        } else {
            fighter.career.peakRanking =
                Math.min(
                    fighter.career.peakRanking,
                    value
                );
        }
    }
    if (
        division
    ) {
        fighter.rankings.division =
            division;
        fighter.career.currentWeightClass =
            division;
    }
    fighter.updatedAt =
        new Date().toISOString();
    return fighter.rankings;
}
/* ============================================================
   CHAMPION
============================================================ */
function setChampionStatus(
    fighter,
    isChampion,
    titleData = {}
) {
    if (!fighter) {
        return null;
    }
    fighter.career.title =
        Boolean(
            isChampion
        );
    if (
        isChampion
    ) {
        const title = {
            id:
                titleData.id ||
                createId(
                    "title"
                ),
            promotionId:
                titleData.promotionId ||
                null,
            division:
                titleData.division ||
                fighter.physical.weightClass,
            wonAt:
                titleData.wonAt ||
                new Date().toISOString(),
            defenses:
                safeNumber(
                    titleData.defenses,
                    0
                ),
            active:
                true
        };
        fighter.titles.push(
            title
        );
        fighter.legacy.championships =
            fighter.titles.length;
    }
    fighter.updatedAt =
        new Date().toISOString();
    return fighter.career.title;
}
/* ============================================================
   FAME
============================================================ */
function modifyFame(
    fighter,
    amount
) {
    if (!fighter) {
        return null;
    }
    const before =
        safeNumber(
            fighter.fame,
            0
        );
    fighter.fame =
        clamp(
            before +
            safeNumber(
                amount
            ),
            0,
            100
        );
    fighter.updatedAt =
        new Date().toISOString();
    return {
        before,
        after:
            fighter.fame,
        change:
            round(
                fighter.fame -
                before
            )
    };
}
/* ============================================================
   FOLLOWERS
============================================================ */
function modifyFollowers(
    fighter,
    amount
) {
    if (!fighter) {
        return null;
    }
    const before =
        Math.max(
            0,
            Math.floor(
                safeNumber(
                    fighter.followers,
                    0
                )
            )
        );
    fighter.followers =
        Math.max(
            0,
            Math.floor(
                before +
                safeNumber(
                    amount
                )
            )
        );
    fighter.updatedAt =
        new Date().toISOString();
    return {
        before,
        after:
            fighter.followers,
        change:
            fighter.followers -
            before
    };
}
/* ============================================================
   FILTERS
============================================================ */
function filterFighters(
    fighters,
    filters = {}
) {
    if (!fighters) {
        return [];
    }
    const list =
        Array.isArray(
            fighters
        )
            ? fighters
            : Object.values(
                fighters
            );
    return list.filter(
        fighter => {
            if (
                filters.status &&
                fighter.status !==
                    filters.status
            ) {
                return false;
            }
            if (
                filters.type &&
                fighter.type !==
                    filters.type
            ) {
                return false;
            }
            if (
                filters.sex &&
                fighter.sex !==
                    filters.sex
            ) {
                return false;
            }
            if (
                filters.country &&
                fighter.country !==
                    filters.country
            ) {
                return false;
            }
            if (
                filters.style &&
                fighter.style !==
                    filters.style
            ) {
                return false;
            }
            if (
                filters.weightClass &&
                fighter.physical
                    ?.weightClass !==
                    filters.weightClass
            ) {
                return false;
            }
            if (
                filters.promotionId &&
                fighter.career
                    ?.currentPromotionId !==
                    filters.promotionId
            ) {
                return false;
            }
            if (
                filters.minOVR !==
                    undefined &&
                fighter.ovr <
                    filters.minOVR
            ) {
                return false;
            }
            if (
                filters.maxOVR !==
                    undefined &&
                fighter.ovr >
                    filters.maxOVR
            ) {
                return false;
            }
            if (
                filters.minAge !==
                    undefined &&
                fighter.physical
                    ?.age <
                    filters.minAge
            ) {
                return false;
            }
            if (
                filters.maxAge !==
                    undefined &&
                fighter.physical
                    ?.age >
                    filters.maxAge
            ) {
                return false;
            }
            return true;
        }
    );
}
/* ============================================================
   SORT
============================================================ */
function sortFighters(
    fighters,
    criterion = "ovr",
    descending = true
) {
    const list =
        Array.isArray(
            fighters
        )
            ? [...fighters]
            : Object.values(
                fighters || {}
            );
    const direction =
        descending
            ? -1
            : 1;
    return list.sort(
        (a, b) => {
            let valueA;
            let valueB;
            switch (
                criterion
            ) {
                case "ovr":
                    valueA =
                        safeNumber(
                            a.ovr
                        );
                    valueB =
                        safeNumber(
                            b.ovr
                        );
                    break;
                case "potential":
                    valueA =
                        safeNumber(
                            a.potential
                        );
                    valueB =
                        safeNumber(
                            b.potential
                        );
                    break;
                case "fame":
                    valueA =
                        safeNumber(
                            a.fame
                        );
                    valueB =
                        safeNumber(
                            b.fame
                        );
                    break;
                case "wins":
                    valueA =
                        safeNumber(
                            a.record?.wins
                        );
                    valueB =
                        safeNumber(
                            b.record?.wins
                        );
                    break;
                case "ranking":
                    valueA =
                        safeNumber(
                            a.rankings?.current,
                            999
                        );
                    valueB =
                        safeNumber(
                            b.rankings?.current,
                            999
                        );
                    return (
                        valueA -
                        valueB
                    ) * (
                        descending
                            ? 1
                            : -1
                    );
                case "age":
                    valueA =
                        safeNumber(
                            a.physical?.age
                        );
                    valueB =
                        safeNumber(
                            b.physical?.age
                        );
                    break;
                default:
                    valueA = 0;
                    valueB = 0;
            }
            return (
                valueA -
                valueB
            ) * direction;
        }
    );
}
/* ============================================================
   SEARCH
============================================================ */
function searchFighters(
    fighters,
    query
) {
    if (!query) {
        return [];
    }
    const normalized =
        String(
            query
        )
            .trim()
            .toLowerCase();
    const list =
        Array.isArray(
            fighters
        )
            ? fighters
            : Object.values(
                fighters || {}
            );
    return list.filter(
        fighter => {
            const text =
                [
                    fighter.firstName,
                    fighter.lastName,
                    fighter.fullName,
                    fighter.nickname,
                    fighter.country,
                    fighter.city,
                    fighter.style
                ]
                    .filter(
                        Boolean
                    )
                    .join(" ")
                    .toLowerCase();
            return text.includes(
                normalized
            );
        }
    );
}
/* ============================================================
   WORLD DATABASE
============================================================ */
function createFighterDatabase() {
    return {
        fighters: {},
        activeIds: [],
        retiredIds: [],
        champions: {},
        prospects: [],
        legends: [],
        lastGeneratedAt:
            null
    };
}
function addFighter(
    database,
    fighter
) {
    if (
        !database ||
        !fighter
    ) {
        return null;
    }
    if (
        !database.fighters
    ) {
        database.fighters = {};
    }
    database.fighters[
        fighter.id
    ] = fighter;
    updateDatabaseIndexes(
        database
    );
    return fighter;
}
function removeFighter(
    database,
    fighterId
) {
    if (
        !database ||
        !database.fighters ||
        !database.fighters[
            fighterId
        ]
    ) {
        return false;
    }
    delete database.fighters[
        fighterId
    ];
    updateDatabaseIndexes(
        database
    );
    return true;
}
function getFighter(
    database,
    fighterId
) {
    return (
        database?.fighters?.[
            fighterId
        ] ||
        null
    );
}
/* ============================================================
   DATABASE INDEXES
============================================================ */
function updateDatabaseIndexes(
    database
) {
    if (!database) {
        return null;
    }
    const fighters =
        Object.values(
            database.fighters ||
            {}
        );
    database.activeIds =
        fighters
            .filter(
                fighter =>
                    fighter.status ===
                    FIGHTER_STATUS.ACTIVE
            )
            .map(
                fighter =>
                    fighter.id
            );
    database.retiredIds =
        fighters
            .filter(
                fighter =>
                    fighter.status ===
                    FIGHTER_STATUS.RETIRED
            )
            .map(
                fighter =>
                    fighter.id
            );
    database.legends =
        fighters
            .filter(
                fighter =>
                    fighter.type ===
                        FIGHTER_TYPES.LEGEND ||
                    fighter.legacy?.hallOfFame
            )
            .map(
                fighter =>
                    fighter.id
            );
    database.prospects =
        fighters
            .filter(
                fighter =>
                    fighter.type ===
                        FIGHTER_TYPES.PROSPECT ||
                    (
                        safeNumber(
                            fighter.physical?.age,
                            99
                        ) <= 25 &&
                        safeNumber(
                            fighter.potential,
                            0
                        ) >= 75
                    )
            )
            .map(
                fighter =>
                    fighter.id
            );
    database.lastGeneratedAt =
        new Date().toISOString();
    return database;
}
/* ============================================================
   GENERATE WORLD FIGHTERS
============================================================ */
function generateFighters(
    count = 10,
    options = {}
) {
    const database =
        createFighterDatabase();
    const total =
        Math.max(
            0,
            Math.floor(
                safeNumber(
                    count,
                    10
                )
            )
        );
    for (
        let index = 0;
        index < total;
        index++
    ) {
        const fighter =
            createFighter({
                ...options,
                type:
                    options.type ||
                    FIGHTER_TYPES.NPC,
                sex:
                    options.sex ||
                    (
                        Math.random() <
                        0.85
                            ? "male"
                            : "female"
                    ),
                age:
                    options.age ??
                    randomInt(
                        18,
                        35
                    ),
                attributeGeneration:
                    options.attributeGeneration ||
                    {
                        min:
                            options.minOVR
                                ? Math.max(
                                    25,
                                    options.minOVR -
                                    15
                                )
                                : 35,
                        max:
                            options.maxOVR
                                ? Math.min(
                                    90,
                                    options.maxOVR +
                                    10
                                )
                                : 75
                    }
            });
        addFighter(
            database,
            fighter
        );
    }
    updateDatabaseIndexes(
        database
    );
    return database;
}
/* ============================================================
   FIGHTER SNAPSHOT
============================================================ */
function getFighterSnapshot(
    fighter
) {
    if (!fighter) {
        return null;
    }
    return {
        id:
            fighter.id,
        name:
            fighter.fullName,
        nickname:
            fighter.nickname,
        age:
            fighter.physical?.age ??
            null,
        sex:
            fighter.sex,
        country:
            fighter.country,
        city:
            fighter.city,
        style:
            fighter.style,
        ovr:
            fighter.ovr,
        potential:
            fighter.potential,
        record:
            deepClone(
                fighter.record
            ),
        ranking:
            fighter.rankings?.current ??
            null,
        weightClass:
            fighter.physical
                ?.weightClass ??
            null,
        promotion:
            fighter.career
                ?.currentPromotionId ??
            null,
        status:
            fighter.status,
        fame:
            fighter.fame,
        followers:
            fighter.followers,
        champion:
            Boolean(
                fighter.career?.title
            )
    };
}
/* ============================================================
   VALIDATION
============================================================ */
function validateFighter(
    fighter
) {
    if (!fighter) {
        return false;
    }
    if (!fighter.id) {
        return false;
    }
    if (!fighter.fullName) {
        return false;
    }
    if (
        !fighter.attributes ||
        typeof fighter.attributes !==
            "object"
    ) {
        return false;
    }
    if (
        !fighter.record ||
        typeof fighter.record !==
            "object"
    ) {
        return false;
    }
    if (
        !fighter.career ||
        typeof fighter.career !==
            "object"
    ) {
        return false;
    }
    if (
        !Object.values(
            FIGHTER_STATUS
        ).includes(
            fighter.status
        )
    ) {
        return false;
    }
    return true;
}
/* ============================================================
   CLONE
============================================================ */
function cloneFighter(
    fighter
) {
    return deepClone(
        fighter
    );
}
/* ============================================================
   EXPORTS
============================================================ */
export {
    FIGHTER_STATUS,
    FIGHTER_TYPES,
    CAREER_STATUS,
    RESULT_TYPES,
    FINISH_METHODS,
    STRIKING_ATTRIBUTES,
    GRAPPLING_ATTRIBUTES,
    PHYSICAL_ATTRIBUTES,
    MENTAL_ATTRIBUTES,
    DEFAULT_ATTRIBUTE_VALUES,
    calculateGroupAverage,
    calculateFighterOVR,
    generateAttributes,
    randomName,
    createRecord,
    createFightHistoryEntry,
    createCareer,
    createPhysicalProfile,
    createFighter,
    updateFighterOVR,
    updateFighterStyle,
    developFighterAttribute,
    developFighter,
    registerFightResult,
    turnProfessional,
    retireFighter,
    setFighterRanking,
    setChampionStatus,
    modifyFame,
    modifyFollowers,
    filterFighters,
    sortFighters,
    searchFighters,
    createFighterDatabase,
    addFighter,
    removeFighter,
    getFighter,
    updateDatabaseIndexes,
    generateFighters,
    getFighterSnapshot,
    validateFighter,
    cloneFighter
};
export default {
    FIGHTER_STATUS,
    FIGHTER_TYPES,
    CAREER_STATUS,
    RESULT_TYPES,
    FINISH_METHODS,
    STRIKING_ATTRIBUTES,
    GRAPPLING_ATTRIBUTES,
    PHYSICAL_ATTRIBUTES,
    MENTAL_ATTRIBUTES,
    DEFAULT_ATTRIBUTE_VALUES,
    calculateGroupAverage,
    calculateFighterOVR,
    generateAttributes,
    randomName,
    createRecord,
    createFightHistoryEntry,
    createCareer,
    createPhysicalProfile,
    createFighter,
    updateFighterOVR,
    updateFighterStyle,
    developFighterAttribute,
    developFighter,
    registerFightResult,
    turnProfessional,
    retireFighter,
    setFighterRanking,
    setChampionStatus,
    modifyFame,
    modifyFollowers,
    filterFighters,
    sortFighters,
    searchFighters,
    createFighterDatabase,
    addFighter,
    removeFighter,
    getFighter,
    updateDatabaseIndexes,
    generateFighters,
    getFighterSnapshot,
    validateFighter,
    cloneFighter
};
