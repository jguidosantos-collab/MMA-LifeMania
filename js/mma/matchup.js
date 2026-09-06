// ============================================================
// MMA LIFE DYNASTY
// js/mma/matchup.js
// ============================================================

import {
    getStyleProfile,
    getStyleMatchupModifier
} from "./styles.js";

import {
    getWeightClass,
    areSameWeightClass
} from "./weightClasses.js";

// ============================================================
// VERSION
// ============================================================

export const MATCHUP_VERSION = 1;

// ============================================================
// MATCHUP CATEGORIES
// ============================================================

export const MATCHUP_LEVELS = Object.freeze({
    EXTREME_FAVORITE: "extreme_favorite",
    FAVORITE: "favorite",
    SLIGHT_FAVORITE: "slight_favorite",
    EVEN: "even",
    SLIGHT_UNDERDOG: "slight_underdog",
    UNDERDOG: "underdog",
    EXTREME_UNDERDOG: "extreme_underdog"
});

// ============================================================
// ADVANTAGE TYPES
// ============================================================

export const ADVANTAGE_TYPES = Object.freeze({
    STRIKING: "striking",
    GRAPPLING: "grappling",
    WRESTLING: "wrestling",
    PHYSICAL: "physical",
    SPEED: "speed",
    POWER: "power",
    CARDIO: "cardio",
    DEFENSE: "defense",
    MENTAL: "mental",
    EXPERIENCE: "experience",
    HEIGHT: "height",
    REACH: "reach",
    STYLE: "style",
    CONDITION: "condition",
    OVR: "ovr"
});

// ============================================================
// HELPERS
// ============================================================

function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function clamp(value, min = 0, max = 100) {
    return Math.max(
        min,
        Math.min(
            max,
            safeNumber(value, min)
        )
    );
}

function normalizeString(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function round(value, decimals = 2) {
    const multiplier =
        10 ** decimals;

    return Math.round(
        safeNumber(value) *
        multiplier
    ) / multiplier;
}

function getFighterId(fighter) {
    return (
        fighter?.id ||
        fighter?.fighterId ||
        null
    );
}

function getFighterName(fighter) {
    return (
        fighter?.identity?.fullName ||
        fighter?.identity?.name ||
        fighter?.name ||
        fighter?.nickname ||
        "Unknown Fighter"
    );
}

// ============================================================
// ATTRIBUTE GROUPS
// ============================================================

const STRIKING_ATTRIBUTES = [
    "punching",
    "boxing",
    "kickboxing",
    "muayThai",
    "kicks",
    "accuracy",
    "combination",
    "counterStriking",
    "clinchStriking",
    "dirtyBoxing",
    "strikingDefense"
];

const GRAPPLING_ATTRIBUTES = [
    "takedowns",
    "takedownDefense",
    "wrestling",
    "topControl",
    "groundAndPound",
    "submission",
    "submissionDefense",
    "scrambles",
    "clinch"
];

const PHYSICAL_ATTRIBUTES = [
    "strength",
    "power",
    "speed",
    "explosiveness",
    "agility",
    "balance",
    "endurance"
];

const MENTAL_ATTRIBUTES = [
    "fightIQ",
    "composure",
    "discipline",
    "focus",
    "courage",
    "aggression",
    "adaptability",
    "resilience"
];

// ============================================================
// ATTRIBUTE ACCESS
// ============================================================

function getAttribute(
    fighter,
    attribute,
    fallback = 50
) {
    return clamp(
        fighter?.attributes?.[attribute] ??
        fighter?.stats?.[attribute] ??
        fighter?.ratings?.[attribute] ??
        fallback
    );
}

function getGroupAverage(
    fighter,
    attributes
) {
    if (
        !Array.isArray(attributes) ||
        attributes.length === 0
    ) {
        return 50;
    }

    const values =
        attributes.map(
            attribute =>
                getAttribute(
                    fighter,
                    attribute
                )
        );

    return (
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) /
        values.length
    );
}

// ============================================================
// TECHNICAL RATINGS
// ============================================================

export function getStrikingRating(
    fighter
) {
    return round(
        getGroupAverage(
            fighter,
            STRIKING_ATTRIBUTES
        ),
        2
    );
}

export function getGrapplingRating(
    fighter
) {
    return round(
        getGroupAverage(
            fighter,
            GRAPPLING_ATTRIBUTES
        ),
        2
    );
}

