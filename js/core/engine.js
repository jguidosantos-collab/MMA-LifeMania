/**
 * ============================================================
 * MMA LIFE DYNASTY
 * CORE — ENGINE
 * ============================================================
 *
 * O ENGINE é o maestro da simulação.
 *
 * Ele coordena:
 * - STATE
 * - CLOCK
 * - CALENDAR
 * - EVENTS
 * - SAVE
 *
 * IMPORTANTE:
 * O Engine NÃO deve conter regras específicas de:
 * - MMA
 * - treinamento
 * - carreira
 * - negócios
 * - relacionamentos
 * - dynasty
 *
 * Esses sistemas serão registrados como módulos separados.
 * ============================================================
 */

import {
    createEmptyGameState,
    normalizeGameState,
    validateGameState
} from "./state.js";

import {
    initializeClock,
    advanceWeek,
    getTimeInfo
} from "./clock.js";

import {
    getCurrentWeekEvents,
    getEventsForCurrentDate
} from "./calendar.js";

import {
    EVENT_TYPES,
    emitEvent,
    processEvent
} from "./events.js";

import {
    saveGame,
    loadGame,
    startAutosave,
    stopAutosave
} from "./save.js";


// ------------------------------------------------------------
// ENGINE
// ------------------------------------------------------------

export class GameEngine {

    constructor() {

        this.state = null;

        this.running = false;

        this.initialized = false;

        this.systems = new Map();

        this.weekListeners = [];

        this.dayListeners = [];

        this.errorListeners = [];

        this.lastError = null;
    }


    // --------------------------------------------------------
    // INICIALIZAR NOVO JOGO
    // --------------------------------------------------------

    newGame(options = {}) {

        const state =
            createEmptyGameState();

        if (options.difficulty) {
            state.meta.difficulty =
                options.difficulty;
        }

        if (options.startDate) {
            state.meta.currentDate =
                options.startDate;
        }

        initializeClock(
            state
        );

        this.state =
            normalizeGameState(
                state
            );

        this.initialized = true;

        this.running = true;

        emitEvent(
            this.state,
            {
                type:
                    EVENT_TYPES.GAME_STARTED,

                date:
                    this.state.meta.currentDate,

                title:
                    "Novo jogo iniciado",

                description:
                    "Uma nova jornada começou.",

                source:
                    "engine",

                importance:
                    3
            }
        );

        this.notifySystems(
            "onGameStart"
        );

        return this.state;
    }


    // --------------------------------------------------------
    // CARREGAR JOGO
    // --------------------------------------------------------

    loadGame() {

        const result =
            loadGame();

        if (!result.success) {
            return result;
        }

        this.state =
            normalizeGameState(
                result.state
            );

        initializeClock(
            this.state
        );

        this.initialized = true;

        this.running = true;

        this.notifySystems(
            "onGameLoad"
        );

        return {
            success: true,
            state: this.state
        };
    }


    // --------------------------------------------------------
    // REGISTRAR SISTEMA
    // --------------------------------------------------------

    registerSystem(
        name,
        system
    ) {

        if (!name) {
            throw new Error(
                "O sistema precisa ter um nome."
            );
        }

        if (!system) {
            throw new Error(
                `Sistema inválido: ${name}`
            );
        }

        this.systems.set(
            name,
            system
        );

        if (
            this.initialized &&
            typeof system.onRegister === "function"
        ) {
            system.onRegister(
                this.state,
                this
            );
        }

        return system;
    }


    // --------------------------------------------------------
    // REMOVER SISTEMA
    // --------------------------------------------------------

    unregisterSystem(name) {

        const system =
            this.systems.get(
                name
            );

        if (
            system &&
            typeof system.onUnregister === "function"
        ) {
            system.onUnregister(
                this.state,
                this
            );
        }

        return this.systems.delete(
            name
        );
    }


    // --------------------------------------------------------
    // OBTER SISTEMA
    // --------------------------------------------------------

    getSystem(name) {

        return (
            this.systems.get(name) ||
            null
        );
    }


    // --------------------------------------------------------
    // NOTIFICAR SISTEMAS
    // --------------------------------------------------------

    notifySystems(
        method,
        ...args
    ) {

        for (
            const [
                name,
                system
            ]
            of this.systems
        ) {

            if (
                typeof system[method] !==
                "function"
            ) {
                continue;
            }

            try {

                system[method](
                    this.state,
                    this,
                    ...args
                );

            } catch (error) {

                this.handleError(
                    error,
                    name,
                    method
                );
            }
        }
    }


    // --------------------------------------------------------
    // AVANÇAR UM DIA
    // --------------------------------------------------------

