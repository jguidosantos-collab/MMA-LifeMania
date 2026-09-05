// ============================================================
// MMA LIFE DYNASTY
// CORE — STATE
// ============================================================

import {
    GAME_VERSION,
    DEFAULT_SETTINGS,
    DEFAULT_PLAYER,
    ENERGY,
    FATIGUE,
    HEALTH,
    DIFFICULTIES,
    CAREER_STAGES
} from "./constants.js";


// ============================================================
// CREATE EMPTY GAME STATE
// ============================================================

export function createEmptyGameState() {

    return {

        // --------------------------------------------------------
        // GAME META
        // --------------------------------------------------------

        version: GAME_VERSION,

        meta: {
            gameName: "MMA Life Dynasty",

            startedAt: null,

            lastSavedAt: null,

            currentDate: "2026-01-01",

            currentWeek: 1,

            currentMonth: 1,

            currentYear: 1,

            difficulty: DIFFICULTIES.NORMAL,

            paused: false
        },


        // ========================================================
        // PLAYER
        // ========================================================

        player: null,


        // ========================================================
        // WORLD
        // ========================================================

        world: {

            fighters: {},

            promotions: {},

            events: {},

            rankings: {},

            champions: {},

            gyms: {},

            venues: {},

            countries: {},

            cities: {},

            news: {},

            tournaments: {},

            sponsors: {},

            managers: {}
        },


        // ========================================================
        // CAREER
        // ========================================================

        career: {

            stage: CAREER_STAGES.AMATEUR,

            professional: false,

            amateur: {

                active: true,

                fights: 0,

                wins: 0,

                losses: 0,

                draws: 0,

                knockouts: 0,

                submissions: 0,

                decisions: 0,

                titles: [],

                tournaments: [],

                record: []
            },

            professionalCareer: {

                active: false,

                fights: 0,

                wins: 0,

                losses: 0,

                draws: 0,

                noContests: 0,

                knockouts: 0,

                submissions: 0,

                decisions: 0,

                titles: [],

                defenses: 0,

                organizations: [],

                record: []
            },

            history: [],

            achievements: [],

            milestones: [],

            rivalries: [],

            currentOrganizationId: null,

            currentDivisionId: null,

            currentRank: null
        },


        // ========================================================
        // TRAINING
        // ========================================================

        training: {

            energy: ENERGY.MAX,

            fatigue: FATIGUE.MIN,

            health: HEALTH.MAX,

            sessions: [],

            weeklyPlan: [],

            camp: null,

            recovery: {

                sleep: 8,

                nutrition: 100,

                hydration: 100,

                recoveryScore: 100
            },

            weight: {

                currentKg: null,

                targetKg: null,

                naturalKg: null,

                weighInKg: null,

                fightNightKg: null,

                waterWeight: 0,

                bodyFat: null,

                cutting: false
            }
        },


        // ========================================================
        // HEALTH / INJURIES
        // ========================================================

        health: {

            overall: HEALTH.MAX,

            injuries: [],

            chronicConditions: [],

            medicalSuspension: false,

            medicalSuspensionUntil: null,

            lastMedicalCheck: null,

            concussionHistory: 0,

            surgeries: [],

            scars: [],

            physicalCondition: HEALTH.MAX
        },


        // ========================================================
        // BUSINESS
        // ========================================================

        business: {

            manager: null,

            sponsors: [],

            contracts: [],

            negotiations: [],

            endorsements: [],

            income: {

                fightPurses: 0,

                winBonuses: 0,

                performanceBonuses: 0,

                titleBonuses: 0,

                sponsorships: 0,

                endorsements: 0,

                investments: 0,

                businessIncome: 0,

                other: 0,

                total: 0
            },

            expenses: {

                managerFees: 0,

                coaches: 0,

                gym: 0,

                medical: 0,

                travel: 0,

                training: 0,

                nutrition: 0,

                housing: 0,

                family: 0,

                lifestyle: 0,

                taxes: 0,

                other: 0,

                total: 0
            },

            finances: {

                cash: 0,

                careerEarnings: 0,

                careerExpenses: 0,

                netWorth: 0,

                assets: [],

                liabilities: []
            }
        },


        // ========================================================
        // LIFE
        // ========================================================

        life: {

            relationships: [],

            partner: null,

            marriage: null,

            children: [],

            parents: [],

            siblings: [],

            friends: [],

            education: {

                level: "Basic",

                institution: null,

                completed: false,

                skills: []
            },

            employment: {

                active: false,

                job: null,

                salary: 0
            },

            residence: {

                homeId: null,

                country: DEFAULT_PLAYER.country,

                city: null
            },

            vehicles: [],

            lifestyle: {

                level: 1,

                spending: 0
            }
        },


        // ========================================================
        // DYNASTY
        // ========================================================

        dynasty: {

            active: true,

            activeCharacterId: null,

            currentGeneration: 1,

            generations: [],

            genealogy: [],

            inheritance: [],

            deceasedCharacters: [],

            familyRecords: [],

            familyAssets: [],

            familyAchievements: [],

            familyRivalries: []
        },


        // ========================================================
        // MEDIA
        // ========================================================

        media: {

            fame: 0,

            fameLevel: "Unknown",

            followers: 0,

            reputation: 0,

            hype: 0,

            publicPersona: "Underdog",

            mediaAppearances: 0,

            interviews: [],

            socialPosts: [],

            news: [],

            viralMoments: [],

            controversies: [],

            fanBase: {

                local: 0,

                national: 0,

                international: 0,

                hardcore: 0
            }
        },


        // ========================================================
        // PROMOTER
        // ========================================================

        promoter: {

            active: false,

            organizationId: null,

            ownershipPercentage: 0,

            staff: [],

            fighters: [],

            events: [],

            venues: [],

            broadcastDeals: [],

            sponsors: [],

            revenue: 0,

            expenses: 0,

            reputation: 0,

            audience: 0
        },


        // ========================================================
        // CALENDAR
        // ========================================================

        calendar: {

            upcomingEvents: [],

            completedEvents: [],

            scheduledFights: [],

            appointments: [],

            birthdays: [],

            personalEvents: [],

            deadlines: []
        },


        // ========================================================
        // HISTORY
        // ========================================================

        history: [],


        // ========================================================
        // NOTIFICATIONS
        // ========================================================

        notifications: [],


        // ========================================================
        // SETTINGS
        // ========================================================

        settings: {

            ...DEFAULT_SETTINGS
        }
    };
}