export function getPhysicalRating(
    fighter
) {
    return round(
        getGroupAverage(
            fighter,
            PHYSICAL_ATTRIBUTES
        ),
        2
    );
}

export function getMentalRating(
    fighter
) {
    return round(
        getGroupAverage(
            fighter,
            MENTAL_ATTRIBUTES
        ),
        2
    );
}

// ============================================================
// OVR
// ============================================================

export function getOVR(fighter) {
    return clamp(
        fighter?.ovr ??
        fighter?.overall ??
        fighter?.ratings?.overall ??
        calculateEstimatedOVR(fighter)
    );
}

export function calculateEstimatedOVR(
    fighter
) {
    const striking =
        getStrikingRating(fighter);

    const grappling =
        getGrapplingRating(fighter);

    const physical =
        getPhysicalRating(fighter);

    const mental =
        getMentalRating(fighter);

    return round(
        striking * 0.30 +
        grappling * 0.30 +
        physical * 0.20 +
        mental * 0.20,
        2
    );
}

// ============================================================
// CONDITION
// ============================================================

export function getEnergy(fighter) {
    return clamp(
        fighter?.training?.energy ??
        fighter?.energy ??
        100
    );
}

export function getFatigue(fighter) {
    return clamp(
        fighter?.training?.fatigue ??
        fighter?.fatigue ??
        0
    );
}

export function getHealth(fighter) {
    return clamp(
        fighter?.health?.overall ??
        fighter?.health?.score ??
        fighter?.health?.condition ??
        100
    );
}

export function getConditionRating(
    fighter
) {
    const energy =
        getEnergy(fighter);

    const fatigue =
        getFatigue(fighter);

    const health =
        getHealth(fighter);

    return round(
        energy * 0.40 +
        (100 - fatigue) * 0.30 +
        health * 0.30,
        2
    );
}

// ============================================================
// EXPERIENCE
// ============================================================

export function getFightCount(
    fighter
) {
    const record =
        fighter?.record || {};

    return Math.max(
        0,
        safeNumber(
            record.total ??
            record.fights ??
            (
                safeNumber(record.wins) +
                safeNumber(record.losses) +
                safeNumber(record.draws)
            ),
            0
        )
    );
}

export function getWins(fighter) {
    return Math.max(
        0,
        safeNumber(
            fighter?.record?.wins ??
            fighter?.record?.W ??
            0
        )
    );
}

export function getLosses(fighter) {
    return Math.max(
        0,
        safeNumber(
            fighter?.record?.losses ??
            fighter?.record?.L ??
            0
        )
    );
}

export function getExperienceRating(
    fighter
) {
    const fights =
        getFightCount(fighter);

    const wins =
        getWins(fighter);

    const losses =
        getLosses(fighter);

    const winRate =
        fights > 0
            ? wins / fights
            : 0.5;

    const fightExperience =
        Math.min(
            100,
            fights * 4
        );

    const winningExperience =
        winRate * 25;

    const losingExperience =
        Math.min(
            15,
            losses * 1.5
        );

    return round(
        clamp(
            fightExperience +
            winningExperience +
            losingExperience
        ),
        2
    );
}

// ============================================================
// PHYSICAL PROFILE
// ============================================================

export function getHeightCm(fighter) {
    return safeNumber(
        fighter?.physical?.heightCm ??
        fighter?.physical?.height ??
        fighter?.heightCm ??
        fighter?.height,
        0
    );
}

export function getReachCm(fighter) {
    return safeNumber(
        fighter?.physical?.reachCm ??
        fighter?.physical?.reach ??
        fighter?.reachCm ??
        fighter?.reach,
        0
    );
}

export function getWeightKg(fighter) {
    return safeNumber(
        fighter?.physical?.weightKg ??
        fighter?.physical?.weight ??
        fighter?.weightKg ??
        fighter?.weight,
        0
    );
}

export function calculateHeightAdvantage(
    fighterA,
    fighterB
) {
    const heightA =
        getHeightCm(fighterA);

    const heightB =
        getHeightCm(fighterB);

    if (
        heightA <= 0 ||
        heightB <= 0
    ) {
        return 0;
    }

    return round(
        heightA - heightB,
        2
    );
}

export function calculateReachAdvantage(
    fighterA,
    fighterB
) {
    const reachA =
        getReachCm(fighterA);

    const reachB =
        getReachCm(fighterB);

    if (
        reachA <= 0 ||
        reachB <= 0
    ) {
        return 0;
    }

    return round(
        reachA - reachB,
        2
    );
}

