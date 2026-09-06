/* ============================================================
   MMA LIFE DYNASTY
   CHARACTER CREATION SYSTEM
   ============================================================ */

const CHARACTER_CREATION_VERSION = "2.0.0";

const characterCreationState = {
    initialized: false,
    completed: false,

    currentStep: 1,
    totalSteps: 5,

    identity: {
        firstName: "",
        lastName: "",
        nickname: "",
        country: "Brasil",
        city: ""
    },

    physical: {
        age: 16,
        height: 1.75,
        weight: 70,
        weightClass: "Leve"
    },

    style: {
        fightingStyle: "MMA",
        stance: "Ortodoxo"
    },

    personality: {
        discipline: 70,
        confidence: 60,
        aggression: 50,
        intelligence: 60,
        charisma: 50
    },

    attributes: {},
    potential: 0,
    genetics: {},

    createdCharacter: null
};


/* ============================================================
   OPTIONS
   ============================================================ */

const CREATION_OPTIONS = {
    countries: [
        "Brasil",
        "Estados Unidos",
        "México",
        "Argentina",
        "Canadá",
        "Reino Unido",
        "Irlanda",
        "França",
        "Espanha",
        "Portugal",
        "Japão",
        "Coreia do Sul",
        "Austrália",
        "Rússia"
    ],

    cities: {
        "Brasil": [
            "São Paulo",
            "Rio de Janeiro",
            "Belo Horizonte",
            "Brasília",
            "Curitiba",
            "Porto Alegre",
            "Salvador",
            "Recife",
            "Fortaleza",
            "Manaus",
            "Belém",
            "Macapá"
        ],

        "Estados Unidos": [
            "Las Vegas",
            "Los Angeles",
            "Miami",
            "New York",
            "Chicago",
            "Houston",
            "Dallas"
        ],

        "México": [
            "Cidade do México",
            "Guadalajara",
            "Monterrey"
        ],

        "Argentina": [
            "Buenos Aires",
            "Córdoba",
            "Rosário"
        ],

        "Canadá": [
            "Toronto",
            "Montreal",
            "Vancouver"
        ],

        "Reino Unido": [
            "Londres",
            "Manchester",
            "Liverpool"
        ],

        "Irlanda": [
            "Dublin",
            "Cork"
        ],

        "França": [
            "Paris",
            "Lyon",
            "Marselha"
        ],

        "Espanha": [
            "Madrid",
            "Barcelona",
            "Valência"
        ],

        "Portugal": [
            "Lisboa",
            "Porto",
            "Braga"
        ],

        "Japão": [
            "Tokyo",
            "Osaka",
            "Kyoto"
        ],

        "Coreia do Sul": [
            "Seul",
            "Busan",
            "Incheon"
        ],

        "Austrália": [
            "Sydney",
            "Melbourne",
            "Brisbane"
        ],

        "Rússia": [
            "Moscou",
            "São Petersburgo",
            "Kazan"
        ]
    },

    fightingStyles: [
        "MMA",
        "Boxe",
        "Muay Thai",
        "Kickboxing",
        "Jiu-Jitsu",
        "Wrestling",
        "Judô",
        "Sambo",
        "Karate"
    ],

    stances: [
        "Ortodoxo",
        "Canhoto"
    ],

    weightClasses: [
        "Mosca",
        "Galo",
        "Pena",
        "Leve",
        "Meio-Médio",
        "Médio",
        "Meio-Pesado",
        "Pesado"
    ]
};


/* ============================================================
   WEIGHT CLASS LIMITS
   ============================================================ */

const WEIGHT_CLASS_LIMITS = {
    "Mosca": 57,
    "Galo": 61,
    "Pena": 66,
    "Leve": 70,
    "Meio-Médio": 77,
    "Médio": 84,
    "Meio-Pesado": 93,
    "Pesado": 120
};


/* ============================================================
   UTILS
   ============================================================ */

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function normalizeNumber(value, fallback = 0) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return number;
}


function safeString(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}


