// ============================================================
// MMA LIFE DYNASTY
// js/career/titles.js
// ============================================================

import {
    getProfessionalCareer,
    getProfessionalStage
} from "./professional.js";

import {
    getChampion,
    setChampion,
    removeChampion
} from "./rankings.js";

// ============================================================
// VERSION
// ============================================================

export const TITLES_VERSION = 1;

// ============================================================
// TITLE TYPES
// ============================================================

export const TITLE_TYPES = Object.freeze({
    REGULAR: "regular",
    INTERIM: "interim",
    TOURNAMENT: "tournament",
    GRAND_PRIX: "grand_prix",
    SPECIAL: "special"
});

// ============================================================
// TITLE STATUS
// ============================================================

export const TITLE_STATUS = Object.freeze({
    ACTIVE: "active",
    VACANT: "vacant",
    RETIRED: "retired"
});

// ============================================================
// TITLE FIGHT TYPES
// ============================================================

export const TITLE_FIGHT_TYPES = Object.freeze({
    TITLE: "title",
    INTERIM_TITLE: "interim_title",
    UNIFICATION: "unification",
    VACANT_TITLE: "vacant_title",
    DEFENSE: "defense"
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

function clone(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return value;
    }

    return JSON.parse(
        JSON.stringify(value)
    );
}

function createId(prefix = "title") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );
}

// ============================================================
// TITLE OBJECT
// ============================================================

export function createTitle(options = {}) {
    return {
        id:
            options.id ||
            createId("title"),

        name:
            options.name ||
            "Championship",

        shortName:
            options.shortName ||
            options.name ||
            "Title",

        type:
            options.type ||
            TITLE_TYPES.REGULAR,

        status:
            options.status ||
            TITLE_STATUS.VACANT,

        promotionId:
            options.promotionId ||
            null,

        promotionName:
            options.promotionName ||
            null,

        division:
            options.division ||
            null,

        gender:
            options.gender ||
            null,

        championId:
            options.championId ||
            null,

        championName:
            options.championName ||
            null,

        interim:
            options.interim ??
            false,

        createdDate:
            options.createdDate ||
            null,

        wonDate:
            options.wonDate ||
            null,

        lostDate:
            options.lostDate ||
            null,

        defenses:
            safeNumber(
                options.defenses,
                0
            ),

        successfulDefenses:
            safeNumber(
                options.successfulDefenses,
                0
            ),

        reignNumber:
            safeNumber(
                options.reignNumber,
                1
            ),

        history:
            Array.isArray(
                options.history
            )
                ? clone(options.history)
                : [],

        previousChampions:
            Array.isArray(
                options.previousChampions
            )
                ? clone(
                    options.previousChampions
                )
                : [],

        records: {
            longestReignDays:
                safeNumber(
                    options.records
                        ?.longestReignDays,
                    0
                ),

            mostDefenses:
                safeNumber(
                    options.records
                        ?.mostDefenses,
                    0
                )
        }
    };
}

// ============================================================
// TITLE DATABASE
// ============================================================

export function createTitleDatabase() {
    return {
        version:
            TITLES_VERSION,

        titles: {},

        championships: {},

        history: [],

        lastUpdate:
            null
    };
}

// ============================================================
// DATABASE ACCESS
// ============================================================

export function getTitle(
    database,
    titleId
) {
    if (
        !database?.titles
    ) {
        return null;
    }

    return (
        database.titles[titleId] ||
        null
    );
}

export function addTitleToDatabase(
    database,
    title
) {
    if (
        !database ||
        !title
    ) {
        return null;
    }

    if (
        !database.titles
    ) {
        database.titles = {};
    }

    database.titles[title.id] =
        title;

    return title;
}

export function removeTitleFromDatabase(
    database,
    titleId
) {
    if (
        !database?.titles?.[titleId]
    ) {
        return false;
    }

    delete database.titles[
        titleId
    ];

    return true;
}

// ============================================================
// FIND TITLES
// ============================================================

export function findTitles(
    database,
    options = {}
) {
    const titles =
        Object.values(
            database?.titles || {}
        );

    return titles.filter(
        title => {
            if (
                options.promotionId &&
                String(
                    title.promotionId
                ) !==
                String(
                    options.promotionId
                )
            ) {
                return false;
            }

            if (
                options.division &&
                String(
                    title.division
                ) !==
                String(
                    options.division
                )
            ) {
                return false;
            }

            if (
                options.type &&
                title.type !==
                options.type
            ) {
                return false;
            }

            if (
                options.status &&
                title.status !==
                options.status
            ) {
                return false;
            }

            if (
                options.championId &&
                String(
                    title.championId
                ) !==
                String(
                    options.championId
                )
            ) {
                return false;
            }

            return true;
        }
    );
}

