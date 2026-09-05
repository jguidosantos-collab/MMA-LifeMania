// ============================================================
// MMA LIFE DYNASTY
// PLAYER — IDENTITY
// ============================================================

import {
    DEFAULT_STARTING_AGE,
    DEFAULT_PLAYER,
    WEIGHT_CLASSES_MEN,
    WEIGHT_CLASSES_WOMEN,
    STANCES,
    GAME_VERSION
} from "../core/constants.js";


// ============================================================
// ID
// ============================================================

function generatePlayerId() {
    return `player_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;
}


// ============================================================
// NORMALIZAÇÃO DE TEXTO
// ============================================================

function normalizeText(value, fallback = "") {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value).trim();
}


// ============================================================
// NORMALIZAÇÃO DE ALTURA
// ============================================================

function normalizeHeight(value, fallback = 175) {
    const height = Number(value);

    if (!Number.isFinite(height) || height <= 0) {
        return fallback;
    }

    return Math.round(height);
}


// ============================================================
// NORMALIZAÇÃO DE PESO
// ============================================================

function normalizeWeight(value, fallback = null) {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    const weight = Number(value);

    if (!Number.isFinite(weight) || weight <= 0) {
        return fallback;
    }

    return Number(weight.toFixed(1));
}


// ============================================================
// CLASSES DE PESO
// ============================================================

function getWeightClass(sex, weightClassId) {
    const classes =
        sex === "female"
            ? WEIGHT_CLASSES_WOMEN
            : WEIGHT_CLASSES_MEN;

    if (!classes || !classes.length) {
        return null;
    }

    return (
        classes.find(weightClass => {
            return (
                weightClass.id === weightClassId ||
                weightClass.name === weightClassId
            );
        }) || classes[0]
    );
}


// ============================================================
// ALTURA / REACH
// ============================================================

function calculateDefaultReach(height) {
    return Math.round(height * 1.02);
}


// ============================================================
// DATA DE NASCIMENTO
// ============================================================

function createBirthDate(age = DEFAULT_STARTING_AGE) {
    const currentYear = new Date().getFullYear();

    const birthYear = currentYear - Number(age);

    return `${birthYear}-01-01`;
}


// ============================================================
// IDENTIDADE PADRÃO
// ============================================================

export function createDefaultIdentity(overrides = {}) {
    const player = {
        id: generatePlayerId(),

        firstName: "",
        middleName: "",
        lastName: "",

        fullName: "",
        nickname: "",

        sex: DEFAULT_PLAYER.sex || "male",

        birthDate: createBirthDate(DEFAULT_STARTING_AGE),
        age: DEFAULT_STARTING_AGE,

        country: DEFAULT_PLAYER.country || "Brazil",
        countryCode: "BR",

        state: "",
        region: "",
        city: "",

        nationality: "Brazilian",

        height: DEFAULT_PLAYER.height || 175,
        reach: DEFAULT_PLAYER.reach || 178,

        weight: null,

        weightClass:
            DEFAULT_PLAYER.weightClass ||
            "featherweight",

        stance:
            DEFAULT_PLAYER.stance ||
            STANCES.ORTHODOX ||
            "orthodox",

        createdAt: new Date().toISOString(),

        version: GAME_VERSION
    };

    return {
        ...player,
        ...overrides
    };
}


// ============================================================
// CRIAÇÃO DE IDENTIDADE
// ============================================================

export function createIdentity(data = {}) {
    const identity = createDefaultIdentity(data);

    identity.firstName = normalizeText(
        data.firstName,
        identity.firstName
    );

    identity.middleName = normalizeText(
        data.middleName,
        identity.middleName
    );

    identity.lastName = normalizeText(
        data.lastName,
        identity.lastName
    );

    identity.nickname = normalizeText(
        data.nickname,
        identity.nickname
    );

    identity.sex =
        data.sex === "female"
            ? "female"
            : "male";

    identity.country = normalizeText(
        data.country,
        identity.country
    );

    identity.countryCode = normalizeText(
        data.countryCode,
        identity.countryCode
    ).toUpperCase();

    identity.state = normalizeText(
        data.state,
        identity.state
    );

    identity.region = normalizeText(
        data.region,
        identity.region
    );

    identity.city = normalizeText(
        data.city,
        identity.city
    );

    identity.nationality = normalizeText(
        data.nationality,
        identity.nationality
    );

    identity.height = normalizeHeight(
        data.height,
        identity.height
    );

    identity.reach = normalizeHeight(
        data.reach,
        calculateDefaultReach(identity.height)
    );

    identity.weight = normalizeWeight(
        data.weight,
        identity.weight
    );

    identity.weightClass = normalizeText(
        data.weightClass,
        identity.weightClass
    ).toLowerCase();

    identity.stance = normalizeText(
        data.stance,
        identity.stance
    ).toLowerCase();

    identity.birthDate = normalizeText(
        data.birthDate,
        identity.birthDate
    );

    identity.age = calculateAgeFromBirthDate(
        identity.birthDate
    );

    identity.fullName = buildFullName(identity);

    validateIdentity(identity);

    return identity;
}


// ============================================================
// NOME COMPLETO
// ============================================================

export function buildFullName(identity) {
    const parts = [
        identity.firstName,
        identity.middleName,
        identity.lastName
    ].filter(Boolean);

    return parts.join(" ").trim();
}


// ============================================================
// IDADE
// ============================================================

export function calculateAgeFromBirthDate(
    birthDate,
    referenceDate = new Date()
) {
    if (!birthDate) {
        return DEFAULT_STARTING_AGE;
    }

    const birth = new Date(birthDate);

    if (Number.isNaN(birth.getTime())) {
        return DEFAULT_STARTING_AGE;
    }

    const reference = new Date(referenceDate);

    let age =
        reference.getFullYear() -
        birth.getFullYear();

    const monthDifference =
        reference.getMonth() -
        birth.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            reference.getDate() < birth.getDate()
        )
    ) {
        age--;
    }

    return Math.max(0, age);
}


// ============================================================
// ATUALIZAR IDADE
// ============================================================

export function updateIdentityAge(
    identity,
    currentDate = new Date()
) {
    if (!identity) {
        return null;
    }

    identity.age = calculateAgeFromBirthDate(
        identity.birthDate,
        currentDate
    );

    return identity.age;
}


// ============================================================
// IDADE EM DATA ESPECÍFICA
// ============================================================

export function getAgeAtDate(
    birthDate,
    targetDate
) {
    return calculateAgeFromBirthDate(
        birthDate,
        targetDate
    );
}


// ============================================================
// ANIVERSÁRIO
// ============================================================

export function isBirthday(
    birthDate,
    currentDate = new Date()
) {
    if (!birthDate) {
        return false;
    }

    const birth = new Date(birthDate);
    const current = new Date(currentDate);

    if (
        Number.isNaN(birth.getTime()) ||
        Number.isNaN(current.getTime())
    ) {
        return false;
    }

    return (
        birth.getMonth() === current.getMonth() &&
        birth.getDate() === current.getDate()
    );
}


// ============================================================
// CLASSE DE PESO
// ============================================================

export function setWeightClass(
    identity,
    weightClassId
) {
    if (!identity) {
        return false;
    }

    const weightClass = getWeightClass(
        identity.sex,
        weightClassId
    );

    if (!weightClass) {
        return false;
    }

    identity.weightClass = weightClass.id;

    return true;
}


// ============================================================
// OBTER CLASSE DE PESO ATUAL
// ============================================================

export function getCurrentWeightClass(identity) {
    if (!identity) {
        return null;
    }

    return getWeightClass(
        identity.sex,
        identity.weightClass
    );
}


// ============================================================
// MUDANÇA DE SEXO
// ============================================================

export function setSex(identity, sex) {
    if (!identity) {
        return false;
    }

    identity.sex =
        sex === "female"
            ? "female"
            : "male";

    const currentClass = getWeightClass(
        identity.sex,
        identity.weightClass
    );

    if (!currentClass) {
        const classes =
            identity.sex === "female"
                ? WEIGHT_CLASSES_WOMEN
                : WEIGHT_CLASSES_MEN;

        if (classes && classes.length) {
            identity.weightClass = classes[0].id;
        }
    }

    return true;
}


// ============================================================
// STANCE
// ============================================================

export function setStance(identity, stance) {
    if (!identity) {
        return false;
    }

    const normalized = normalizeText(
        stance,
        "orthodox"
    ).toLowerCase();

    const validStances = Object.values(STANCES);

    if (validStances.includes(normalized)) {
        identity.stance = normalized;
        return true;
    }

    return false;
}


// ============================================================
// ALTURA
// ============================================================

export function setHeight(identity, height) {
    if (!identity) {
        return false;
    }

    identity.height = normalizeHeight(
        height,
        identity.height
    );

    if (!identity.reach) {
        identity.reach = calculateDefaultReach(
            identity.height
        );
    }

    return true;
}


// ============================================================
// ALCANCE
// ============================================================

export function setReach(identity, reach) {
    if (!identity) {
        return false;
    }

    identity.reach = normalizeHeight(
        reach,
        calculateDefaultReach(identity.height)
    );

    return true;
}


// ============================================================
// PESO
// ============================================================

export function setWeight(identity, weight) {
    if (!identity) {
        return false;
    }

    identity.weight = normalizeWeight(
        weight,
        identity.weight
    );

    return true;
}


// ============================================================
// LOCALIZAÇÃO
// ============================================================

export function setLocation(
    identity,
    location = {}
) {
    if (!identity) {
        return false;
    }

    if (location.country !== undefined) {
        identity.country =
            normalizeText(location.country);
    }

    if (location.countryCode !== undefined) {
        identity.countryCode =
            normalizeText(location.countryCode)
                .toUpperCase();
    }

    if (location.state !== undefined) {
        identity.state =
            normalizeText(location.state);
    }

    if (location.region !== undefined) {
        identity.region =
            normalizeText(location.region);
    }

    if (location.city !== undefined) {
        identity.city =
            normalizeText(location.city);
    }

    if (location.nationality !== undefined) {
        identity.nationality =
            normalizeText(location.nationality);
    }

    return true;
}


// ============================================================
// RENOMEAR
// ============================================================

export function setName(
    identity,
    firstName,
    lastName,
    middleName = ""
) {
    if (!identity) {
        return false;
    }

    identity.firstName =
        normalizeText(firstName);

    identity.middleName =
        normalizeText(middleName);

    identity.lastName =
        normalizeText(lastName);

    identity.fullName =
        buildFullName(identity);

    return true;
}


// ============================================================
// APELIDO
// ============================================================

export function setNickname(
    identity,
    nickname
) {
    if (!identity) {
        return false;
    }

    identity.nickname =
        normalizeText(nickname);

    return true;
}


// ============================================================
// NOME DE EXIBIÇÃO
// ============================================================

export function getDisplayName(identity) {
    if (!identity) {
        return "Unknown Fighter";
    }

    if (identity.nickname) {
        return `${identity.fullName} "${identity.nickname}"`;
    }

    return identity.fullName || "Unknown Fighter";
}


// ============================================================
// NOME CURTO
// ============================================================

export function getShortName(identity) {
    if (!identity) {
        return "";
    }

    if (identity.nickname) {
        return identity.nickname;
    }

    if (identity.firstName && identity.lastName) {
        return `${identity.firstName} ${identity.lastName}`;
    }

    return identity.fullName || "";
}


// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateIdentity(identity) {
    if (!identity || typeof identity !== "object") {
        throw new Error(
            "Identity inválida."
        );
    }

    if (!identity.id) {
        throw new Error(
            "Identity precisa possuir um ID."
        );
    }

    if (!identity.birthDate) {
        throw new Error(
            "Identity precisa possuir uma data de nascimento."
        );
    }

    if (
        !Number.isFinite(identity.height) ||
        identity.height <= 0
    ) {
        throw new Error(
            "Altura inválida."
        );
    }

    if (
        !Number.isFinite(identity.reach) ||
        identity.reach <= 0
    ) {
        throw new Error(
            "Alcance inválido."
        );
    }

    if (!identity.weightClass) {
        throw new Error(
            "Classe de peso não definida."
        );
    }

    return true;
}


// ============================================================
// CLONE
// ============================================================

export function cloneIdentity(identity) {
    if (!identity) {
        return null;
    }

    return JSON.parse(
        JSON.stringify(identity)
    );
}


// ============================================================
// EXPORTAÇÃO PADRÃO
// ============================================================

export default {
    createDefaultIdentity,
    createIdentity,

    buildFullName,
    getDisplayName,
    getShortName,

    calculateAgeFromBirthDate,
    updateIdentityAge,
    getAgeAtDate,
    isBirthday,

    setName,
    setNickname,
    setSex,

    setLocation,

    setHeight,
    setReach,
    setWeight,

    setWeightClass,
    getCurrentWeightClass,

    setStance,

    validateIdentity,
    cloneIdentity
};