function escapeHTML(value) {
    return safeString(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initializeCharacterCreation() {
    if (characterCreationState.initialized) {
        return getCharacterCreationState();
    }

    characterCreationState.initialized = true;

    return getCharacterCreationState();
}


function resetCharacterCreation() {
    characterCreationState.completed = false;
    characterCreationState.currentStep = 1;

    characterCreationState.identity = {
        firstName: "",
        lastName: "",
        nickname: "",
        country: "Brasil",
        city: ""
    };

    characterCreationState.physical = {
        age: 16,
        height: 1.75,
        weight: 70,
        weightClass: "Leve"
    };

    characterCreationState.style = {
        fightingStyle: "MMA",
        stance: "Ortodoxo"
    };

    characterCreationState.personality = {
        discipline: 70,
        confidence: 60,
        aggression: 50,
        intelligence: 60,
        charisma: 50
    };

    characterCreationState.attributes = {};
    characterCreationState.potential = 0;
    characterCreationState.genetics = {};
    characterCreationState.createdCharacter = null;

    return getCharacterCreationState();
}


/* ============================================================
   STATE
   ============================================================ */

function getCharacterCreationState() {
    return JSON.parse(
        JSON.stringify(characterCreationState)
    );
}


function getCharacterCreationData() {
    return {
        identity: {
            ...characterCreationState.identity
        },

        physical: {
            ...characterCreationState.physical
        },

        style: {
            ...characterCreationState.style
        },

        personality: {
            ...characterCreationState.personality
        },

        attributes: {
            ...characterCreationState.attributes
        },

        potential: characterCreationState.potential,

        genetics: {
            ...characterCreationState.genetics
        }
    };
}


function getCreationOptions() {
    return JSON.parse(
        JSON.stringify(CREATION_OPTIONS)
    );
}


function getCurrentCreationStep() {
    return characterCreationState.currentStep;
}


/* ============================================================
   CITY
   ============================================================ */

function getCitiesForCountry(country) {
    return CREATION_OPTIONS.cities[country] || [];
}


/* ============================================================
   SETTERS
   ============================================================ */

function setCharacterField(field, value) {
    if (field in characterCreationState.identity) {
        characterCreationState.identity[field] = safeString(value);
        return true;
    }

    return false;
}


function setIdentity(data = {}) {
    if (data.firstName !== undefined) {
        characterCreationState.identity.firstName =
            safeString(data.firstName);
    }

    if (data.lastName !== undefined) {
        characterCreationState.identity.lastName =
            safeString(data.lastName);
    }

    if (data.nickname !== undefined) {
        characterCreationState.identity.nickname =
            safeString(data.nickname);
    }

    if (data.country !== undefined) {
        characterCreationState.identity.country =
            safeString(data.country);

        const cities =
            getCitiesForCountry(characterCreationState.identity.country);

        if (
            cities.length > 0 &&
            !cities.includes(characterCreationState.identity.city)
        ) {
            characterCreationState.identity.city = cities[0];
        }
    }

    if (data.city !== undefined) {
        characterCreationState.identity.city =
            safeString(data.city);
    }

    return getCharacterCreationData();
}


function setLocation(country, city) {
    setIdentity({
        country,
        city
    });

    return getCharacterCreationData();
}


function setPhysical(data = {}) {
    if (data.age !== undefined) {
        characterCreationState.physical.age =
            clamp(
                normalizeNumber(data.age, 16),
                14,
                60
            );
    }

    if (data.height !== undefined) {
        characterCreationState.physical.height =
            clamp(
                normalizeNumber(data.height, 1.75),
                1.40,
                2.20
            );
    }

    if (data.weight !== undefined) {
        characterCreationState.physical.weight =
            clamp(
                normalizeNumber(data.weight, 70),
                45,
                160
            );
    }

    if (data.weightClass !== undefined) {
        characterCreationState.physical.weightClass =
            safeString(data.weightClass);
    }

    return getCharacterCreationData();
}


function setPhysicalData(data = {}) {
    return setPhysical(data);
}


function setStyleData(data = {}) {
    if (data.fightingStyle !== undefined) {
        characterCreationState.style.fightingStyle =
            safeString(data.fightingStyle);
    }

    if (data.stance !== undefined) {
        characterCreationState.style.stance =
            safeString(data.stance);
    }

    return getCharacterCreationData();
}


function setStyle(data = {}) {
    return setStyleData(data);
}


function setPersonality(data = {}) {
    const fields = [
        "discipline",
        "confidence",
        "aggression",
        "intelligence",
        "charisma"
    ];

    for (const field of fields) {
        if (data[field] !== undefined) {
            characterCreationState.personality[field] =
                clamp(
                    normalizeNumber(
                        data[field],
                        characterCreationState.personality[field]
                    ),
                    0,
                    100
                );
        }
    }

    return getCharacterCreationData();
}


/* ============================================================
   ATTRIBUTES
   ============================================================ */

function generateStartingAttributes() {
    const personality =
        characterCreationState.personality;

    const style =
        characterCreationState.style.fightingStyle;

    const base = randomInt(48, 65);

    const attributes = {
        striking: clamp(
            base +
            randomInt(-8, 8) +
            Math.round((personality.aggression - 50) * 0.15),
            1,
            100
        ),

        grappling: clamp(
            base +
            randomInt(-8, 8) +
            Math.round((personality.intelligence - 50) * 0.15),
            1,
            100
        ),

        wrestling: clamp(
            base +
            randomInt(-8, 8) +
            Math.round((personality.discipline - 50) * 0.12),
            1,
            100
        ),

        cardio: clamp(
            base +
            randomInt(-6, 10) +
            Math.round((personality.discipline - 50) * 0.18),
            1,
            100
        ),

        strength: clamp(
            base +
            randomInt(-8, 8),
            1,
            100
        ),

        speed: clamp(
            base +
            randomInt(-8, 10),
            1,
            100
        ),

        defense: clamp(
            base +
            randomInt(-8, 8) +
            Math.round((personality.intelligence - 50) * 0.15),
            1,
            100
        ),

        chin: clamp(
            base +
            randomInt(-7, 8),
            1,
            100
        ),

        recovery: clamp(
            base +
            randomInt(-7, 8) +
            Math.round((personality.discipline - 50) * 0.10),
            1,
            100
        ),

        mental: clamp(
            base +
            randomInt(-6, 10) +
            Math.round((personality.confidence - 50) * 0.20),
            1,
            100
        )
    };


    /*
     * Pequenas especializações pelo estilo escolhido.
     */

    if (style === "Boxe") {
        attributes.striking += 6;
        attributes.speed += 3;
    }

    if (style === "Muay Thai") {
        attributes.striking += 5;
        attributes.chin += 3;
    }

    if (style === "Kickboxing") {
        attributes.striking += 5;
        attributes.speed += 3;
    }

    if (style === "Jiu-Jitsu") {
        attributes.grappling += 7;
        attributes.defense += 4;
    }

    if (style === "Wrestling") {
        attributes.wrestling += 8;
        attributes.grappling += 4;
    }

    if (style === "Judô") {
        attributes.grappling += 6;
        attributes.wrestling += 5;
    }

    if (style === "Sambo") {
        attributes.grappling += 6;
        attributes.wrestling += 5;
    }

    if (style === "Karate") {
        attributes.speed += 5;
        attributes.striking += 4;
    }


    for (const key of Object.keys(attributes)) {
        attributes[key] =
            clamp(attributes[key], 1, 100);
    }


    characterCreationState.attributes =
        attributes;

    return {
        ...attributes
    };
}


/* ============================================================
   POTENTIAL
   ============================================================ */

function generateStartingPotential() {
    const personality =
        characterCreationState.personality;

    let potential =
        randomInt(65, 92);

    potential +=
        Math.round(
            (personality.discipline - 50) * 0.10
        );

    potential +=
        Math.round(
            (personality.intelligence - 50) * 0.08
        );

    potential =
        clamp(
            potential,
            50,
            99
        );

    characterCreationState.potential =
        potential;

    return potential;
}


/* ============================================================
   GENETICS
   ============================================================ */

function generateStartingGenetics() {
    const genetics = {
        durability: randomInt(40, 90),
        naturalStrength: randomInt(40, 90),
        naturalSpeed: randomInt(40, 90),
        cardioPotential: randomInt(40, 90),
        injuryResistance: randomInt(40, 90),
        recoveryPotential: randomInt(40, 90)
    };

    characterCreationState.genetics =
        genetics;

    return {
        ...genetics
    };
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateCharacterCreation() {
    const errors = [];

    const identity =
        characterCreationState.identity;

    const physical =
        characterCreationState.physical;


    if (!identity.firstName) {
        errors.push("Digite seu primeiro nome.");
    }


    if (!identity.lastName) {
        errors.push("Digite seu sobrenome.");
    }


    if (!identity.country) {
        errors.push("Selecione seu país.");
    }


    if (!identity.city) {
        errors.push("Selecione sua cidade.");
    }


    if (
        physical.age < 14 ||
        physical.age > 60
    ) {
        errors.push("A idade precisa estar entre 14 e 60 anos.");
    }


    if (
        physical.height < 1.40 ||
        physical.height > 2.20
    ) {
        errors.push("A altura informada é inválida.");
    }


    if (
        physical.weight < 45 ||
        physical.weight > 160
    ) {
        errors.push("O peso informado é inválido.");
    }


    if (!physical.weightClass) {
        errors.push("Selecione uma categoria de peso.");
    }


    return {
        valid: errors.length === 0,
        errors
    };
}


function validateCurrentCreationStep() {
    const step =
        characterCreationState.currentStep;

    const errors = [];


    if (step === 1) {
        if (!characterCreationState.identity.firstName) {
            errors.push("Digite seu primeiro nome.");
        }

        if (!characterCreationState.identity.lastName) {
            errors.push("Digite seu sobrenome.");
        }
    }


    if (step === 2) {
        if (!characterCreationState.identity.country) {
            errors.push("Selecione seu país.");
        }

        if (!characterCreationState.identity.city) {
            errors.push("Selecione sua cidade.");
        }
    }


    if (step === 3) {
        const physical =
            characterCreationState.physical;

        if (
            physical.age < 14 ||
            physical.age > 60
        ) {
            errors.push("Idade inválida.");
        }

        if (
            physical.height < 1.40 ||
            physical.height > 2.20
        ) {
            errors.push("Altura inválida.");
        }

        if (
            physical.weight < 45 ||
            physical.weight > 160
        ) {
            errors.push("Peso inválido.");
        }
    }


    if (step === 4) {
        if (!characterCreationState.style.fightingStyle) {
            errors.push("Escolha um estilo de luta.");
        }
    }


    return {
        valid: errors.length === 0,
        errors
    };
}


/* ============================================================
   STEP CONTROL
   ============================================================ */

function goToCreationStep(step) {
    const target =
        clamp(
            normalizeNumber(step, 1),
            1,
            characterCreationState.totalSteps
        );

    characterCreationState.currentStep =
        target;

    return target;
}


function nextCreationStep() {
    const validation =
        validateCurrentCreationStep();

    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors,
            step: characterCreationState.currentStep
        };
    }

    if (
        characterCreationState.currentStep <
        characterCreationState.totalSteps
    ) {
        characterCreationState.currentStep++;
    }

    return {
        success: true,
        step: characterCreationState.currentStep
    };
}


function previousCreationStep() {
    if (characterCreationState.currentStep > 1) {
        characterCreationState.currentStep--;
    }

    return {
        success: true,
        step: characterCreationState.currentStep
    };
}


/* ============================================================
   CHARACTER SUMMARY
   ============================================================ */

function getCharacterCreationSummary() {
    const identity =
        characterCreationState.identity;

    const physical =
        characterCreationState.physical;

    const style =
        characterCreationState.style;

    return {
        name:
            `${identity.firstName} ${identity.lastName}`.trim(),

        displayName:
            identity.nickname ||
            `${identity.firstName} ${identity.lastName}`.trim(),

        nickname:
            identity.nickname,

        country:
            identity.country,

        city:
            identity.city,

        age:
            physical.age,

        height:
            physical.height,

        weight:
            physical.weight,

        weightClass:
            physical.weightClass,

        fightingStyle:
            style.fightingStyle,

        stance:
            style.stance,

        potential:
            characterCreationState.potential,

        attributes:
            {
                ...characterCreationState.attributes
            }
    };
}


/* ============================================================
   FINALIZE
   ============================================================ */

function finalizeCharacterCreation() {
    const validation =
        validateCharacterCreation();

    if (!validation.valid) {
        return {
            success: false,
            errors: validation.errors
        };
    }


    /*
     * Gera os valores iniciais somente no momento
     * em que o personagem realmente é criado.
     */

    generateStartingAttributes();
    generateStartingPotential();
    generateStartingGenetics();


    const identity =
        characterCreationState.identity;

    const physical =
        characterCreationState.physical;

    const style =
        characterCreationState.style;


    const fullName =
        `${identity.firstName} ${identity.lastName}`.trim();


    const displayName =
        identity.nickname ||
        fullName;


    /*
     * O objeto abaixo é o personagem que será entregue
     * ao restante do jogo.
     */

    const character = {
        id:
            `fighter_${Date.now()}_${randomInt(1000, 9999)}`,

        firstName:
            identity.firstName,

        lastName:
            identity.lastName,

        fullName,

        name:
            fullName,

        displayName,

        nickname:
            identity.nickname,

        country:
            identity.country,

        city:
            identity.city,

        age:
            physical.age,

        birthAge:
            physical.age,

        height:
            physical.height,

        weight:
            physical.weight,

        weightClass:
            physical.weightClass,

        fightingStyle:
            style.fightingStyle,

        style:
            style.fightingStyle,

        stance:
            style.stance,

        attributes:
            {
                ...characterCreationState.attributes
            },

        potential:
            characterCreationState.potential,

        genetics:
            {
                ...characterCreationState.genetics
            },

        personality:
            {
                ...characterCreationState.personality
            },

        careerStage:
            physical.age >= 18
                ? "regional"
                : "amateur",

        careerLevel:
            physical.age >= 18
                ? 2
                : 1,

        amateur:
            {
                active:
                    physical.age < 18,

                fights:
                    0,

                wins:
                    0,

                losses:
                    0,

                draws:
                    0
            },

        professional:
            {
                active:
                    physical.age >= 18,

                fights:
                    0,

                wins:
                    0,

                losses:
                    0,

                draws:
                    0
            },

        record:
            {
                wins: 0,
                losses: 0,
                draws: 0,
                total: 0
            },

        fame:
            0,

        followers:
            0,

        money:
            0,

        health:
            100,

        energy:
            100,

        fatigue:
            0,

        confidence:
            characterCreationState.personality.confidence,

        moral:
            75,

        experience:
            0,

        createdAt:
            new Date().toISOString()
    };


    characterCreationState.createdCharacter =
        character;

    characterCreationState.completed =
        true;


    return {
        success: true,
        character
    };
}


/* ============================================================
   MESSAGE
   ============================================================ */

function showCreationMessage(message) {
    console.log(
        "[MMA LIFE DYNASTY]",
        message
    );


    let container =
        document.getElementById(
            "character-creation-message"
        );


    if (!container) {
        container =
            document.createElement("div");

        container.id =
            "character-creation-message";

        container.style.position =
            "fixed";

        container.style.left =
            "50%";

        container.style.bottom =
            "24px";

        container.style.transform =
            "translateX(-50%)";

        container.style.zIndex =
            "99999";

        container.style.padding =
            "12px 20px";

        container.style.borderRadius =
            "12px";

        container.style.background =
            "#151515";

        container.style.color =
            "#ffffff";

        container.style.border =
            "1px solid rgba(255,255,255,.15)";

        container.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.45)";

        container.style.fontFamily =
            "Arial, sans-serif";

        document.body.appendChild(container);
    }


    container.textContent =
        message;


    container.style.display =
        "block";


    clearTimeout(
        container._hideTimer
    );


    container._hideTimer =
        setTimeout(() => {
            container.style.display =
                "none";
        }, 3500);
}