// ============================================================
// SPEED / POWER / CARDIO / DEFENSE
// ============================================================

export function getSpeedRating(
    fighter
) {
    return round(
        (
            getAttribute(
                fighter,
                "speed"
            ) +
            getAttribute(
                fighter,
                "agility"
            ) +
            getAttribute(
                fighter,
                "explosiveness"
            )
        ) / 3,
        2
    );
}

export function getPowerRating(
    fighter
) {
    return round(
        (
            getAttribute(
                fighter,
                "power"
            ) +
            getAttribute(
                fighter,
                "strength"
            ) +
            getAttribute(
                fighter,
                "explosiveness"
            )
        ) / 3,
        2
    );
}

export function getCardioRating(
    fighter
) {
    return round(
        (
            getAttribute(
                fighter,
                "endurance"
            ) +
            getAttribute(
                fighter,
                "cardio"
            ) +
            getAttribute(
                fighter,
                "stamina"
            )
        ) / 3,
        2
    );
}

export function getDefenseRating(
    fighter
) {
    return round(
        (
            getAttribute(
                fighter,
                "strikingDefense"
            ) +
            getAttribute(
                fighter,
                "takedownDefense"
            ) +
            getAttribute(
                fighter,
                "submissionDefense"
            )
        ) / 3,
        2
    );
}

// ============================================================
// STYLE
// ============================================================

export function getFighterStyle(
    fighter
) {
    return (
        fighter?.style ||
        fighter?.identity?.style ||
        fighter?.attributes?.style ||
        fighter?.career?.style ||
        "Balanced"
    );
}

export function getStyleAnalysis(
    fighterA,
    fighterB
) {
    const styleA =
        getFighterStyle(fighterA);

    const styleB =
        getFighterStyle(fighterB);

    let modifier = 0;

    try {
        modifier =
            safeNumber(
                getStyleMatchupModifier(
                    styleA,
                    styleB
                ),
                0
            );
    } catch {
        modifier = 0;
    }

    let profileA = null;
    let profileB = null;

    try {
        profileA =
            getStyleProfile(styleA);
    } catch {
        profileA = null;
    }

    try {
        profileB =
            getStyleProfile(styleB);
    } catch {
        profileB = null;
    }

    return {
        fighterA: {
            style: styleA,
            profile: profileA
        },

        fighterB: {
            style: styleB,
            profile: profileB
        },

        modifierA:
            round(modifier, 3),

        modifierB:
            round(-modifier, 3),

        advantage:
            modifier > 0
                ? "A"
                : modifier < 0
                    ? "B"
                    : "even"
    };
}

// ============================================================
// STYLE ADVANTAGE SCORE
// ============================================================

export function calculateStyleAdvantage(
    fighterA,
    fighterB
) {
    const analysis =
        getStyleAnalysis(
            fighterA,
            fighterB
        );

    return clamp(
        50 +
        analysis.modifierA * 50,
        0,
        100
    );
}

// ============================================================
// TECHNICAL ADVANTAGES
// ============================================================

export function compareRatings(
    fighterA,
    fighterB
) {
    const ratings = {
        striking: {
            A: getStrikingRating(fighterA),
            B: getStrikingRating(fighterB)
        },

        grappling: {
            A: getGrapplingRating(fighterA),
            B: getGrapplingRating(fighterB)
        },

        physical: {
            A: getPhysicalRating(fighterA),
            B: getPhysicalRating(fighterB)
        },

        mental: {
            A: getMentalRating(fighterA),
            B: getMentalRating(fighterB)
        },

        speed: {
            A: getSpeedRating(fighterA),
            B: getSpeedRating(fighterB)
        },

        power: {
            A: getPowerRating(fighterA),
            B: getPowerRating(fighterB)
        },

        cardio: {
            A: getCardioRating(fighterA),
            B: getCardioRating(fighterB)
        },

        defense: {
            A: getDefenseRating(fighterA),
            B: getDefenseRating(fighterB)
        },

        experience: {
            A: getExperienceRating(fighterA),
            B: getExperienceRating(fighterB)
        },

        condition: {
            A: getConditionRating(fighterA),
            B: getConditionRating(fighterB)
        },

        ovr: {
            A: getOVR(fighterA),
            B: getOVR(fighterB)
        }
    };

    return ratings;
}

// ============================================================
// ADVANTAGE BUILDER
// ============================================================

