/*
============================================================
MMA LIFE DYNASTY
FIGHT ENGINE
============================================================
Responsabilidade:
- Simular uma luta de MMA
- Calcular vantagem técnica
- Calcular vantagem de estilo
- Calcular condição física
- Calcular desempenho por round
- Determinar KO/TKO
- Determinar finalização
- Determinar decisão
- Registrar estatísticas
- Gerar narrativa básica da luta
IMPORTANTE:
Este módulo NÃO altera automaticamente o recorde dos
lutadores.
O resultado pode ser enviado posteriormente para:
registerFightResult()
do fighters.js.
============================================================
*/
import {
    getStyleMatchupModifier,
    getStyleProfile
} from "./styles.js";
/* ============================================================
   CONSTANTS
============================================================ */
const FIGHT_ENGINE_VERSION = 1;
const ROUND_DURATION_SECONDS = 300;
const MAX_ROUNDS = 5;
const RESULT = Object.freeze({
    WIN: "win",
    LOSS: "loss",
    DRAW: "draw",
    NO_CONTEST: "noContest"
});
const METHODS = Object.freeze({
    KO: "ko",
    TKO: "tko",
    SUBMISSION: "submission",
    DECISION: "decision",
    DRAW: "draw",
    NO_CONTEST: "noContest"
});
const FIGHT_PHASES = Object.freeze({
    STANDING: "standing",
    CLINCH: "clinch",
    GROUND: "ground"
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
    return Number.isFinite(number)
        ? number
        : fallback;
}
function clamp(
    value,
    min,
    max
) {
    return Math.max(
        min,
        Math.min(
            max,
            safeNumber(
                value,
                min
            )
        )
    );
}
function roundNumber(
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
function randomFloat(
    min = 0,
    max = 1
) {
    return (
        Math.random() *
        (
            max -
            min
        )
    ) + min;
}
function randomInt(
    min,
    max
) {
    return Math.floor(
        randomFloat(
            min,
            max + 1
        )
    );
}
function chance(
    probability
) {
    return (
        Math.random() <
        clamp(
            probability,
            0,
            1
        )
    );
}
function createId(
    prefix = "fight"
) {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );
}
/* ============================================================
   ATTRIBUTE HELPERS
============================================================ */
function getAttribute(
    fighter,
    name,
    fallback = 50
) {
    return clamp(
        fighter?.attributes?.[
            name
        ],
        1,
        100
    ) || fallback;
}
function average(
    values
) {
    const valid =
        values
            .map(
                value =>
                    safeNumber(
                        value,
                        0
                    )
            )
            .filter(
                value =>
                    Number.isFinite(
                        value
                    )
            );
    if (
        !valid.length
    ) {
        return 0;
    }
    return (
        valid.reduce(
            (
                total,
                value
            ) =>
                total +
                value,
            0
        ) /
        valid.length
    );
}
/* ============================================================
   TECHNICAL RATINGS
============================================================ */
function getStrikingRating(
    fighter
) {
    return average([
        getAttribute(
            fighter,
            "boxing"
        ),
        getAttribute(
            fighter,
            "punching"
        ),
        getAttribute(
            fighter,
            "kicking"
        ),
        getAttribute(
            fighter,
            "muayThai"
        ),
        getAttribute(
            fighter,
            "strikingPower"
        ),
        getAttribute(
            fighter,
            "strikingAccuracy"
        ),
        getAttribute(
            fighter,
            "speed"
        ),
        getAttribute(
            fighter,
            "timing"
        ),
        getAttribute(
            fighter,
            "footwork"
        )
    ]);
}
function getWrestlingRating(
    fighter
) {
    return average([
        getAttribute(
            fighter,
            "wrestling"
        ),
        getAttribute(
            fighter,
            "takedowns"
        ),
        getAttribute(
            fighter,
            "takedownDefense"
        ),
        getAttribute(
            fighter,
            "clinch"
        ),
        getAttribute(
            fighter,
            "groundControl"
        ),
        getAttribute(
            fighter,
            "scrambling"
        )
    ]);
}
function getGrapplingRating(
    fighter
) {
    return average([
        getAttribute(
            fighter,
            "bjj"
        ),
        getAttribute(
            fighter,
            "submissions"
        ),
        getAttribute(
            fighter,
            "submissionDefense"
        ),
        getAttribute(
            fighter,
            "groundControl"
        ),
        getAttribute(
            fighter,
            "transitions"
        ),
        getAttribute(
            fighter,
            "scrambling"
        )
    ]);
}
function getPhysicalRating(
    fighter
) {
    return average([
        getAttribute(
            fighter,
            "strength"
        ),
        getAttribute(
            fighter,
            "power"
        ),
        getAttribute(
            fighter,
            "explosiveness"
        ),
        getAttribute(
            fighter,
            "speed"
        ),
        getAttribute(
            fighter,
            "agility"
        )
    ]);
}
function getCardioRating(
    fighter
) {
    return average([
        getAttribute(
            fighter,
            "cardio"
        ),
        getAttribute(
            fighter,
            "endurance"
        )
    ]);
}
function getMentalRating(
    fighter
) {
    return average([
        getAttribute(
            fighter,
            "fightIQ"
        ),
        getAttribute(
            fighter,
            "composure"
        ),
        getAttribute(
            fighter,
            "discipline"
        ),
        getAttribute(
            fighter,
            "focus"
        ),
        getAttribute(
            fighter,
            "confidence"
        ),
        getAttribute(
            fighter,
            "courage"
        ),
        getAttribute(
            fighter,
            "adaptability"
        ),
        getAttribute(
            fighter,
            "resilience"
        )
    ]);
}
/* ============================================================
   CONDITION
============================================================ */
function getCondition(
    fighter
) {
    const energy =
        clamp(
            fighter?.training?.energy,
            0,
            100
        );
    const fatigue =
        clamp(
            fighter?.training?.fatigue,
            0,
            100
        );
    const health =
        clamp(
            fighter?.health?.overall,
            0,
            100
        );
    const defaultEnergy =
        fighter?.training
            ? energy
            : 100;
    const defaultFatigue =
        fighter?.training
            ? fatigue
            : 0;
    const defaultHealth =
        fighter?.health
            ? health
            : 100;
    return clamp(
        (
            defaultEnergy * 0.35
        ) +
        (
            (
                100 -
                defaultFatigue
            ) * 0.30
        ) +
        (
            defaultHealth * 0.35
        ),
        0,
        100
    );
}
/* ============================================================
   STYLE
============================================================ */
function getStyleModifier(
    fighterA,
    fighterB
) {
    if (
        !fighterA ||
        !fighterB
    ) {
        return 0;
    }
    const styleA =
        fighterA.style ||
        "Balanced";
    const styleB =
        fighterB.style ||
        "Balanced";
    return safeNumber(
        getStyleMatchupModifier(
            styleA,
            styleB
        ),
        0
    );
}
function getStyleCombatProfile(
    fighter
) {
    const profile =
        getStyleProfile(
            fighter?.style ||
            "Balanced"
        );
    return (
        profile || {
            preferredRange:
                "mixed",
            preferredPhase:
                "mixed"
        }
    );
}
/* ============================================================
   BASE POWER
============================================================ */
function calculateBasePower(
    fighter
) {
    const ovr =
        safeNumber(
            fighter?.ovr,
            50
        );
    const striking =
        getStrikingRating(
            fighter
        );
    const wrestling =
        getWrestlingRating(
            fighter
        );
    const grappling =
        getGrapplingRating(
            fighter
        );
    const physical =
        getPhysicalRating(
            fighter
        );
    const mental =
        getMentalRating(
            fighter
        );
    return clamp(
        (
            ovr * 0.20
        ) +
        (
            striking * 0.20
        ) +
        (
            wrestling * 0.15
        ) +
        (
            grappling * 0.15
        ) +
        (
            physical * 0.15
        ) +
        (
            mental * 0.15
        ),
        1,
        100
    );
}
/* ============================================================
   PHASE POWER
============================================================ */
function calculatePhasePower(
    fighter,
    phase
) {
    switch (
        phase
    ) {
        case FIGHT_PHASES.STANDING:
            return average([
                getStrikingRating(
                    fighter
                ),
                getAttribute(
                    fighter,
                    "speed"
                ),
                getAttribute(
                    fighter,
                    "timing"
                ),
                getAttribute(
                    fighter,
                    "footwork"
                )
            ]);
        case FIGHT_PHASES.CLINCH:
            return average([
                getWrestlingRating(
                    fighter
                ),
                getAttribute(
                    fighter,
                    "clinch"
                ),
                getAttribute(
                    fighter,
                    "strength"
                ),
                getAttribute(
                    fighter,
                    "dirtyBoxing"
                )
            ]);
        case FIGHT_PHASES.GROUND:
            return average([
                getWrestlingRating(
                    fighter
                ),
                getGrapplingRating(
                    fighter
                ),
                getAttribute(
                    fighter,
                    "groundControl"
                ),
                getAttribute(
                    fighter,
                    "submissionDefense"
                )
            ]);
        default:
            return calculateBasePower(
                fighter
            );
    }
}
/* ============================================================
   ROUND PROFILE
============================================================ */
function createRoundProfile(
    roundNumber
) {
    return {
        round:
            roundNumber,
        phase:
            FIGHT_PHASES.STANDING,
        fighterA: {
            strikesLanded: 0,
            strikesAttempted: 0,
            significantStrikes: 0,
            takedowns: 0,
            submissionAttempts: 0,
            controlSeconds: 0,
            damage: 0,
            knockdowns: 0
        },
        fighterB: {
            strikesLanded: 0,
            strikesAttempted: 0,
            significantStrikes: 0,
            takedowns: 0,
            submissionAttempts: 0,
            controlSeconds: 0,
            damage: 0,
            knockdowns: 0
        },
        scoreA: 0,
        scoreB: 0,
        momentumA: 50,
        momentumB: 50,
        finishThreatA: 0,
        finishThreatB: 0,
        winner: null,
        method:
            null,
        endedEarly:
            false
    };
}
/* ============================================================
   PHASE SELECTION
============================================================ */
function chooseFightPhase(
    fighterA,
    fighterB,
    momentumA,
    momentumB
) {
    const profileA =
        getStyleCombatProfile(
            fighterA
        );
    const profileB =
        getStyleCombatProfile(
            fighterB
        );
    const preferenceA =
        profileA.preferredPhase ||
        "mixed";
    const preferenceB =
        profileB.preferredPhase ||
        "mixed";
    const weights = {
        [FIGHT_PHASES.STANDING]:
            1,
        [FIGHT_PHASES.CLINCH]:
            1,
        [FIGHT_PHASES.GROUND]:
            1
    };
    if (
        preferenceA ===
        "striking"
    ) {
        weights.standing +=
            2;
    }
    if (
        preferenceA ===
        "wrestling"
    ) {
        weights.clinch +=
            2;
        weights.ground +=
            1;
    }
    if (
        preferenceA ===
        "grappling"
    ) {
        weights.ground +=
            3;
    }
    if (
        preferenceB ===
        "striking"
    ) {
        weights.standing +=
            2;
    }
    if (
        preferenceB ===
        "wrestling"
    ) {
        weights.clinch +=
            2;
        weights.ground +=
            1;
    }
    if (
        preferenceB ===
        "grappling"
    ) {
        weights.ground +=
            3;
    }
    if (
        momentumA >
        momentumB + 15
    ) {
        weights.standing +=
            0.5;
    }
    if (
        momentumB >
        momentumA + 15
    ) {
        weights.ground +=
            0.5;
    }
    const entries =
        Object.entries(
            weights
        );
    const total =
        entries.reduce(
            (
                sum,
                [, value]
            ) =>
                sum + value,
            0
        );
    let roll =
        randomFloat(
            0,
            total
        );
    for (
        const [
            phase,
            weight
        ]
        of entries
    ) {
        roll -=
            weight;
        if (
            roll <= 0
        ) {
            return phase;
        }
    }
    return FIGHT_PHASES.STANDING;
}
/* ============================================================
   PERFORMANCE
============================================================ */
function calculateFighterPerformance(
    fighter,
    opponent,
    phase,
    roundNumber,
    momentum
) {
    const base =
        calculateBasePower(
            fighter
        );
    const phasePower =
        calculatePhasePower(
            fighter,
            phase
        );
    const condition =
        getCondition(
            fighter
        );
    const cardio =
        getCardioRating(
            fighter
        );
    const mental =
        getMentalRating(
            fighter
        );
    const styleModifier =
        getStyleModifier(
            fighter,
            opponent
        );
    const fatiguePenalty =
        Math.max(
            0,
            roundNumber - 1
        ) *
        Math.max(
            0,
            50 - cardio
        ) *
        0.025;
    const momentumModifier =
        (
            momentum -
            50
        ) *
        0.20;
    const randomVariance =
        randomFloat(
            -8,
            8
        );
    const performance =
        (
            base * 0.25
        ) +
        (
            phasePower * 0.35
        ) +
        (
            condition * 0.15
        ) +
        (
            cardio * 0.10
        ) +
        (
            mental * 0.10
        ) +
        (
            styleModifier * 8
        ) +
        momentumModifier +
        randomVariance -
        fatiguePenalty;
    return clamp(
        performance,
        1,
        110
    );
}
/* ============================================================
   DAMAGE
============================================================ */
function calculateDamage(
    attacker,
    defender,
    attackerPerformance,
    defenderPerformance,
    phase
) {
    const physical =
        getPhysicalRating(
            attacker
        );
    const power =
        getAttribute(
            attacker,
            "power"
        );
    const defense =
        phase ===
        FIGHT_PHASES.STANDING
            ? average([
                getAttribute(
                    defender,
                    "headMovement"
                ),
                getAttribute(
                    defender,
                    "footwork"
                ),
                getAttribute(
                    defender,
                    "strikingAccuracy"
                )
            ])
            : phase ===
                FIGHT_PHASES.GROUND
                ? average([
                    getAttribute(
                        defender,
                        "submissionDefense"
                    ),
                    getAttribute(
                        defender,
                        "groundControl"
                    ),
                    getAttribute(
                        defender,
                        "scrambling"
                    )
                ])
                : average([
                    getAttribute(
                        defender,
                        "wrestling"
                    ),
                    getAttribute(
                        defender,
                        "clinch"
                    ),
                    getAttribute(
                        defender,
                        "strength"
                    )
                ]);
    const advantage =
        attackerPerformance -
        defenderPerformance;
    const base =
        (
            physical * 0.25
        ) +
        (
            power * 0.30
        ) +
        (
            Math.max(
                0,
                advantage
            ) * 0.45
        );
    return clamp(
        base /
        10,
        0,
        12
    );
}
/* ============================================================
   STRIKE SIMULATION
============================================================ */
function simulateStrikes(
    attacker,
    defender,
    performance,
    phase
) {
    let attempts =
        randomInt(
            8,
            30
        );
    if (
        phase ===
        FIGHT_PHASES.GROUND
    ) {
        attempts =
            randomInt(
                4,
                20
            );
    }
    const accuracy =
        clamp(
            (
                getAttribute(
                    attacker,
                    "strikingAccuracy"
                ) *
                0.60
            ) +
            (
                performance *
                0.40
            ),
            1,
            100
        );
    const landed =
        Math.round(
            attempts *
            (
                accuracy /
                100
            ) *
            randomFloat(
                0.75,
                1.05
            )
        );
    const significant =
        Math.round(
            landed *
            randomFloat(
                0.45,
                0.80
            )
        );
    return {
        attempts,
        landed:
            clamp(
                landed,
                0,
                attempts
            ),
        significant:
            clamp(
                significant,
                0,
                landed
            )
    };
}
/* ============================================================
   TAKEDOWN SIMULATION
============================================================ */
function simulateTakedowns(
    attacker,
    defender,
    performance,
    phase
) {
    if (
        phase ===
        FIGHT_PHASES.STANDING
    ) {
        const wrestling =
            getWrestlingRating(
                attacker
            );
        const defense =
            getAttribute(
                defender,
                "takedownDefense"
            );
        const probability =
            clamp(
                (
                    wrestling -
                    defense +
                    50
                ) /
                140,
                0.03,
                0.70
            );
        return {
            attempts:
                randomInt(
                    0,
                    5
                ),
            landed:
                chance(
                    probability
                )
                    ? randomInt(
                        1,
                        2
                    )
                    : 0
        };
    }
    return {
        attempts:
            randomInt(
                0,
                2
            ),
        landed:
            chance(
                0.35
            )
                ? 1
                : 0
    };
}
/* ============================================================
   SUBMISSION SIMULATION
============================================================ */
function simulateSubmission(
    attacker,
    defender,
    performance,
    phase
) {
    if (
        phase !==
        FIGHT_PHASES.GROUND
    ) {
        return {
            attempts: 0,
            threat: 0,
            success: false
        };
    }
    const grappling =
        getGrapplingRating(
            attacker
        );
    const defense =
        getAttribute(
            defender,
            "submissionDefense"
        );
    const threat =
        clamp(
            (
                grappling -
                defense +
                50
            ) /
            2,
            0,
            100
        );
    const attempts =
        chance(
            threat / 150
        )
            ? randomInt(
                1,
                2
            )
            : 0;
    const success =
        attempts > 0 &&
        chance(
            clamp(
                (
                    grappling -
                    defense +
                    40
                ) /
                150,
                0.01,
                0.45
            )
        );
    return {
        attempts,
        threat,
        success
    };
}
/* ============================================================
   KNOCKDOWN
============================================================ */
function calculateKnockdownChance(
    attacker,
    defender,
    performance,
    damage
) {
    const power =
        getAttribute(
            attacker,
            "strikingPower"
        );
    const defense =
        average([
            getAttribute(
                defender,
                "headMovement"
            ),
            getAttribute(
                defender,
                "composure"
            ),
            getAttribute(
                defender,
                "resilience"
            )
        ]);
    const advantage =
        Math.max(
            0,
            performance -
            (
                defense * 0.65
            )
        );
    return clamp(
        (
            power * 0.002
        ) +
        (
            advantage * 0.006
        ) +
        (
            damage * 0.015
        ),
        0.002,
        0.25
    );
}
/* ============================================================
   FINISH CHECK
============================================================ */
function checkFinish(
    attacker,
    defender,
    performanceDifference,
    damage,
    phase,
    roundNumber
) {
    const health =
        clamp(
            defender?._fightHealth,
            0,
            100
        );
    const resilience =
        getAttribute(
            defender,
            "resilience"
        );
    const courage =
        getAttribute(
            defender,
            "courage"
        );
    const finishResistance =
        (
            resilience * 0.55
        ) +
        (
            courage * 0.20
        ) +
        (
            health * 0.25
        );
    if (
        phase ===
        FIGHT_PHASES.GROUND
    ) {
        const grappling =
            getGrapplingRating(
                attacker
            );
        const submissionDefense =
            getAttribute(
                defender,
                "submissionDefense"
            );
        const submissionDifference =
            grappling -
            submissionDefense;
        const submissionChance =
            clamp(
                (
                    submissionDifference +
                    20
                ) /
                300,
                0.002,
                0.18
            );
        if (
            chance(
                submissionChance *
                (
                    1 +
                    (
                        100 -
                        health
                    ) /
                    150
                )
            )
        ) {
            return {
                finished: true,
                method:
                    METHODS.SUBMISSION,
                round:
                    roundNumber
            };
        }
    }
    const koPower =
        getAttribute(
            attacker,
            "strikingPower"
        );
    const koChance =
        clamp(
            (
                (
                    performanceDifference +
                    10
                ) *
                0.002
            ) +
            (
                koPower *
                0.0006
            ) +
            (
                damage *
                0.004
            ) -
            (
                finishResistance *
                0.0007
            ),
            0.001,
            0.20
        );
    if (
        chance(
            koChance
        )
    ) {
        return {
            finished: true,
            method:
                damage >= 8
                    ? METHODS.KO
                    : METHODS.TKO,
            round:
                roundNumber
        };
    }
    return {
        finished: false,
        method: null,
        round: null
    };
}
/* ============================================================
   ROUND SCORE
============================================================ */
function calculateRoundScore(
    stats,
    controlSeconds,
    damage,
    knockdowns,
    performance
) {
    return (
        (
            stats.significantStrikes *
            0.55
        ) +
        (
            stats.strikesLanded *
            0.15
        ) +
        (
            stats.takedowns *
            1.50
        ) +
        (
            controlSeconds /
            60 *
            0.75
        ) +
        (
            damage *
            1.40
        ) +
        (
            knockdowns *
            8
        ) +
        (
            performance *
            0.08
        )
    );
}
/* ============================================================
   SIMULATE ROUND
============================================================ */
function simulateRound(
    fighterA,
    fighterB,
    roundNumber,
    state
) {
    const round =
        createRoundProfile(
            roundNumber
        );
    const momentumA =
        safeNumber(
            state.momentumA,
            50
        );
    const momentumB =
        safeNumber(
            state.momentumB,
            50
        );
    const phase =
        chooseFightPhase(
            fighterA,
            fighterB,
            momentumA,
            momentumB
        );
    round.phase =
        phase;
    const performanceA =
        calculateFighterPerformance(
            fighterA,
            fighterB,
            phase,
            roundNumber,
            momentumA
        );
    const performanceB =
        calculateFighterPerformance(
            fighterB,
            fighterA,
            phase,
            roundNumber,
            momentumB
        );
    const strikesA =
        simulateStrikes(
            fighterA,
            fighterB,
            performanceA,
            phase
        );
    const strikesB =
        simulateStrikes(
            fighterB,
            fighterA,
            performanceB,
            phase
        );
    const takedownsA =
        simulateTakedowns(
            fighterA,
            fighterB,
            performanceA,
            phase
        );
    const takedownsB =
        simulateTakedowns(
            fighterB,
            fighterA,
            performanceB,
            phase
        );
    const submissionA =
        simulateSubmission(
            fighterA,
            fighterB,
            performanceA,
            phase
        );
    const submissionB =
        simulateSubmission(
            fighterB,
            fighterA,
            performanceB,
            phase
        );
    const damageA =
        calculateDamage(
            fighterA,
            fighterB,
            performanceA,
            performanceB,
            phase
        );
    const damageB =
        calculateDamage(
            fighterB,
            fighterA,
            performanceB,
            performanceA,
            phase
        );
    const knockdownA =
        chance(
            calculateKnockdownChance(
                fighterA,
                fighterB,
                performanceA,
                damageA
            )
        )
            ? 1
            : 0;
    const knockdownB =
        chance(
            calculateKnockdownChance(
                fighterB,
                fighterA,
                performanceB,
                damageB
            )
        )
            ? 1
            : 0;
    const controlA =
        phase ===
        FIGHT_PHASES.GROUND
            ? randomInt(
                20,
                160
            )
            : randomInt(
                0,
                40
            );
    const controlB =
        phase ===
        FIGHT_PHASES.GROUND
            ? randomInt(
                20,
                160
            )
            : randomInt(
                0,
                40
            );
    round.fighterA = {
        strikesLanded:
            strikesA.landed,
        strikesAttempted:
            strikesA.attempts,
        significantStrikes:
            strikesA.significant,
        takedowns:
            takedownsA.landed,
        submissionAttempts:
            submissionA.attempts,
        controlSeconds:
            controlA,
        damage:
            damageA,
        knockdowns:
            knockdownA,
        performance:
            roundNumber === 1
                ? performanceA
                : roundNumber * 0 +
                  performanceA
    };
    round.fighterB = {
        strikesLanded:
            strikesB.landed,
        strikesAttempted:
            strikesB.attempts,
        significantStrikes:
            strikesB.significant,
        takedowns:
            takedownsB.landed,
        submissionAttempts:
            submissionB.attempts,
        controlSeconds:
            controlB,
        damage:
            damageB,
        knockdowns:
            knockdownB,
        performance:
            performanceB
    };
    round.finishThreatA =
        clamp(
            submissionA.threat +
            (
                damageA *
                4
            ) +
            (
                knockdownA *
                25
            ),
            0,
            100
        );
    round.finishThreatB =
        clamp(
            submissionB.threat +
            (
                damageB *
                4
            ) +
            (
                knockdownB *
                25
            ),
            0,
            100
        );
    round.scoreA =
        calculateRoundScore(
            round.fighterA,
            controlA,
            damageA,
            knockdownA,
            performanceA
        );
    round.scoreB =
        calculateRoundScore(
            round.fighterB,
            controlB,
            damageB,
            knockdownB,
            performanceB
        );
    round.winner =
        round.scoreA >
        round.scoreB
            ? "A"
            : round.scoreB >
                round.scoreA
                ? "B"
                : "draw";
    const damageToB =
        damageA *
        randomFloat(
            0.8,
            1.3
        );
    const damageToA =
        damageB *
        randomFloat(
            0.8,
            1.3
        );
    fighterA._fightHealth =
        clamp(
            safeNumber(
                fighterA._fightHealth,
                100
            ) -
            damageToA,
            0,
            100
        );
    fighterB._fightHealth =
        clamp(
            safeNumber(
                fighterB._fightHealth,
                100
            ) -
            damageToB,
            0,
            100
        );
    const finishA =
        checkFinish(
            fighterA,
            fighterB,
            performanceA -
                performanceB,
            damageA,
            phase,
            roundNumber
        );
    const finishB =
        checkFinish(
            fighterB,
            fighterA,
            performanceB -
                performanceA,
            damageB,
            phase,
            roundNumber
        );
    if (
        finishA.finished
    ) {
        round.winner =
            "A";
        round.method =
            finishA.method;
        round.endedEarly =
            true;
        return round;
    }
    if (
        finishB.finished
    ) {
        round.winner =
            "B";
        round.method =
            finishB.method;
        round.endedEarly =
            true;
        return round;
    }
    const momentumChange =
        clamp(
            (
                performanceA -
                performanceB
            ) *
            0.35,
            -15,
            15
        );
    state.momentumA =
        clamp(
            momentumA +
            momentumChange,
            0,
            100
        );
    state.momentumB =
        clamp(
            momentumB -
            momentumChange,
            0,
            100
        );
    return round;
}
/* ============================================================
   DECISION
============================================================ */
function determineDecision(
    rounds
) {
    let scoreA = 0;
    let scoreB = 0;
    const roundScores = [];
    for (
        const round of rounds
    ) {
        let winner =
            round.winner;
        if (
            winner ===
            "A"
        ) {
            scoreA++;
        }
        if (
            winner ===
            "B"
        ) {
            scoreB++;
        }
        roundScores.push({
            round:
                round.round,
            scoreA:
                round.scoreA,
            scoreB:
                round.scoreB,
            winner
        });
    }
    if (
        scoreA >
        scoreB
    ) {
        return {
            result:
                RESULT.WIN,
            winner:
                "A",
            method:
                METHODS.DECISION,
            scoreA,
            scoreB,
            roundScores
        };
    }
    if (
        scoreB >
        scoreA
    ) {
        return {
            result:
                RESULT.WIN,
            winner:
                "B",
            method:
                METHODS.DECISION,
            scoreA,
            scoreB,
            roundScores
        };
    }
    return {
        result:
            RESULT.DRAW,
        winner:
            null,
        method:
            METHODS.DRAW,
        scoreA,
        scoreB,
        roundScores
    };
}
/* ============================================================
   FIGHT NARRATIVE
============================================================ */
function generateRoundNarrative(
    round,
    fighterA,
    fighterB
) {
    const nameA =
        fighterA?.nickname ||
        fighterA?.firstName ||
        "Lutador A";
    const nameB =
        fighterB?.nickname ||
        fighterB?.firstName ||
        "Lutador B";
    if (
        round.method ===
        METHODS.SUBMISSION
    ) {
        return (
            `${nameA} consegue a finalização ` +
            `no round ${round.round}.`
        );
    }
    if (
        round.method ===
            METHODS.KO ||
        round.method ===
            METHODS.TKO
    ) {
        return (
            `${nameA} encontra o golpe decisivo ` +
            `e encerra a luta no round ${round.round}.`
        );
    }
    if (
        round.winner ===
        "A"
    ) {
        if (
            round.fighterA
                .knockdowns >
            0
        ) {
            return (
                `${nameA} domina a ação e consegue ` +
                `um knockdown sobre ${nameB}.`
            );
        }
        if (
            round.fighterA
                .takedowns >
            0
        ) {
            return (
                `${nameA} impõe seu jogo de wrestling ` +
                `e leva a luta para o chão.`
            );
        }
        return (
            `${nameA} leva vantagem nas trocas ` +
            `e controla o ritmo do round.`
        );
    }
    if (
        round.winner ===
        "B"
    ) {
        if (
            round.fighterB
                .knockdowns >
            0
        ) {
            return (
                `${nameB} encontra espaço e consegue ` +
                `um knockdown.`
            );
        }
        if (
            round.fighterB
                .takedowns >
            0
        ) {
            return (
                `${nameB} usa o wrestling para mudar ` +
                `o curso da luta.`
            );
        }
        return (
            `${nameB} responde bem e termina o ` +
            `round em vantagem.`
        );
    }
    return (
        `${nameA} e ${nameB} têm um round equilibrado.`
    );
}
/* ============================================================
   CLEAN FIGHTER
============================================================ */
function removeTemporaryFightData(
    fighter
) {
    if (!fighter) {
        return;
    }
    delete fighter._fightHealth;
}
/* ============================================================
   SIMULATE FIGHT
============================================================ */
function simulateFight(
    fighterAInput,
    fighterBInput,
    options = {}
) {
    if (
        !fighterAInput ||
        !fighterBInput
    ) {
        throw new Error(
            "Dois lutadores são necessários para simular a luta."
        );
    }
    const fighterA = {
        ...fighterAInput,
        attributes: {
            ...(fighterAInput.attributes ||
                {})
        },
        training: {
            ...(fighterAInput.training ||
                {})
        },
        health: {
            ...(fighterAInput.health ||
                {})
        }
    };
    const fighterB = {
        ...fighterBInput,
        attributes: {
            ...(fighterBInput.attributes ||
                {})
        },
        training: {
            ...(fighterBInput.training ||
                {})
        },
        health: {
            ...(fighterBInput.health ||
                {})
        }
    };
    fighterA._fightHealth =
        100;
    fighterB._fightHealth =
        100;
    const scheduledRounds =
        clamp(
            safeNumber(
                options.rounds,
                3
            ),
            1,
            MAX_ROUNDS
        );
    const state = {
        momentumA:
            50,
        momentumB:
            50
    };
    const rounds = [];
    let finish = null;
    for (
        let roundNumber = 1;
        roundNumber <=
        scheduledRounds;
        roundNumber++
    ) {
        const round =
            simulateRound(
                fighterA,
                fighterB,
                roundNumber,
                state
            );
        rounds.push(
            round
        );
        if (
            round.endedEarly
        ) {
            finish = {
                winner:
                    round.winner,
                method:
                    round.method,
                round:
                    round.round
            };
            break;
        }
        if (
            fighterA._fightHealth <=
            0 ||
            fighterB._fightHealth <=
            0
        ) {
            if (
                fighterA._fightHealth <=
                0 &&
                fighterB._fightHealth <=
                0
            ) {
                finish = {
                    winner:
                        null,
                    method:
                        METHODS.DRAW,
                    round:
                        roundNumber
                };
            } else if (
                fighterB._fightHealth <=
                0
            ) {
                finish = {
                    winner:
                        "A",
                    method:
                        METHODS.TKO,
                    round:
                        roundNumber
                };
            } else {
                finish = {
                    winner:
                        "B",
                    method:
                        METHODS.TKO,
                    round:
                        roundNumber
                };
            }
            break;
        }
    }
    let decision;
    if (
        finish
    ) {
        decision = {
            result:
                finish.winner
                    ? RESULT.WIN
                    : RESULT.DRAW,
            winner:
                finish.winner,
            method:
                finish.method,
            scoreA:
                null,
            scoreB:
                null
        };
    } else {
        decision =
            determineDecision(
                rounds
            );
    }
    const winner =
        decision.winner ===
        "A"
            ? fighterA
            : decision.winner ===
                "B"
                ? fighterB
                : null;
    const loser =
        decision.winner ===
        "A"
            ? fighterB
            : decision.winner ===
                "B"
                ? fighterA
                : null;
    const result = {
        id:
            createId(
                "fight"
            ),
        engineVersion:
            FIGHT_ENGINE_VERSION,
        fighterAId:
            fighterA.id ||
            null,
        fighterBId:
            fighterB.id ||
            null,
        fighterAName:
            fighterA.fullName ||
            fighterA.firstName ||
            "Fighter A",
        fighterBName:
            fighterB.fullName ||
            fighterB.firstName ||
            "Fighter B",
        winnerId:
            winner?.id ||
            null,
        loserId:
            loser?.id ||
            null,
        result:
            decision.result,
        method:
            decision.method,
        round:
            finish?.round ||
            rounds.length,
        scheduledRounds,
        rounds,
        decision,
        fighterAStats:
            calculateFightTotals(
                rounds,
                "fighterA"
            ),
        fighterBStats:
            calculateFightTotals(
                rounds,
                "fighterB"
            ),
        finalHealth: {
            fighterA:
                roundNumberValue(
                    fighterA._fightHealth
                ),
            fighterB:
                roundNumberValue(
                    fighterB._fightHealth
                )
        },
        narrative:
            rounds.map(
                round =>
                    generateRoundNarrative(
                        round,
                        fighterA,
                        fighterB
                    )
            ),
        completedAt:
            new Date().toISOString()
    };
    removeTemporaryFightData(
        fighterA
    );
    removeTemporaryFightData(
        fighterB
    );
    return result;
}
/* ============================================================
   TOTAL STATS
============================================================ */
function calculateFightTotals(
    rounds,
    fighterKey
) {
    const total = {
        strikesLanded: 0,
        strikesAttempted: 0,
        significantStrikes: 0,
        takedowns: 0,
        submissionAttempts: 0,
        controlSeconds: 0,
        damage: 0,
        knockdowns: 0
    };
    for (
        const round of rounds
    ) {
        const stats =
            round[
                fighterKey
            ];
        if (!stats) {
            continue;
        }
        total.strikesLanded +=
            safeNumber(
                stats.strikesLanded
            );
        total.strikesAttempted +=
            safeNumber(
                stats.strikesAttempted
            );
        total.significantStrikes +=
            safeNumber(
                stats.significantStrikes
            );
        total.takedowns +=
            safeNumber(
                stats.takedowns
            );
        total.submissionAttempts +=
            safeNumber(
                stats.submissionAttempts
            );
        total.controlSeconds +=
            safeNumber(
                stats.controlSeconds
            );
        total.damage +=
            safeNumber(
                stats.damage
            );
        total.knockdowns +=
            safeNumber(
                stats.knockdowns
            );
    }
    return {
        ...total,
        accuracy:
            total.strikesAttempted >
            0
                ? roundNumber(
                    (
                        total.strikesLanded /
                        total.strikesAttempted
                    ) *
                    100
                )
                : 0,
        controlMinutes:
            roundNumber(
                total.controlSeconds /
                60
            )
    };
}
/* ============================================================
   HELPER
============================================================ */
function roundNumberValue(
    value
) {
    return roundNumber(
        safeNumber(
            value,
            0
        ),
        1
    );
}
/* ============================================================
   QUICK SIMULATION
============================================================ */
function quickSimulate(
    fighterA,
    fighterB
) {
    const result =
        simulateFight(
            fighterA,
            fighterB,
            {
                rounds: 3
            }
        );
    return {
        winnerId:
            result.winnerId,
        loserId:
            result.loserId,
        method:
            result.method,
        round:
            result.round,
        fighterAName:
            result.fighterAName,
        fighterBName:
            result.fighterBName
    };
}
/* ============================================================
   MATCHUP ANALYSIS
============================================================ */
function analyzeMatchup(
    fighterA,
    fighterB
) {
    const strikingA =
        getStrikingRating(
            fighterA
        );
    const strikingB =
        getStrikingRating(
            fighterB
        );
    const wrestlingA =
        getWrestlingRating(
            fighterA
        );
    const wrestlingB =
        getWrestlingRating(
            fighterB
        );
    const grapplingA =
        getGrapplingRating(
            fighterA
        );
    const grapplingB =
        getGrapplingRating(
            fighterB
        );
    const physicalA =
        getPhysicalRating(
            fighterA
        );
    const physicalB =
        getPhysicalRating(
            fighterB
        );
    const cardioA =
        getCardioRating(
            fighterA
        );
    const cardioB =
        getCardioRating(
            fighterB
        );
    const mentalA =
        getMentalRating(
            fighterA
        );
    const mentalB =
        getMentalRating(
            fighterB
        );
    const styleModifier =
        getStyleModifier(
            fighterA,
            fighterB
        );
    const ratingA =
        (
            strikingA * 0.20
        ) +
        (
            wrestlingA * 0.20
        ) +
        (
            grapplingA * 0.20
        ) +
        (
            physicalA * 0.15
        ) +
        (
            cardioA * 0.10
        ) +
        (
            mentalA * 0.15
        );
    const ratingB =
        (
            strikingB * 0.20
        ) +
        (
            wrestlingB * 0.20
        ) +
        (
            grapplingB * 0.20
        ) +
        (
            physicalB * 0.15
        ) +
        (
            cardioB * 0.10
        ) +
        (
            mentalB * 0.15
        );
    const adjustedA =
        ratingA +
        (
            styleModifier *
            8
        );
    const adjustedB =
        ratingB -
        (
            styleModifier *
            8
        );
    const difference =
        adjustedA -
        adjustedB;
    return {
        fighterA: {
            striking:
                roundNumber(
                    strikingA
                ),
            wrestling:
                roundNumber(
                    wrestlingA
                ),
            grappling:
                roundNumber(
                    grapplingA
                ),
            physical:
                roundNumber(
                    physicalA
                ),
            cardio:
                roundNumber(
                    cardioA
                ),
            mental:
                roundNumber(
                    mentalA
                ),
            rating:
                roundNumber(
                    ratingA
                )
        },
        fighterB: {
            striking:
                roundNumber(
                    strikingB
                ),
            wrestling:
                roundNumber(
                    wrestlingB
                ),
            grappling:
                roundNumber(
                    grapplingB
                ),
            physical:
                roundNumber(
                    physicalB
                ),
            cardio:
                roundNumber(
                    cardioB
                ),
            mental:
                roundNumber(
                    mentalB
                ),
            rating:
                roundNumber(
                    ratingB
                )
        },
        styleModifier:
            roundNumber(
                styleModifier
            ),
        adjustedA:
            roundNumber(
                adjustedA
            ),
        adjustedB:
            roundNumber(
                adjustedB
            ),
        difference:
            roundNumber(
                difference
            ),
        favorite:
            difference > 2
                ? "A"
                : difference < -2
                    ? "B"
                    : "even"
    };
}
/* ============================================================
   VALIDATION
============================================================ */
function validateFightResult(
    result
) {
    if (!result) {
        return false;
    }
    if (!result.id) {
        return false;
    }
    if (!result.fighterAName) {
        return false;
    }
    if (!result.fighterBName) {
        return false;
    }
    if (
        !Object.values(
            METHODS
        ).includes(
            result.method
        )
    ) {
        return false;
    }
    if (
        !Array.isArray(
            result.rounds
        )
    ) {
        return false;
    }
    return true;
}
/* ============================================================
   SNAPSHOT
============================================================ */
function getFightSnapshot(
    result
) {
    if (!result) {
        return null;
    }
    return {
        id:
            result.id,
        fighterA:
            result.fighterAName,
        fighterB:
            result.fighterBName,
        winner:
            result.winnerId,
        method:
            result.method,
        round:
            result.round,
        scheduledRounds:
            result.scheduledRounds,
        rounds:
            result.rounds.length
    };
}
/* ============================================================
   EXPORTS
============================================================ */
export {
    FIGHT_ENGINE_VERSION,
    RESULT,
    METHODS,
    FIGHT_PHASES,
    getStrikingRating,
    getWrestlingRating,
    getGrapplingRating,
    getPhysicalRating,
    getCardioRating,
    getMentalRating,
    getCondition,
    calculateBasePower,
    calculatePhasePower,
    createRoundProfile,
    chooseFightPhase,
    calculateFighterPerformance,
    simulateRound,
    determineDecision,
    calculateFightTotals,
    simulateFight,
    quickSimulate,
    analyzeMatchup,
    validateFightResult,
    getFightSnapshot
};
export default {
    FIGHT_ENGINE_VERSION,
    RESULT,
    METHODS,
    FIGHT_PHASES,
    getStrikingRating,
    getWrestlingRating,
    getGrapplingRating,
    getPhysicalRating,
    getCardioRating,
    getMentalRating,
    getCondition,
    calculateBasePower,
    calculatePhasePower,
    createRoundProfile,
    chooseFightPhase,
    calculateFighterPerformance,
    simulateRound,
    determineDecision,
    calculateFightTotals,
    simulateFight,
    quickSimulate,
    analyzeMatchup,
    validateFightResult,
    getFightSnapshot
};