/* ============================================================
   START GAME BRIDGE
   ============================================================ */

async function startGameAfterCharacterCreation(character) {
    console.log(
        "[MMA LIFE DYNASTY] Iniciando carreira...",
        character
    );


    /*
     * Primeiro tentamos utilizar a API principal
     * do jogo.
     */

    const gameAPI =
        globalThis.MMA_LIFE_GAME;


    if (gameAPI) {

        /*
         * Método recomendado.
         */

        if (
            typeof gameAPI.startNewGame ===
            "function"
        ) {
            const result =
                await gameAPI.startNewGame(
                    character
                );

            return result !== false;
        }


        /*
         * Compatibilidade com uma versão
         * alternativa da API.
         */

        if (
            typeof gameAPI.startCareer ===
            "function"
        ) {
            const result =
                await gameAPI.startCareer(
                    character
                );

            return result !== false;
        }
    }


    /*
     * Se o main.js ainda não possui uma função
     * específica para iniciar a carreira, emitimos
     * o evento. O main.js poderá capturá-lo.
     */

    document.dispatchEvent(
        new CustomEvent(
            "mma-life-character-created",
            {
                detail: {
                    character
                }
            }
        )
    );


    /*
     * Damos um pequeno tempo para que listeners
     * externos processem o evento.
     */

    await new Promise(
        resolve => setTimeout(resolve, 50)
    );


    return true;
}


