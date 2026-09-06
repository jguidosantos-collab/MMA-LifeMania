/*
============================================================
MMA LIFE DYNASTY
MEDIA — AWARDS
============================================================
Responsabilidade:
- Sistema de prêmios e honrarias
- Prêmios individuais
- Prêmios por luta
- Prêmios por desempenho
- Lutador do ano
- Revelação do ano
- Campeão do ano
- Hall da Fama
- Impacto em fama, reputação e popularidade
- Histórico de premiações
- Estatísticas
- Integração com database.media.awards
Arquivo:
js/media/awards.js
IMPORTANTE:
- Arquivo independente
- Não depende de outros módulos
- Não altera outros arquivos automaticamente
============================================================
*/
const AWARDS_VERSION = 1;
const AWARDS_CONFIG = {
    maxHistory: 2000,
    maxCurrentSeason: 200,
    fame: {
        award: 5,
        majorAward: 10,
        hallOfFame: 20,
        nomination: 2
    },
    reputation: {
        award: 4,
        majorAward: 7,
        hallOfFame: 15,
        nomination: 1
    },
    popularity: {
        award: 5,
        majorAward: 10,
        hallOfFame: 15,
        nomination: 2
    },
    followers: {
        award: 500,
        majorAward: 2500,
        hallOfFame: 10000,
        nomination: 250
    },
    commercial: {
        award: 3,
        majorAward: 8,
        hallOfFame: 15
    }
};
const AWARD_TYPES = {
    fighterOfTheYear: "fighter_of_the_year",
    maleFighterOfTheYear: "male_fighter_of_the_year",
    femaleFighterOfTheYear: "female_fighter_of_the_year",
    breakthrough: "breakthrough",
    rookie: "rookie",
    comeback: "comeback",
    fightOfTheYear: "fight_of_the_year",
    knockoutOfTheYear: "knockout_of_the_year",
    submissionOfTheYear: "submission_of_the_year",
    performanceOfTheYear: "performance_of_the_year",
    championOfTheYear: "champion_of_the_year",
    upsetOfTheYear: "upset_of_the_year",
    prospectOfTheYear: "prospect_of_the_year",
    coachOfTheYear: "coach_of_the_year",
    gymOfTheYear: "gym_of_the_year",
    fanFavorite: "fan_favorite",
    mostEntertaining: "most_entertaining",
    bestRivalry: "best_rivalry",
    eventOfTheYear: "event_of_the_year",
    promoterOfTheYear: "promoter_of_the_year",
    hallOfFame: "hall_of_fame",
    lifetimeAchievement: "lifetime_achievement",
    legacy: "legacy"
};
const AWARD_LEVELS = {
    local: {
        label: "Regional",
        multiplier: 0.5
    },
    regional: {
        label: "Regional",
        multiplier: 0.6
    },
    national: {
        label: "Nacional",
        multiplier: 1
    },
    international: {
        label: "Internacional",
        multiplier: 1.5
    },
    elite: {
        label: "Elite",
        multiplier: 2
    },
    legendary: {
        label: "Lendário",
        multiplier: 3
    }
};
const AWARD_LABELS = {
    fighter_of_the_year: "Lutador do Ano",
    male_fighter_of_the_year: "Lutador Masculino do Ano",
    female_fighter_of_the_year: "Lutadora do Ano",
    breakthrough: "Revelação do Ano",
    rookie: "Novato do Ano",
    comeback: "Retorno do Ano",
    fight_of_the_year: "Luta do Ano",
    knockout_of_the_year: "Nocaute do Ano",
    submission_of_the_year: "Finalização do Ano",
    performance_of_the_year: "Performance do Ano",
    champion_of_the_year: "Campeão do Ano",
    upset_of_the_year: "Zebra do Ano",
    prospect_of_the_year: "Prospecto do Ano",
    coach_of_the_year: "Treinador do Ano",
    gym_of_the_year: "Academia do Ano",
    fan_favorite: "Favorito dos Fãs",
    most_entertaining: "Mais Divertido do Ano",
    best_rivalry: "Rivalidade do Ano",
    event_of_the_year: "Evento do Ano",
    promoter_of_the_year: "Promotor do Ano",
    hall_of_fame: "Hall da Fama",
    lifetime_achievement: "Prêmio por Conjunto da Obra",
    legacy: "Prêmio de Legado"
};
function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
}
function randomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}
function safeString(value, fallback = "") {
    return value === null ||
        value === undefined ||
        value === ""
        ? fallback
        : String(value);
}
function createId(prefix = "award") {
    return `${prefix}_${Date.now()}_${Math.floor(
        Math.random() * 1000000
    )}`;
}
function nowISO() {
    return new Date().toISOString();
}
function getDatabase(database) {
    if (database && typeof database === "object") {
        return database;
    }
    if (
        typeof globalThis !== "undefined" &&
        globalThis.database
    ) {
        return globalThis.database;
    }
    return null;
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
function getPlayer(database) {
    const db = getDatabase(database);
    return db?.player || null;
}
function getFighterId(fighter) {
    if (!fighter) {
        return null;
    }
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
    return getFighterId(
        getPlayer(database)
    );
}
function createAwardsState() {
    return {
        version: AWARDS_VERSION,
        currentSeason: null,
        awards: [],
        nominations: [],
        history: [],
        hallOfFame: [],
        statistics: {
            totalAwards: 0,
            totalNominations: 0,
            fighterOfTheYear: 0,
            fightOfTheYear: 0,
            knockoutOfTheYear: 0,
            submissionOfTheYear: 0,
            performanceOfTheYear: 0,
            championOfTheYear: 0,
            breakthrough: 0,
            rookie: 0,
            comeback: 0,
            fanFavorite: 0,
            mostEntertaining: 0,
            bestRivalry: 0,
            hallOfFame: 0,
            lifetimeAchievement: 0,
            legacy: 0,
            fameGained: 0,
            reputationGained: 0,
            popularityGained: 0,
            followersGained: 0,
            regionalAwards: 0,
            nationalAwards: 0,
            internationalAwards: 0,
            eliteAwards: 0,
            legendaryAwards: 0
        },
        lastUpdated: nowISO()
    };
}
function ensureAwards(database) {
    const media = ensureMedia(database);
    if (!media) {
        return null;
    }
    if (!media.awards) {
        media.awards =
            createAwardsState();
    }
    const state = media.awards;
    if (!Array.isArray(state.awards)) {
        state.awards = [];
    }
    if (!Array.isArray(state.nominations)) {
        state.nominations = [];
    }
    if (!Array.isArray(state.history)) {
        state.history = [];
    }
    if (!Array.isArray(state.hallOfFame)) {
        state.hallOfFame = [];
    }
    if (!state.statistics) {
        state.statistics =
            createAwardsState().statistics;
    }
    state.lastUpdated = nowISO();
    return state;
}
function normalizeAwardType(type) {
    if (!type) {
        return AWARD_TYPES.performanceOfTheYear;
    }
    const value =
        String(type).toLowerCase();
    const valid =
        Object.values(AWARD_TYPES);
    return valid.includes(value)
        ? value
        : AWARD_TYPES.performanceOfTheYear;
}
function normalizeAwardLevel(level) {
    if (!level) {
        return "national";
    }
    const value =
        String(level).toLowerCase();
    return AWARD_LEVELS[value]
        ? value
        : "national";
}
function getAwardLabel(type) {
    const normalized =
        normalizeAwardType(type);
    return (
        AWARD_LABELS[normalized] ||
        "Prêmio"
    );
}
function getAwardLevelLabel(level) {
    const normalized =
        normalizeAwardLevel(level);
    return AWARD_LEVELS[
        normalized
    ].label;
}
function getAwardMultiplier(level) {
    const normalized =
        normalizeAwardLevel(level);
    return AWARD_LEVELS[
        normalized
    ].multiplier;
}
function isMajorAward(type) {
    const majorTypes = [
        AWARD_TYPES.fighterOfTheYear,
        AWARD_TYPES.maleFighterOfTheYear,
        AWARD_TYPES.femaleFighterOfTheYear,
        AWARD_TYPES.championOfTheYear,
        AWARD_TYPES.fightOfTheYear,
        AWARD_TYPES.knockoutOfTheYear,
        AWARD_TYPES.submissionOfTheYear,
        AWARD_TYPES.performanceOfTheYear,
        AWARD_TYPES.hallOfFame,
        AWARD_TYPES.lifetimeAchievement,
        AWARD_TYPES.legacy
    ];
    return majorTypes.includes(
        normalizeAwardType(type)
    );
}
function calculateAwardImpact(
    type,
    level = "national",
    isNomination = false
) {
    const normalizedType =
        normalizeAwardType(type);
    const normalizedLevel =
        normalizeAwardLevel(level);
    const multiplier =
        getAwardMultiplier(
            normalizedLevel
        );
    if (isNomination) {
        return {
            fame: Math.round(
                AWARDS_CONFIG.fame.nomination *
                multiplier
            ),
            reputation: Math.round(
                AWARDS_CONFIG.reputation.nomination *
                multiplier
            ),
            popularity: Math.round(
                AWARDS_CONFIG.popularity.nomination *
                multiplier
            ),
            followers: Math.round(
                AWARDS_CONFIG.followers.nomination *
                multiplier
            ),
            commercial: 0
        };
    }
    const major =
        isMajorAward(normalizedType);
    const hall =
        normalizedType ===
        AWARD_TYPES.hallOfFame;
    const fameBase =
        hall
            ? AWARDS_CONFIG.fame.hallOfFame
            : major
            ? AWARDS_CONFIG.fame.majorAward
            : AWARDS_CONFIG.fame.award;
    const reputationBase =
        hall
            ? AWARDS_CONFIG.reputation.hallOfFame
            : major
            ? AWARDS_CONFIG.reputation.majorAward
            : AWARDS_CONFIG.reputation.award;
    const popularityBase =
        hall
            ? AWARDS_CONFIG.popularity.hallOfFame
            : major
            ? AWARDS_CONFIG.popularity.majorAward
            : AWARDS_CONFIG.popularity.award;
    const followerBase =
        hall
            ? AWARDS_CONFIG.followers.hallOfFame
            : major
            ? AWARDS_CONFIG.followers.majorAward
            : AWARDS_CONFIG.followers.award;
    const commercialBase =
        hall
            ? AWARDS_CONFIG.commercial.hallOfFame
            : major
            ? AWARDS_CONFIG.commercial.majorAward
            : AWARDS_CONFIG.commercial.award;
    return {
        fame: Math.round(
            fameBase * multiplier
        ),
        reputation: Math.round(
            reputationBase * multiplier
        ),
        popularity: Math.round(
            popularityBase * multiplier
        ),
        followers: Math.round(
            followerBase * multiplier
        ),
        commercial: Math.round(
            commercialBase * multiplier
        )
    };
}
function getCurrentYear(database) {
    const db = getDatabase(database);
    return (
        db?.calendar?.year ||
        db?.meta?.currentYear ||
        db?.year ||
        new Date().getFullYear()
    );
}
function createSeason(database, year = null) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    const seasonYear =
        year ?? getCurrentYear(database);
    state.currentSeason = {
        year: seasonYear,
        startedAt: nowISO(),
        nominations: [],
        winners: [],
        completed: false
    };
    return state.currentSeason;
}
function ensureCurrentSeason(database) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    if (
        !state.currentSeason ||
        state.currentSeason.year !==
            getCurrentYear(database)
    ) {
        return createSeason(database);
    }
    return state.currentSeason;
}
function createNomination(
    database,
    options = {}
) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    const fighter =
        options.fighter ||
        getPlayer(database);
    const fighterId =
        options.fighterId ||
        getFighterId(fighter);
    const fighterName =
        options.fighterName ||
        getFighterName(fighter);
    const type =
        normalizeAwardType(
            options.type
        );
    const level =
        normalizeAwardLevel(
            options.level
        );
    const impact =
        calculateAwardImpact(
            type,
            level,
            true
        );
    const nomination = {
        id:
            options.id ||
            createId("nomination"),
        type,
        label:
            options.label ||
            getAwardLabel(type),
        level,
        levelLabel:
            getAwardLevelLabel(level),
        fighterId,
        fighterName,
        year:
            options.year ??
            getCurrentYear(database),
        reason:
            options.reason ||
            `Indicado ao prêmio ${getAwardLabel(type)}.`,
        eventId:
            options.eventId ||
            null,
        fightId:
            options.fightId ||
            null,
        promotionId:
            options.promotionId ||
            null,
        score:
            Number(options.score) || 0,
        impact,
        status: "nominated",
        createdAt: nowISO()
    };
    state.nominations.push(
        nomination
    );
    state.statistics.totalNominations += 1;
    return nomination;
}
function createAward(
    database,
    options = {}
) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    if (
        state.awards.length >=
        AWARDS_CONFIG.maxCurrentSeason
    ) {
        return null;
    }
    const fighter =
        options.fighter ||
        getPlayer(database);
    const fighterId =
        options.fighterId ||
        getFighterId(fighter);
    const fighterName =
        options.fighterName ||
        getFighterName(fighter);
    const type =
        normalizeAwardType(
            options.type
        );
    const level =
        normalizeAwardLevel(
            options.level
        );
    const impact =
        calculateAwardImpact(
            type,
            level,
            false
        );
    const award = {
        id:
            options.id ||
            createId("award"),
        type,
        label:
            options.label ||
            getAwardLabel(type),
        level,
        levelLabel:
            getAwardLevelLabel(level),
        fighterId,
        fighterName,
        winner:
            options.winner ??
            true,
        year:
            options.year ??
            getCurrentYear(database),
        reason:
            options.reason ||
            `Vencedor de ${getAwardLabel(type)}.`,
        eventId:
            options.eventId ||
            null,
        fightId:
            options.fightId ||
            null,
        promotionId:
            options.promotionId ||
            null,
        rivalryId:
            options.rivalryId ||
            null,
        gymId:
            options.gymId ||
            null,
        score:
            Number(options.score) || 0,
        impact,
        major:
            isMajorAward(type),
        hallOfFame:
            type ===
            AWARD_TYPES.hallOfFame,
        createdAt: nowISO()
    };
    state.awards.push(award);
    state.history.push(award);
    state.statistics.totalAwards += 1;
    incrementTypeStatistic(
        state,
        type
    );
    incrementLevelStatistic(
        state,
        level
    );
    state.statistics.fameGained +=
        impact.fame;
    state.statistics.reputationGained +=
        impact.reputation;
    state.statistics.popularityGained +=
        impact.popularity;
    state.statistics.followersGained +=
        impact.followers;
    if (
        type ===
        AWARD_TYPES.hallOfFame
    ) {
        addToHallOfFame(
            database,
            award
        );
    }
    trimAwards(database);
    return award;
}
function incrementTypeStatistic(
    state,
    type
) {
    const map = {
        [AWARD_TYPES.fighterOfTheYear]:
            "fighterOfTheYear",
        [AWARD_TYPES.maleFighterOfTheYear]:
            "fighterOfTheYear",
        [AWARD_TYPES.femaleFighterOfTheYear]:
            "fighterOfTheYear",
        [AWARD_TYPES.fightOfTheYear]:
            "fightOfTheYear",
        [AWARD_TYPES.knockoutOfTheYear]:
            "knockoutOfTheYear",
        [AWARD_TYPES.submissionOfTheYear]:
            "submissionOfTheYear",
        [AWARD_TYPES.performanceOfTheYear]:
            "performanceOfTheYear",
        [AWARD_TYPES.championOfTheYear]:
            "championOfTheYear",
        [AWARD_TYPES.breakthrough]:
            "breakthrough",
        [AWARD_TYPES.rookie]:
            "rookie",
        [AWARD_TYPES.comeback]:
            "comeback",
        [AWARD_TYPES.fanFavorite]:
            "fanFavorite",
        [AWARD_TYPES.mostEntertaining]:
            "mostEntertaining",
        [AWARD_TYPES.bestRivalry]:
            "bestRivalry",
        [AWARD_TYPES.hallOfFame]:
            "hallOfFame",
        [AWARD_TYPES.lifetimeAchievement]:
            "lifetimeAchievement",
        [AWARD_TYPES.legacy]:
            "legacy"
    };
    const key = map[type];
    if (
        key &&
        state.statistics[key] !==
            undefined
    ) {
        state.statistics[key] += 1;
    }
}
function incrementLevelStatistic(
    state,
    level
) {
    const map = {
        regional: "regionalAwards",
        local: "regionalAwards",
        national: "nationalAwards",
        international:
            "internationalAwards",
        elite: "eliteAwards",
        legendary:
            "legendaryAwards"
    };
    const key = map[level];
    if (
        key &&
        state.statistics[key] !==
            undefined
    ) {
        state.statistics[key] += 1;
    }
}
function addToHallOfFame(
    database,
    award
) {
    const state = ensureAwards(database);
    if (!state || !award) {
        return null;
    }
    const existing =
        state.hallOfFame.find(
            entry =>
                entry.fighterId ===
                award.fighterId
        );
    if (existing) {
        existing.inductionCount =
            (existing.inductionCount || 1) + 1;
        existing.lastInductedAt =
            nowISO();
        return existing;
    }
    const entry = {
        id:
            createId("hof"),
        fighterId:
            award.fighterId,
        fighterName:
            award.fighterName,
        inductionYear:
            award.year,
        inductionCount: 1,
        reason:
            award.reason,
        awardId:
            award.id,
        lastInductedAt:
            nowISO()
    };
    state.hallOfFame.push(entry);
    return entry;
}
function findAwardById(
    database,
    awardId
) {
    const state = ensureAwards(database);
    if (!state || !awardId) {
        return null;
    }
    return (
        state.awards.find(
            award =>
                award.id === awardId
        ) ||
        state.history.find(
            award =>
                award.id === awardId
        ) ||
        null
    );
}
function getPlayerAwards(database) {
    const state = ensureAwards(database);
    if (!state) {
        return [];
    }
    const playerId =
        getPlayerId(database);
    return state.history.filter(
        award =>
            award.fighterId ===
            playerId
    );
}
function getPlayerNominations(
    database
) {
    const state = ensureAwards(database);
    if (!state) {
        return [];
    }
    const playerId =
        getPlayerId(database);
    return state.nominations.filter(
        nomination =>
            nomination.fighterId ===
            playerId
    );
}
function getAwardsByType(
    database,
    type
) {
    const state = ensureAwards(database);
    if (!state) {
        return [];
    }
    const normalized =
        normalizeAwardType(type);
    return state.history.filter(
        award =>
            award.type === normalized
    );
}
function getAwardsByYear(
    database,
    year
) {
    const state = ensureAwards(database);
    if (!state) {
        return [];
    }
    return state.history.filter(
        award =>
            Number(award.year) ===
            Number(year)
    );
}
function getAwardsByLevel(
    database,
    level
) {
    const state = ensureAwards(database);
    if (!state) {
        return [];
    }
    const normalized =
        normalizeAwardLevel(level);
    return state.history.filter(
        award =>
            award.level === normalized
    );
}
function getRecentAwards(
    database,
    limit = 10
) {
    const state = ensureAwards(database);
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
            Math.max(
                1,
                Number(limit) || 10
            )
        );
}
function getLatestPlayerAwards(
    database,
    limit = 10
) {
    return getPlayerAwards(database)
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(
            0,
            Math.max(
                1,
                Number(limit) || 10
            )
        );
}
function getHallOfFame(
    database
) {
    const state = ensureAwards(database);
    return state
        ? [...state.hallOfFame]
        : [];
}
function isPlayerAward(
    database,
    award
) {
    if (!award) {
        return false;
    }
    return (
        award.fighterId ===
        getPlayerId(database)
    );
}
function getPlayerAwardCount(
    database
) {
    return getPlayerAwards(
        database
    ).length;
}
function getPlayerNominationCount(
    database
) {
    return getPlayerNominations(
        database
    ).length;
}
function hasPlayerWonAward(
    database,
    type,
    year = null
) {
    const awards =
        getPlayerAwards(database);
    const normalized =
        normalizeAwardType(type);
    return awards.some(
        award =>
            award.type === normalized &&
            (year === null ||
                Number(award.year) ===
                    Number(year))
    );
}
function hasPlayerWonMajorAward(
    database
) {
    return getPlayerAwards(
        database
    ).some(
        award =>
            award.major === true
    );
}
function getPlayerMajorAwards(
    database
) {
    return getPlayerAwards(
        database
    ).filter(
        award =>
            award.major === true
    );
}
function getPlayerAwardImpact(
    database
) {
    return getPlayerAwards(
        database
    ).reduce(
        (total, award) => {
            total.fame +=
                award.impact?.fame || 0;
            total.reputation +=
                award.impact?.reputation || 0;
            total.popularity +=
                award.impact?.popularity || 0;
            total.followers +=
                award.impact?.followers || 0;
            total.commercial +=
                award.impact?.commercial || 0;
            return total;
        },
        {
            fame: 0,
            reputation: 0,
            popularity: 0,
            followers: 0,
            commercial: 0
        }
    );
}
function getPlayerAwardScore(
    database
) {
    const awards =
        getPlayerAwards(database);
    return awards.reduce(
        (score, award) => {
            const multiplier =
                getAwardMultiplier(
                    award.level
                );
            const majorBonus =
                award.major
                    ? 10
                    : 0;
            const hofBonus =
                award.hallOfFame
                    ? 50
                    : 0;
            return (
                score +
                10 * multiplier +
                majorBonus +
                hofBonus
            );
        },
        0
    );
}
function nominatePlayer(
    database,
    type,
    options = {}
) {
    return createNomination(
        database,
        {
            ...options,
            fighter:
                options.fighter ||
                getPlayer(database),
            type
        }
    );
}
function awardPlayer(
    database,
    type,
    options = {}
) {
    return createAward(
        database,
        {
            ...options,
            fighter:
                options.fighter ||
                getPlayer(database),
            type
        }
    );
}
function awardFighterOfTheYear(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.fighterOfTheYear,
        {
            ...options,
            level:
                options.level ||
                "elite"
        }
    );
}
function awardFightOfTheYear(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.fightOfTheYear,
        {
            ...options,
            level:
                options.level ||
                "elite"
        }
    );
}
function awardKnockoutOfTheYear(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.knockoutOfTheYear,
        {
            ...options,
            level:
                options.level ||
                "elite"
        }
    );
}
function awardSubmissionOfTheYear(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.submissionOfTheYear,
        {
            ...options,
            level:
                options.level ||
                "elite"
        }
    );
}
function awardPerformanceOfTheYear(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.performanceOfTheYear,
        {
            ...options,
            level:
                options.level ||
                "elite"
        }
    );
}
function awardChampionOfTheYear(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.championOfTheYear,
        {
            ...options,
            level:
                options.level ||
                "elite"
        }
    );
}
function awardBreakthrough(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.breakthrough,
        options
    );
}
function awardRookieOfTheYear(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.rookie,
        options
    );
}
function awardComebackOfTheYear(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.comeback,
        options
    );
}
function awardFanFavorite(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.fanFavorite,
        options
    );
}
function awardMostEntertaining(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.mostEntertaining,
        options
    );
}
function awardBestRivalry(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.bestRivalry,
        options
    );
}
function inductHallOfFame(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.hallOfFame,
        {
            ...options,
            level:
                options.level ||
                "legendary"
        }
    );
}
function awardLifetimeAchievement(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.lifetimeAchievement,
        {
            ...options,
            level:
                options.level ||
                "legendary"
        }
    );
}
function awardLegacy(
    database,
    options = {}
) {
    return awardPlayer(
        database,
        AWARD_TYPES.legacy,
        {
            ...options,
            level:
                options.level ||
                "legendary"
        }
    );
}
function completeSeason(
    database,
    year = null
) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    const season =
        state.currentSeason ||
        createSeason(
            database,
            year
        );
    season.completed = true;
    season.completedAt = nowISO();
    return season;
}
function resetSeason(
    database,
    year = null
) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    state.awards = [];
    state.nominations = [];
    return createSeason(
        database,
        year
    );
}
function getAwardCategoryRanking(
    database,
    type,
    limit = 10
) {
    const awards =
        getAwardsByType(
            database,
            type
        );
    const counts = {};
    for (const award of awards) {
        const id =
            award.fighterId ||
            award.fighterName;
        if (!id) {
            continue;
        }
        if (!counts[id]) {
            counts[id] = {
                fighterId:
                    award.fighterId,
                fighterName:
                    award.fighterName,
                wins: 0,
                score: 0
            };
        }
        counts[id].wins += 1;
        counts[id].score +=
            10 *
            getAwardMultiplier(
                award.level
            );
    }
    return Object.values(counts)
        .sort(
            (a, b) =>
                b.score - a.score ||
                b.wins - a.wins
        )
        .slice(
            0,
            Math.max(
                1,
                Number(limit) || 10
            )
        );
}
function getAllTimeRanking(
    database,
    limit = 20
) {
    const state = ensureAwards(database);
    if (!state) {
        return [];
    }
    const ranking = {};
    for (const award of state.history) {
        const id =
            award.fighterId ||
            award.fighterName;
        if (!id) {
            continue;
        }
        if (!ranking[id]) {
            ranking[id] = {
                fighterId:
                    award.fighterId,
                fighterName:
                    award.fighterName,
                awards: 0,
                majorAwards: 0,
                hallOfFame: 0,
                score: 0
            };
        }
        ranking[id].awards += 1;
        if (award.major) {
            ranking[id].majorAwards += 1;
        }
        if (award.hallOfFame) {
            ranking[id].hallOfFame += 1;
        }
        ranking[id].score +=
            10 *
            getAwardMultiplier(
                award.level
            );
        if (award.major) {
            ranking[id].score += 10;
        }
        if (award.hallOfFame) {
            ranking[id].score += 50;
        }
    }
    return Object.values(ranking)
        .sort(
            (a, b) =>
                b.score - a.score
        )
        .slice(
            0,
            Math.max(
                1,
                Number(limit) || 20
            )
        );
}
function getMostAwardedFighter(
    database
) {
    const ranking =
        getAllTimeRanking(
            database,
            1
        );
    return ranking[0] || null;
}
function getMostAwardedPlayer(
    database
) {
    const awards =
        getPlayerAwards(database);
    if (!awards.length) {
        return null;
    }
    return {
        fighterId:
            getPlayerId(database),
        fighterName:
            getFighterName(
                getPlayer(database)
            ),
        awards:
            awards.length,
        majorAwards:
            awards.filter(
                award =>
                    award.major
            ).length,
        hallOfFame:
            awards.filter(
                award =>
                    award.hallOfFame
            ).length,
        score:
            getPlayerAwardScore(
                database
            )
    };
}
function getNextAwardMilestone(
    database
) {
    const count =
        getPlayerAwardCount(
            database
        );
    const milestones = [
        1,
        3,
        5,
        10,
        20,
        30,
        50,
        100
    ];
    const next =
        milestones.find(
            value =>
                value > count
        );
    if (!next) {
        return null;
    }
    return {
        current: count,
        target: next,
        remaining:
            next - count,
        progress:
            clamp(
                (count / next) * 100,
                0,
                100
            )
    };
}
function getHallOfFameEligibility(
    database
) {
    const player =
        getPlayer(database);
    if (!player) {
        return {
            eligible: false,
            score: 0,
            reasons: []
        };
    }
    const awards =
        getPlayerAwards(database);
    const majorAwards =
        awards.filter(
            award =>
                award.major
        ).length;
    const titles =
        Number(
            player.titlesWon ??
            player.championships ??
            0
        );
    const wins =
        Number(
            player.wins ??
            player.record?.wins ??
            0
        );
    const fame =
        Number(
            player.fame ??
            0
        );
    const legacy =
        Number(
            player.legacyScore ??
            player.legacy?.score ??
            0
        );
    let score = 0;
    score +=
        Math.min(
            wins * 0.5,
            30
        );
    score +=
        Math.min(
            titles * 8,
            32
        );
    score +=
        Math.min(
            majorAwards * 5,
            25
        );
    score +=
        Math.min(
            fame * 0.1,
            10
        );
    score +=
        Math.min(
            legacy * 0.1,
            20
        );
    score =
        Math.round(score);
    const reasons = [];
    if (wins >= 20) {
        reasons.push(
            "Carreira com grande número de vitórias."
        );
    }
    if (titles >= 2) {
        reasons.push(
            "Conquistou múltiplos títulos."
        );
    }
    if (majorAwards >= 3) {
        reasons.push(
            "Acumulou grandes prêmios."
        );
    }
    if (fame >= 70) {
        reasons.push(
            "Grande reconhecimento público."
        );
    }
    if (legacy >= 70) {
        reasons.push(
            "Legado considerado excepcional."
        );
    }
    return {
        eligible:
            score >= 75,
        score:
            clamp(score, 0, 100),
        reasons
    };
}
function autoInductHallOfFame(
    database
) {
    const eligibility =
        getHallOfFameEligibility(
            database
        );
    if (!eligibility.eligible) {
        return null;
    }
    const already =
        getPlayerAwards(
            database
        ).some(
            award =>
                award.type ===
                AWARD_TYPES.hallOfFame
        );
    if (already) {
        return null;
    }
    return inductHallOfFame(
        database,
        {
            reason:
                "Carreira e legado excepcionais no MMA."
        }
    );
}
function getStatistics(database) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    const playerAwards =
        getPlayerAwards(database);
    const playerNominations =
        getPlayerNominations(
            database
        );
    const winRate =
        playerNominations.length
            ? (
                  playerAwards.length /
                  playerNominations.length
              ) * 100
            : 0;
    return {
        ...state.statistics,
        currentSeason:
            state.currentSeason,
        playerAwards:
            playerAwards.length,
        playerNominations:
            playerNominations.length,
        playerWinRate:
            Math.round(
                winRate * 10
            ) / 10,
        playerScore:
            getPlayerAwardScore(
                database
            ),
        hallOfFameMembers:
            state.hallOfFame.length,
        nextMilestone:
            getNextAwardMilestone(
                database
            )
    };
}
function getProfile(database) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    const awards =
        getPlayerAwards(database);
    const nominations =
        getPlayerNominations(
            database
        );
    const impact =
        getPlayerAwardImpact(
            database
        );
    return {
        awardCount:
            awards.length,
        nominationCount:
            nominations.length,
        majorAwardCount:
            awards.filter(
                award =>
                    award.major
            ).length,
        hallOfFame:
            awards.some(
                award =>
                    award.hallOfFame
            ),
        awardScore:
            getPlayerAwardScore(
                database
            ),
        impact,
        recentAwards:
            getLatestPlayerAwards(
                database,
                10
            ),
        nominations:
            nominations
                .slice(-10)
                .reverse(),
        hallOfFameEligibility:
            getHallOfFameEligibility(
                database
            ),
        nextMilestone:
            getNextAwardMilestone(
                database
            )
    };
}
function getSummary(database) {
    const profile =
        getProfile(database);
    if (!profile) {
        return null;
    }
    return {
        awards:
            profile.awardCount,
        nominations:
            profile.nominationCount,
        majorAwards:
            profile.majorAwardCount,
        hallOfFame:
            profile.hallOfFame,
        score:
            profile.awardScore,
        fameGained:
            profile.impact.fame,
        reputationGained:
            profile.impact.reputation,
        popularityGained:
            profile.impact.popularity,
        followersGained:
            profile.impact.followers
    };
}
function trimAwards(database) {
    const state = ensureAwards(database);
    if (!state) {
        return;
    }
    if (
        state.history.length >
        AWARDS_CONFIG.maxHistory
    ) {
        state.history =
            state.history.slice(
                -AWARDS_CONFIG.maxHistory
            );
    }
    if (
        state.nominations.length >
        AWARDS_CONFIG.maxHistory
    ) {
        state.nominations =
            state.nominations.slice(
                -AWARDS_CONFIG.maxHistory
            );
    }
    if (
        state.awards.length >
        AWARDS_CONFIG.maxCurrentSeason
    ) {
        state.awards =
            state.awards.slice(
                -AWARDS_CONFIG.maxCurrentSeason
            );
    }
}
function validateAwards(database) {
    const state = ensureAwards(database);
    if (!state) {
        return {
            valid: false,
            errors: [
                "Database não encontrado."
            ]
        };
    }
    const errors = [];
    if (!Array.isArray(state.awards)) {
        errors.push(
            "awards precisa ser um array."
        );
    }
    if (
        !Array.isArray(
            state.nominations
        )
    ) {
        errors.push(
            "nominations precisa ser um array."
        );
    }
    if (
        !Array.isArray(state.history)
    ) {
        errors.push(
            "history precisa ser um array."
        );
    }
    if (
        !Array.isArray(
            state.hallOfFame
        )
    ) {
        errors.push(
            "hallOfFame precisa ser um array."
        );
    }
    for (const award of state.history) {
        if (!award.id) {
            errors.push(
                "Prêmio sem ID encontrado."
            );
        }
        if (
            !Object.values(
                AWARD_TYPES
            ).includes(award.type)
        ) {
            errors.push(
                `Prêmio ${award.id} possui tipo inválido.`
            );
        }
        if (
            !AWARD_LEVELS[
                award.level
            ]
        ) {
            errors.push(
                `Prêmio ${award.id} possui nível inválido.`
            );
        }
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
function snapshot(database) {
    const state = ensureAwards(database);
    if (!state) {
        return null;
    }
    return JSON.parse(
        JSON.stringify(state)
    );
}
function resetAwards(database) {
    const media =
        ensureMedia(database);
    if (!media) {
        return null;
    }
    media.awards =
        createAwardsState();
    return media.awards;
}
const awardsAPI = {
    AWARDS_VERSION,
    AWARDS_CONFIG,
    AWARD_TYPES,
    AWARD_LEVELS,
    AWARD_LABELS,
    createAwardsState,
    ensureAwards,
    normalizeAwardType,
    normalizeAwardLevel,
    getAwardLabel,
    getAwardLevelLabel,
    getAwardMultiplier,
    isMajorAward,
    calculateAwardImpact,
    createSeason,
    ensureCurrentSeason,
    createNomination,
    createAward,
    findAwardById,
    getPlayerAwards,
    getPlayerNominations,
    getAwardsByType,
    getAwardsByYear,
    getAwardsByLevel,
    getRecentAwards,
    getLatestPlayerAwards,
    getHallOfFame,
    isPlayerAward,
    getPlayerAwardCount,
    getPlayerNominationCount,
    hasPlayerWonAward,
    hasPlayerWonMajorAward,
    getPlayerMajorAwards,
    getPlayerAwardImpact,
    getPlayerAwardScore,
    nominatePlayer,
    awardPlayer,
    awardFighterOfTheYear,
    awardFightOfTheYear,
    awardKnockoutOfTheYear,
    awardSubmissionOfTheYear,
    awardPerformanceOfTheYear,
    awardChampionOfTheYear,
    awardBreakthrough,
    awardRookieOfTheYear,
    awardComebackOfTheYear,
    awardFanFavorite,
    awardMostEntertaining,
    awardBestRivalry,
    inductHallOfFame,
    awardLifetimeAchievement,
    awardLegacy,
    addToHallOfFame,
    completeSeason,
    resetSeason,
    getAwardCategoryRanking,
    getAllTimeRanking,
    getMostAwardedFighter,
    getMostAwardedPlayer,
    getNextAwardMilestone,
    getHallOfFameEligibility,
    autoInductHallOfFame,
    getStatistics,
    getProfile,
    getSummary,
    trimAwards,
    validateAwards,
    snapshot,
    resetAwards
};
export {
    AWARDS_VERSION,
    AWARDS_CONFIG,
    AWARD_TYPES,
    AWARD_LEVELS,
    AWARD_LABELS,
    createAwardsState,
    ensureAwards,
    normalizeAwardType,
    normalizeAwardLevel,
    getAwardLabel,
    getAwardLevelLabel,
    getAwardMultiplier,
    isMajorAward,
    calculateAwardImpact,
    createSeason,
    ensureCurrentSeason,
    createNomination,
    createAward,
    findAwardById,
    getPlayerAwards,
    getPlayerNominations,
    getAwardsByType,
    getAwardsByYear,
    getAwardsByLevel,
    getRecentAwards,
    getLatestPlayerAwards,
    getHallOfFame,
    isPlayerAward,
    getPlayerAwardCount,
    getPlayerNominationCount,
    hasPlayerWonAward,
    hasPlayerWonMajorAward,
    getPlayerMajorAwards,
    getPlayerAwardImpact,
    getPlayerAwardScore,
    nominatePlayer,
    awardPlayer,
    awardFighterOfTheYear,
    awardFightOfTheYear,
    awardKnockoutOfTheYear,
    awardSubmissionOfTheYear,
    awardPerformanceOfTheYear,
    awardChampionOfTheYear,
    awardBreakthrough,
    awardRookieOfTheYear,
    awardComebackOfTheYear,
    awardFanFavorite,
    awardMostEntertaining,
    awardBestRivalry,
    inductHallOfFame,
    awardLifetimeAchievement,
    awardLegacy,
    addToHallOfFame,
    completeSeason,
    resetSeason,
    getAwardCategoryRanking,
    getAllTimeRanking,
    getMostAwardedFighter,
    getMostAwardedPlayer,
    getNextAwardMilestone,
    getHallOfFameEligibility,
    autoInductHallOfFame,
    getStatistics,
    getProfile,
    getSummary,
    trimAwards,
    validateAwards,
    snapshot,
    resetAwards
};
export default awardsAPI;