// ============================================================
// CHAMPIONSHIP KEY
// ============================================================

export function createChampionshipKey(
    promotionId,
    division,
    type = TITLE_TYPES.REGULAR
) {
    return (
        String(
            promotionId ||
            "global"
        ) +
        "::" +
        String(
            division ||
            "unknown"
        ) +
        "::" +
        String(
            type
        )
    );
}

// ============================================================
// REGISTER CHAMPIONSHIP
// ============================================================

export function registerChampionship(
    database,
    title
) {
    if (
        !database ||
        !title
    ) {
        return null;
    }

    if (
        !database.championships
    ) {
        database.championships = {};
    }

    const key =
        createChampionshipKey(
            title.promotionId,
            title.division,
            title.type
        );

    database.championships[key] =
        title.id;

    return key;
}

// ============================================================
// GET CHAMPIONSHIP
// ============================================================

export function getChampionship(
    database,
    promotionId,
    division,
    type = TITLE_TYPES.REGULAR
) {
    const key =
        createChampionshipKey(
            promotionId,
            division,
            type
        );

    const titleId =
        database?.championships?.[
            key
        ];

    if (
        titleId
    ) {
        return getTitle(
            database,
            titleId
        );
    }

    const found =
        findTitles(
            database,
            {
                promotionId,
                division,
                type
            }
        )[0];

    return found || null;
}

// ============================================================
// CURRENT CHAMPION
// ============================================================

export function getTitleChampion(
    database,
    promotionId,
    division,
    type = TITLE_TYPES.REGULAR
) {
    const title =
        getChampionship(
            database,
            promotionId,
            division,
            type
        );

    if (
        !title
    ) {
        return null;
    }

    if (
        !title.championId
    ) {
        return null;
    }

    return {
        fighterId:
            title.championId,

        fighterName:
            title.championName,

        titleId:
            title.id,

        titleName:
            title.name
    };
}

// ============================================================
// IS TITLE VACANT
// ============================================================

export function isTitleVacant(
    title
) {
    return (
        !title ||
        title.status ===
            TITLE_STATUS.VACANT ||
        !title.championId
    );
}

// ============================================================
// VACATE TITLE
// ============================================================

export function vacateTitle(
    database,
    titleId,
    options = {}
) {
    const title =
        getTitle(
            database,
            titleId
        );

    if (
        !title
    ) {
        return {
            success: false,
            reason:
                "title_not_found"
        };
    }

    const previousChampion = {
        fighterId:
            title.championId,

        fighterName:
            title.championName,

        lostDate:
            options.date ||
            null,

        reason:
            options.reason ||
            "vacated"
    };

    if (
        title.championId
    ) {
        title.previousChampions.push(
            previousChampion
        );
    }

    title.championId =
        null;

    title.championName =
        null;

    title.status =
        TITLE_STATUS.VACANT;

    title.lostDate =
        options.date ||
        null;

    title.history.push({
        id:
            createId(
                "titleEvent"
            ),

        type:
            "vacated",

        date:
            options.date ||
            null,

        fighterId:
            previousChampion.fighterId ||
            null,

        fighterName:
            previousChampion.fighterName ||
            null,

        reason:
            options.reason ||
            "vacated"
    });

    removeChampion(
        database.rankings ||
            database,
        title.promotionId,
        title.division,
        options
    );

    return {
        success: true,

        title,

        previousChampion
    };
}

// ============================================================
// AWARD TITLE
// ============================================================