/* ============================================================
   EVENT BINDING
   ============================================================ */

function bindCharacterCreationEvents(container) {
    if (!container) {
        return;
    }


    /*
     * INPUTS
     */

    const firstName =
        container.querySelector(
            '[data-creation-field="firstName"]'
        );

    if (firstName) {
        firstName.addEventListener(
            "input",
            event => {
                setCharacterField(
                    "firstName",
                    event.target.value
                );
            }
        );
    }


    const lastName =
        container.querySelector(
            '[data-creation-field="lastName"]'
        );

    if (lastName) {
        lastName.addEventListener(
            "input",
            event => {
                setCharacterField(
                    "lastName",
                    event.target.value
                );
            }
        );
    }


    const nickname =
        container.querySelector(
            '[data-creation-field="nickname"]'
        );

    if (nickname) {
        nickname.addEventListener(
            "input",
            event => {
                setCharacterField(
                    "nickname",
                    event.target.value
                );
            }
        );
    }


    const country =
        container.querySelector(
            '[data-creation-field="country"]'
        );

    if (country) {
        country.addEventListener(
            "change",
            event => {
                setLocation(
                    event.target.value,
                    ""
                );

                refreshCharacterCreation(
                    container
                );
            }
        );
    }


    const city =
        container.querySelector(
            '[data-creation-field="city"]'
        );

    if (city) {
        city.addEventListener(
            "change",
            event => {
                setCharacterField(
                    "city",
                    event.target.value
                );
            }
        );
    }


    const age =
        container.querySelector(
            '[data-creation-field="age"]'
        );

    if (age) {
        age.addEventListener(
            "input",
            event => {
                setPhysical({
                    age:
                        event.target.value
                });
            }
        );
    }


    const height =
        container.querySelector(
            '[data-creation-field="height"]'
        );

    if (height) {
        height.addEventListener(
            "input",
            event => {
                setPhysical({
                    height:
                        event.target.value
                });
            }
        );
    }


    const weight =
        container.querySelector(
            '[data-creation-field="weight"]'
        );

    if (weight) {
        weight.addEventListener(
            "input",
            event => {
                setPhysical({
                    weight:
                        event.target.value
                });
            }
        );
    }


    const weightClass =
        container.querySelector(
            '[data-creation-field="weightClass"]'
        );

    if (weightClass) {
        weightClass.addEventListener(
            "change",
            event => {
                setPhysical({
                    weightClass:
                        event.target.value
                });
            }
        );
    }


    const fightingStyle =
        container.querySelector(
            '[data-creation-field="fightingStyle"]'
        );

    if (fightingStyle) {
        fightingStyle.addEventListener(
            "change",
            event => {
                setStyleData({
                    fightingStyle:
                        event.target.value
                });
            }
        );
    }


    const stance =
        container.querySelector(
            '[data-creation-field="stance"]'
        );

    if (stance) {
        stance.addEventListener(
            "change",
            event => {
                setStyleData({
                    stance:
                        event.target.value
                });
            }
        );
    }


    /*
     * BOTÕES DE ESTILO
     */

    const styleButtons =
        container.querySelectorAll(
            '[data-creation-style]'
        );


    styleButtons.forEach(
        button => {
            button.addEventListener(
                "click",
                event => {
                    event.preventDefault();

                    const style =
                        button.dataset.creationStyle;

                    setStyleData({
                        fightingStyle:
                            style
                    });


                    styleButtons.forEach(
                        item => {
                            item.classList.remove(
                                "selected",
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "selected",
                        "active"
                    );
                }
            );
        }
    );


    /*
     * PERSONALIDADE
     */

    const personalityFields = [
        "discipline",
        "confidence",
        "aggression",
        "intelligence",
        "charisma"
    ];


    personalityFields.forEach(
        field => {
            const element =
                container.querySelector(
                    `[data-creation-personality="${field}"]`
                );

            if (!element) {
                return;
            }


            element.addEventListener(
                "input",
                event => {
                    setPersonality({
                        [field]:
                            event.target.value
                    });
                }
            );
        }
    );


    /*
     * NAVEGAÇÃO
     */

    const next =
        container.querySelector(
            '[data-creation-action="next"]'
        );

    if (next) {
        next.addEventListener(
            "click",
            event => {
                event.preventDefault();

                const result =
                    nextCreationStep();

                if (!result.success) {
                    showCreationMessage(
                        result.errors[0]
                    );

                    return;
                }

                refreshCharacterCreation(
                    container
                );
            }
        );
    }


    const previous =
        container.querySelector(
            '[data-creation-action="previous"]'
        );

    if (previous) {
        previous.addEventListener(
            "click",
            event => {
                event.preventDefault();

                previousCreationStep();

                refreshCharacterCreation(
                    container
                );
            }
        );
    }


    /*
     * ========================================================
     * COMEÇAR CARREIRA
     * ========================================================
     *
     * ESTA É A PARTE CORRIGIDA.
     */

    const finish =
        container.querySelector(
            '[data-creation-action="finish"]'
        );


    if (finish) {

        finish.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                /*
                 * Evita duplo clique.
                 */

                if (
                    finish.dataset.starting ===
                    "true"
                ) {
                    return;
                }


                finish.dataset.starting =
                    "true";


                finish.disabled =
                    true;


                try {

                    const result =
                        finalizeCharacterCreation();


                    if (!result.success) {

                        showCreationMessage(
                            result.errors[0] ||
                            "Não foi possível criar o personagem."
                        );

                        finish.disabled =
                            false;

                        finish.dataset.starting =
                            "false";

                        return;
                    }


                    console.log(
                        "[MMA LIFE DYNASTY] Personagem criado:",
                        result.character
                    );


                    /*
                     * Evento oficial de personagem criado.
                     */

                    document.dispatchEvent(
                        new CustomEvent(
                            "mma-life-character-created",
                            {
                                detail: {
                                    character:
                                        result.character
                                }
                            }
                        )
                    );


                    showCreationMessage(
                        "Personagem criado! Iniciando carreira..."
                    );


                    /*
                     * Agora realmente tentamos iniciar
                     * o jogo.
                     */

                    const started =
                        await startGameAfterCharacterCreation(
                            result.character
                        );


                    if (!started) {
                        throw new Error(
                            "A API principal do jogo não conseguiu iniciar a carreira."
                        );
                    }


                    /*
                     * Evento adicional para outros sistemas.
                     */

                    document.dispatchEvent(
                        new CustomEvent(
                            "mma-life-game-start-requested",
                            {
                                detail: {
                                    character:
                                        result.character
                                }
                            }
                        )
                    );


                    /*
                     * Se o main.js assumiu o controle,
                     * ele fará a transição para o dashboard.
                     */

                } catch (error) {

                    console.error(
                        "[MMA LIFE DYNASTY] Erro ao iniciar carreira:",
                        error
                    );


                    showCreationMessage(
                        "Erro ao iniciar a carreira. Veja o console."
                    );


                    finish.disabled =
                        false;

                    finish.dataset.starting =
                        "false";
                }
            }
        );
    }
}