function createAdvantage(
    type,
    valueA,
    valueB,
    label
) {
    const difference =
        round(
            valueA - valueB,
            2
        );

    let winner = "even";

    if (
        difference > 2
    ) {
        winner = "A";
    } else if (
        difference < -2
    ) {
        winner = "B";
    }

    return {
        type,
        label,
        valueA:
            round(valueA, 2),
        valueB:
            round(valueB, 2),
        difference,
        winner
    };
}

export function getAdvantages(
    fighterA,
    fighterB
) {
    const ratings =
        compareRatings(
            fighterA,
            fighterB
        );

    const advantages = [
        createAdvantage(
            ADVANTAGE_TYPES.STRIKING,
            ratings.striking.A,
            ratings.striking.B,
            "Striking"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.GRAPPLING,
            ratings.grappling.A,
            ratings.grappling.B,
            "Grappling"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.PHYSICAL,
            ratings.physical.A,
            ratings.physical.B,
            "Physical"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.SPEED,
            ratings.speed.A,
            ratings.speed.B,
            "Speed"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.POWER,
            ratings.power.A,
            ratings.power.B,
            "Power"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.CARDIO,
            ratings.cardio.A,
            ratings.cardio.B,
            "Cardio"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.DEFENSE,
            ratings.defense.A,
            ratings.defense.B,
            "Defense"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.MENTAL,
            ratings.mental.A,
            ratings.mental.B,
            "Mental"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.EXPERIENCE,
            ratings.experience.A,
            ratings.experience.B,
            "Experience"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.CONDITION,
            ratings.condition.A,
            ratings.condition.B,
            "Condition"
        ),

        createAdvantage(
            ADVANTAGE_TYPES.OVR,
            ratings.ovr.A,
            ratings.ovr.B,
            "Overall"
        )
    ];

    const heightDifference =
        calculateHeightAdvantage(
            fighterA,
            fighterB
        );

    const reachDifference =
        calculateReachAdvantage(
            fighterA,
            fighterB
        );

    advantages.push(
        createAdvantage(
            ADVANTAGE_TYPES.HEIGHT,
            heightDifference > 0
                ? Math.abs(heightDifference)
                : 0,
            heightDifference < 0
                ? Math.abs(heightDifference)
                : 0,
            "Height"
        )
    );

    advantages.push(
        createAdvantage(
            ADVANTAGE_TYPES.REACH,
            reachDifference > 0
                ? Math.abs(reachDifference)
                : 0,
            reachDifference < 0
                ? Math.abs(reachDifference)
                : 0,
            "Reach"
        )
    );

    const styleAdvantage =
        calculateStyleAdvantage(
            fighterA,
            fighterB
        );

    advantages.push(
        createAdvantage(
            ADVANTAGE_TYPES.STYLE,
            styleAdvantage,
            100 - styleAdvantage,
            "Style"
        )
    );

    return advantages;
}

// ============================================================
// EXPERIENCE / RECORD ANALYSIS
// ============================================================

export function analyzeExperience(
    fighterA,
    fighterB
) {
    const fightsA =
        getFightCount(fighterA);

    const fightsB =
        getFightCount(fighterB);

    const winsA =
        getWins(fighterA);

    const winsB =
        getWins(fighterB);

    const lossesA =
        getLosses(fighterA);

    const lossesB =
        getLosses(fighterB);

    return {
        fighterA: {
            fights: fightsA,
            wins: winsA,
            losses: lossesA,
            winRate:
                fightsA > 0
                    ? round(
                        winsA / fightsA,
                        3
                    )
                    : 0.5,
            rating:
                getExperienceRating(
                    fighterA
                )
        },

        fighterB: {
            fights: fightsB,
            wins: winsB,
            losses: lossesB,
            winRate:
                fightsB > 0
                    ? round(
                        winsB / fightsB,
                        3
                    )
                    : 0.5,
            rating:
                getExperienceRating(
                    fighterB
                )
        },

        fightDifference:
            fightsA - fightsB
    };
}

// ============================================================
// PHYSICAL ANALYSIS
// ============================================================

