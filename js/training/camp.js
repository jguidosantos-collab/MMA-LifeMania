/*
============================================================
MMA LIFE DYNASTY
TRAINING CAMP SYSTEM
============================================================
Responsabilidade:
- Criar e gerenciar camps de luta
- Controlar fases da preparação
- Controlar progresso
- Definir foco de treinamento
- Controlar intensidade
- Preparar o atleta para a luta
- Calcular bônus e penalidades do camp
- Integrar futuramente com:
  - training.js
  - recovery.js
  - fatigue.js
  - weightCut.js
  - fightEngine.js
IMPORTANTE:
Este módulo NÃO executa treinos individuais.
Ele administra o CAMP como um todo.
============================================================
*/
const CAMP_PHASES = Object.freeze({
    PREPARATION: "preparation",
    BUILD: "build",
    INTENSIFICATION: "intensification",
    PEAK: "peak",
    TAPER: "taper",
    FIGHT: "fight",
    RECOVERY: "recovery",
    COMPLETED: "completed"
});
const CAMP_PHASE_ORDER = Object.freeze([
    CAMP_PHASES.PREPARATION,
    CAMP_PHASES.BUILD,
    CAMP_PHASES.INTENSIFICATION,
    CAMP_PHASES.PEAK,
    CAMP_PHASES.TAPER,
    CAMP_PHASES.FIGHT,
    CAMP_PHASES.RECOVERY,
    CAMP_PHASES.COMPLETED
]);
const CAMP_STATUS = Object.freeze({
    PLANNED: "planned",
    ACTIVE: "active",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
});
const CAMP_FOCUSES = Object.freeze({
    BALANCED: "balanced",
    STRIKING: "striking",
    WRESTLING: "wrestling",
    GRAPPLING: "grappling",
    CARDIO: "cardio",
    STRENGTH: "strength",
    SPEED: "speed",
    POWER: "power",
    DEFENSE: "defense",
    FIGHT_IQ: "fightIQ",
    GAMEPLAN: "gameplan",
    WEIGHT: "weight",
    RECOVERY: "recovery"
});
const CAMP_INTENSITIES = Object.freeze({
    LOW: "low",
    MODERATE: "moderate",
    HIGH: "high",
    EXTREME: "extreme"
});
const DEFAULT_CAMP = Object.freeze({
    durationWeeks: 8,
    focus: CAMP_FOCUSES.BALANCED,
    intensity: CAMP_INTENSITIES.MODERATE
});
const PHASE_CONFIG = Object.freeze({
    [CAMP_PHASES.PREPARATION]: {
        defaultWeeks: 1,
        maxIntensity: 0.65,
        fatigueMultiplier: 0.60,
        injuryMultiplier: 0.65,
        recoveryMultiplier: 1.00
    },
    [CAMP_PHASES.BUILD]: {
        defaultWeeks: 2,
        maxIntensity: 0.80,
        fatigueMultiplier: 0.85,
        injuryMultiplier: 0.80,
        recoveryMultiplier: 0.90
    },
    [CAMP_PHASES.INTENSIFICATION]: {
        defaultWeeks: 2,
        maxIntensity: 0.95,
        fatigueMultiplier: 1.10,
        injuryMultiplier: 1.10,
        recoveryMultiplier: 0.80
    },
    [CAMP_PHASES.PEAK]: {
        defaultWeeks: 1,
        maxIntensity: 1.00,
        fatigueMultiplier: 1.25,
        injuryMultiplier: 1.25,
        recoveryMultiplier: 0.75
    },
    [CAMP_PHASES.TAPER]: {
        defaultWeeks: 1,
        maxIntensity: 0.60,
        fatigueMultiplier: 0.50,
        injuryMultiplier: 0.55,
        recoveryMultiplier: 1.35
    },
    [CAMP_PHASES.FIGHT]: {
        defaultWeeks: 0,
        maxIntensity: 0.00,
        fatigueMultiplier: 0.00,
        injuryMultiplier: 0.00,
        recoveryMultiplier: 1.50
    },
    [CAMP_PHASES.RECOVERY]: {
        defaultWeeks: 1,
        maxIntensity: 0.20,
        fatigueMultiplier: 0.20,
        injuryMultiplier: 0.20,
        recoveryMultiplier: 1.75
    }
});
/* ============================================================
   UTILITIES
============================================================ */
function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return min;
    }
    return Math.max(min, Math.min(max, number));
}
function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}
function generateCampId() {
    return `camp_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}
function normalizeFocus(focus) {
    if (Object.values(CAMP_FOCUSES).includes(focus)) {
        return focus;
    }
    return CAMP_FOCUSES.BALANCED;
}
function normalizeIntensity(intensity) {
    if (Object.values(CAMP_INTENSITIES).includes(intensity)) {
        return intensity;
    }
    return CAMP_INTENSITIES.MODERATE;
}
function intensityValue(intensity) {
    switch (intensity) {
        case CAMP_INTENSITIES.LOW:
            return 0.40;
        case CAMP_INTENSITIES.MODERATE:
            return 0.60;
        case CAMP_INTENSITIES.HIGH:
            return 0.80;
        case CAMP_INTENSITIES.EXTREME:
            return 1.00;
        default:
            return 0.60;
    }
}
function normalizeDuration(weeks) {
    return clamp(Math.round(safeNumber(weeks, 8)), 3, 20);
}
/* ============================================================
   PHASE GENERATION
============================================================ */
function buildDefaultPhases(durationWeeks = 8) {
    const weeks = normalizeDuration(durationWeeks);
    /*
     Default structure:
     1 week preparation
     2 weeks build
     2 weeks intensification
     1 week peak
     1 week taper
     1 fight
     1 recovery
     Longer camps distribute additional weeks into BUILD
     and INTENSIFICATION.
    */
    let preparation = 1;
    let build = 2;
    let intensification = 2;
    let peak = 1;
    let taper = 1;
    let trainingWeeks =
        weeks -
        preparation -
        build -
        intensification -
        peak -
        taper;
    while (trainingWeeks > 0) {
        if (trainingWeeks >= 2) {
            build += 1;
            trainingWeeks -= 1;
        } else {
            intensification += 1;
            trainingWeeks -= 1;
        }
    }
    return [
        {
            phase: CAMP_PHASES.PREPARATION,
            weeks: preparation
        },
        {
            phase: CAMP_PHASES.BUILD,
            weeks: build
        },
        {
            phase: CAMP_PHASES.INTENSIFICATION,
            weeks: intensification
        },
        {
            phase: CAMP_PHASES.PEAK,
            weeks: peak
        },
        {
            phase: CAMP_PHASES.TAPER,
            weeks: taper
        }
    ];
}
function createPhaseState(phase, weeks) {
    return {
        phase,
        plannedWeeks: Math.max(0, Math.round(weeks)),
        completedWeeks: 0,
        progress: 0,
        started: false,
        completed: false
    };
}
/* ============================================================
   CAMP CREATION
============================================================ */
function createCamp(options = {}) {
    const durationWeeks = normalizeDuration(
        options.durationWeeks ?? DEFAULT_CAMP.durationWeeks
    );
    const focus = normalizeFocus(
        options.focus ?? DEFAULT_CAMP.focus
    );
    const intensity = normalizeIntensity(
        options.intensity ?? DEFAULT_CAMP.intensity
    );
    const phaseDefinitions = buildDefaultPhases(durationWeeks);
    const phases = phaseDefinitions.map(definition =>
        createPhaseState(
            definition.phase,
            definition.weeks
        )
    );
    return {
        id: options.id || generateCampId(),
        status: CAMP_STATUS.PLANNED,
        createdAt:
            options.createdAt ||
            new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        durationWeeks,
        currentWeek: 0,
        currentPhase: CAMP_PHASES.PREPARATION,
        focus,
        intensity,
        phases,
        fight: {
            opponentId: options.opponentId || null,
            opponentName: options.opponentName || null,
            promotionId: options.promotionId || null,
            eventId: options.eventId || null,
            fightType: options.fightType || "Professional",
            weightClass: options.weightClass || null,
            scheduledDate: options.scheduledDate || null,
            rounds: safeNumber(options.rounds, 3),
            titleFight: Boolean(options.titleFight),
            interimTitle: Boolean(options.interimTitle)
        },
        gameplan: {
            prepared: false,
            opponentScouted: false,
            strikingPlan: 0,
            wrestlingPlan: 0,
            grapplingPlan: 0,
            defensePlan: 0,
            cardioPlan: 0,
            strategy: "balanced",
            notes: ""
        },
        weight: {
            startingWeight: safeNumber(
                options.startingWeight,
                0
            ),
            targetWeight: safeNumber(
                options.targetWeight,
                0
            ),
            currentWeight: safeNumber(
                options.startingWeight,
                0
            ),
            fightNightWeight: 0,
            weightCutStarted: false,
            weightCutCompleted: false
        },
        progress: {
            overall: 0,
            technical: 0,
            physical: 0,
            mental: 0,
            tactical: 0,
            conditioning: 0,
            gameplan: 0,
            weightManagement: 0
        },
        load: {
            trainingLoad: 0,
            fatigueGenerated: 0,
            injuryRisk: 0,
            accumulatedFatigue: 0,
            recoveryQuality: 100
        },
        performance: {
            readiness: 0,
            technicalReadiness: 0,
            physicalReadiness: 0,
            mentalReadiness: 0,
            tacticalReadiness: 0,
            peakReached: false,
            peakedEarly: false,
            overtrained: false
        },
        notes: [],
        history: []
    };
}
/* ============================================================
   CAMP STATUS
============================================================ */
function startCamp(camp, date = null) {
    if (!camp) {
        return null;
    }
    if (camp.status === CAMP_STATUS.COMPLETED) {
        return camp;
    }
    if (camp.status === CAMP_STATUS.CANCELLED) {
        return camp;
    }
    camp.status = CAMP_STATUS.ACTIVE;
    camp.startedAt =
        camp.startedAt ||
        date ||
        new Date().toISOString();
    if (
        !camp.currentPhase ||
        camp.currentPhase === CAMP_PHASES.COMPLETED
    ) {
        camp.currentPhase = CAMP_PHASES.PREPARATION;
    }
    const phase = getCurrentPhase(camp);
    if (phase) {
        phase.started = true;
    }
    addCampHistory(
        camp,
        "camp_started",
        {
            phase: camp.currentPhase,
            week: camp.currentWeek
        }
    );
    return camp;
}
function cancelCamp(camp, reason = "") {
    if (!camp) {
        return null;
    }
    camp.status = CAMP_STATUS.CANCELLED;
    addCampHistory(
        camp,
        "camp_cancelled",
        {
            reason
        }
    );
    return camp;
}
function completeCamp(camp, date = null) {
    if (!camp) {
        return null;
    }
    camp.status = CAMP_STATUS.COMPLETED;
    camp.currentPhase = CAMP_PHASES.COMPLETED;
    camp.completedAt =
        date ||
        new Date().toISOString();
    camp.progress.overall = 100;
    camp.performance.readiness =
        calculateReadiness(camp);
    addCampHistory(
        camp,
        "camp_completed",
        {
            readiness: camp.performance.readiness
        }
    );
    return camp;
}
/* ============================================================
   PHASE MANAGEMENT
============================================================ */
function getCurrentPhase(camp) {
    if (!camp || !Array.isArray(camp.phases)) {
        return null;
    }
    return (
        camp.phases.find(
            phase =>
                phase.phase === camp.currentPhase
        ) || null
    );
}
function getPhase(camp, phaseName) {
    if (!camp || !Array.isArray(camp.phases)) {
        return null;
    }
    return camp.phases.find(
        phase =>
            phase.phase === phaseName
    ) || null;
}
function getPhaseIndex(camp) {
    if (!camp) {
        return -1;
    }
    return CAMP_PHASE_ORDER.indexOf(
        camp.currentPhase
    );
}
function advancePhase(camp) {
    if (!camp) {
        return null;
    }
    const current = getCurrentPhase(camp);
    if (current) {
        current.completed = true;
        current.progress = 100;
    }
    const currentIndex = getPhaseIndex(camp);
    /*
     * After taper, the next phase is FIGHT.
     */
    if (
        currentIndex < 0 ||
        currentIndex >= CAMP_PHASE_ORDER.length - 2
    ) {
        camp.currentPhase = CAMP_PHASES.FIGHT;
        addCampHistory(
            camp,
            "phase_advanced",
            {
                phase: camp.currentPhase
            }
        );
        return camp;
    }
    camp.currentPhase =
        CAMP_PHASE_ORDER[currentIndex + 1];
    const next = getCurrentPhase(camp);
    if (next) {
        next.started = true;
    }
    addCampHistory(
        camp,
        "phase_advanced",
        {
            phase: camp.currentPhase
        }
    );
    return camp;
}
function processPhaseWeek(camp) {
    if (!camp || camp.status !== CAMP_STATUS.ACTIVE) {
        return camp;
    }
    const phase = getCurrentPhase(camp);
    if (!phase) {
        return camp;
    }
    phase.started = true;
    phase.completedWeeks += 1;
    phase.progress = clamp(
        (
            phase.completedWeeks /
            Math.max(1, phase.plannedWeeks)
        ) * 100,
        0,
        100
    );
    if (
        phase.completedWeeks >=
        phase.plannedWeeks
    ) {
        advancePhase(camp);
    }
    return camp;
}
/* ============================================================
   WEEK PROCESSING
============================================================ */
function advanceCampWeek(camp) {
    if (!camp) {
        return null;
    }
    if (camp.status === CAMP_STATUS.PLANNED) {
        startCamp(camp);
    }
    if (camp.status !== CAMP_STATUS.ACTIVE) {
        return camp;
    }
    /*
     * Once the planned training duration is reached,
     * move into fight week.
     */
    if (
        camp.currentWeek <
        camp.durationWeeks
    ) {
        camp.currentWeek += 1;
    }
    processPhaseWeek(camp);
    updateCampProgress(camp);
    updateCampLoad(camp);
    updateCampReadiness(camp);
    /*
     * Fight week.
     */
    if (
        camp.currentWeek >=
        camp.durationWeeks &&
        camp.currentPhase !== CAMP_PHASES.FIGHT
    ) {
        camp.currentPhase = CAMP_PHASES.FIGHT;
        addCampHistory(
            camp,
            "fight_week_started",
            {
                week: camp.currentWeek
            }
        );
    }
    return camp;
}
/* ============================================================
   PROGRESS
============================================================ */
function getFocusWeights(focus) {
    const weights = {
        technical: 0.20,
        physical: 0.20,
        mental: 0.15,
        tactical: 0.15,
        conditioning: 0.20,
        gameplan: 0.10
    };
    switch (focus) {
        case CAMP_FOCUSES.STRIKING:
            weights.technical = 0.35;
            weights.tactical = 0.20;
            weights.gameplan = 0.15;
            weights.physical = 0.10;
            weights.conditioning = 0.15;
            weights.mental = 0.05;
            break;
        case CAMP_FOCUSES.WRESTLING:
        case CAMP_FOCUSES.GRAPPLING:
            weights.technical = 0.35;
            weights.tactical = 0.20;
            weights.physical = 0.15;
            weights.conditioning = 0.15;
            weights.gameplan = 0.10;
            weights.mental = 0.05;
            break;
        case CAMP_FOCUSES.CARDIO:
            weights.conditioning = 0.45;
            weights.physical = 0.25;
            weights.technical = 0.10;
            weights.tactical = 0.10;
            weights.mental = 0.05;
            weights.gameplan = 0.05;
            break;
        case CAMP_FOCUSES.STRENGTH:
        case CAMP_FOCUSES.POWER:
            weights.physical = 0.45;
            weights.technical = 0.15;
            weights.conditioning = 0.15;
            weights.tactical = 0.10;
            weights.mental = 0.05;
            weights.gameplan = 0.10;
            break;
        case CAMP_FOCUSES.SPEED:
            weights.physical = 0.30;
            weights.technical = 0.30;
            weights.conditioning = 0.15;
            weights.tactical = 0.10;
            weights.mental = 0.05;
            weights.gameplan = 0.10;
            break;
        case CAMP_FOCUSES.DEFENSE:
            weights.technical = 0.25;
            weights.tactical = 0.25;
            weights.mental = 0.15;
            weights.conditioning = 0.15;
            weights.physical = 0.10;
            weights.gameplan = 0.10;
            break;
        case CAMP_FOCUSES.FIGHT_IQ:
        case CAMP_FOCUSES.GAMEPLAN:
            weights.tactical = 0.35;
            weights.mental = 0.20;
            weights.gameplan = 0.25;
            weights.technical = 0.10;
            weights.conditioning = 0.05;
            weights.physical = 0.05;
            break;
        case CAMP_FOCUSES.WEIGHT:
            weights.conditioning = 0.35;
            weights.physical = 0.20;
            weights.mental = 0.15;
            weights.tactical = 0.10;
            weights.technical = 0.10;
            weights.gameplan = 0.10;
            break;
        case CAMP_FOCUSES.RECOVERY:
            weights.mental = 0.25;
            weights.conditioning = 0.25;
            weights.physical = 0.25;
            weights.technical = 0.10;
            weights.tactical = 0.10;
            weights.gameplan = 0.05;
            break;
        default:
            break;
    }
    return weights;
}
function calculateWeeklyProgress(camp) {
    if (!camp) {
        return 0;
    }
    const intensity = intensityValue(
        camp.intensity
    );
    const phase = getCurrentPhase(camp);
    if (!phase) {
        return 0;
    }
    const config =
        PHASE_CONFIG[phase.phase] ||
        PHASE_CONFIG[CAMP_PHASES.BUILD];
    const phaseMultiplier =
        config.maxIntensity || 0.75;
    const fatiguePenalty =
        clamp(
            1 -
            (
                safeNumber(
                    camp.load.accumulatedFatigue,
                    0
                ) / 200
            ),
            0.50,
            1
        );
    const base =
        8 *
        intensity *
        phaseMultiplier *
        fatiguePenalty;
    return clamp(base, 0, 10);
}
function updateCampProgress(camp) {
    if (!camp) {
        return null;
    }
    const weeklyGain =
        calculateWeeklyProgress(camp);
    const weights =
        getFocusWeights(camp.focus);
    camp.progress.technical =
        clamp(
            camp.progress.technical +
            weeklyGain * weights.technical,
            0,
            100
        );
    camp.progress.physical =
        clamp(
            camp.progress.physical +
            weeklyGain * weights.physical,
            0,
            100
        );
    camp.progress.mental =
        clamp(
            camp.progress.mental +
            weeklyGain * weights.mental,
            0,
            100
        );
    camp.progress.tactical =
        clamp(
            camp.progress.tactical +
            weeklyGain * weights.tactical,
            0,
            100
        );
    camp.progress.conditioning =
        clamp(
            camp.progress.conditioning +
            weeklyGain * weights.conditioning,
            0,
            100
        );
    camp.progress.gameplan =
        clamp(
            camp.progress.gameplan +
            weeklyGain * weights.gameplan,
            0,
            100
        );
    camp.progress.overall =
        calculateOverallProgress(
            camp.progress
        );
    return camp;
}
function calculateOverallProgress(progress) {
    if (!progress) {
        return 0;
    }
    const values = [
        progress.technical,
        progress.physical,
        progress.mental,
        progress.tactical,
        progress.conditioning,
        progress.gameplan
    ];
    const total =
        values.reduce(
            (sum, value) =>
                sum + safeNumber(value),
            0
        );
    return clamp(
        total / values.length,
        0,
        100
    );
}
/* ============================================================
   TRAINING LOAD / FATIGUE / RISK
============================================================ */
function updateCampLoad(camp) {
    if (!camp) {
        return null;
    }
    const phase = getCurrentPhase(camp);
    if (!phase) {
        return camp;
    }
    const config =
        PHASE_CONFIG[phase.phase] ||
        PHASE_CONFIG[CAMP_PHASES.BUILD];
    const intensity =
        intensityValue(camp.intensity);
    const weeklyLoad =
        10 *
        intensity *
        config.fatigueMultiplier;
    camp.load.trainingLoad += weeklyLoad;
    camp.load.fatigueGenerated =
        weeklyLoad;
    camp.load.accumulatedFatigue =
        clamp(
            camp.load.accumulatedFatigue +
            (
                weeklyLoad *
                0.55
            ),
            0,
            100
        );
    camp.load.recoveryQuality =
        clamp(
            100 -
            (
                camp.load.accumulatedFatigue *
                0.65
            ),
            0,
            100
        );
    camp.load.injuryRisk =
        calculateCampInjuryRisk(camp);
    return camp;
}
function calculateCampInjuryRisk(camp) {
    if (!camp) {
        return 0;
    }
    const phase = getCurrentPhase(camp);
    if (!phase) {
        return 0;
    }
    const config =
        PHASE_CONFIG[phase.phase] ||
        PHASE_CONFIG[CAMP_PHASES.BUILD];
    const intensity =
        intensityValue(camp.intensity);
    const fatigue =
        clamp(
            camp.load.accumulatedFatigue /
            100,
            0,
            1
        );
    const baseRisk =
        0.01 +
        (
            intensity *
            0.035
        );
    const phaseRisk =
        safeNumber(
            config.injuryMultiplier,
            1
        );
    const fatigueRisk =
        1 +
        fatigue;
    return clamp(
        baseRisk *
        phaseRisk *
        fatigueRisk,
        0,
        0.30
    );
}
/* ============================================================
   READINESS
============================================================ */
function calculateReadiness(camp) {
    if (!camp) {
        return 0;
    }
    const progress =
        camp.progress || {};
    const base =
        (
            safeNumber(progress.technical) +
            safeNumber(progress.physical) +
            safeNumber(progress.mental) +
            safeNumber(progress.tactical) +
            safeNumber(progress.conditioning) +
            safeNumber(progress.gameplan)
        ) / 6;
    const recovery =
        safeNumber(
            camp.load.recoveryQuality,
            100
        );
    const fatiguePenalty =
        Math.max(
            0,
            (
                100 -
                recovery
            ) * 0.35
        );
    const overtrainingPenalty =
        camp.performance.overtrained
            ? 10
            : 0;
    return clamp(
        base -
        fatiguePenalty -
        overtrainingPenalty,
        0,
        100
    );
}
function updateCampReadiness(camp) {
    if (!camp) {
        return null;
    }
    const readiness =
        calculateReadiness(camp);
    camp.performance.readiness =
        readiness;
    camp.performance.technicalReadiness =
        camp.progress.technical;
    camp.performance.physicalReadiness =
        camp.progress.physical;
    camp.performance.mentalReadiness =
        camp.progress.mental;
    camp.performance.tacticalReadiness =
        camp.progress.tactical;
    /*
     * Peak detection.
     */
    if (
        camp.currentPhase === CAMP_PHASES.PEAK
    ) {
        camp.performance.peakReached =
            readiness >= 75;
    }
    /*
     * Excessive fatigue can cause
     * overtraining.
     */
    camp.performance.overtrained =
        camp.load.accumulatedFatigue >= 85;
    return camp;
}
/* ============================================================
   CAMP MODIFIERS
============================================================ */
function getCampModifiers(camp) {
    if (!camp) {
        return {
            striking: 1,
            grappling: 1,
            wrestling: 1,
            cardio: 1,
            strength: 1,
            speed: 1,
            defense: 1,
            fightIQ: 1,
            recovery: 1,
            injuryRisk: 1
        };
    }
    const modifiers = {
        striking: 1,
        grappling: 1,
        wrestling: 1,
        cardio: 1,
        strength: 1,
        speed: 1,
        defense: 1,
        fightIQ: 1,
        recovery: 1,
        injuryRisk: 1
    };
    const focusBonus = 0.12;
    switch (camp.focus) {
        case CAMP_FOCUSES.STRIKING:
            modifiers.striking += focusBonus;
            break;
        case CAMP_FOCUSES.WRESTLING:
            modifiers.wrestling += focusBonus;
            break;
        case CAMP_FOCUSES.GRAPPLING:
            modifiers.grappling += focusBonus;
            break;
        case CAMP_FOCUSES.CARDIO:
            modifiers.cardio += focusBonus;
            break;
        case CAMP_FOCUSES.STRENGTH:
        case CAMP_FOCUSES.POWER:
            modifiers.strength += focusBonus;
            break;
        case CAMP_FOCUSES.SPEED:
            modifiers.speed += focusBonus;
            break;
        case CAMP_FOCUSES.DEFENSE:
            modifiers.defense += focusBonus;
            break;
        case CAMP_FOCUSES.FIGHT_IQ:
        case CAMP_FOCUSES.GAMEPLAN:
            modifiers.fightIQ += focusBonus;
            break;
        case CAMP_FOCUSES.RECOVERY:
            modifiers.recovery += 0.20;
            break;
        default:
            break;
    }
    /*
     * Fatigue affects all performance.
     */
    const fatigue =
        clamp(
            camp.load.accumulatedFatigue /
            100,
            0,
            1
        );
    const fatiguePenalty =
        fatigue * 0.15;
    modifiers.striking -= fatiguePenalty;
    modifiers.grappling -= fatiguePenalty;
    modifiers.wrestling -= fatiguePenalty;
    modifiers.cardio -= fatiguePenalty;
    modifiers.strength -= fatiguePenalty;
    modifiers.speed -= fatiguePenalty;
    modifiers.defense -= fatiguePenalty;
    modifiers.fightIQ -= fatiguePenalty;
    /*
     * Recovery quality affects injury risk.
     */
    modifiers.injuryRisk =
        1 +
        (
            fatigue * 0.50
        );
    return modifiers;
}
/* ============================================================
   GAMEPLAN
============================================================ */
function updateGameplan(
    camp,
    plan = {}
) {
    if (!camp) {
        return null;
    }
    camp.gameplan.strikingPlan =
        clamp(
            safeNumber(
                plan.strikingPlan,
                camp.gameplan.strikingPlan
            ),
            0,
            100
        );
    camp.gameplan.wrestlingPlan =
        clamp(
            safeNumber(
                plan.wrestlingPlan,
                camp.gameplan.wrestlingPlan
            ),
            0,
            100
        );
    camp.gameplan.grapplingPlan =
        clamp(
            safeNumber(
                plan.grapplingPlan,
                camp.gameplan.grapplingPlan
            ),
            0,
            100
        );
    camp.gameplan.defensePlan =
        clamp(
            safeNumber(
                plan.defensePlan,
                camp.gameplan.defensePlan
            ),
            0,
            100
        );
    camp.gameplan.cardioPlan =
        clamp(
            safeNumber(
                plan.cardioPlan,
                camp.gameplan.cardioPlan
            ),
            0,
            100
        );
    if (plan.strategy) {
        camp.gameplan.strategy =
            String(plan.strategy);
    }
    if (
        Object.prototype.hasOwnProperty.call(
            plan,
            "prepared"
        )
    ) {
        camp.gameplan.prepared =
            Boolean(plan.prepared);
    }
    if (
        Object.prototype.hasOwnProperty.call(
            plan,
            "opponentScouted"
        )
    ) {
        camp.gameplan.opponentScouted =
            Boolean(plan.opponentScouted);
    }
    if (plan.notes !== undefined) {
        camp.gameplan.notes =
            String(plan.notes);
    }
    camp.progress.gameplan =
        clamp(
            (
                camp.gameplan.strikingPlan +
                camp.gameplan.wrestlingPlan +
                camp.gameplan.grapplingPlan +
                camp.gameplan.defensePlan +
                camp.gameplan.cardioPlan
            ) / 5,
            0,
            100
        );
    updateCampReadiness(camp);
    return camp;
}
/* ============================================================
   FIGHT SETUP
============================================================ */
function setCampFight(camp, fight = {}) {
    if (!camp) {
        return null;
    }
    camp.fight = {
        ...camp.fight,
        opponentId:
            fight.opponentId ??
            camp.fight.opponentId,
        opponentName:
            fight.opponentName ??
            camp.fight.opponentName,
        promotionId:
            fight.promotionId ??
            camp.fight.promotionId,
        eventId:
            fight.eventId ??
            camp.fight.eventId,
        fightType:
            fight.fightType ??
            camp.fight.fightType,
        weightClass:
            fight.weightClass ??
            camp.fight.weightClass,
        scheduledDate:
            fight.scheduledDate ??
            camp.fight.scheduledDate,
        rounds:
            safeNumber(
                fight.rounds,
                camp.fight.rounds
            ),
        titleFight:
            fight.titleFight !== undefined
                ? Boolean(fight.titleFight)
                : camp.fight.titleFight,
        interimTitle:
            fight.interimTitle !== undefined
                ? Boolean(fight.interimTitle)
                : camp.fight.interimTitle
    };
    return camp;
}
/* ============================================================
   WEIGHT
============================================================ */
function setCampWeight(
    camp,
    startingWeight,
    targetWeight
) {
    if (!camp) {
        return null;
    }
    camp.weight.startingWeight =
        Math.max(
            0,
            safeNumber(startingWeight)
        );
    camp.weight.currentWeight =
        camp.weight.startingWeight;
    camp.weight.targetWeight =
        Math.max(
            0,
            safeNumber(targetWeight)
        );
    return camp;
}
function updateCampWeight(
    camp,
    currentWeight
) {
    if (!camp) {
        return null;
    }
    camp.weight.currentWeight =
        Math.max(
            0,
            safeNumber(
                currentWeight,
                camp.weight.currentWeight
            )
        );
    if (
        camp.weight.targetWeight > 0
    ) {
        const starting =
            camp.weight.startingWeight;
        const target =
            camp.weight.targetWeight;
        const current =
            camp.weight.currentWeight;
        const totalDistance =
            Math.abs(
                starting - target
            );
        const currentDistance =
            Math.abs(
                current - target
            );
        camp.progress.weightManagement =
            totalDistance <= 0
                ? 100
                : clamp(
                    (
                        1 -
                        (
                            currentDistance /
                            totalDistance
                        )
                    ) * 100,
                    0,
                    100
                );
    }
    return camp;
}
/* ============================================================
   PEAK / TAPER
============================================================ */
function isFightWeek(camp) {
    return Boolean(
        camp &&
        (
            camp.currentPhase ===
            CAMP_PHASES.FIGHT
        )
    );
}
function isPeakWeek(camp) {
    return Boolean(
        camp &&
        (
            camp.currentPhase ===
            CAMP_PHASES.PEAK
        )
    );
}
function isTaperWeek(camp) {
    return Boolean(
        camp &&
        (
            camp.currentPhase ===
            CAMP_PHASES.TAPER
        )
    );
}
function getPeakModifier(camp) {
    if (!camp) {
        return 1;
    }
    if (camp.currentPhase === CAMP_PHASES.PEAK) {
        return 1.08;
    }
    if (camp.currentPhase === CAMP_PHASES.TAPER) {
        return 1.05;
    }
    if (camp.currentPhase === CAMP_PHASES.FIGHT) {
        return 1.10;
    }
    return 1;
}
/* ============================================================
   CAMP HEALTH CHECK
============================================================ */
function getCampCondition(camp) {
    if (!camp) {
        return "unknown";
    }
    const fatigue =
        camp.load.accumulatedFatigue;
    const readiness =
        camp.performance.readiness;
    if (fatigue >= 90) {
        return "overtrained";
    }
    if (fatigue >= 75) {
        return "exhausted";
    }
    if (readiness >= 85 && fatigue <= 50) {
        return "excellent";
    }
    if (readiness >= 70) {
        return "good";
    }
    if (readiness >= 50) {
        return "adequate";
    }
    return "poor";
}
function getCampSummary(camp) {
    if (!camp) {
        return null;
    }
    return {
        id: camp.id,
        status: camp.status,
        week: camp.currentWeek,
        durationWeeks: camp.durationWeeks,
        phase: camp.currentPhase,
        focus: camp.focus,
        intensity: camp.intensity,
        progress: Math.round(
            camp.progress.overall
        ),
        readiness: Math.round(
            camp.performance.readiness
        ),
        fatigue: Math.round(
            camp.load.accumulatedFatigue
        ),
        injuryRisk: Number(
            camp.load.injuryRisk.toFixed(3)
        ),
        condition:
            getCampCondition(camp),
        opponent:
            camp.fight.opponentName,
        weightClass:
            camp.fight.weightClass
    };
}
/* ============================================================
   HISTORY
============================================================ */
function addCampHistory(
    camp,
    type,
    data = {}
) {
    if (!camp) {
        return null;
    }
    if (!Array.isArray(camp.history)) {
        camp.history = [];
    }
    camp.history.push({
        id: `camp_history_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 7)}`,
        type,
        timestamp:
            new Date().toISOString(),
        week: camp.currentWeek,
        phase: camp.currentPhase,
        data: {
            ...data
        }
    });
    return camp;
}
function getCampHistory(
    camp,
    type = null
) {
    if (
        !camp ||
        !Array.isArray(camp.history)
    ) {
        return [];
    }
    if (!type) {
        return [
            ...camp.history
        ];
    }
    return camp.history.filter(
        entry =>
            entry.type === type
    );
}
/* ============================================================
   VALIDATION
============================================================ */
function validateCamp(camp) {
    const errors = [];
    if (!camp || typeof camp !== "object") {
        return {
            valid: false,
            errors: ["Camp inválido."]
        };
    }
    if (!camp.id) {
        errors.push(
            "Camp sem ID."
        );
    }
    if (
        !Object.values(CAMP_STATUS)
            .includes(camp.status)
    ) {
        errors.push(
            "Status de camp inválido."
        );
    }
    if (
        !Object.values(CAMP_PHASES)
            .includes(camp.currentPhase)
    ) {
        errors.push(
            "Fase de camp inválida."
        );
    }
    if (
        !Object.values(CAMP_FOCUSES)
            .includes(camp.focus)
    ) {
        errors.push(
            "Foco de camp inválido."
        );
    }
    if (
        !Object.values(CAMP_INTENSITIES)
            .includes(camp.intensity)
    ) {
        errors.push(
            "Intensidade de camp inválida."
        );
    }
    if (
        !Number.isFinite(
            Number(camp.durationWeeks)
        ) ||
        camp.durationWeeks < 3
    ) {
        errors.push(
            "Duração do camp inválida."
        );
    }
    if (
        !Array.isArray(camp.phases)
    ) {
        errors.push(
            "Fases do camp ausentes."
        );
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
/* ============================================================
   CLONE
============================================================ */
function cloneCamp(camp) {
    if (!camp) {
        return null;
    }
    return JSON.parse(
        JSON.stringify(camp)
    );
}
/* ============================================================
   FACTORY HELPERS
============================================================ */
function createFightCamp(options = {}) {
    return createCamp({
        ...options,
        focus:
            options.focus ||
            CAMP_FOCUSES.BALANCED
    });
}
function createStrikingCamp(options = {}) {
    return createCamp({
        ...options,
        focus: CAMP_FOCUSES.STRIKING
    });
}
function createWrestlingCamp(options = {}) {
    return createCamp({
        ...options,
        focus: CAMP_FOCUSES.WRESTLING
    });
}
function createGrapplingCamp(options = {}) {
    return createCamp({
        ...options,
        focus: CAMP_FOCUSES.GRAPPLING
    });
}
function createConditioningCamp(options = {}) {
    return createCamp({
        ...options,
        focus: CAMP_FOCUSES.CARDIO
    });
}
/* ============================================================
   DEFAULT EXPORT
============================================================ */
export {
    CAMP_PHASES,
    CAMP_PHASE_ORDER,
    CAMP_STATUS,
    CAMP_FOCUSES,
    CAMP_INTENSITIES,
    DEFAULT_CAMP,
    PHASE_CONFIG,
    createCamp,
    createFightCamp,
    createStrikingCamp,
    createWrestlingCamp,
    createGrapplingCamp,
    createConditioningCamp,
    startCamp,
    cancelCamp,
    completeCamp,
    getCurrentPhase,
    getPhase,
    getPhaseIndex,
    advancePhase,
    processPhaseWeek,
    advanceCampWeek,
    calculateWeeklyProgress,
    updateCampProgress,
    calculateOverallProgress,
    updateCampLoad,
    calculateCampInjuryRisk,
    calculateReadiness,
    updateCampReadiness,
    getCampModifiers,
    updateGameplan,
    setCampFight,
    setCampWeight,
    updateCampWeight,
    isFightWeek,
    isPeakWeek,
    isTaperWeek,
    getPeakModifier,
    getCampCondition,
    getCampSummary,
    addCampHistory,
    getCampHistory,
    validateCamp,
    cloneCamp
};
export default {
    CAMP_PHASES,
    CAMP_PHASE_ORDER,
    CAMP_STATUS,
    CAMP_FOCUSES,
    CAMP_INTENSITIES,
    DEFAULT_CAMP,
    PHASE_CONFIG,
    createCamp,
    createFightCamp,
    createStrikingCamp,
    createWrestlingCamp,
    createGrapplingCamp,
    createConditioningCamp,
    startCamp,
    cancelCamp,
    completeCamp,
    getCurrentPhase,
    getPhase,
    getPhaseIndex,
    advancePhase,
    processPhaseWeek,
    advanceCampWeek,
    calculateWeeklyProgress,
    updateCampProgress,
    calculateOverallProgress,
    updateCampLoad,
    calculateCampInjuryRisk,
    calculateReadiness,
    updateCampReadiness,
    getCampModifiers,
    updateGameplan,
    setCampFight,
    setCampWeight,
    updateCampWeight,
    isFightWeek,
    isPeakWeek,
    isTaperWeek,
    getPeakModifier,
    getCampCondition,
    getCampSummary,
    addCampHistory,
    getCampHistory,
    validateCamp,
    cloneCamp
};