/* ============================================================
   REFRESH
   ============================================================ */

function refreshCharacterCreation(container) {
    if (!container) {
        return;
    }

    renderCharacterCreation(container);
}


/* ============================================================
   RENDER
   ============================================================ */

function renderCharacterCreation(container) {
    if (!container) {
        console.error(
            "[MMA LIFE DYNASTY] Container da criação não encontrado."
        );

        return;
    }


    initializeCharacterCreation();


    const state =
        characterCreationState;

    const identity =
        state.identity;

    const physical =
        state.physical;

    const style =
        state.style;

    const personality =
        state.personality;


    const cities =
        getCitiesForCountry(
            identity.country
        );


    const step =
        state.currentStep;


    const fullName =
        `${identity.firstName} ${identity.lastName}`.trim();


    container.innerHTML = `
        <section
            class="creation-panel"
            style="
                min-height:100vh;
                box-sizing:border-box;
                padding:24px;
                background:#0b0b0b;
                color:#fff;
                font-family:Arial,Helvetica,sans-serif;
            "
        >

            <div
                style="
                    max-width:900px;
                    margin:0 auto;
                "
            >

                <div
                    style="
                        text-align:center;
                        margin-bottom:30px;
                    "
                >

                    <div
                        style="
                            font-size:13px;
                            letter-spacing:3px;
                            opacity:.65;
                            margin-bottom:8px;
                        "
                    >
                        MMA LIFE DYNASTY
                    </div>

                    <h1
                        style="
                            margin:0;
                            font-size:32px;
                        "
                    >
                        CRIE SEU LUTADOR
                    </h1>

                    <p
                        style="
                            margin:10px 0 0;
                            opacity:.65;
                        "
                    >
                        Construa sua carreira desde o início.
                    </p>

                </div>


                <div
                    style="
                        display:flex;
                        gap:8px;
                        margin-bottom:25px;
                    "
                >

                    ${[1, 2, 3, 4, 5]
                        .map(
                            number => `
                                <div
                                    style="
                                        flex:1;
                                        height:5px;
                                        border-radius:10px;
                                        background:${
                                            number <= step
                                                ? "#ffffff"
                                                : "rgba(255,255,255,.15)"
                                        };
                                    "
                                ></div>
                            `
                        )
                        .join("")
                    }

                </div>


                <div
                    style="
                        background:rgba(255,255,255,.045);
                        border:1px solid rgba(255,255,255,.10);
                        border-radius:20px;
                        padding:24px;
                    "
                >

                    ${renderCreationStep(step)}

                </div>


                <div
                    style="
                        margin-top:20px;
                        display:flex;
                        justify-content:space-between;
                        gap:12px;
                    "
                >

                    ${
                        step > 1
                            ? `
                                <button
                                    type="button"
                                    data-creation-action="previous"
                                    style="
                                        padding:14px 22px;
                                        border:1px solid rgba(255,255,255,.15);
                                        border-radius:12px;
                                        background:#151515;
                                        color:#fff;
                                        cursor:pointer;
                                    "
                                >
                                    ← VOLTAR
                                </button>
                            `
                            : `<div></div>`
                    }


                    ${
                        step < 5
                            ? `
                                <button
                                    type="button"
                                    data-creation-action="next"
                                    style="
                                        padding:14px 28px;
                                        border:0;
                                        border-radius:12px;
                                        background:#fff;
                                        color:#000;
                                        font-weight:700;
                                        cursor:pointer;
                                    "
                                >
                                    CONTINUAR →
                                </button>
                            `
                            : `
                                <button
                                    type="button"
                                    data-creation-action="finish"
                                    style="
                                        padding:15px 30px;
                                        border:0;
                                        border-radius:12px;
                                        background:#fff;
                                        color:#000;
                                        font-weight:800;
                                        cursor:pointer;
                                    "
                                >
                                    COMEÇAR CARREIRA
                                </button>
                            `
                    }

                </div>


                ${
                    fullName
                        ? `
                            <div
                                style="
                                    margin-top:25px;
                                    text-align:center;
                                    opacity:.7;
                                    font-size:14px;
                                "
                            >
                                ${escapeHTML(fullName)}
                            </div>
                        `
                        : ""
                }

            </div>

        </section>
    `;


    bindCharacterCreationEvents(
        container
    );
}