export function awardTitle(
    database,
    titleId,
    fighter,
    options = {}
) {
    const title =
        getTitle(
            database,
            titleId
        );

    if (
        !title
    ) {
        return {
            success: false,
            reason:
                "title_not_found"
        };
    }

    if (
        !fighter
    ) {
        return {
            success: false,
            reason:
                "fighter_missing"
        };
    }

    const fighterId =
        fighter.id ||
        fighter.identity?.id ||
        null;

    const fighterName =
        fighter.name ||
        fighter.identity?.name ||
        fighter.identity?.fullName ||
        "Unknown Fighter";

    if (
        !fighterId
    ) {
        return {
            success: false,
            reason:
                "fighter_id_missing"
        };
    }

    const previousChampionId =
        title.championId;

    const previousChampionName =
        title.championName;

    if (
        previousChampionId &&
        String(
            previousChampionId
        ) !==
        String(
            fighterId
        )
    ) {
        title.previousChampions.push({
            fighterId:
                previousChampionId,

            fighterName:
                previousChampionName,

            lostDate:
                options.date ||
                null
        });
    }

    title.championId =
        fighterId;

    title.championName =
        fighterName;

    title.status =
        TITLE_STATUS.ACTIVE;

    title.interim =
        options.interim ??
        title.interim;

    title.wonDate =
        options.date ||
        null;

    title.reignNumber +=
        previousChampionId
            ? 1
            : 0;

    title.history.push({
        id:
            createId(
                "titleEvent"
            ),

        type:
            previousChampionId
                ? "new_champion"
                : "first_champion",

        date:
            options.date ||
            null,

        fighterId,

        fighterName,

        previousChampionId:
            previousChampionId ||
            null,

        previousChampionName:
            previousChampionName ||
            null,

        method:
            options.method ||
            null
    });

    /*
     * Sincroniza ranking quando
     * a estrutura de rankings estiver
     * disponível.
     */
    if (
        database.rankings
    ) {
        try {
            setChampion(
                database.rankings,
                fighterId,
                title.promotionId,
                title.division,
                options
            );
        } catch {
            // Não interrompe o sistema de títulos.
        }
    }

    /*
     * Registra o título também no
     * histórico profissional do lutador.
     */
    const professional =
        getProfessionalCareer(
            fighter
        );

    if (
        professional
    ) {
        if (
            !Array.isArray(
                professional.titles
            )
        ) {
            professional.titles = [];
        }

        const existing =
            professional.titles.find(
                item =>
                    String(
                        item.titleId
                    ) ===
                    String(
                        title.id
                    ) &&
                    item.active !== false
            );

        if (
            !existing
        ) {
            professional.titles.push({
                id:
                    createId(
                        "fighterTitle"
                    ),

                titleId:
                    title.id,

                name:
                    title.name,

                promotionId:
                    title.promotionId,

                division:
                    title.division,

                wonDate:
                    options.date ||
                    null,

                defenses: 0,

                active: true
            });
        }
    }

    return {
        success: true,

        title,

        champion: {
            fighterId,
            fighterName
        }
    };
}

// ============================================================
// LOSE TITLE
// ============================================================

export function loseTitle(
    database,
    titleId,
    fighterId,
    options = {}
) {
    const title =
        getTitle(
            database,
            titleId
        );

    if (
        !title
    ) {
        return {
            success: false,
            reason:
                "title_not_found"
        };
    }

    if (
        !title.championId ||
        String(
            title.championId
        ) !==
        String(
            fighterId
        )
    ) {
        return {
            success: false,
            reason:
                "fighter_is_not_champion"
        };
    }

    const oldChampionId =
        title.championId;

    const oldChampionName =
        title.championName;

    title.previousChampions.push({
        fighterId:
            oldChampionId,

        fighterName:
            oldChampionName,

        lostDate:
            options.date ||
            null,

        reason:
            options.reason ||
            "lost_title"
    });

    title.history.push({
        id:
            createId(
                "titleEvent"
            ),

        type:
            "title_lost",

        date:
            options.date ||
            null,

        fighterId:
            oldChampionId,

        fighterName:
            oldChampionName,

        reason:
            options.reason ||
            "lost_title"
    });

    title.championId =
        null;

    title.championName =
        null;

    title.status =
        TITLE_STATUS.VACANT;

    title.lostDate =
        options.date ||
        null;

    /*
     * Desativa o cinturão no histórico
     * profissional do lutador.
     */
    const fighter =
        options.fighter;

    if (
        fighter
    ) {
        deactivateFighterTitle(
            fighter,
            title.id,
            options.date
        );
    }

    return {
        success: true,

        title,

        formerChampion: {
            fighterId:
                oldChampionId,

            fighterName:
                oldChampionName
        }
    };
}

// ============================================================
// TITLE DEFENSE
// ============================================================

