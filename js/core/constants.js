// ============================================================
// MMA LIFE DYNASTY
// CORE — CONSTANTS
// ============================================================

export const GAME_VERSION = 1;

export const GAME_NAME = "MMA Life Dynasty";

export const WORLD_START_DATE = "2026-01-01";


// ============================================================
// DIFFICULTY
// ============================================================

export const DIFFICULTIES = {
    EASY: "easy",
    NORMAL: "normal",
    HARD: "hard",
    LEGEND: "legend"
};


// ============================================================
// CAREER STAGES
// ============================================================

export const CAREER_STAGES = {
    AMATEUR: "Amateur",
    REGIONAL: "Regional",
    NATIONAL: "National",
    INTERNATIONAL: "International",
    ELITE: "Elite"
};

export const CAREER_STAGE_ORDER = [
    CAREER_STAGES.AMATEUR,
    CAREER_STAGES.REGIONAL,
    CAREER_STAGES.NATIONAL,
    CAREER_STAGES.INTERNATIONAL,
    CAREER_STAGES.ELITE
];


// ============================================================
// PROFESSIONAL AGE
// ============================================================

export const MIN_PROFESSIONAL_AGE = 18;

export const DEFAULT_STARTING_AGE = 15;


// ============================================================
// WEIGHT CLASSES
// ============================================================

export const WEIGHT_CLASSES = {

    MEN: {
        FLYWEIGHT: {
            id: "flyweight",
            name: "Flyweight",
            limitKg: 56.7
        },

        BANTAMWEIGHT: {
            id: "bantamweight",
            name: "Bantamweight",
            limitKg: 61.2
        },

        FEATHERWEIGHT: {
            id: "featherweight",
            name: "Featherweight",
            limitKg: 65.8
        },

        LIGHTWEIGHT: {
            id: "lightweight",
            name: "Lightweight",
            limitKg: 70.3
        },

        WELTERWEIGHT: {
            id: "welterweight",
            name: "Welterweight",
            limitKg: 77.1
        },

        MIDDLEWEIGHT: {
            id: "middleweight",
            name: "Middleweight",
            limitKg: 83.9
        },

        LIGHT_HEAVYWEIGHT: {
            id: "light_heavyweight",
            name: "Light Heavyweight",
            limitKg: 93.0
        },

        HEAVYWEIGHT: {
            id: "heavyweight",
            name: "Heavyweight",
            limitKg: 120.2
        }
    },

    WOMEN: {
        ATOMWEIGHT: {
            id: "atomweight",
            name: "Atomweight",
            limitKg: 47.6
        },

        STRAWWEIGHT: {
            id: "strawweight",
            name: "Strawweight",
            limitKg: 52.2
        },

        FLYWEIGHT: {
            id: "flyweight",
            name: "Flyweight",
            limitKg: 56.7
        },

        BANTAMWEIGHT: {
            id: "bantamweight",
            name: "Bantamweight",
            limitKg: 61.2
        },

        FEATHERWEIGHT: {
            id: "featherweight",
            name: "Featherweight",
            limitKg: 65.8
        }
    }
};


// ============================================================
// FIGHT STYLES
// ============================================================

export const FIGHT_STYLES = {

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
};


// ============================================================
// STANCES
// ============================================================

export const STANCES = {
    ORTHODOX: "Orthodox",
    SOUTHPAW: "Southpaw",
    SWITCH: "Switch"
};


// ============================================================
// FIGHT RESULTS
// ============================================================

export const FIGHT_RESULTS = {

    KO: "KO",
    TKO: "TKO",

    SUBMISSION: "Submission",

    DECISION_UNANIMOUS: "Decision - Unanimous",
    DECISION_SPLIT: "Decision - Split",
    DECISION_MAJORITY: "Decision - Majority",

    DRAW: "Draw",

    NO_CONTEST: "No Contest",

    DISQUALIFICATION: "Disqualification"
};


// ============================================================
// FIGHT TYPES
// ============================================================

export const FIGHT_TYPES = {

    AMATEUR: "Amateur",

    PROFESSIONAL: "Professional",

    EXHIBITION: "Exhibition",

    TOURNAMENT: "Tournament",

    TITLE: "Title Fight",

    INTERIM_TITLE: "Interim Title",

    TITLE_ELIMINATOR: "Title Eliminator",

    SUPERFIGHT: "Superfight"
};