export function analyzePhysical(
    fighterA,
    fighterB
) {
    const heightA =
        getHeightCm(fighterA);

    const heightB =
        getHeightCm(fighterB);

    const reachA =
        getReachCm(fighterA);

    const reachB =
        getReachCm(fighterB);

    const weightA =
        getWeightKg(fighterA);

    const weightB =
        getWeightKg(fighterB);

    return {
        fighterA: {
            heightCm: heightA,
            reachCm: reachA,
            weightKg: weightA
        },

        fighterB: {
            heightCm: heightB,
            reachCm: reachB,
            weightKg: weightB
        },

        heightDifferenceCm:
            round(
                heightA - heightB,
                2
            ),

        reachDifferenceCm:
            round(
                reachA - reachB,
                2
            ),

        weightDifferenceKg:
            round(
                weightA - weightB,
                2
            )
    };
}

// ============================================================
// WEIGHT CLASS ANALYSIS
// ============================================================

export function analyzeWeightClass(
    fighterA,
    fighterB
) {
    const classA =
        fighterA?.physical?.weightClass ||
        fighterA?.weightClass ||
        fighterA?.career?.weightClass ||
        null;

    const classB =
        fighterB?.physical?.weightClass ||
        fighterB?.weightClass ||
        fighterB?.career?.weightClass ||
        null;

    let detailsA = null;
    let detailsB = null;

    try {
        detailsA =
            getWeightClass(
                classA,
                fighterA?.identity?.sex ||
                fighterA?.sex ||
                fighterA?.gender
            );
    } catch {
        detailsA = null;
    }

    try {
        detailsB =
            getWeightClass(
                classB,
                fighterB?.identity?.sex ||
                fighterB?.sex ||
                fighterB?.gender
            );
    } catch {
        detailsB = null;
    }

    return {
        fighterA: {
            id: classA,
            details: detailsA
        },

        fighterB: {
            id: classB,
            details: detailsB
        },

        sameClass:
            areSameWeightClass(
                fighterA,
                fighterB
            )
    };
}

// ============================================================
// RANKING ANALYSIS
// ============================================================

function getRank(fighter) {
    const rank =
        safeNumber(
            fighter?.rankings?.current ??
            fighter?.rank ??
            fighter?.career?.rank,
            0
        );

    return rank > 0
        ? rank
        : null;
}

function isChampion(fighter) {
    return Boolean(
        fighter?.rankings?.isChampion ||
        fighter?.career?.isChampion ||
        fighter?.career?.title?.isChampion ||
        fighter?.champion === true
    );
}

export function analyzeRanking(
    fighterA,
    fighterB
) {
    const rankA =
        getRank(fighterA);

    const rankB =
        getRank(fighterB);

    return {
        fighterA: {
            rank: rankA,
            champion:
                isChampion(fighterA)
        },

        fighterB: {
            rank: rankB,
            champion:
                isChampion(fighterB)
        },

        rankDifference:
            rankA !== null &&
            rankB !== null
                ? rankA - rankB
                : null,

        titleFight:
            isChampion(fighterA) !==
            isChampion(fighterB)
    };
}

// ============================================================
// FAME / DRAW
// ============================================================

function getFame(fighter) {
    return clamp(
        fighter?.fame?.score ??
        fighter?.fame ??
        fighter?.media?.fame ??
        0
    );
}

function getFollowers(fighter) {
    return Math.max(
        0,
        safeNumber(
            fighter?.fame?.followers ??
            fighter?.followers ??
            fighter?.media?.followers ??
            0
        )
    );
}

export function getDrawValue(
    fighter
) {
    const fame =
        getFame(fighter);

    const followers =
        getFollowers(fighter);

    const followerScore =
        followers > 0
            ? Math.min(
                100,
                Math.log10(
                    followers + 1
                ) * 12
            )
            : 0;

    const ovr =
        getOVR(fighter);

    return round(
        fame * 0.50 +
        followerScore * 0.15 +
        ovr * 0.35,
        2
    );
}

export function analyzeMarketability(
    fighterA,
    fighterB
) {
    const drawA =
        getDrawValue(fighterA);

    const drawB =
        getDrawValue(fighterB);

    return {
        fighterA: {
            fame:
                getFame(fighterA),
            followers:
                getFollowers(fighterA),
            drawValue:
                drawA
        },

        fighterB: {
            fame:
                getFame(fighterB),
            followers:
                getFollowers(fighterB),
            drawValue:
                drawB
        },

        difference:
            round(
                drawA - drawB,
                2
            )
    };
}

// ============================================================
// MATCHUP POWER
// ============================================================