export function recordTitleDefense(
    database,
    titleId,
    champion,
    options = {}
) {
    const title =
        getTitle(
            database,
            titleId
        );

    if (
        !title
    ) {
        return {
            success: false,
            reason:
                "title_not_found"
        };
    }

    const championId =
        champion?.id ||
        champion?.identity?.id ||
        champion;

    if (
        !championId
    ) {
        return {
            success: false,
            reason:
                "champion_missing"
        };
    }

    if (
        String(
            title.championId
        ) !==
        String(
            championId
        )
    ) {
        return {
            success: false,
            reason:
                "fighter_is_not_champion"
        };
    }

    title.defenses += 1;

    title.successfulDefenses +=
        options.success !== false
            ? 1
            : 0;

    if (
        title.successfulDefenses >
        title.records.mostDefenses
    ) {
        title.records.mostDefenses =
            title.successfulDefenses;
    }

    title.history.push({
        id:
            createId(
                "titleDefense"
            ),

        type:
            "defense",

        date:
            options.date ||
            null,

        fighterId:
            championId,

        fighterName:
            champion?.name ||
            champion?.identity?.name ||
            title.championName,

        opponentId:
            options.opponentId ||
            null,

        opponentName:
            options.opponentName ||
            null,

        method:
            options.method ||
            null,

        round:
            safeNumber(
                options.round,
                0
            ),

        successful:
            options.success !== false
    });

    /*
     * Atualiza título no perfil
     * profissional do campeão.
     */
    if (
        champion &&
        champion.career?.professional
    ) {
        const fighterTitles =
            champion.career.professional
                .titles || [];

        const fighterTitle =
            fighterTitles.find(
                item =>
                    String(
                        item.titleId
                    ) ===
                    String(
                        title.id
                    ) &&
                    item.active !== false
            );

        if (
            fighterTitle
        ) {
            fighterTitle.defenses =
                safeNumber(
                    fighterTitle.defenses,
                    0
                ) + 1;
        }
    }

    return {
        success: true,

        title,

        defenseNumber:
            title.successfulDefenses
    };
}

// ============================================================
// DEACTIVATE FIGHTER TITLE
// ============================================================

export function deactivateFighterTitle(
    fighter,
    titleId,
    date = null
) {
    const professional =
        getProfessionalCareer(
            fighter
        );

    if (
        !professional
    ) {
        return false;
    }

    const fighterTitle =
        professional.titles.find(
            item =>
                String(
                    item.titleId
                ) ===
                String(
                    titleId
                ) &&
                item.active !== false
        );

    if (
        !fighterTitle
    ) {
        return false;
    }

    fighterTitle.active =
        false;

    fighterTitle.lostDate =
        date ||
        fighterTitle.lostDate ||
        null;

    return true;
}

// ============================================================
// GET FIGHTER TITLES
// ============================================================

export function getFighterTitles(
    fighter
) {
    const professional =
        getProfessionalCareer(
            fighter
        );

    if (
        !professional
    ) {
        return [];
    }

    return Array.isArray(
        professional.titles
    )
        ? professional.titles
        : [];
}

export function getActiveFighterTitles(
    fighter
) {
    return getFighterTitles(
        fighter
    ).filter(
        title =>
            title.active !== false
    );
}

// ============================================================
// CHAMPION CHECK
// ============================================================

export function isTitleHolder(
    fighter,
    titleId = null
) {
    const titles =
        getActiveFighterTitles(
            fighter
        );

    if (
        !titleId
    ) {
        return titles.length > 0;
    }

    return titles.some(
        title =>
            String(
                title.titleId
            ) ===
            String(
                titleId
            )
    );
}

// ============================================================
// TITLE FIGHT VALIDATION
// ============================================================

export function canFightForTitle(
    fighter,
    title,
    options = {}
) {
    if (
        !fighter
    ) {
        return {
            allowed: false,
            reason:
                "fighter_missing"
        };
    }

    if (
        !title
    ) {
        return {
            allowed: false,
            reason:
                "title_missing"
        };
    }

    const professional =
        getProfessionalCareer(
            fighter
        );

    if (
        !professional?.active
    ) {
        return {
            allowed: false,
            reason:
                "professional_career_inactive"
        };
    }

    const division =
        professional.currentDivision ||
        fighter?.physical?.weightClass ||
        fighter?.weightClass;

    if (
        division &&
        title.division &&
        String(
            division
        ) !==
        String(
            title.division
        )
    ) {
        return {
            allowed: false,
            reason:
                "wrong_division"
        };
    }

    if (
        title.status ===
        TITLE_STATUS.RETIRED
    ) {
        return {
            allowed: false,
            reason:
                "title_retired"
        };
    }

    if (
        !title.championId
    ) {
        if (
            options.allowVacant ===
            false
        ) {
            return {
                allowed: false,
                reason:
                    "title_vacant"
            };
        }
    }

    return {
        allowed: true,
        reason: null
    };
}