// ============================================================
// ORGANIZATION LEVELS
// ============================================================

export const ORGANIZATION_LEVELS = {

    REGIONAL: 1,

    NATIONAL: 2,

    INTERNATIONAL: 3,

    ELITE: 4
};


// ============================================================
// UFC IS THE ABSOLUTE TOP
// ============================================================

export const TOP_ORGANIZATION = "ufc";

export const TOP_ORGANIZATION_LEVEL = ORGANIZATION_LEVELS.ELITE;


// ============================================================
// RANKING
// ============================================================

export const RANKING = {

    CHAMPION: 0,

    MAX_RANK: 15,

    MIN_RANK: 1
};


// ============================================================
// ATTRIBUTE LIMITS
// ============================================================

export const ATTRIBUTE_LIMITS = {

    MIN: 1,

    MAX: 100,

    STARTING_MIN: 20,

    STARTING_MAX: 70
};


// ============================================================
// ENERGY
// ============================================================

export const ENERGY = {

    MAX: 100,

    MIN: 0,

    DAILY_RECOVERY: 100
};


// ============================================================
// FATIGUE
// ============================================================

export const FATIGUE = {

    MIN: 0,

    MAX: 100,

    SAFE: 30,

    MODERATE: 60,

    HIGH: 80,

    CRITICAL: 95
};


// ============================================================
// HEALTH
// ============================================================

export const HEALTH = {

    MIN: 0,

    MAX: 100,

    HEALTHY: 90,

    WARNING: 70,

    INJURED: 50,

    CRITICAL: 25
};


// ============================================================
// FAME LEVELS
// ============================================================

export const FAME_LEVELS = {

    UNKNOWN: "Unknown",

    LOCAL: "Local",

    REGIONAL: "Regional",

    NATIONAL: "National",

    INTERNATIONAL: "International",

    WORLD: "World",

    LEGEND: "Legend"
};


// ============================================================
// PERSONALITY
// ============================================================

export const PERSONALITY_TRAITS = [

    "Disciplined",
    "Ambitious",
    "Calm",
    "Aggressive",
    "Confident",
    "Humble",
    "Arrogant",
    "Charismatic",
    "Introverted",
    "Adaptable",
    "Risk Taker",
    "Loyal",
    "Independent",
    "Professional",
    "Controversial"
];


// ============================================================
// PERSONA / PUBLIC IMAGE
// ============================================================

export const PUBLIC_PERSONAS = [

    "Underdog",
    "Professional",
    "Fan Favorite",
    "Superstar",
    "Bad Boy",
    "Trash Talker",
    "Technician",
    "Champion",
    "Knockout Artist",
    "Submission Specialist",
    "Legend"
];


// ============================================================
// RELATIONSHIP STATUS
// ============================================================

export const RELATIONSHIP_STATUS = {

    SINGLE: "Single",
    DATING: "Dating",
    ENGAGED: "Engaged",
    MARRIED: "Married",
    DIVORCED: "Divorced",
    WIDOWED: "Widowed"
};


// ============================================================
// DYNASTY
// ============================================================

export const DYNASTY = {

    MAX_GENERATIONS: 100,

    MIN_INHERITANCE_AGE: 18,

    ENABLE_DESCENDANTS: true
};


// ============================================================
// SAVE SYSTEM
// ============================================================

export const SAVE_SYSTEM = {

    STORAGE_KEY: "mma_life_dynasty_save",

    AUTO_SAVE: true,

    AUTO_SAVE_INTERVAL_MINUTES: 5
};


// ============================================================
// DEFAULT PLAYER
// ============================================================

export const DEFAULT_PLAYER = {

    age: DEFAULT_STARTING_AGE,

    gender: "male",

    country: "Brazil",

    weightClass: "featherweight",

    stance: STANCES.ORTHODOX,

    primaryStyle: FIGHT_STYLES.BALANCED,

    secondaryStyle: null,

    heightCm: 175,

    reachCm: 178
};


// ============================================================
// DEFAULT GAME SETTINGS
// ============================================================

export const DEFAULT_SETTINGS = {

    language: "pt-BR",

    currency: "USD",

    difficulty: DIFFICULTIES.NORMAL,

    notifications: true,

    animations: true
};