export function calculateMatchupPower(
    fighter,
    opponent,
    options = {}
) {
    const {
        includeCondition = true,
        includeExperience = true,
        includeStyle = true
    } = options;

    let power =
        getOVR(fighter);

    /*
     * Condição física
     */
    if (includeCondition) {
        const condition =
            getConditionRating(
                fighter
            );

        power =
            power * 0.80 +
            condition * 0.20;
    }

    /*
     * Experiência
     */
    if (includeExperience) {
        const experience =
            getExperienceRating(
                fighter
            );

        power =
            power * 0.90 +
            experience * 0.10;
    }

    /*
     * Estilo contra o adversário
     */
    if (includeStyle && opponent) {
        const style =
            getStyleAnalysis(
                fighter,
                opponent
            );

        power *=
            1 +
            safeNumber(
                style.modifierA,
                0
            );
    }

    return round(
        clamp(power),
        2
    );
}

// ============================================================
// WIN PROBABILITY
// ============================================================

export function calculateWinProbability(
    fighterA,
    fighterB,
    options = {}
) {
    const powerA =
        calculateMatchupPower(
            fighterA,
            fighterB,
            options
        );

    const powerB =
        calculateMatchupPower(
            fighterB,
            fighterA,
            options
        );

    const total =
        powerA + powerB;

    if (
        total <= 0
    ) {
        return {
            fighterA: 50,
            fighterB: 50
        };
    }

    let probabilityA =
        (
            powerA /
            total
        ) * 100;

    let probabilityB =
        100 -
        probabilityA;

    /*
     * Impede probabilidades absurdamente
     * extremas em confrontos normais.
     */
    const minimum =
        options.minimumProbability ??
        5;

    const maximum =
        options.maximumProbability ??
        95;

    probabilityA =
        clamp(
            probabilityA,
            minimum,
            maximum
        );

    probabilityB =
        100 -
        probabilityA;

    return {
        fighterA:
            round(
                probabilityA,
                2
            ),

        fighterB:
            round(
                probabilityB,
                2
            )
    };
}

// ============================================================
// FAVORITE
// ============================================================

export function determineFavorite(
    fighterA,
    fighterB,
    options = {}
) {
    const probability =
        calculateWinProbability(
            fighterA,
            fighterB,
            options
        );

    const difference =
        probability.fighterA -
        probability.fighterB;

    if (
        Math.abs(difference) <= 2
    ) {
        return {
            fighter: "even",
            probabilityA:
                probability.fighterA,
            probabilityB:
                probability.fighterB,
            difference:
                round(
                    difference,
                    2
                )
        };
    }

    return {
        fighter:
            difference > 0
                ? "A"
                : "B",

        probabilityA:
            probability.fighterA,

        probabilityB:
            probability.fighterB,

        difference:
            round(
                difference,
                2
            )
    };
}

// ============================================================
// MATCHUP LEVEL
// ============================================================

export function getMatchupLevel(
    probability
) {
    const chance =
        safeNumber(
            probability,
            50
        );

    if (
        chance >= 75
    ) {
        return MATCHUP_LEVELS
            .EXTREME_FAVORITE;
    }

    if (
        chance >= 62
    ) {
        return MATCHUP_LEVELS
            .FAVORITE;
    }

    if (
        chance >= 55
    ) {
        return MATCHUP_LEVELS
            .SLIGHT_FAVORITE;
    }

    if (
        chance > 45
    ) {
        return MATCHUP_LEVELS.EVEN;
    }

    if (
        chance > 38
    ) {
        return MATCHUP_LEVELS
            .SLIGHT_UNDERDOG;
    }

    if (
        chance > 25
    ) {
        return MATCHUP_LEVELS
            .UNDERDOG;
    }

    return MATCHUP_LEVELS
        .EXTREME_UNDERDOG;
}

// ============================================================
// ROUND-BY-ROUND POTENTIAL
// ============================================================

export function calculateRoundPotential(
    fighter,
    roundNumber = 1,
    totalRounds = 3
) {
    const cardio =
        getCardioRating(fighter);

    const condition =
        getConditionRating(fighter);

    const mental =
        getMentalRating(fighter);

    const fatigueFactor =
        Math.max(
            0,
            (
                roundNumber - 1
            ) /
            Math.max(
                1,
                totalRounds - 1
            )
        );

    const lateFightBonus =
        (
            cardio * 0.55 +
            condition * 0.25 +
            mental * 0.20
        ) *
        fatigueFactor *
        0.15;

    return round(
        clamp(
            getOVR(fighter) +
            lateFightBonus,
            0,
            100
        ),
        2
    );
}