// ============================================================
// TITLE FIGHT RESULT
// ============================================================

export function processTitleFight(
    database,
    titleId,
    winner,
    loser,
    options = {}
) {
    const title =
        getTitle(
            database,
            titleId
        );

    if (
        !title
    ) {
        return {
            success: false,
            reason:
                "title_not_found"
        };
    }

    if (
        !winner
    ) {
        return {
            success: false,
            reason:
                "winner_missing"
        };
    }

    const winnerId =
        winner.id ||
        winner.identity?.id;

    const loserId =
        loser?.id ||
        loser?.identity?.id ||
        null;

    if (
        !winnerId
    ) {
        return {
            success: false,
            reason:
                "winner_id_missing"
        };
    }

    const oldChampion =
        title.championId;

    /*
     * Se o campeão venceu,
     * registra defesa.
     */
    if (
        oldChampion &&
        String(
            oldChampion
        ) ===
        String(
            winnerId
        )
    ) {
        return recordTitleDefense(
            database,
            titleId,
            winner,
            {
                ...options,

                opponentId:
                    loserId,

                opponentName:
                    loser?.name ||
                    loser?.identity?.name ||
                    null,

                success: true
            }
        );
    }

    /*
     * Novo campeão.
     */
    const result =
        awardTitle(
            database,
            titleId,
            winner,
            {
                ...options,

                method:
                    options.method ||
                    null
            }
        );

    if (
        result.success &&
        loser &&
        oldChampion &&
        String(
            oldChampion
        ) ===
        String(
            loserId
        )
    ) {
        deactivateFighterTitle(
            loser,
            titleId,
            options.date
        );
    }

    return result;
}

// ============================================================
// UNIFICATION
// ============================================================

export function unifyTitles(
    database,
    primaryTitleId,
    secondaryTitleId,
    winner,
    options = {}
) {
    const primary =
        getTitle(
            database,
            primaryTitleId
        );

    const secondary =
        getTitle(
            database,
            secondaryTitleId
        );

    if (
        !primary ||
        !secondary
    ) {
        return {
            success: false,
            reason:
                "title_not_found"
        };
    }

    const winnerId =
        winner?.id ||
        winner?.identity?.id ||
        winner;

    if (
        !winnerId
    ) {
        return {
            success: false,
            reason:
                "winner_missing"
        };
    }

    const result =
        awardTitle(
            database,
            primaryTitleId,
            winner,
            {
                ...options,
                unification: true
            }
        );

    if (
        !result.success
    ) {
        return result;
    }

    /*
     * O segundo cinturão é incorporado
     * ao principal e fica aposentado.
     */
    secondary.status =
        TITLE_STATUS.RETIRED;

    secondary.championId =
        null;

    secondary.championName =
        null;

    secondary.history.push({
        id:
            createId(
                "unification"
            ),

        type:
            "unified",

        date:
            options.date ||
            null,

        winnerId
    });

    return {
        success: true,

        primaryTitle:
            primary,

        unifiedTitle:
            secondary,

        winnerId
    };
}

// ============================================================
// INTERIM TITLE
// ============================================================

export function createInterimTitle(
    database,
    options = {}
) {
    const title =
        createTitle({
            ...options,

            type:
                TITLE_TYPES.INTERIM,

            interim: true,

            status:
                TITLE_STATUS.VACANT
        });

    addTitleToDatabase(
        database,
        title
    );

    registerChampionship(
        database,
        title
    );

    return title;
}

// ============================================================
// REMOVE INTERIM TITLE
// ============================================================

export function retireInterimTitle(
    database,
    titleId,
    options = {}
) {
    const title =
        getTitle(
            database,
            titleId
        );

    if (
        !title
    ) {
        return false;
    }

    if (
        title.type !==
        TITLE_TYPES.INTERIM
    ) {
        return false;
    }

    title.status =
        TITLE_STATUS.RETIRED;

    title.history.push({
        id:
            createId(
                "interimEvent"
            ),

        type:
            "interim_retired",

        date:
            options.date ||
            null,

        reason:
            options.reason ||
            "unified"
    });

    return true;
}