    advanceDay() {

        this.ensureInitialized();

        const previousDate =
            this.state.meta.currentDate;

        this.notifySystems(
            "onBeforeDayAdvance",
            previousDate
        );

        // O clock será utilizado para
        // avançar exatamente um dia.
        const clockModule =
            this.getClockModule();

        if (!clockModule) {
            throw new Error(
                "Clock não disponível."
            );
        }

        clockModule(
            this.state,
            1
        );

        const currentDate =
            this.state.meta.currentDate;

        const dayEvents =
            getEventsForCurrentDate(
                this.state
            );

        for (
            const event
            of dayEvents
        ) {

            processEvent(
                this.state,
                event
            );
        }

        this.notifySystems(
            "onDayAdvance",
            previousDate,
            currentDate
        );

        this.dayListeners.forEach(
            listener => {

                try {
                    listener(
                        this.state,
                        previousDate,
                        currentDate
                    );
                } catch (error) {
                    this.handleError(
                        error,
                        "dayListener"
                    );
                }

            }
        );

        return this.state;
    }


    // --------------------------------------------------------
    // AVANÇAR SEMANA
    // --------------------------------------------------------

    advanceWeek() {

        this.ensureInitialized();

        const previousDate =
            this.state.meta.currentDate;

        const previousWeek =
            this.state.meta.currentWeek;

        this.notifySystems(
            "onBeforeWeekAdvance",
            previousDate
        );

        advanceWeek(
            this.state,
            1
        );

        const currentDate =
            this.state.meta.currentDate;

        const currentWeek =
            this.state.meta.currentWeek;

        const weekEvents =
            getCurrentWeekEvents(
                this.state
            );

        for (
            const event
            of weekEvents
        ) {

            processEvent(
                this.state,
                event
            );
        }

        emitEvent(
            this.state,
            {
                type:
                    EVENT_TYPES.WEEK_STARTED,

                date:
                    currentDate,

                title:
                    "Nova semana",

                description:
                    `Semana ${currentWeek} iniciada.`,

                source:
                    "engine",

                importance:
                    1
            }
        );

        this.notifySystems(
            "onWeekAdvance",

            previousDate,

            currentDate,

            previousWeek,

            currentWeek
        );

        this.weekListeners.forEach(
            listener => {

                try {

                    listener(
                        this.state,
                        previousDate,
                        currentDate
                    );

                } catch (error) {

                    this.handleError(
                        error,
                        "weekListener"
                    );
                }

            }
        );

        return this.state;
    }


    // --------------------------------------------------------
    // AVANÇAR VÁRIAS SEMANAS
    // --------------------------------------------------------

    advanceWeeks(
        amount = 1
    ) {

        this.ensureInitialized();

        if (
            !Number.isInteger(amount) ||
            amount < 0
        ) {
            throw new Error(
                "A quantidade de semanas deve ser um inteiro positivo."
            );
        }

        for (
            let i = 0;
            i < amount;
            i++
        ) {
            this.advanceWeek();
        }

        return this.state;
    }


    // --------------------------------------------------------
    // OBTER ESTADO
    // --------------------------------------------------------

    getState() {

        return this.state;
    }


    // --------------------------------------------------------
    // OBTER TEMPO
    // --------------------------------------------------------

    getTime() {

        if (!this.state) {
            return null;
        }

        return getTimeInfo(
            this.state
        );
    }


    // --------------------------------------------------------
    // SALVAR
    // --------------------------------------------------------

    save() {

        this.ensureInitialized();

        return saveGame(
            this.state
        );
    }


    // --------------------------------------------------------
    // AUTOSAVE
    // --------------------------------------------------------

    enableAutosave(
        interval
    ) {

        this.ensureInitialized();

        return startAutosave(
            () => this.state,
            interval
        );
    }


    // --------------------------------------------------------
    // DESATIVAR AUTOSAVE
    // --------------------------------------------------------

    disableAutosave() {

        stopAutosave();
    }


    // --------------------------------------------------------
    // INICIAR ENGINE
    // --------------------------------------------------------

    start() {

        this.ensureInitialized();

        this.running = true;

        this.notifySystems(
            "onEngineStart"
        );

        return true;
    }


    // --------------------------------------------------------
    // PAUSAR ENGINE
    // --------------------------------------------------------

    pause() {

        this.running = false;

        this.notifySystems(
            "onEnginePause"
        );

        return true;
    }


    // --------------------------------------------------------
    // PARAR ENGINE
    // --------------------------------------------------------

    stop() {

        this.running = false;

        stopAutosave();

        this.notifySystems(
            "onEngineStop"
        );

        return true;
    }


    // --------------------------------------------------------
    // LISTENERS DA SEMANA
    // --------------------------------------------------------