// ============================================================
// DEEP CLONE
// ============================================================

export function cloneGameState(state) {

    return JSON.parse(JSON.stringify(state));
}


// ============================================================
// NORMALIZE GAME STATE
// ============================================================

export function normalizeGameState(state) {

    const base = createEmptyGameState();

    if (!state || typeof state !== "object") {

        return base;
    }

    return mergeDeep(base, state);
}


// ============================================================
// DEEP MERGE
// ============================================================

function mergeDeep(target, source) {

    for (const key of Object.keys(source)) {

        const sourceValue = source[key];

        if (
            sourceValue &&
            typeof sourceValue === "object" &&
            !Array.isArray(sourceValue)
        ) {

            if (
                !target[key] ||
                typeof target[key] !== "object" ||
                Array.isArray(target[key])
            ) {

                target[key] = {};
            }

            mergeDeep(target[key], sourceValue);

        } else {

            target[key] = sourceValue;
        }
    }

    return target;
}


// ============================================================
// VALIDATE GAME STATE
// ============================================================

export function validateGameState(state) {

    const errors = [];

    if (!state || typeof state !== "object") {

        errors.push("Game state is not an object.");

        return {
            valid: false,
            errors
        };
    }


    // --------------------------------------------------------
    // VERSION
    // --------------------------------------------------------

    if (typeof state.version !== "number") {

        errors.push("Invalid game version.");
    }


    // --------------------------------------------------------
    // META
    // --------------------------------------------------------

    if (!state.meta) {

        errors.push("Missing meta state.");

    } else {

        if (!state.meta.currentDate) {

            errors.push("Missing current game date.");
        }

        if (
            typeof state.meta.currentWeek !== "number" ||
            state.meta.currentWeek < 1
        ) {

            errors.push("Invalid current week.");
        }
    }


    // --------------------------------------------------------
    // TRAINING
    // --------------------------------------------------------

    if (!state.training) {

        errors.push("Missing training state.");

    } else {

        if (
            typeof state.training.energy !== "number" ||
            state.training.energy < ENERGY.MIN ||
            state.training.energy > ENERGY.MAX
        ) {

            errors.push("Invalid energy value.");
        }

        if (
            typeof state.training.fatigue !== "number" ||
            state.training.fatigue < FATIGUE.MIN ||
            state.training.fatigue > FATIGUE.MAX
        ) {

            errors.push("Invalid fatigue value.");
        }
    }


    // --------------------------------------------------------
    // HEALTH
    // --------------------------------------------------------

    if (!state.health) {

        errors.push("Missing health state.");

    } else {

        if (
            typeof state.health.overall !== "number" ||
            state.health.overall < HEALTH.MIN ||
            state.health.overall > HEALTH.MAX
        ) {

            errors.push("Invalid health value.");
        }
    }


    // --------------------------------------------------------
    // SETTINGS
    // --------------------------------------------------------

    if (!state.settings) {

        errors.push("Missing settings.");
    }


    return {

        valid: errors.length === 0,

        errors
    };
}


// ============================================================
// PLAYER TEMPLATE
// ============================================================

export function createPlayerState(overrides = {}) {

    return {

        id: null,

        name: "",

        nickname: "",

        gender: DEFAULT_PLAYER.gender,

        birthDate: null,

        age: DEFAULT_PLAYER.age,

        country: DEFAULT_PLAYER.country,

        nationality: DEFAULT_PLAYER.country,

        state: null,

        city: null,

        heightCm: DEFAULT_PLAYER.heightCm,

        reachCm: DEFAULT_PLAYER.reachCm,

        weightKg: null,

        weightClass: DEFAULT_PLAYER.weightClass,

        stance: DEFAULT_PLAYER.stance,

        primaryStyle: DEFAULT_PLAYER.primaryStyle,

        secondaryStyle: DEFAULT_PLAYER.secondaryStyle,

        ovr: 0,

        potential: 0,

        attributes: {},

        personality: {},

        genetics: {},

        experience: 0,

        durability: 0,

        morale: 100,

        confidence: 50,

        createdAt: null,

        ...overrides
    };
}