// ============================================================
// TITLE HISTORY
// ============================================================

export function getTitleHistory(
    database,
    titleId
) {
    const title =
        getTitle(
            database,
            titleId
        );

    if (
        !title
    ) {
        return [];
    }

    return clone(
        title.history
    );
}

export function getPreviousChampions(
    database,
    titleId
) {
    const title =
        getTitle(
            database,
            titleId
        );

    if (
        !title
    ) {
        return [];
    }

    return clone(
        title.previousChampions
    );
}

// ============================================================
// TITLE RECORDS
// ============================================================

export function getTitleRecords(
    title
) {
    if (
        !title
    ) {
        return {
            mostDefenses: 0,
            longestReignDays: 0
        };
    }

    return {
        mostDefenses:
            safeNumber(
                title.records
                    ?.mostDefenses,
                0
            ),

        longestReignDays:
            safeNumber(
                title.records
                    ?.longestReignDays,
                0
            )
    };
}

// ============================================================
// TITLE SUMMARY
// ============================================================

export function getTitleSummary(
    title
) {
    if (
        !title
    ) {
        return null;
    }

    return {
        id:
            title.id,

        name:
            title.name,

        type:
            title.type,

        status:
            title.status,

        promotionId:
            title.promotionId,

        division:
            title.division,

        championId:
            title.championId,

        championName:
            title.championName,

        vacant:
            isTitleVacant(
                title
            ),

        interim:
            title.interim,

        defenses:
            title.successfulDefenses,

        reignNumber:
            title.reignNumber,

        historyLength:
            title.history.length
    };
}

// ============================================================
// VALIDATION
// ============================================================

export function validateTitle(
    title
) {
    const errors = [];

    if (
        !title ||
        typeof title !== "object"
    ) {
        return {
            valid: false,
            errors: [
                "title_missing"
            ]
        };
    }

    if (
        !title.id
    ) {
        errors.push(
            "id_missing"
        );
    }

    if (
        !title.name
    ) {
        errors.push(
            "name_missing"
        );
    }

    if (
        !title.division
    ) {
        errors.push(
            "division_missing"
        );
    }

    if (
        !Array.isArray(
            title.history
        )
    ) {
        errors.push(
            "history_invalid"
        );
    }

    if (
        !Array.isArray(
            title.previousChampions
        )
    ) {
        errors.push(
            "previous_champions_invalid"
        );
    }

    if (
        title.defenses < 0
    ) {
        errors.push(
            "invalid_defenses"
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

export function validateTitleDatabase(
    database
) {
    const errors = [];

    if (
        !database ||
        typeof database !== "object"
    ) {
        return {
            valid: false,
            errors: [
                "database_missing"
            ]
        };
    }

    if (
        !database.titles ||
        typeof database.titles !==
        "object"
    ) {
        errors.push(
            "titles_invalid"
        );
    }

    for (
        const [
            id,
            title
        ] of Object.entries(
            database.titles || {}
        )
    ) {
        const validation =
            validateTitle(
                title
            );

        if (
            !validation.valid
        ) {
            errors.push(
                ...validation.errors.map(
                    error =>
                        `${id}:${error}`
                )
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

// ============================================================
// CLONE / SNAPSHOT
// ============================================================

export function cloneTitles(
    database
) {
    return clone(
        database
    );
}

export function snapshotTitles(
    database
) {
    return clone(
        database
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    TITLES_VERSION,

    TITLE_TYPES,
    TITLE_STATUS,
    TITLE_FIGHT_TYPES,

    createTitle,
    createTitleDatabase,

    getTitle,
    addTitleToDatabase,
    removeTitleFromDatabase,

    findTitles,

    createChampionshipKey,
    registerChampionship,
    getChampionship,
    getTitleChampion,

    isTitleVacant,
    vacateTitle,
    awardTitle,
    loseTitle,

    recordTitleDefense,
    deactivateFighterTitle,

    getFighterTitles,
    getActiveFighterTitles,
    isTitleHolder,

    canFightForTitle,
    processTitleFight,

    unifyTitles,

    createInterimTitle,
    retireInterimTitle,

    getTitleHistory,
    getPreviousChampions,

    getTitleRecords,
    getTitleSummary,

    validateTitle,
    validateTitleDatabase,

    cloneTitles,
    snapshotTitles
};
