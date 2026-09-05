import {
    MIN_PROFESSIONAL_AGE,
    DEFAULT_STARTING_AGE
} from "./constants.js";

/**
 * ============================================================
 * MMA LIFE DYNASTY
 * CORE — CLOCK
 * ============================================================
 *
 * Responsabilidade:
 * - Controlar a passagem do tempo do jogo.
 * - Trabalhar com semanas, meses e anos.
 * - Atualizar a idade do personagem.
 * - Fornecer informações temporais para os demais sistemas.
 *
 * IMPORTANTE:
 * O clock NÃO executa treinamento, lutas, eventos ou vida.
 * Ele apenas controla o tempo.
 * ============================================================
 */

// ------------------------------------------------------------
// CONSTANTES
// ------------------------------------------------------------

const DAYS_PER_WEEK = 7;

const MONTH_NAMES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];


// ------------------------------------------------------------
// UTILITÁRIOS DE DATA
// ------------------------------------------------------------

export function parseDate(dateString) {
    const date = new Date(`${dateString}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) {
        throw new Error(`Data inválida: ${dateString}`);
    }

    return date;
}


export function formatDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


export function getDateParts(dateString) {
    const date = parseDate(dateString);

    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        monthName: MONTH_NAMES[date.getUTCMonth()],
        dayOfWeek: date.getUTCDay()
    };
}


export function getMonthName(month) {
    return MONTH_NAMES[month - 1] || "";
}


// ------------------------------------------------------------
// ADICIONAR TEMPO
// ------------------------------------------------------------

export function addDays(dateString, days) {
    const date = parseDate(dateString);

    date.setUTCDate(date.getUTCDate() + days);

    return formatDate(date);
}


export function addWeeks(dateString, weeks = 1) {
    return addDays(dateString, weeks * DAYS_PER_WEEK);
}


// ------------------------------------------------------------
// DIFERENÇA ENTRE DATAS
// ------------------------------------------------------------

export function daysBetween(startDate, endDate) {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const difference = end.getTime() - start.getTime();

    return Math.floor(difference / (1000 * 60 * 60 * 24));
}


export function weeksBetween(startDate, endDate) {
    return Math.floor(daysBetween(startDate, endDate) / DAYS_PER_WEEK);
}


// ------------------------------------------------------------
// INFORMAÇÕES DA SEMANA
// ------------------------------------------------------------

export function getWeekInfo(dateString) {
    const date = parseDate(dateString);

    const year = date.getUTCFullYear();
    const firstDayOfYear = new Date(Date.UTC(year, 0, 1));

    const difference =
        Math.floor(
            (date.getTime() - firstDayOfYear.getTime()) /
            (1000 * 60 * 60 * 24)
        );

    const week = Math.floor(difference / DAYS_PER_WEEK) + 1;

    return {
        week,
        year,
        date: dateString
    };
}


// ------------------------------------------------------------
// VERIFICAÇÕES TEMPORAIS
// ------------------------------------------------------------

export function isFirstDayOfMonth(dateString) {
    const { day } = getDateParts(dateString);

    return day === 1;
}


export function isLastDayOfMonth(dateString) {
    const date = parseDate(dateString);

    const currentMonth = date.getUTCMonth();

    const tomorrow = new Date(date);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    return tomorrow.getUTCMonth() !== currentMonth;
}


export function isFirstDayOfYear(dateString) {
    const { month, day } = getDateParts(dateString);

    return month === 1 && day === 1;
}


export function isLastDayOfYear(dateString) {
    const { month, day } = getDateParts(dateString);

    return month === 12 && day === 31;
}


// ------------------------------------------------------------
// ANIVERSÁRIO
// ------------------------------------------------------------

export function isBirthday(currentDate, birthDate) {
    if (!currentDate || !birthDate) {
        return false;
    }

    const current = getDateParts(currentDate);
    const birth = getDateParts(birthDate);

    return (
        current.month === birth.month &&
        current.day === birth.day
    );
}


export function calculateAge(birthDate, currentDate) {
    const birth = getDateParts(birthDate);
    const current = getDateParts(currentDate);

    let age = current.year - birth.year;

    if (
        current.month < birth.month ||
        (
            current.month === birth.month &&
            current.day < birth.day
        )
    ) {
        age--;
    }

    return Math.max(0, age);
}


// ------------------------------------------------------------
// ESTÁGIO ETÁRIO
// ------------------------------------------------------------

export function getAgeStage(age) {
    if (age < 13) {
        return "Child";
    }

    if (age < 15) {
        return "EarlyTeen";
    }

    if (age < 18) {
        return "Teen";
    }

    if (age < 25) {
        return "YoungAdult";
    }

    if (age < 30) {
        return "PrimeDevelopment";
    }

    if (age < 35) {
        return "Prime";
    }

    if (age < 40) {
        return "Veteran";
    }

    if (age < 45) {
        return "LateCareer";
    }

    return "PostPrime";
}


// ------------------------------------------------------------
// INFORMAÇÕES COMPLETAS DO TEMPO
// ------------------------------------------------------------

export function getTimeInfo(state) {
    if (!state?.meta?.currentDate) {
        return null;
    }

    const currentDate = state.meta.currentDate;

    const dateParts = getDateParts(currentDate);
    const weekInfo = getWeekInfo(currentDate);

    let age = null;

    if (state.player?.birthDate) {
        age = calculateAge(
            state.player.birthDate,
            currentDate
        );
    }

    return {
        date: currentDate,

        day: dateParts.day,
        month: dateParts.month,
        monthName: dateParts.monthName,
        year: dateParts.year,

        week: weekInfo.week,

        age,

        ageStage:
            age !== null
                ? getAgeStage(age)
                : null
    };
}


// ------------------------------------------------------------
// AVANÇAR O TEMPO
// ------------------------------------------------------------

export function advanceDays(state, days = 1) {
    if (!state?.meta) {
        throw new Error("Estado do jogo inválido.");
    }

    if (!Number.isInteger(days) || days < 0) {
        throw new Error("A quantidade de dias deve ser um inteiro positivo.");
    }

    if (days === 0) {
        return state;
    }

    const previousDate = state.meta.currentDate;

    state.meta.currentDate = addDays(
        previousDate,
        days
    );

    updateCalendarCounters(
        state,
        previousDate
    );

    updatePlayerAge(
        state,
        previousDate
    );

    return state;
}


export function advanceWeek(state, weeks = 1) {
    if (!Number.isInteger(weeks) || weeks < 0) {
        throw new Error("A quantidade de semanas deve ser um inteiro positivo.");
    }

    if (weeks === 0) {
        return state;
    }

    return advanceDays(
        state,
        weeks * DAYS_PER_WEEK
    );
}


// ------------------------------------------------------------
// ATUALIZA CONTADORES DO CALENDÁRIO
// ------------------------------------------------------------

function updateCalendarCounters(state, previousDate) {
    const currentDate = state.meta.currentDate;

    const previousParts = getDateParts(previousDate);
    const currentParts = getDateParts(currentDate);

    if (state.meta.currentWeek == null) {
        state.meta.currentWeek = 1;
    }

    if (state.meta.currentYear == null) {
        state.meta.currentYear = currentParts.year;
    }

    const weeksPassed = weeksBetween(
        previousDate,
        currentDate
    );

    state.meta.currentWeek += weeksPassed;

    if (currentParts.year !== previousParts.year) {
        state.meta.currentYear = currentParts.year;
    }
}


// ------------------------------------------------------------
// ATUALIZA IDADE DO JOGADOR
// ------------------------------------------------------------

function updatePlayerAge(state, previousDate) {
    if (!state.player?.birthDate) {
        return;
    }

    const newAge = calculateAge(
        state.player.birthDate,
        state.meta.currentDate
    );

    state.player.age = newAge;

    if (isBirthday(
        state.meta.currentDate,
        state.player.birthDate
    )) {
        handleBirthday(state, newAge);
    }
}


// ------------------------------------------------------------
// ANIVERSÁRIO
// ------------------------------------------------------------

function handleBirthday(state, newAge) {
    if (!Array.isArray(state.history)) {
        state.history = [];
    }

    state.history.push({
        type: "birthday",
        date: state.meta.currentDate,
        age: newAge,
        description: `O personagem completou ${newAge} anos.`
    });

    if (!Array.isArray(state.notifications)) {
        state.notifications = [];
    }

    state.notifications.push({
        id: `birthday_${state.meta.currentDate}_${newAge}`,
        type: "birthday",
        date: state.meta.currentDate,
        title: "Aniversário",
        message: `Você completou ${newAge} anos.`
    });
}


// ------------------------------------------------------------
// STATUS PROFISSIONAL
// ------------------------------------------------------------

export function canBecomeProfessional(age) {
    return age >= MIN_PROFESSIONAL_AGE;
}


export function getCareerAgeStatus(age) {
    if (age < MIN_PROFESSIONAL_AGE) {
        return {
            professionalAllowed: false,
            reason: `Carreira profissional disponível a partir dos ${MIN_PROFESSIONAL_AGE} anos.`
        };
    }

    return {
        professionalAllowed: true,
        reason: null
    };
}


// ------------------------------------------------------------
// RESET / INICIALIZAÇÃO DO RELÓGIO
// ------------------------------------------------------------

export function initializeClock(state, startDate = null) {
    if (!state?.meta) {
        throw new Error("Estado do jogo inválido.");
    }

    if (startDate) {
        parseDate(startDate);
        state.meta.currentDate = startDate;
    }

    if (!state.meta.currentDate) {
        throw new Error("Data inicial do jogo não definida.");
    }

    const dateParts = getDateParts(
        state.meta.currentDate
    );

    state.meta.currentYear = dateParts.year;

    if (!state.meta.currentWeek) {
        state.meta.currentWeek =
            getWeekInfo(state.meta.currentDate).week;
    }

    if (state.player?.birthDate) {
        state.player.age = calculateAge(
            state.player.birthDate,
            state.meta.currentDate
        );
    }

    return state;
}


// ------------------------------------------------------------
// SNAPSHOT DO TEMPO
// ------------------------------------------------------------

export function createTimeSnapshot(state) {
    const time = getTimeInfo(state);

    if (!time) {
        return null;
    }

    return {
        date: time.date,
        week: time.week,
        year: time.year,
        age: time.age
    };
}


// ------------------------------------------------------------
// EXPORT DEFAULT
// ------------------------------------------------------------

export default {
    parseDate,
    formatDate,
    getDateParts,
    getMonthName,

    addDays,
    addWeeks,

    daysBetween,
    weeksBetween,

    getWeekInfo,

    isFirstDayOfMonth,
    isLastDayOfMonth,
    isFirstDayOfYear,
    isLastDayOfYear,

    isBirthday,
    calculateAge,

    getAgeStage,
    getTimeInfo,

    advanceDays,
    advanceWeek,

    canBecomeProfessional,
    getCareerAgeStatus,

    initializeClock,
    createTimeSnapshot
};