    onWeekAdvance(
        listener
    ) {

        if (
            typeof listener !==
            "function"
        ) {
            throw new Error(
                "Listener inválido."
            );
        }

        this.weekListeners.push(
            listener
        );

        return () => {

            const index =
                this.weekListeners.indexOf(
                    listener
                );

            if (index !== -1) {
                this.weekListeners.splice(
                    index,
                    1
                );
            }

        };
    }


    // --------------------------------------------------------
    // LISTENERS DO DIA
    // --------------------------------------------------------

    onDayAdvance(
        listener
    ) {

        if (
            typeof listener !==
            "function"
        ) {
            throw new Error(
                "Listener inválido."
            );
        }

        this.dayListeners.push(
            listener
        );

        return () => {

            const index =
                this.dayListeners.indexOf(
                    listener
                );

            if (index !== -1) {
                this.dayListeners.splice(
                    index,
                    1
                );
            }

        };
    }


    // --------------------------------------------------------
    // LISTENERS DE ERRO
    // --------------------------------------------------------

    onError(
        listener
    ) {

        if (
            typeof listener !==
            "function"
        ) {
            throw new Error(
                "Listener inválido."
            );
        }

        this.errorListeners.push(
            listener
        );

        return () => {

            const index =
                this.errorListeners.indexOf(
                    listener
                );

            if (index !== -1) {
                this.errorListeners.splice(
                    index,
                    1
                );
            }

        };
    }


    // --------------------------------------------------------
    // TRATAMENTO DE ERROS
    // --------------------------------------------------------

    handleError(
        error,
        systemName = "engine",
        method = null
    ) {

        this.lastError = {

            message:
                error?.message ||
                String(error),

            system:
                systemName,

            method,

            timestamp:
                new Date().toISOString()
        };

        console.error(
            "MMA Life Dynasty Engine Error:",
            this.lastError
        );

        this.errorListeners.forEach(
            listener => {

                try {

                    listener(
                        this.lastError,
                        error
                    );

                } catch {
                    // Não deixar um listener
                    // quebrar o Engine.
                }

            }
        );
    }


    // --------------------------------------------------------
    // GARANTIR INICIALIZAÇÃO
    // --------------------------------------------------------

    ensureInitialized() {

        if (
            !this.initialized ||
            !this.state
        ) {
            throw new Error(
                "O Engine ainda não foi inicializado."
            );
        }
    }


    // --------------------------------------------------------
    // CLOCK INTERNO
    // --------------------------------------------------------

    getClockModule() {

        return (
            this._clockAdvance ||
            null
        );
    }


    // --------------------------------------------------------
    // CONFIGURAR CLOCK
    // --------------------------------------------------------

    setClockModule(
        clockAdvanceFunction
    ) {

        if (
            typeof clockAdvanceFunction !==
            "function"
        ) {
            throw new Error(
                "Clock inválido."
            );
        }

        this._clockAdvance =
            clockAdvanceFunction;
    }


    // --------------------------------------------------------
    // VALIDAR ENGINE
    // --------------------------------------------------------

    validate() {

        if (!this.state) {

            return {
                valid: false,
                errors: [
                    "Estado do jogo não existe."
                ]
            };
        }

        const validation =
            validateGameState(
                this.state
            );

        if (
            validation === true
        ) {

            return {
                valid: true,
                errors: []
            };
        }

        if (
            validation === false
        ) {

            return {
                valid: false,
                errors: [
                    "Estado inválido."
                ]
            };
        }

        return validation;
    }


    // --------------------------------------------------------
    // RESETAR ENGINE
    // --------------------------------------------------------

    reset() {

        this.stop();

        this.state = null;

        this.initialized = false;

        this.running = false;

        this.systems.clear();

        this.weekListeners = [];

        this.dayListeners = [];

        this.lastError = null;
    }
}


// ------------------------------------------------------------
// CLOCK PADRÃO DO ENGINE
// ------------------------------------------------------------

import {
    advanceDays
} from "./clock.js";


// O Engine usa uma função simples para
// manter o clock desacoplado.

const defaultClockAdvance =
    (
        state,
        days
    ) => {

        advanceDays(
            state,
            days
        );
    };


// ------------------------------------------------------------
// FACTORY
// ------------------------------------------------------------

export function createGameEngine() {

    const engine =
        new GameEngine();

    engine.setClockModule(
        defaultClockAdvance
    );

    return engine;
}


// ------------------------------------------------------------
// ENGINE GLOBAL DA APLICAÇÃO
// ------------------------------------------------------------

export const gameEngine =
    createGameEngine();


// ------------------------------------------------------------
// EXPORT DEFAULT
// ------------------------------------------------------------

export default gameEngine;