// ============================================================
// FINISH POTENTIAL
// ============================================================

export function calculateFinishPotential(
    fighter
) {
    const power =
        getPowerRating(fighter);

    const striking =
        getStrikingRating(fighter);

    const grappling =
        getGrapplingRating(fighter);

    const submission =
        getAttribute(
            fighter,
            "submission"
        );

    const groundAndPound =
        getAttribute(
            fighter,
            "groundAndPound"
        );

    return round(
        clamp(
            power * 0.25 +
            striking * 0.25 +
            grappling * 0.15 +
            submission * 0.20 +
            groundAndPound * 0.15
        ),
        2
    );
}

// ============================================================
// FIGHT PATH ANALYSIS
// ============================================================

export function analyzeFightPaths(
    fighterA,
    fighterB
) {
    const strikingA =
        getStrikingRating(fighterA);

    const strikingB =
        getStrikingRating(fighterB);

    const grapplingA =
        getGrapplingRating(fighterA);

    const grapplingB =
        getGrapplingRating(fighterB);

    const powerA =
        getPowerRating(fighterA);

    const powerB =
        getPowerRating(fighterB);

    const cardioA =
        getCardioRating(fighterA);

    const cardioB =
        getCardioRating(fighterB);

    const submissionA =
        getAttribute(
            fighterA,
            "submission"
        );

    const submissionB =
        getAttribute(
            fighterB,
            "submission"
        );

    const paths = {
        striking: {
            fighterA:
                strikingA,
            fighterB:
                strikingB,
            advantage:
                strikingA >
                strikingB + 2
                    ? "A"
                    : strikingB >
                        strikingA + 2
                        ? "B"
                        : "even"
        },

        grappling: {
            fighterA:
                grapplingA,
            fighterB:
                grapplingB,
            advantage:
                grapplingA >
                grapplingB + 2
                    ? "A"
                    : grapplingB >
                        grapplingA + 2
                        ? "B"
                        : "even"
        },

        power: {
            fighterA:
                powerA,
            fighterB:
                powerB,
            advantage:
                powerA >
                powerB + 2
                    ? "A"
                    : powerB >
                        powerA + 2
                        ? "B"
                        : "even"
        },

        cardio: {
            fighterA:
                cardioA,
            fighterB:
                cardioB,
            advantage:
                cardioA >
                cardioB + 2
                    ? "A"
                    : cardioB >
                        cardioA + 2
                        ? "B"
                        : "even"
        },

        submission: {
            fighterA:
                submissionA,
            fighterB:
                submissionB,
            advantage:
                submissionA >
                submissionB + 2
                    ? "A"
                    : submissionB >
                        submissionA + 2
                        ? "B"
                        : "even"
        }
    };

    return paths;
}

// ============================================================
// MAIN MATCHUP ANALYSIS
// ============================================================

export function analyzeMatchup(
    fighterA,
    fighterB,
    options = {}
) {
    if (
        !fighterA ||
        !fighterB
    ) {
        return {
            valid: false,
            errors: [
                "missing_fighter"
            ]
        };
    }

    const style =
        getStyleAnalysis(
            fighterA,
            fighterB
        );

    const ratings =
        compareRatings(
            fighterA,
            fighterB
        );

    const advantages =
        getAdvantages(
            fighterA,
            fighterB
        );

    const experience =
        analyzeExperience(
            fighterA,
            fighterB
        );

    const physical =
        analyzePhysical(
            fighterA,
            fighterB
        );

    const weightClass =
        analyzeWeightClass(
            fighterA,
            fighterB
        );

    const ranking =
        analyzeRanking(
            fighterA,
            fighterB
        );

    const marketability =
        analyzeMarketability(
            fighterA,
            fighterB
        );

    const fightPaths =
        analyzeFightPaths(
            fighterA,
            fighterB
        );

    const probabilities =
        calculateWinProbability(
            fighterA,
            fighterB,
            options
        );

    const favorite =
        determineFavorite(
            fighterA,
            fighterB,
            options
        );

    const finishPotentialA =
        calculateFinishPotential(
            fighterA
        );

    const finishPotentialB =
        calculateFinishPotential(
            fighterB
        );

    return {
        version:
            MATCHUP_VERSION,

        valid:
            weightClass.sameClass ||
            options.allowDifferentWeightClass === true,

        errors:
            weightClass.sameClass ||
            options.allowDifferentWeightClass === true
                ? []
                : [
                    "different_weight_class"
                ],

        fighterA: {
            id:
                getFighterId(fighterA),

            name:
                getFighterName(fighterA),

            ovr:
                getOVR(fighterA),

            style:
                getFighterStyle(fighterA),

            condition:
                getConditionRating(
                    fighterA
                ),

            experience:
                getExperienceRating(
                    fighterA
                ),

            finishPotential:
                finishPotentialA
        },

        fighterB: {
            id:
                getFighterId(fighterB),

            name:
                getFighterName(fighterB),

            ovr:
                getOVR(fighterB),

            style:
                getFighterStyle(fighterB),

            condition:
                getConditionRating(
                    fighterB
                ),

            experience:
                getExperienceRating(
                    fighterB
                ),

            finishPotential:
                finishPotentialB
        },

        ratings,

        advantages,

        style,

        experience,

        physical,

        weightClass,

        ranking,

        marketability,

        fightPaths,

        probabilities,

        favorite,

        matchupLevelA:
            getMatchupLevel(
                probabilities.fighterA
            ),

        matchupLevelB:
            getMatchupLevel(
                probabilities.fighterB
            ),

        power: {
            fighterA:
                calculateMatchupPower(
                    fighterA,
                    fighterB,
                    options
                ),

            fighterB:
                calculateMatchupPower(
                    fighterB,
                    fighterA,
                    options
                )
        }
    };
}