/* ============================================================
   STEP RENDER
   ============================================================ */

function renderCreationStep(step) {

    if (step === 1) {

        return `
            <div>

                <h2>IDENTIDADE</h2>

                <p style="opacity:.6;">
                    Quem é você?
                </p>


                <div
                    style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:16px;
                    "
                >

                    <label>
                        <span>Nome</span>

                        <input
                            type="text"
                            data-creation-field="firstName"
                            value="${escapeHTML(characterCreationState.identity.firstName)}"
                            placeholder="Seu nome"
                            autocomplete="off"
                            style="${inputStyle()}"
                        >
                    </label>


                    <label>
                        <span>Sobrenome</span>

                        <input
                            type="text"
                            data-creation-field="lastName"
                            value="${escapeHTML(characterCreationState.identity.lastName)}"
                            placeholder="Seu sobrenome"
                            autocomplete="off"
                            style="${inputStyle()}"
                        >
                    </label>

                </div>


                <label
                    style="
                        display:block;
                        margin-top:16px;
                    "
                >
                    <span>Apelido / Nome de luta</span>

                    <input
                        type="text"
                        data-creation-field="nickname"
                        value="${escapeHTML(characterCreationState.identity.nickname)}"
                        placeholder="Opcional"
                        autocomplete="off"
                        style="${inputStyle()}"
                    >
                </label>

            </div>
        `;
    }


    if (step === 2) {

        const country =
            characterCreationState.identity.country;

        const city =
            characterCreationState.identity.city;


        return `
            <div>

                <h2>ORIGEM</h2>

                <p style="opacity:.6;">
                    Escolha onde sua história começa.
                </p>


                <label style="display:block;margin-top:20px;">
                    <span>País</span>

                    <select
                        data-creation-field="country"
                        style="${inputStyle()}"
                    >

                        ${CREATION_OPTIONS.countries
                            .map(
                                item => `
                                    <option
                                        value="${escapeHTML(item)}"
                                        ${item === country ? "selected" : ""}
                                    >
                                        ${escapeHTML(item)}
                                    </option>
                                `
                            )
                            .join("")
                        }

                    </select>

                </label>


                <label
                    style="
                        display:block;
                        margin-top:16px;
                    "
                >

                    <span>Cidade</span>

                    <select
                        data-creation-field="city"
                        style="${inputStyle()}"
                    >

                        ${
                            getCitiesForCountry(country)
                                .map(
                                    item => `
                                        <option
                                            value="${escapeHTML(item)}"
                                            ${item === city ? "selected" : ""}
                                        >
                                            ${escapeHTML(item)}
                                        </option>
                                    `
                                )
                                .join("")
                        }

                    </select>

                </label>

            </div>
        `;
    }


    if (step === 3) {

        return `
            <div>

                <h2>FÍSICO</h2>

                <p style="opacity:.6;">
                    Defina as características físicas iniciais.
                </p>


                <div
                    style="
                        display:grid;
                        grid-template-columns:repeat(3,1fr);
                        gap:16px;
                        margin-top:20px;
                    "
                >

                    <label>
                        <span>Idade</span>

                        <input
                            type="number"
                            min="14"
                            max="60"
                            data-creation-field="age"
                            value="${characterCreationState.physical.age}"
                            style="${inputStyle()}"
                        >
                    </label>


                    <label>
                        <span>Altura (m)</span>

                        <input
                            type="number"
                            min="1.40"
                            max="2.20"
                            step="0.01"
                            data-creation-field="height"
                            value="${characterCreationState.physical.height}"
                            style="${inputStyle()}"
                        >
                    </label>


                    <label>
                        <span>Peso (kg)</span>

                        <input
                            type="number"
                            min="45"
                            max="160"
                            step="0.1"
                            data-creation-field="weight"
                            value="${characterCreationState.physical.weight}"
                            style="${inputStyle()}"
                        >
                    </label>

                </div>


                <label
                    style="
                        display:block;
                        margin-top:16px;
                    "
                >

                    <span>Categoria de peso</span>

                    <select
                        data-creation-field="weightClass"
                        style="${inputStyle()}"
                    >

                        ${CREATION_OPTIONS.weightClasses
                            .map(
                                item => `
                                    <option
                                        value="${escapeHTML(item)}"
                                        ${
                                            item ===
                                            characterCreationState.physical.weightClass
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escapeHTML(item)}
                                        ${
                                            WEIGHT_CLASS_LIMITS[item]
                                                ? ` — ${WEIGHT_CLASS_LIMITS[item]} kg`
                                                : ""
                                        }
                                    </option>
                                `
                            )
                            .join("")
                        }

                    </select>

                </label>

            </div>
        `;
    }


    if (step === 4) {

        return `
            <div>

                <h2>ESTILO DE LUTA</h2>

                <p style="opacity:.6;">
                    Escolha a base técnica do seu lutador.
                </p>


                <div
                    style="
                        display:grid;
                        grid-template-columns:repeat(3,1fr);
                        gap:10px;
                        margin-top:20px;
                    "
                >

                    ${CREATION_OPTIONS.fightingStyles
                        .map(
                            item => `
                                <button
                                    type="button"
                                    data-creation-style="${escapeHTML(item)}"
                                    class="${
                                        item ===
                                        characterCreationState.style.fightingStyle
                                            ? "selected active"
                                            : ""
                                    }"
                                    style="
                                        padding:16px 10px;
                                        border-radius:12px;
                                        border:1px solid rgba(255,255,255,.15);
                                        background:${
                                            item ===
                                            characterCreationState.style.fightingStyle
                                                ? "#fff"
                                                : "#151515"
                                        };
                                        color:${
                                            item ===
                                            characterCreationState.style.fightingStyle
                                                ? "#000"
                                                : "#fff"
                                        };
                                        cursor:pointer;
                                    "
                                >
                                    ${escapeHTML(item)}
                                </button>
                            `
                        )
                        .join("")
                    }

                </div>


                <label
                    style="
                        display:block;
                        margin-top:20px;
                    "
                >

                    <span>Base / Guarda</span>

                    <select
                        data-creation-field="stance"
                        style="${inputStyle()}"
                    >

                        ${CREATION_OPTIONS.stances
                            .map(
                                item => `
                                    <option
                                        value="${escapeHTML(item)}"
                                        ${
                                            item ===
                                            characterCreationState.style.stance
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escapeHTML(item)}
                                    </option>
                                `
                            )
                            .join("")
                        }

                    </select>

                </label>

            </div>
        `;
    }


    if (step === 5) {

        return `
            <div>

                <h2>PERSONALIDADE</h2>

                <p style="opacity:.6;">
                    Suas características mentais influenciam o desenvolvimento da carreira.
                </p>


                ${renderPersonalitySlider(
                    "disciplina",
                    "Disciplina",
                    characterCreationState.personality.discipline
                )}


                ${renderPersonalitySlider(
                    "confidence",
                    "Confiança",
                    characterCreationState.personality.confidence
                )}


                ${renderPersonalitySlider(
                    "aggression",
                    "Agressividade",
                    characterCreationState.personality.aggression
                )}


                ${renderPersonalitySlider(
                    "intelligence",
                    "Inteligência",
                    characterCreationState.personality.intelligence
                )}


                ${renderPersonalitySlider(
                    "charisma",
                    "Carisma",
                    characterCreationState.personality.charisma
                )}


                <div
                    style="
                        margin-top:25px;
                        padding:18px;
                        border-radius:14px;
                        background:rgba(255,255,255,.05);
                    "
                >

                    <strong>
                        Resumo
                    </strong>

                    <div
                        style="
                            margin-top:12px;
                            line-height:1.8;
                            opacity:.8;
                        "
                    >
                        ${escapeHTML(
                            characterCreationState.identity.firstName ||
                            "Novo lutador"
                        )}

                        ${escapeHTML(
                            characterCreationState.identity.lastName
                        )}

                        <br>

                        ${escapeHTML(
                            characterCreationState.style.fightingStyle
                        )}

                        ·

                        ${escapeHTML(
                            characterCreationState.style.stance
                        )}

                        <br>

                        ${characterCreationState.physical.age}
                        anos ·
                        ${characterCreationState.physical.height}m ·
                        ${characterCreationState.physical.weight}kg

                    </div>

                </div>

            </div>
        `;
    }


    return "";
}


