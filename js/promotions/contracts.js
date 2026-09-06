// ============================================================
// MMA LIFE DYNASTY
// js/promotions/contracts.js
// ============================================================
export const CONTRACTS_VERSION = 1;
// ============================================================
// CONTRACT STATUS
// ============================================================
export const CONTRACT_STATUS = Object.freeze({
    OFFERED: "offered",
    NEGOTIATING: "negotiating",
    ACTIVE: "active",
    COMPLETED: "completed",
    EXPIRED: "expired",
    TERMINATED: "terminated",
    REJECTED: "rejected",
    CANCELLED: "cancelled"
});
// ============================================================
// CONTRACT TYPES
// ============================================================
export const CONTRACT_TYPES = Object.freeze({
    SINGLE_FIGHT: "single_fight",
    MULTI_FIGHT: "multi_fight",
    DEVELOPMENT: "development",
    CHAMPIONSHIP: "championship",
    TOURNAMENT: "tournament",
    EXCLUSIVE: "exclusive",
    RENEWAL: "renewal"
});
// ============================================================
// FIGHT PAYMENT TYPES
// ============================================================
export const PAYMENT_TYPES = Object.freeze({
    SHOW: "show",
    WIN: "win",
    PERFORMANCE: "performance",
    KNOCKOUT: "knockout",
    SUBMISSION: "submission",
    TITLE: "title",
    BONUS: "bonus"
});
// ============================================================
// TERMINATION REASONS
// ============================================================
export const TERMINATION_REASONS = Object.freeze({
    COMPLETED: "completed",
    EXPIRED: "expired",
    MUTUAL: "mutual",
    PERFORMANCE: "performance",
    BREACH: "breach",
    RETIREMENT: "retirement",
    INJURY: "injury",
    PROMOTION_CLOSED: "promotion_closed",
    OTHER: "other"
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
    return Math.min(
        max,
        Math.max(
            min,
            safeNumber(value, min)
        )
    );
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
function createId(prefix = "contract") {
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
function nowISO() {
    return new Date().toISOString();
}
// ============================================================
// DEFAULT CONTRACT VALUES
// ============================================================
export const CONTRACT_CONFIG = Object.freeze({
    DEFAULT_FIGHTS: 3,
    MIN_FIGHTS: 1,
    MAX_FIGHTS: 8,
    DEFAULT_SHOW_PURSE: 300,
    DEFAULT_WIN_BONUS: 300,
    DEFAULT_PERFORMANCE_BONUS: 0,
    DEFAULT_TITLE_BONUS: 0,
    DEFAULT_TERMINATION_FEE: 0,
    NEGOTIATION_STEP_PERCENT: 10,
    MAX_NEGOTIATION_ROUNDS: 5
});
// ============================================================
// BASE PAY BY PROMOTION LEVEL
// ============================================================
export const BASE_PAY_BY_LEVEL = Object.freeze({
    Regional: {
        show: 300,
        win: 300,
        performance: 100,
        title: 250
    },
    National: {
        show: 1000,
        win: 1000,
        performance: 500,
        title: 1500
    },
    International: {
        show: 6500,
        win: 8000,
        performance: 3000,
        title: 10000
    },
    Elite: {
        show: 12000,
        win: 12000,
        performance: 10000,
        title: 25000
    }
});
// ============================================================
// CONTRACT FACTORY
// ============================================================
export function createContract(options = {}) {
    const level =
        options.promotionLevel ||
        "Regional";
    const basePay =
        BASE_PAY_BY_LEVEL[level] ||
        BASE_PAY_BY_LEVEL.Regional;
    const fights = clamp(
        options.fights ??
            CONTRACT_CONFIG.DEFAULT_FIGHTS,
        CONTRACT_CONFIG.MIN_FIGHTS,
        CONTRACT_CONFIG.MAX_FIGHTS
    );
    return {
        id:
            options.id ||
            createId(),
        version:
            CONTRACTS_VERSION,
        type:
            options.type ||
            CONTRACT_TYPES.MULTI_FIGHT,
        status:
            options.status ||
            CONTRACT_STATUS.OFFERED,
        fighterId:
            options.fighterId ||
            null,
        fighterName:
            options.fighterName ||
            null,
        promotionId:
            options.promotionId ||
            null,
        promotionName:
            options.promotionName ||
            null,
        promotionLevel:
            level,
        division:
            options.division ||
            null,
        exclusive:
            options.exclusive === true,
        fights: {
            total:
                fights,
            completed:
                safeNumber(
                    options.completedFights,
                    0
                ),
            remaining:
                Math.max(
                    0,
                    fights -
                    safeNumber(
                        options.completedFights,
                        0
                    )
                )
        },
        purse: {
            show:
                safeNumber(
                    options.showPurse ??
                        basePay.show,
                    CONTRACT_CONFIG
                        .DEFAULT_SHOW_PURSE
                ),
            win:
                safeNumber(
                    options.winBonus ??
                        basePay.win,
                    CONTRACT_CONFIG
                        .DEFAULT_WIN_BONUS
                ),
            performance:
                safeNumber(
                    options.performanceBonus ??
                        basePay.performance,
                    CONTRACT_CONFIG
                        .DEFAULT_PERFORMANCE_BONUS
                ),
            knockout:
                safeNumber(
                    options.knockoutBonus,
                    0
                ),
            submission:
                safeNumber(
                    options.submissionBonus,
                    0
                ),
            title:
                safeNumber(
                    options.titleBonus ??
                        basePay.title,
                    CONTRACT_CONFIG
                        .DEFAULT_TITLE_BONUS
                )
        },
        escalation: {
            enabled:
                options.escalation
                    ?.enabled === true,
            showPercent:
                safeNumber(
                    options.escalation
                        ?.showPercent,
                    0
                ),
            winPercent:
                safeNumber(
                    options.escalation
                        ?.winPercent,
                    0
                )
        },
        clauses: {
            titleShot:
                options.clauses
                    ?.titleShot === true,
            rematch:
                options.clauses
                    ?.rematch === true,
            sponsorship:
                options.clauses
                    ?.sponsorship === true,
            medical:
                options.clauses
                    ?.medical === true,
            release:
                options.clauses
                    ?.release === true,
            terminationFee:
                safeNumber(
                    options.clauses
                        ?.terminationFee,
                    CONTRACT_CONFIG
                        .DEFAULT_TERMINATION_FEE
                ),
            minimumFights:
                safeNumber(
                    options.clauses
                        ?.minimumFights,
                    0
                )
        },
        dates: {
            offeredAt:
                options.dates
                    ?.offeredAt ||
                options.offeredAt ||
                nowISO(),
            acceptedAt:
                options.dates
                    ?.acceptedAt ||
                null,
            startedAt:
                options.dates
                    ?.startedAt ||
                null,
            expiresAt:
                options.dates
                    ?.expiresAt ||
                null,
            completedAt:
                options.dates
                    ?.completedAt ||
                null,
            terminatedAt:
                options.dates
                    ?.terminatedAt ||
                null
        },
        negotiations: {
            rounds:
                safeNumber(
                    options.negotiations
                        ?.rounds,
                    0
                ),
            originalShow:
                safeNumber(
                    options.negotiations
                        ?.originalShow,
                    safeNumber(
                        options.showPurse ??
                            basePay.show,
                        0
                    )
                ),
            originalWin:
                safeNumber(
                    options.negotiations
                        ?.originalWin,
                    safeNumber(
                        options.winBonus ??
                            basePay.win,
                        0
                    )
                ),
            lastCounterOffer:
                options.negotiations
                    ?.lastCounterOffer
                    ? clone(
                        options.negotiations
                            .lastCounterOffer
                    )
                    : null
        },
        fightHistory:
            Array.isArray(
                options.fightHistory
            )
                ? clone(
                    options.fightHistory
                )
                : [],
        totalEarned:
            safeNumber(
                options.totalEarned,
                0
            ),
        notes:
            Array.isArray(
                options.notes
            )
                ? [...options.notes]
                : []
    };
}
// ============================================================
// PAYMENT CALCULATION
// ============================================================
export function calculateFightPayment(
    contract,
    result = {},
    options = {}
) {
    if (
        !contract
    ) {
        return {
            total: 0,
            breakdown: {}
        };
    }
    const show =
        safeNumber(
            contract.purse?.show,
            0
        );
    const won =
        result.result === "win" ||
        result.won === true;
    const winBonus =
        won
            ? safeNumber(
                contract.purse?.win,
                0
            )
            : 0;
    const performance =
        result.performance === true ||
        result.performanceBonus === true
            ? safeNumber(
                contract.purse?.performance,
                0
            )
            : 0;
    const knockout =
        (
            result.method === "KO" ||
            result.method === "TKO" ||
            result.method === "ko" ||
            result.method === "tko"
        )
            ? safeNumber(
                contract.purse?.knockout,
                0
            )
            : 0;
    const submission =
        (
            result.method === "Submission" ||
            result.method === "submission"
        )
            ? safeNumber(
                contract.purse?.submission,
                0
            )
            : 0;
    const title =
        result.titleFight === true
            ? safeNumber(
                contract.purse?.title,
                0
            )
            : 0;
    const customBonus =
        safeNumber(
            options.customBonus,
            0
        );
    const total =
        show +
        winBonus +
        performance +
        knockout +
        submission +
        title +
        customBonus;
    return {
        total,
        breakdown: {
            show,
            win:
                winBonus,
            performance,
            knockout,
            submission,
            title,
            customBonus
        }
    };
}
// ============================================================
// CONTRACT VALUE
// ============================================================
export function calculateContractValue(
    contract
) {
    if (
        !contract
    ) {
        return 0;
    }
    const remaining =
        safeNumber(
            contract.fights?.remaining,
            0
        );
    const show =
        safeNumber(
            contract.purse?.show,
            0
        );
    const win =
        safeNumber(
            contract.purse?.win,
            0
        );
    const performance =
        safeNumber(
            contract.purse?.performance,
            0
        );
    const title =
        safeNumber(
            contract.purse?.title,
            0
        );
    const estimatedPerFight =
        show +
        win * 0.5 +
        performance * 0.25 +
        title * 0.15;
    return (
        estimatedPerFight *
        remaining
    );
}
// ============================================================
// ACCEPT CONTRACT
// ============================================================
export function acceptContract(
    contract,
    options = {}
) {
    if (
        !contract
    ) {
        return {
            success: false,
            reason:
                "contract_missing"
        };
    }
    if (
        contract.status !==
            CONTRACT_STATUS.OFFERED &&
        contract.status !==
            CONTRACT_STATUS.NEGOTIATING
    ) {
        return {
            success: false,
            reason:
                "invalid_status"
        };
    }
    contract.status =
        CONTRACT_STATUS.ACTIVE;
    contract.dates.acceptedAt =
        options.date ||
        nowISO();
    contract.dates.startedAt =
        options.date ||
        nowISO();
    contract.fights.remaining =
        Math.max(
            0,
            safeNumber(
                contract.fights.total,
                0
            ) -
            safeNumber(
                contract.fights.completed,
                0
            )
        );
    return {
        success: true,
        contract
    };
}
// ============================================================
// REJECT CONTRACT
// ============================================================
export function rejectContract(
    contract,
    reason = "fighter_rejected"
) {
    if (
        !contract
    ) {
        return false;
    }
    contract.status =
        CONTRACT_STATUS.REJECTED;
    contract.notes.push(
        reason
    );
    return true;
}
// ============================================================
// START NEGOTIATION
// ============================================================
export function startNegotiation(
    contract
) {
    if (
        !contract
    ) {
        return false;
    }
    if (
        contract.status !==
        CONTRACT_STATUS.OFFERED
    ) {
        return false;
    }
    contract.status =
        CONTRACT_STATUS.NEGOTIATING;
    return true;
}
// ============================================================
// COUNTER OFFER
// ============================================================
export function makeCounterOffer(
    contract,
    options = {}
) {
    if (
        !contract
    ) {
        return {
            success: false,
            reason:
                "contract_missing"
        };
    }
    if (
        contract.status !==
        CONTRACT_STATUS.NEGOTIATING
    ) {
        return {
            success: false,
            reason:
                "not_negotiating"
        };
    }
    if (
        safeNumber(
            contract.negotiations?.rounds,
            0
        ) >=
        CONTRACT_CONFIG
            .MAX_NEGOTIATION_ROUNDS
    ) {
        return {
            success: false,
            reason:
                "maximum_rounds"
        };
    }
    const currentShow =
        safeNumber(
            contract.purse?.show,
            0
        );
    const currentWin =
        safeNumber(
            contract.purse?.win,
            0
        );
    const show =
        options.showPurse !==
            undefined
            ? Math.max(
                0,
                safeNumber(
                    options.showPurse
                )
            )
            : currentShow;
    const win =
        options.winBonus !==
            undefined
            ? Math.max(
                0,
                safeNumber(
                    options.winBonus
                )
            )
            : currentWin;
    const counterOffer = {
        showPurse: show,
        winBonus: win,
        fights:
            options.fights !==
                undefined
                ? Math.max(
                    1,
                    Math.floor(
                        safeNumber(
                            options.fights
                        )
                    )
                )
                : contract.fights.total,
        titleShot:
            options.titleShot === true,
        notes:
            options.notes ||
            null
    };
    contract.negotiations.rounds += 1;
    contract.negotiations
        .lastCounterOffer =
        clone(
            counterOffer
        );
    return {
        success: true,
        counterOffer,
        round:
            contract.negotiations
                .rounds
    };
}
// ============================================================
// APPLY COUNTER OFFER
// ============================================================
export function applyCounterOffer(
    contract,
    counterOffer
) {
    if (
        !contract ||
        !counterOffer
    ) {
        return false;
    }
    if (
        counterOffer.showPurse !==
            undefined
    ) {
        contract.purse.show =
            Math.max(
                0,
                safeNumber(
                    counterOffer.showPurse
                )
            );
    }
    if (
        counterOffer.winBonus !==
            undefined
    ) {
        contract.purse.win =
            Math.max(
                0,
                safeNumber(
                    counterOffer.winBonus
                )
            );
    }
    if (
        counterOffer.fights !==
            undefined
    ) {
        const fights =
            clamp(
                Math.floor(
                    safeNumber(
                        counterOffer.fights
                    )
                ),
                CONTRACT_CONFIG
                    .MIN_FIGHTS,
                CONTRACT_CONFIG
                    .MAX_FIGHTS
            );
        contract.fights.total =
            fights;
        contract.fights.remaining =
            Math.max(
                0,
                fights -
                safeNumber(
                    contract.fights.completed
                )
            );
    }
    if (
        counterOffer.titleShot === true
    ) {
        contract.clauses.titleShot =
            true;
    }
    return contract;
}
// ============================================================
// RECORD FIGHT
// ============================================================
export function recordContractFight(
    contract,
    result = {},
    options = {}
) {
    if (
        !contract
    ) {
        return {
            success: false,
            reason:
                "contract_missing"
        };
    }
    if (
        contract.status !==
        CONTRACT_STATUS.ACTIVE
    ) {
        return {
            success: false,
            reason:
                "contract_not_active"
        };
    }
    if (
        safeNumber(
            contract.fights.remaining,
            0
        ) <= 0
    ) {
        return {
            success: false,
            reason:
                "no_fights_remaining"
        };
    }
    const payment =
        calculateFightPayment(
            contract,
            result,
            options
        );
    contract.fights.completed += 1;
    contract.fights.remaining =
        Math.max(
            0,
            safeNumber(
                contract.fights.total
            ) -
            safeNumber(
                contract.fights.completed
            )
        );
    contract.totalEarned +=
        payment.total;
    const fightRecord = {
        fightId:
            options.fightId ||
            null,
        date:
            options.date ||
            nowISO(),
        result:
            result.result ||
            null,
        method:
            result.method ||
            null,
        opponentId:
            result.opponentId ||
            null,
        opponentName:
            result.opponentName ||
            null,
        titleFight:
            result.titleFight === true,
        payment:
            payment.total,
        breakdown:
            clone(
                payment.breakdown
            )
    };
    contract.fightHistory.push(
        fightRecord
    );
    if (
        contract.fights.remaining <= 0
    ) {
        contract.status =
            CONTRACT_STATUS.COMPLETED;
        contract.dates.completedAt =
            options.date ||
            nowISO();
    }
    return {
        success: true,
        payment,
        fightRecord,
        completed:
            contract.status ===
            CONTRACT_STATUS.COMPLETED,
        contract
    };
}
// ============================================================
// RENEW CONTRACT
// ============================================================
export function createRenewalContract(
    contract,
    options = {}
) {
    if (
        !contract
    ) {
        return null;
    }
    return createContract({
        ...clone(contract),
        id:
            null,
        type:
            CONTRACT_TYPES.RENEWAL,
        status:
            CONTRACT_STATUS.OFFERED,
        fights:
            options.fights ??
            CONTRACT_CONFIG
                .DEFAULT_FIGHTS,
        completedFights:
            0,
        showPurse:
            options.showPurse ??
            contract.purse?.show,
        winBonus:
            options.winBonus ??
            contract.purse?.win,
        performanceBonus:
            options.performanceBonus ??
            contract.purse?.performance,
        titleBonus:
            options.titleBonus ??
            contract.purse?.title,
        dates: {
            offeredAt:
                options.offeredAt ||
                nowISO()
        },
        fightHistory: [],
        totalEarned: 0
    });
}
// ============================================================
// TERMINATE CONTRACT
// ============================================================
export function terminateContract(
    contract,
    reason =
        TERMINATION_REASONS.MUTUAL,
    options = {}
) {
    if (
        !contract
    ) {
        return {
            success: false,
            reason:
                "contract_missing"
        };
    }
    if (
        contract.status !==
            CONTRACT_STATUS.ACTIVE &&
        contract.status !==
            CONTRACT_STATUS.NEGOTIATING &&
        contract.status !==
            CONTRACT_STATUS.OFFERED
    ) {
        return {
            success: false,
            reason:
                "invalid_status"
        };
    }
    contract.status =
        CONTRACT_STATUS.TERMINATED;
    contract.dates.terminatedAt =
        options.date ||
        nowISO();
    contract.notes.push(
        `Terminated: ${reason}`
    );
    return {
        success: true,
        reason,
        fee:
            safeNumber(
                contract.clauses
                    ?.terminationFee,
                0
            ),
        contract
    };
}
// ============================================================
// EXPIRE CONTRACT
// ============================================================
export function expireContract(
    contract,
    options = {}
) {
    if (
        !contract
    ) {
        return false;
    }
    if (
        contract.status ===
        CONTRACT_STATUS.COMPLETED
    ) {
        return false;
    }
    contract.status =
        CONTRACT_STATUS.EXPIRED;
    contract.dates.completedAt =
        options.date ||
        nowISO();
    return true;
}
// ============================================================
// CONTRACT STATUS HELPERS
// ============================================================
export function isContractActive(
    contract
) {
    return (
        !!contract &&
        contract.status ===
            CONTRACT_STATUS.ACTIVE
    );
}
export function isContractFinished(
    contract
) {
    if (
        !contract
    ) {
        return false;
    }
    return [
        CONTRACT_STATUS.COMPLETED,
        CONTRACT_STATUS.EXPIRED,
        CONTRACT_STATUS.TERMINATED,
        CONTRACT_STATUS.CANCELLED
    ].includes(
        contract.status
    );
}
export function getRemainingFights(
    contract
) {
    return Math.max(
        0,
        safeNumber(
            contract?.fights
                ?.remaining,
            0
        )
    );
}
// ============================================================
// PLAYER CONTRACT MANAGEMENT
// ============================================================
function ensurePlayerContracts(
    player
) {
    if (
        !player
    ) {
        return null;
    }
    if (
        !player.business
    ) {
        player.business = {};
    }
    if (
        !Array.isArray(
            player.business.contracts
        )
    ) {
        player.business.contracts = [];
    }
    return player.business.contracts;
}
export function addContractToPlayer(
    player,
    contract
) {
    const contracts =
        ensurePlayerContracts(
            player
        );
    if (
        !contracts ||
        !contract
    ) {
        return false;
    }
    contracts.push(
        clone(
            contract
        )
    );
    return true;
}
export function getPlayerContracts(
    player,
    options = {}
) {
    const contracts =
        ensurePlayerContracts(
            player
        );
    if (
        !contracts
    ) {
        return [];
    }
    if (
        options.activeOnly
    ) {
        return contracts.filter(
            contract =>
                contract.status ===
                CONTRACT_STATUS.ACTIVE
        );
    }
    if (
        options.promotionId
    ) {
        return contracts.filter(
            contract =>
                contract.promotionId ===
                options.promotionId
        );
    }
    return contracts;
}
export function getActivePlayerContract(
    player,
    promotionId = null
) {
    const contracts =
        getPlayerContracts(
            player,
            {
                activeOnly: true
            }
        );
    if (
        promotionId
    ) {
        return (
            contracts.find(
                contract =>
                    contract.promotionId ===
                    promotionId
            ) ||
            null
        );
    }
    return contracts[0] || null;
}
// ============================================================
// PLAYER FINANCE SYNC
// ============================================================
export function applyContractPaymentToPlayer(
    player,
    payment,
    options = {}
) {
    if (
        !player
    ) {
        return false;
    }
    const amount =
        safeNumber(
            payment,
            0
        );
    if (
        !player.business
    ) {
        player.business = {};
    }
    if (
        !player.business.finances
    ) {
        player.business.finances = {
            cash: 0,
            careerEarnings: 0,
            expenses: 0,
            assets: []
        };
    }
    player.business.finances.cash =
        safeNumber(
            player.business.finances.cash,
            0
        ) + amount;
    player.business.finances
        .careerEarnings =
        safeNumber(
            player.business.finances
                .careerEarnings,
            0
        ) + amount;
    if (
        !player.business.income
    ) {
        player.business.income = 0;
    }
    player.business.income =
        safeNumber(
            player.business.income,
            0
        ) + amount;
    return true;
}
// ============================================================
// CONTRACT SEARCH
// ============================================================
export function findContract(
    contracts,
    contractId
) {
    if (
        !Array.isArray(
            contracts
        )
    ) {
        return null;
    }
    return (
        contracts.find(
            contract =>
                contract.id ===
                contractId
        ) ||
        null
    );
}
// ============================================================
// CONTRACT FILTER
// ============================================================
export function filterContracts(
    contracts,
    filters = {}
) {
    if (
        !Array.isArray(
            contracts
        )
    ) {
        return [];
    }
    return contracts.filter(
        contract => {
            if (
                filters.status &&
                contract.status !==
                    filters.status
            ) {
                return false;
            }
            if (
                filters.promotionId &&
                contract.promotionId !==
                    filters.promotionId
            ) {
                return false;
            }
            if (
                filters.fighterId &&
                contract.fighterId !==
                    filters.fighterId
            ) {
                return false;
            }
            if (
                filters.type &&
                contract.type !==
                    filters.type
            ) {
                return false;
            }
            return true;
        }
    );
}
// ============================================================
// CONTRACT SUMMARY
// ============================================================
export function getContractSummary(
    contract
) {
    if (
        !contract
    ) {
        return null;
    }
    return {
        id:
            contract.id,
        status:
            contract.status,
        type:
            contract.type,
        fighter:
            contract.fighterName,
        promotion:
            contract.promotionName,
        promotionLevel:
            contract.promotionLevel,
        division:
            contract.division,
        fightsTotal:
            contract.fights?.total || 0,
        fightsCompleted:
            contract.fights?.completed || 0,
        fightsRemaining:
            contract.fights?.remaining || 0,
        showPurse:
            contract.purse?.show || 0,
        winBonus:
            contract.purse?.win || 0,
        performanceBonus:
            contract.purse?.performance || 0,
        titleBonus:
            contract.purse?.title || 0,
        estimatedValue:
            calculateContractValue(
                contract
            ),
        totalEarned:
            safeNumber(
                contract.totalEarned,
                0
            ),
        exclusive:
            contract.exclusive === true
    };
}
// ============================================================
// CONTRACT VALIDATION
// ============================================================
export function validateContract(
    contract
) {
    const errors = [];
    if (
        !contract ||
        typeof contract !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "contract_missing"
            ]
        };
    }
    if (
        !contract.id
    ) {
        errors.push(
            "id_missing"
        );
    }
    if (
        !contract.fighterId
    ) {
        errors.push(
            "fighter_missing"
        );
    }
    if (
        !contract.promotionId
    ) {
        errors.push(
            "promotion_missing"
        );
    }
    if (
        !Object.values(
            CONTRACT_STATUS
        ).includes(
            contract.status
        )
    ) {
        errors.push(
            "invalid_status"
        );
    }
    if (
        safeNumber(
            contract.fights?.total,
            0
        ) < 1
    ) {
        errors.push(
            "invalid_fight_count"
        );
    }
    if (
        safeNumber(
            contract.fights?.completed,
            0
        ) < 0
    ) {
        errors.push(
            "invalid_completed_fights"
        );
    }
    if (
        safeNumber(
            contract.fights?.remaining,
            0
        ) < 0
    ) {
        errors.push(
            "invalid_remaining_fights"
        );
    }
    if (
        safeNumber(
            contract.purse?.show,
            0
        ) < 0
    ) {
        errors.push(
            "invalid_show_purse"
        );
    }
    if (
        safeNumber(
            contract.purse?.win,
            0
        ) < 0
    ) {
        errors.push(
            "invalid_win_bonus"
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
// ============================================================
// CONTRACT DATABASE
// ============================================================
export function createContractDatabase() {
    return {
        version:
            CONTRACTS_VERSION,
        contracts: {},
        order: [],
        history: [],
        lastUpdated:
            null
    };
}
export function addContractToDatabase(
    database,
    contract
) {
    if (
        !database ||
        !contract
    ) {
        return false;
    }
    if (
        !database.contracts
    ) {
        database.contracts = {};
    }
    if (
        !Array.isArray(
            database.order
        )
    ) {
        database.order = [];
    }
    database.contracts[
        contract.id
    ] =
        clone(
            contract
        );
    if (
        !database.order.includes(
            contract.id
        )
    ) {
        database.order.push(
            contract.id
        );
    }
    database.lastUpdated =
        nowISO();
    return true;
}
export function getContractFromDatabase(
    database,
    contractId
) {
    if (
        !database ||
        !database.contracts
    ) {
        return null;
    }
    return (
        database.contracts[
            contractId
        ] ||
        null
    );
}
export function getAllContracts(
    database,
    options = {}
) {
    if (
        !database ||
        !database.contracts
    ) {
        return [];
    }
    let contracts =
        Object.values(
            database.contracts
        );
    if (
        options.status
    ) {
        contracts =
            contracts.filter(
                contract =>
                    contract.status ===
                    options.status
            );
    }
    if (
        options.promotionId
    ) {
        contracts =
            contracts.filter(
                contract =>
                    contract.promotionId ===
                    options.promotionId
            );
    }
    if (
        options.fighterId
    ) {
        contracts =
            contracts.filter(
                contract =>
                    contract.fighterId ===
                    options.fighterId
            );
    }
    return contracts;
}
// ============================================================
// DATABASE VALIDATION
// ============================================================
export function validateContractDatabase(
    database
) {
    const errors = [];
    if (
        !database ||
        typeof database !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "database_missing"
            ]
        };
    }
    if (
        !database.contracts
    ) {
        return {
            valid: false,
            errors: [
                "contracts_missing"
            ]
        };
    }
    for (
        const contract of
            Object.values(
                database.contracts
            )
    ) {
        const result =
            validateContract(
                contract
            );
        if (
            !result.valid
        ) {
            errors.push({
                id:
                    contract.id ||
                    null,
                errors:
                    result.errors
            });
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
export function cloneContract(
    contract
) {
    return clone(
        contract
    );
}
export function cloneContractDatabase(
    database
) {
    return clone(
        database
    );
}
export function snapshotContracts(
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
    CONTRACTS_VERSION,
    CONTRACT_STATUS,
    CONTRACT_TYPES,
    PAYMENT_TYPES,
    TERMINATION_REASONS,
    CONTRACT_CONFIG,
    BASE_PAY_BY_LEVEL,
    createContract,
    calculateFightPayment,
    calculateContractValue,
    acceptContract,
    rejectContract,
    startNegotiation,
    makeCounterOffer,
    applyCounterOffer,
    recordContractFight,
    createRenewalContract,
    terminateContract,
    expireContract,
    isContractActive,
    isContractFinished,
    getRemainingFights,
    addContractToPlayer,
    getPlayerContracts,
    getActivePlayerContract,
    applyContractPaymentToPlayer,
    findContract,
    filterContracts,
    getContractSummary,
    validateContract,
    createContractDatabase,
    addContractToDatabase,
    getContractFromDatabase,
    getAllContracts,
    validateContractDatabase,
    cloneContract,
    cloneContractDatabase,
    snapshotContracts
};