// ============================================================
// QUICK ANALYSIS
// ============================================================

export function quickMatchupAnalysis(
    fighterA,
    fighterB
) {
    const probabilities =
        calculateWinProbability(
            fighterA,
            fighterB
        );

    const favorite =
        determineFavorite(
            fighterA,
            fighterB
        );

    return {
        fighterA:
            getFighterName(fighterA),

        fighterB:
            getFighterName(fighterB),

        probabilityA:
            probabilities.fighterA,

        probabilityB:
            probabilities.fighterB,

        favorite:
            favorite.fighter,

        matchupLevelA:
            getMatchupLevel(
                probabilities.fighterA
            ),

        matchupLevelB:
            getMatchupLevel(
                probabilities.fighterB
            )
    };
}

// ============================================================
// VALIDATION
// ============================================================

export function validateMatchup(
    fighterA,
    fighterB
) {
    const errors = [];

    if (!fighterA) {
        errors.push(
            "fighterA_missing"
        );
    }

    if (!fighterB) {
        errors.push(
            "fighterB_missing"
        );
    }

    if (
        fighterA &&
        fighterB &&
        getFighterId(fighterA) &&
        getFighterId(fighterB) &&
        String(
            getFighterId(fighterA)
        ) ===
        String(
            getFighterId(fighterB)
        )
    ) {
        errors.push(
            "same_fighter"
        );
    }

    if (
        fighterA &&
        fighterB &&
        !areSameWeightClass(
            fighterA,
            fighterB
        )
    ) {
        errors.push(
            "different_weight_class"
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

// ============================================================
// CLONE
// ============================================================

export function cloneMatchup(
    matchup
) {
    if (
        matchup === null ||
        matchup === undefined
    ) {
        return matchup;
    }

    return JSON.parse(
        JSON.stringify(matchup)
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    MATCHUP_VERSION,

    MATCHUP_LEVELS,
    ADVANTAGE_TYPES,

    getStrikingRating,
    getGrapplingRating,
    getPhysicalRating,
    getMentalRating,

    getOVR,
    calculateEstimatedOVR,

    getEnergy,
    getFatigue,
    getHealth,
    getConditionRating,

    getFightCount,
    getWins,
    getLosses,
    getExperienceRating,

    getHeightCm,
    getReachCm,
    getWeightKg,

    calculateHeightAdvantage,
    calculateReachAdvantage,

    getSpeedRating,
    getPowerRating,
    getCardioRating,
    getDefenseRating,

    getFighterStyle,
    getStyleAnalysis,
    calculateStyleAdvantage,

    compareRatings,
    getAdvantages,

    analyzeExperience,
    analyzePhysical,
    analyzeWeightClass,
    analyzeRanking,

    getDrawValue,
    analyzeMarketability,

    calculateMatchupPower,
    calculateWinProbability,
    determineFavorite,
    getMatchupLevel,

    calculateRoundPotential,
    calculateFinishPotential,

    analyzeFightPaths,
    analyzeMatchup,
    quickMatchupAnalysis,

    validateMatchup,
    cloneMatchup
};