/* ============================================================
   PERSONALITY SLIDER
   ============================================================ */

function renderPersonalitySlider(
    field,
    label,
    value
) {

    return `
        <label
            style="
                display:block;
                margin-top:20px;
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    margin-bottom:8px;
                "
            >

                <span>
                    ${escapeHTML(label)}
                </span>

                <strong>
                    ${value}
                </strong>

            </div>


            <input
                type="range"
                min="0"
                max="100"
                value="${value}"
                data-creation-personality="${escapeHTML(field)}"
                style="
                    width:100%;
                "
            >

        </label>
    `;
}


/* ============================================================
   INPUT STYLE
   ============================================================ */

function inputStyle() {

    return `
        width:100%;
        box-sizing:border-box;
        margin-top:7px;
        padding:13px 14px;
        border-radius:10px;
        border:1px solid rgba(255,255,255,.14);
        background:#111111;
        color:#ffffff;
        outline:none;
    `;
}


/* ============================================================
   PUBLIC API
   ============================================================ */

const characterCreationAPI = {

    version:
        CHARACTER_CREATION_VERSION,

    initialize:
        initializeCharacterCreation,

    reset:
        resetCharacterCreation,

    getState:
        getCharacterCreationState,

    getData:
        getCharacterCreationData,

    getOptions:
        getCreationOptions,

    getCurrentStep:
        getCurrentCreationStep,

    setField:
        setCharacterField,

    setIdentity,

    setLocation,

    getCities:
        getCitiesForCountry,

    setPhysical,

    setPhysicalData,

    setStyle,

    setStyleData,

    setPersonality,

    generateAttributes:
        generateStartingAttributes,

    generatePotential:
        generateStartingPotential,

    generateGenetics:
        generateStartingGenetics,

    validate:
        validateCharacterCreation,

    validateCurrentStep:
        validateCurrentCreationStep,

    finalize:
        finalizeCharacterCreation,

    goToStep:
        goToCreationStep,

    nextStep:
        nextCreationStep,

    previousStep:
        previousCreationStep,

    getSummary:
        getCharacterCreationSummary,

    render:
        renderCharacterCreation,

    startGame:
        startGameAfterCharacterCreation
};


/* ============================================================
   GLOBAL API
   ============================================================ */

globalThis.characterCreationAPI =
    characterCreationAPI;


/* ============================================================
   EXPORT
   ============================================================ */

export {
    characterCreationAPI,
    initializeCharacterCreation,
    resetCharacterCreation,
    getCharacterCreationState,
    getCharacterCreationData,
    getCreationOptions,
    getCurrentCreationStep,
    setCharacterField,
    setIdentity,
    setLocation,
    getCitiesForCountry,
    setPhysical,
    setPhysicalData,
    setStyle,
    setStyleData,
    setPersonality,
    generateStartingAttributes,
    generateStartingPotential,
    generateStartingGenetics,
    validateCharacterCreation,
    validateCurrentCreationStep,
    finalizeCharacterCreation,
    goToCreationStep,
    nextCreationStep,
    previousCreationStep,
    getCharacterCreationSummary,
    renderCharacterCreation,
    startGameAfterCharacterCreation
};
