/* ============================================================
   MMA LIFE DYNASTY
   CHARACTER CREATION
   ============================================================ */

"use strict";

/* ============================================================
   CONFIG
   ============================================================ */

const CHARACTER_CREATION_VERSION = 1;

const CREATION_STEPS = [
    "identity",
    "physical",
    "style",
    "personality",
    "confirmation"
];

const DEFAULT_CHARACTER = {
    firstName: "",
    lastName: "",
    nickname: "",
    gender: "male",

    age: 18,

    country: "Brazil",
    city: "São Paulo",

    weightClass: "lightweight",

    height: 175,
    weight: 70,

    fightingStyle: "mixed",
    stance: "orthodox",

    personality: "disciplined",

    attributes: {
        striking: 50,
        grappling: 50,
        wrestling: 50,
        submission: 50,
        defense: 50,
        cardio: 50,
        strength: 50,
        speed: 50,
        chin: 50,
        fightIQ: 50
    },

    potential: {
        overall: 50,
        ceiling: 75
    },

    genetics: {
        athleticism: 50,
        durability: 50,
        strength: 50,
        speed: 50,
        cardio: 50
    }
};


/* ============================================================
   STATE
   ============================================================ */

const characterCreationState = {

    initialized: false,

    currentStep: "identity",

    completed: false,

    character: cloneCreationData(
        DEFAULT_CHARACTER
    )

};


/* ============================================================
   UTILITIES
   ============================================================ */

function cloneCreationData(data) {

    try {

        return JSON.parse(
            JSON.stringify(data)
        );

    } catch {

        return {
            ...data
        };

    }

}


function clampCreation(
    value,
    min,
    max
) {

    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {

        return min;

    }

    return Math.max(
        min,
        Math.min(
            max,
            number
        )
    );

}


function normalizeCreationText(
    value
) {

    return String(
        value ?? ""
    )
        .trim()
        .replace(/\s+/g, " ");

}


function capitalizeCreation(
    value
) {

    const text =
        normalizeCreationText(
            value
        );

    if (!text) {

        return "";

    }

    return text
        .toLowerCase()
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");

}


/* ============================================================
   OPTIONS
   ============================================================ */

const CREATION_OPTIONS = {

    genders: [
        {
            id: "male",
            name: "Masculino"
        },
        {
            id: "female",
            name: "Feminino"
        }
    ],

    countries: [
        {
            id: "Brazil",
            name: "Brasil"
        },
        {
            id: "United States",
            name: "Estados Unidos"
        },
        {
            id: "Mexico",
            name: "México"
        },
        {
            id: "Argentina",
            name: "Argentina"
        },
        {
            id: "Canada",
            name: "Canadá"
        },
        {
            id: "United Kingdom",
            name: "Reino Unido"
        },
        {
            id: "France",
            name: "França"
        },
        {
            id: "Germany",
            name: "Alemanha"
        },
        {
            id: "Spain",
            name: "Espanha"
        },
        {
            id: "Russia",
            name: "Rússia"
        },
        {
            id: "Georgia",
            name: "Geórgia"
        },
        {
            id: "Japan",
            name: "Japão"
        },
        {
            id: "South Korea",
            name: "Coreia do Sul"
        },
        {
            id: "Thailand",
            name: "Tailândia"
        },
        {
            id: "Australia",
            name: "Austrália"
        }
    ],

    cities: {

        Brazil: [
            "São Paulo",
            "Rio de Janeiro",
            "Curitiba",
            "Belo Horizonte",
            "Porto Alegre",
            "Brasília",
            "Salvador",
            "Recife",
            "Fortaleza",
            "Manaus",
            "Belém",
            "Macapá"
        ],

        "United States": [
            "New York",
            "Los Angeles",
            "Las Vegas",
            "Miami",
            "Chicago",
            "Houston",
            "Atlanta"
        ],

        Mexico: [
            "Mexico City",
            "Guadalajara",
            "Monterrey"
        ],

        Argentina: [
            "Buenos Aires",
            "Córdoba"
        ],

        Canada: [
            "Toronto",
            "Montreal",
            "Vancouver"
        ],

        "United Kingdom": [
            "London",
            "Manchester",
            "Birmingham"
        ],

        France: [
            "Paris",
            "Lyon"
        ],

        Germany: [
            "Berlin",
            "Munich"
        ],

        Spain: [
            "Madrid",
            "Barcelona"
        ],

        Russia: [
            "Moscow",
            "Makhachkala"
        ],

        Georgia: [
            "Tbilisi"
        ],

        Japan: [
            "Tokyo",
            "Osaka"
        ],

        "South Korea": [
            "Seoul"
        ],

        Thailand: [
            "Bangkok",
            "Phuket"
        ],

        Australia: [
            "Sydney",
            "Melbourne"
        ]

    },

    weightClasses: [

        {
            id: "flyweight",
            name: "Peso Mosca",
            min: 56.7,
            max: 57
        },

        {
            id: "bantamweight",
            name: "Peso Galo",
            min: 57,
            max: 61.2
        },

        {
            id: "featherweight",
            name: "Peso Pena",
            min: 61.2,
            max: 65.8
        },

        {
            id: "lightweight",
            name: "Peso Leve",
            min: 65.8,
            max: 70.3
        },

        {
            id: "welterweight",
            name: "Peso Meio-Médio",
            min: 70.3,
            max: 77.1
        },

        {
            id: "middleweight",
            name: "Peso Médio",
            min: 77.1,
            max: 83.9
        },

        {
            id: "light_heavyweight",
            name: "Peso Meio-Pesado",
            min: 83.9,
            max: 93
        },

        {
            id: "heavyweight",
            name: "Peso Pesado",
            min: 93,
            max: 120.2
        }

    ],

    fightingStyles: [

        {
            id: "mixed",
            name: "Completo",
            description:
                "Equilibrado entre trocação, quedas e chão."
        },

        {
            id: "striker",
            name: "Striker",
            description:
                "Especialista em boxe, kickboxing e muay thai."
        },

        {
            id: "wrestler",
            name: "Wrestler",
            description:
                "Foco em quedas, controle e ground and pound."
        },

        {
            id: "grappler",
            name: "Grappler",
            description:
                "Especialista em jiu-jitsu e finalizações."
        }

    ],

    stances: [

        {
            id: "orthodox",
            name: "Ortodoxo"
        },

        {
            id: "southpaw",
            name: "Canhoto"
        },

        {
            id: "switch",
            name: "Switch"
        }

    ],

    personalities: [

        {
            id: "disciplined",
            name: "Disciplinado",
            description:
                "Melhor consistência nos treinos."
        },

        {
            id: "aggressive",
            name: "Agressivo",
            description:
                "Busca intensidade e pressão nas lutas."
        },

        {
            id: "calm",
            name: "Calmo",
            description:
                "Maior estabilidade sob pressão."
        },

        {
            id: "charismatic",
            name: "Carismático",
            description:
                "Maior potencial de fama e popularidade."
        },

        {
            id: "ambitious",
            name: "Ambicioso",
            description:
                "Busca evolução rápida e grandes oportunidades."
        }

    ]

};


/* ============================================================
   GETTERS
   ============================================================ */

function getCharacterCreationState() {

    return characterCreationState;

}


function getCharacterCreationData() {

    return cloneCreationData(
        characterCreationState.character
    );

}


function getCurrentCreationStep() {

    return characterCreationState.currentStep;

}


function getCreationOptions() {

    return cloneCreationData(
        CREATION_OPTIONS
    );

}


/* ============================================================
   SET CHARACTER DATA
   ============================================================ */

function setCharacterField(
    field,
    value
) {

    if (
        !field
    ) {

        return false;

    }


    if (
        field.includes(".")
    ) {

        const parts =
            field.split(".");

        let target =
            characterCreationState.character;


        for (
            let i = 0;
            i < parts.length - 1;
            i++
        ) {

            if (
                !target[parts[i]]
            ) {

                target[parts[i]] = {};

            }

            target =
                target[parts[i]];

        }


        target[
            parts[parts.length - 1]
        ] = value;


        return true;

    }


    if (
        Object.prototype.hasOwnProperty.call(
            characterCreationState.character,
            field
        )
    ) {

        characterCreationState.character[
            field
        ] = value;

        return true;

    }


    return false;

}


/* ============================================================
   IDENTITY
   ============================================================ */

function setIdentity(
    data = {}
) {

    if (
        data.firstName !== undefined
    ) {

        characterCreationState.character.firstName =
            capitalizeCreation(
                data.firstName
            );

    }


    if (
        data.lastName !== undefined
    ) {

        characterCreationState.character.lastName =
            capitalizeCreation(
                data.lastName
            );

    }


    if (
        data.nickname !== undefined
    ) {

        characterCreationState.character.nickname =
            normalizeCreationText(
                data.nickname
            );

    }


    if (
        data.gender !== undefined
    ) {

        const validGender =
            CREATION_OPTIONS.genders
                .some(
                    item =>
                        item.id ===
                        data.gender
                );

        if (
            validGender
        ) {

            characterCreationState.character.gender =
                data.gender;

        }

    }


    return getCharacterCreationData();

}


/* ============================================================
   LOCATION
   ============================================================ */

function setLocation(
    country,
    city
) {

    const validCountry =
        CREATION_OPTIONS.countries
            .some(
                item =>
                    item.id === country
            );


    if (
        !validCountry
    ) {

        return false;

    }


    characterCreationState.character.country =
        country;


    const availableCities =
        CREATION_OPTIONS.cities[
            country
        ] || [];


    if (
        city &&
        availableCities.includes(
            city
        )
    ) {

        characterCreationState.character.city =
            city;

    } else {

        characterCreationState.character.city =
            availableCities[0] ||
            "";

    }


    return true;

}


function getCitiesForCountry(
    country
) {

    return [
        ...(
            CREATION_OPTIONS.cities[
                country
            ] || []
        )
    ];

}


/* ============================================================
   PHYSICAL
   ============================================================ */

function setPhysicalData(
    data = {}
) {

    if (
        data.age !== undefined
    ) {

        characterCreationState.character.age =
            clampCreation(
                data.age,
                18,
                40
            );

    }


    if (
        data.height !== undefined
    ) {

        characterCreationState.character.height =
            clampCreation(
                data.height,
                150,
                220
            );

    }


    if (
        data.weight !== undefined
    ) {

        characterCreationState.character.weight =
            clampCreation(
                data.weight,
                50,
                150
            );

    }


    if (
        data.weightClass !== undefined
    ) {

        const valid =
            CREATION_OPTIONS.weightClasses
                .some(
                    item =>
                        item.id ===
                        data.weightClass
                );

        if (
            valid
        ) {

            characterCreationState.character.weightClass =
                data.weightClass;

        }

    }


    return getCharacterCreationData();

}


/* ============================================================
   STYLE
   ============================================================ */

function setStyleData(
    data = {}
) {

    if (
        data.fightingStyle !== undefined
    ) {

        const valid =
            CREATION_OPTIONS.fightingStyles
                .some(
                    item =>
                        item.id ===
                        data.fightingStyle
                );

        if (
            valid
        ) {

            characterCreationState.character.fightingStyle =
                data.fightingStyle;

        }

    }


    if (
        data.stance !== undefined
    ) {

        const valid =
            CREATION_OPTIONS.stances
                .some(
                    item =>
                        item.id ===
                        data.stance
                );

        if (
            valid
        ) {

            characterCreationState.character.stance =
                data.stance;

        }

    }


    return getCharacterCreationData();

}


/* ============================================================
   PERSONALITY
   ============================================================ */

function setPersonality(
    personality
) {

    const valid =
        CREATION_OPTIONS.personalities
            .some(
                item =>
                    item.id ===
                    personality
            );


    if (
        !valid
    ) {

        return false;

    }


    characterCreationState.character.personality =
        personality;


    return true;

}


/* ============================================================
   STARTING ATTRIBUTES
   ============================================================ */

function generateStartingAttributes() {

    const character =
        characterCreationState.character;


    const style =
        character.fightingStyle;


    const attributes =
        cloneCreationData(
            DEFAULT_CHARACTER.attributes
        );


    if (
        style === "striker"
    ) {

        attributes.striking += 12;
        attributes.speed += 6;

    }


    if (
        style === "wrestler"
    ) {

        attributes.wrestling += 12;
        attributes.strength += 5;

    }


    if (
        style === "grappler"
    ) {

        attributes.grappling += 10;
        attributes.submission += 10;

    }


    if (
        style === "mixed"
    ) {

        attributes.fightIQ += 5;
        attributes.defense += 5;

    }


    const personality =
        character.personality;


    if (
        personality === "disciplined"
    ) {

        attributes.cardio += 4;

    }


    if (
        personality === "aggressive"
    ) {

        attributes.striking += 4;
        attributes.strength += 3;

    }


    if (
        personality === "calm"
    ) {

        attributes.defense += 5;
        attributes.fightIQ += 4;

    }


    if (
        personality === "ambitious"
    ) {

        attributes.cardio += 3;
        attributes.speed += 3;

    }


    if (
        personality === "charismatic"
    ) {

        attributes.fightIQ += 2;

    }


    for (
        const key of Object.keys(
            attributes
        )
    ) {

        attributes[key] =
            clampCreation(
                attributes[key],
                1,
                100
            );

    }


    characterCreationState.character.attributes =
        attributes;


    return cloneCreationData(
        attributes
    );

}


/* ============================================================
   POTENTIAL
   ============================================================ */

function generateStartingPotential() {

    const character =
        characterCreationState.character;


    const base =
        65;


    const variation =
        Math.floor(
            Math.random() * 21
        ) - 10;


    let ceiling =
        base +
        variation;


    if (
        character.personality ===
        "ambitious"
    ) {

        ceiling += 5;

    }


    if (
        character.personality ===
        "disciplined"
    ) {

        ceiling += 3;

    }


    ceiling =
        clampCreation(
            ceiling,
            45,
            90
        );


    characterCreationState.character.potential =
        {
            overall: Math.round(
                ceiling * 0.65
            ),

            ceiling
        };


    return cloneCreationData(
        characterCreationState.character.potential
    );

}


/* ============================================================
   GENETICS
   ============================================================ */

function generateStartingGenetics() {

    const character =
        characterCreationState.character;


    const genetics =
        cloneCreationData(
            DEFAULT_CHARACTER.genetics
        );


    const height =
        Number(
            character.height
        );


    if (
        height >= 185
    ) {

        genetics.athleticism += 5;
        genetics.strength += 4;

    }


    if (
        height <= 165
    ) {

        genetics.speed += 5;

    }


    const style =
        character.fightingStyle;


    if (
        style === "wrestler"
    ) {

        genetics.strength += 4;

    }


    if (
        style === "striker"
    ) {

        genetics.speed += 4;

    }


    if (
        style === "grappler"
    ) {

        genetics.durability += 3;

    }


    for (
        const key of Object.keys(
            genetics
        )
    ) {

        genetics[key] =
            clampCreation(
                genetics[key],
                1,
                100
            );

    }


    characterCreationState.character.genetics =
        genetics;


    return cloneCreationData(
        genetics
    );

}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateCharacterCreation() {

    const character =
        characterCreationState.character;


    const errors = [];


    if (
        !character.firstName
    ) {

        errors.push(
            "Informe o primeiro nome."
        );

    }


    if (
        !character.lastName
    ) {

        errors.push(
            "Informe o sobrenome."
        );

    }


    if (
        character.age < 18
    ) {

        errors.push(
            "O personagem precisa ter pelo menos 18 anos."
        );

    }


    if (
        character.age > 40
    ) {

        errors.push(
            "A idade inicial não pode ultrapassar 40 anos."
        );

    }


    if (
        !character.country
    ) {

        errors.push(
            "Escolha um país."
        );

    }


    if (
        !character.city
    ) {

        errors.push(
            "Escolha uma cidade."
        );

    }


    if (
        !character.weightClass
    ) {

        errors.push(
            "Escolha uma categoria de peso."
        );

    }


    if (
        !character.fightingStyle
    ) {

        errors.push(
            "Escolha um estilo de luta."
        );

    }


    if (
        !character.personality
    ) {

        errors.push(
            "Escolha uma personalidade."
        );

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* ============================================================
   FINALIZE
   ============================================================ */

function finalizeCharacterCreation() {

    const validation =
        validateCharacterCreation();


    if (
        !validation.valid
    ) {

        return {

            success: false,

            errors:
                validation.errors

        };

    }


    generateStartingAttributes();

    generateStartingPotential();

    generateStartingGenetics();


    const character =
        getCharacterCreationData();


    character.fullName =
        `${character.firstName} ${character.lastName}`
            .trim();


    character.displayName =
        character.nickname ||
        character.fullName;


    character.createdAt =
        new Date().toISOString();


    characterCreationState.character =
        character;


    characterCreationState.completed =
        true;


    return {

        success: true,

        character:
            getCharacterCreationData()

    };

}


/* ============================================================
   STEP NAVIGATION
   ============================================================ */

function goToCreationStep(
    step
) {

    if (
        !CREATION_STEPS.includes(
            step
        )
    ) {

        return false;

    }


    characterCreationState.currentStep =
        step;


    return true;

}


function nextCreationStep() {

    const index =
        CREATION_STEPS.indexOf(
            characterCreationState.currentStep
        );


    if (
        index < 0 ||
        index >=
        CREATION_STEPS.length - 1
    ) {

        return false;

    }


    characterCreationState.currentStep =
        CREATION_STEPS[
            index + 1
        ];


    return true;

}


function previousCreationStep() {

    const index =
        CREATION_STEPS.indexOf(
            characterCreationState.currentStep
        );


    if (
        index <= 0
    ) {

        return false;

    }


    characterCreationState.currentStep =
        CREATION_STEPS[
            index - 1
        ];


    return true;

}


/* ============================================================
   RESET
   ============================================================ */

function resetCharacterCreation() {

    characterCreationState.currentStep =
        "identity";

    characterCreationState.completed =
        false;

    characterCreationState.character =
        cloneCreationData(
            DEFAULT_CHARACTER
        );


    return getCharacterCreationData();

}


/* ============================================================
   SUMMARY
   ============================================================ */

function getCharacterCreationSummary() {

    const character =
        characterCreationState.character;


    const weightClass =
        CREATION_OPTIONS.weightClasses
            .find(
                item =>
                    item.id ===
                    character.weightClass
            );


    const style =
        CREATION_OPTIONS.fightingStyles
            .find(
                item =>
                    item.id ===
                    character.fightingStyle
            );


    const personality =
        CREATION_OPTIONS.personalities
            .find(
                item =>
                    item.id ===
                    character.personality
            );


    return {

        name:
            character.fullName ||
            `${character.firstName} ${character.lastName}`
                .trim(),

        nickname:
            character.nickname,

        age:
            character.age,

        location:
            `${character.city}, ${character.country}`,

        weightClass:
            weightClass?.name ||
            character.weightClass,

        weight:
            character.weight,

        height:
            character.height,

        style:
            style?.name ||
            character.fightingStyle,

        personality:
            personality?.name ||
            character.personality,

        stance:
            character.stance,

        attributes:
            cloneCreationData(
                character.attributes
            ),

        potential:
            cloneCreationData(
                character.potential
            ),

        genetics:
            cloneCreationData(
                character.genetics
            )

    };

}


/* ============================================================
   RENDER
   ============================================================ */

function renderCharacterCreation(
    container
) {

    if (
        !container
    ) {

        return null;

    }


    const character =
        characterCreationState.character;


    const summary =
        getCharacterCreationSummary();


    container.innerHTML = `

        <section
            class="character-creation"
            data-version="${CHARACTER_CREATION_VERSION}"
        >

            <header class="creation-header">

                <div>

                    <span class="creation-kicker">
                        MMA LIFE DYNASTY
                    </span>

                    <h1>
                        Crie seu lutador
                    </h1>

                    <p>
                        Sua carreira começa aqui.
                    </p>

                </div>

                <div class="creation-step">
                    Etapa
                    ${CREATION_STEPS.indexOf(
                        characterCreationState.currentStep
                    ) + 1}
                    /
                    ${CREATION_STEPS.length}
                </div>

            </header>


            <div class="creation-progress">

                ${CREATION_STEPS.map(
                    (step, index) => `

                        <button
                            type="button"
                            class="creation-progress-step ${
                                step ===
                                characterCreationState.currentStep
                                    ? "active"
                                    : ""
                            }"
                            data-creation-step="${step}"
                        >
                            ${index + 1}
                        </button>

                    `
                ).join("")}

            </div>


            <div class="creation-layout">


                <div class="creation-panel">

                    ${
                        characterCreationState.currentStep ===
                        "identity"

                            ? renderIdentityStep()

                            : ""
                    }


                    ${
                        characterCreationState.currentStep ===
                        "physical"

                            ? renderPhysicalStep()

                            : ""
                    }


                    ${
                        characterCreationState.currentStep ===
                        "style"

                            ? renderStyleStep()

                            : ""
                    }


                    ${
                        characterCreationState.currentStep ===
                        "personality"

                            ? renderPersonalityStep()

                            : ""
                    }


                    ${
                        characterCreationState.currentStep ===
                        "confirmation"

                            ? renderConfirmationStep()

                            : ""
                    }


                    <div class="creation-navigation">

                        <button
                            type="button"
                            class="creation-button secondary"
                            data-creation-action="previous"
                            ${
                                characterCreationState.currentStep ===
                                "identity"
                                    ? "disabled"
                                    : ""
                            }
                        >
                            VOLTAR
                        </button>


                        ${
                            characterCreationState.currentStep !==
                            "confirmation"

                                ? `

                                    <button
                                        type="button"
                                        class="creation-button primary"
                                        data-creation-action="next"
                                    >
                                        CONTINUAR
                                    </button>

                                `

                                : `

                                    <button
                                        type="button"
                                        class="creation-button primary"
                                        data-creation-action="finish"
                                    >
                                        COMEÇAR CARREIRA
                                    </button>

                                `
                        }

                    </div>

                </div>


                <aside class="creation-preview">

                    <div class="preview-label">
                        SEU LUTADOR
                    </div>

                    <h2>
                        ${
                            summary.name ||
                            "Novo Lutador"
                        }
                    </h2>


                    ${
                        summary.nickname

                            ? `
                                <div class="preview-nickname">
                                    "${escapeCreationHtml(
                                        summary.nickname
                                    )}"
                                </div>
                            `

                            : ""
                    }


                    <div class="preview-grid">

                        <div>
                            <span>IDADE</span>
                            <strong>
                                ${summary.age}
                            </strong>
                        </div>

                        <div>
                            <span>PESO</span>
                            <strong>
                                ${summary.weight}
                                kg
                            </strong>
                        </div>

                        <div>
                            <span>ALTURA</span>
                            <strong>
                                ${summary.height}
                                cm
                            </strong>
                        </div>

                        <div>
                            <span>CATEGORIA</span>
                            <strong>
                                ${summary.weightClass}
                            </strong>
                        </div>

                    </div>


                    <div class="preview-section">

                        <span>LOCALIZAÇÃO</span>

                        <strong>
                            ${escapeCreationHtml(
                                summary.location
                            )}
                        </strong>

                    </div>


                    <div class="preview-section">

                        <span>ESTILO</span>

                        <strong>
                            ${escapeCreationHtml(
                                summary.style
                            )}
                        </strong>

                    </div>


                    <div class="preview-section">

                        <span>PERSONALIDADE</span>

                        <strong>
                            ${escapeCreationHtml(
                                summary.personality
                            )}
                        </strong>

                    </div>


                    <div class="preview-section">

                        <span>BASE DE POTENCIAL</span>

                        <div class="preview-bar">

                            <div
                                style="
                                    width: ${
                                        summary.potential?.ceiling ||
                                        0
                                    }%;
                                "
                            ></div>

                        </div>

                        <strong>
                            ${
                                summary.potential?.ceiling ||
                                "?"
                            }
                            / 100
                        </strong>

                    </div>

                </aside>

            </div>

        </section>

    `;


    bindCharacterCreationEvents(
        container
    );


    return container;

}


/* ============================================================
   STEP RENDERERS
   ============================================================ */

function renderIdentityStep() {

    const character =
        characterCreationState.character;


    return `

        <div class="creation-step-content">

            <div class="creation-title">

                <span>01</span>

                <div>
                    <h2>Identidade</h2>

                    <p>
                        Quem será o protagonista da sua história?
                    </p>
                </div>

            </div>


            <div class="creation-form-grid">

                <label>

                    <span>Nome</span>

                    <input
                        type="text"
                        data-creation-field="firstName"
                        value="${escapeCreationHtml(
                            character.firstName
                        )}"
                        placeholder="Ex.: João"
                        maxlength="30"
                    >

                </label>


                <label>

                    <span>Sobrenome</span>

                    <input
                        type="text"
                        data-creation-field="lastName"
                        value="${escapeCreationHtml(
                            character.lastName
                        )}"
                        placeholder="Ex.: Silva"
                        maxlength="40"
                    >

                </label>


                <label>

                    <span>Apelido</span>

                    <input
                        type="text"
                        data-creation-field="nickname"
                        value="${escapeCreationHtml(
                            character.nickname
                        )}"
                        placeholder="Opcional"
                        maxlength="25"
                    >

                </label>


                <label>

                    <span>Sexo</span>

                    <select
                        data-creation-field="gender"
                    >

                        ${CREATION_OPTIONS.genders
                            .map(
                                item => `

                                    <option
                                        value="${item.id}"
                                        ${
                                            character.gender ===
                                            item.id
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${item.name}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </label>


                <label>

                    <span>País</span>

                    <select
                        data-creation-field="country"
                    >

                        ${CREATION_OPTIONS.countries
                            .map(
                                item => `

                                    <option
                                        value="${item.id}"
                                        ${
                                            character.country ===
                                            item.id
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${item.name}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </label>


                <label>

                    <span>Cidade</span>

                    <select
                        data-creation-field="city"
                    >

                        ${getCitiesForCountry(
                            character.country
                        )
                            .map(
                                city => `

                                    <option
                                        value="${escapeCreationHtml(
                                            city
                                        )}"
                                        ${
                                            character.city ===
                                            city
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${escapeCreationHtml(
                                            city
                                        )}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </label>

            </div>

        </div>

    `;

}


function renderPhysicalStep() {

    const character =
        characterCreationState.character;


    return `

        <div class="creation-step-content">

            <div class="creation-title">

                <span>02</span>

                <div>
                    <h2>Físico</h2>

                    <p>
                        Defina a base física do seu atleta.
                    </p>
                </div>

            </div>


            <div class="creation-form-grid">

                <label>

                    <span>Idade inicial</span>

                    <input
                        type="number"
                        min="18"
                        max="40"
                        data-creation-field="age"
                        value="${character.age}"
                    >

                </label>


                <label>

                    <span>Altura (cm)</span>

                    <input
                        type="number"
                        min="150"
                        max="220"
                        data-creation-field="height"
                        value="${character.height}"
                    >

                </label>


                <label>

                    <span>Peso (kg)</span>

                    <input
                        type="number"
                        min="50"
                        max="150"
                        step="0.1"
                        data-creation-field="weight"
                        value="${character.weight}"
                    >

                </label>


                <label>

                    <span>Categoria</span>

                    <select
                        data-creation-field="weightClass"
                    >

                        ${CREATION_OPTIONS.weightClasses
                            .map(
                                item => `

                                    <option
                                        value="${item.id}"
                                        ${
                                            character.weightClass ===
                                            item.id
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${item.name}
                                    </option>

                                `
                            )
                            .join("")}

                    </select>

                </label>

            </div>


            <div class="creation-info">

                <strong>
                    Importante
                </strong>

                <p>
                    A categoria define os adversários,
                    eventos e oportunidades disponíveis
                    durante sua carreira.
                </p>

            </div>

        </div>

    `;

}


function renderStyleStep() {

    const character =
        characterCreationState.character;


    return `

        <div class="creation-step-content">

            <div class="creation-title">

                <span>03</span>

                <div>
                    <h2>Estilo de luta</h2>

                    <p>
                        Escolha a identidade dentro do cage.
                    </p>
                </div>

            </div>


            <div class="creation-choice-grid">

                ${CREATION_OPTIONS.fightingStyles
                    .map(
                        item => `

                            <button
                                type="button"
                                class="
                                    creation-choice
                                    ${
                                        character.fightingStyle ===
                                        item.id
                                            ? "selected"
                                            : ""
                                    }
                                "
                                data-style="${item.id}"
                            >

                                <strong>
                                    ${item.name}
                                </strong>

                                <span>
                                    ${item.description}
                                </span>

                            </button>

                        `
                    )
                    .join("")}

            </div>


            <div class="creation-subsection">

                <h3>
                    Base de postura
                </h3>


                <div class="creation-inline-options">

                    ${CREATION_OPTIONS.stances
                        .map(
                            item => `

                                <button
                                    type="button"
                                    class="
                                        creation-option
                                        ${
                                            character.stance ===
                                            item.id
                                                ? "selected"
                                                : ""
                                        }
                                    "
                                    data-stance="${item.id}"
                                >
                                    ${item.name}
                                </button>

                            `
                        )
                        .join("")}

                </div>

            </div>

        </div>

    `;

}


function renderPersonalityStep() {

    const character =
        characterCreationState.character;


    return `

        <div class="creation-step-content">

            <div class="creation-title">

                <span>04</span>

                <div>
                    <h2>Personalidade</h2>

                    <p>
                        Sua personalidade influencia sua jornada.
                    </p>
                </div>

            </div>


            <div class="creation-choice-grid">

                ${CREATION_OPTIONS.personalities
                    .map(
                        item => `

                            <button
                                type="button"
                                class="
                                    creation-choice
                                    ${
                                        character.personality ===
                                        item.id
                                            ? "selected"
                                            : ""
                                    }
                                "
                                data-personality="${item.id}"
                            >

                                <strong>
                                    ${item.name}
                                </strong>

                                <span>
                                    ${item.description}
                                </span>

                            </button>

                        `
                    )
                    .join("")}

            </div>

        </div>

    `;

}


function renderConfirmationStep() {

    const summary =
        getCharacterCreationSummary();


    return `

        <div class="creation-step-content">

            <div class="creation-title">

                <span>05</span>

                <div>
                    <h2>Confirmação</h2>

                    <p>
                        Este será o início da sua dinastia.
                    </p>
                </div>

            </div>


            <div class="confirmation-card">

                <h2>
                    ${escapeCreationHtml(
                        summary.name ||
                        "Novo Lutador"
                    )}
                </h2>


                ${
                    summary.nickname

                        ? `
                            <p>
                                "${escapeCreationHtml(
                                    summary.nickname
                                )}"
                            </p>
                        `

                        : ""
                }


                <div class="confirmation-grid">

                    <div>
                        <span>Idade</span>
                        <strong>
                            ${summary.age}
                        </strong>
                    </div>

                    <div>
                        <span>Localização</span>
                        <strong>
                            ${escapeCreationHtml(
                                summary.location
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Categoria</span>
                        <strong>
                            ${escapeCreationHtml(
                                summary.weightClass
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Estilo</span>
                        <strong>
                            ${escapeCreationHtml(
                                summary.style
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Personalidade</span>
                        <strong>
                            ${escapeCreationHtml(
                                summary.personality
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Postura</span>
                        <strong>
                            ${escapeCreationHtml(
                                summary.stance
                            )}
                        </strong>
                    </div>

                </div>

            </div>


            <div class="creation-warning">

                <strong>
                    Sua carreira começa agora.
                </strong>

                <p>
                    Depois de confirmar, o personagem
                    será registrado no universo do MMA Life Dynasty.
                </p>

            </div>

        </div>

    `;

}


/* ============================================================
   EVENTS
   ============================================================ */

function bindCharacterCreationEvents(
    container
) {

    const fields =
        container.querySelectorAll(
            "[data-creation-field]"
        );


    fields.forEach(
        field => {

            field.addEventListener(
                "change",
                event => {

                    const input =
                        event.currentTarget;

                    const key =
                        input.dataset.creationField;

                    let value =
                        input.value;


                    if (
                        [
                            "age",
                            "height",
                            "weight"
                        ].includes(
                            key
                        )
                    ) {

                        value =
                            Number(
                                value
                            );

                    }


                    if (
                        key ===
                        "country"
                    ) {

                        setLocation(
                            value
                        );


                        refreshCharacterCreation(
                            container
                        );


                        return;

                    }


                    if (
                        key ===
                        "city"
                    ) {

                        setLocation(
                            characterCreationState
                                .character
                                .country,
                            value
                        );


                        refreshCharacterCreation(
                            container
                        );


                        return;

                    }


                    setCharacterField(
                        key,
                        value
                    );


                    refreshCharacterCreation(
                        container
                    );

                }
            );


            field.addEventListener(
                "input",
                event => {

                    const input =
                        event.currentTarget;

                    const key =
                        input.dataset.creationField;


                    if (
                        [
                            "firstName",
                            "lastName",
                            "nickname"
                        ].includes(
                            key
                        )
                    ) {

                        setCharacterField(
                            key,
                            input.value
                        );

                    }

                }
            );

        }
    );


    container
        .querySelectorAll(
            "[data-style]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        setStyleData(
                            {
                                fightingStyle:
                                    button.dataset.style
                            }
                        );


                        refreshCharacterCreation(
                            container
                        );

                    }
                );

            }
        );


    container
        .querySelectorAll(
            "[data-stance]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        setStyleData(
                            {
                                stance:
                                    button.dataset.stance
                            }
                        );


                        refreshCharacterCreation(
                            container
                        );

                    }
                );

            }
        );


    container
        .querySelectorAll(
            "[data-personality]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        setPersonality(
                            button.dataset.personality
                        );


                        refreshCharacterCreation(
                            container
                        );

                    }
                );

            }
        );


    container
        .querySelectorAll(
            "[data-creation-step]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        goToCreationStep(
                            button.dataset.creationStep
                        );


                        refreshCharacterCreation(
                            container
                        );

                    }
                );

            }
        );


    const previous =
        container.querySelector(
            '[data-creation-action="previous"]'
        );


    if (
        previous
    ) {

        previous.addEventListener(
            "click",
            () => {

                previousCreationStep();

                refreshCharacterCreation(
                    container
                );

            }
        );

    }


    const next =
        container.querySelector(
            '[data-creation-action="next"]'
        );


    if (
        next
    ) {

        next.addEventListener(
            "click",
            () => {

                const validation =
                    validateCurrentCreationStep();


                if (
                    !validation.valid
                ) {

                    showCreationMessage(
                        validation.errors[0]
                    );

                    return;

                }


                nextCreationStep();

                refreshCharacterCreation(
                    container
                );

            }
        );

    }


    const finish =
        container.querySelector(
            '[data-creation-action="finish"]'
        );


    if (
        finish
    ) {

        finish.addEventListener(
            "click",
            () => {

                const result =
                    finalizeCharacterCreation();


                if (
                    !result.success
                ) {

                    showCreationMessage(
                        result.errors[0]
                    );

                    return;

                }


                showCreationMessage(
                    "Personagem criado com sucesso!"
                );


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

            }
        );

    }

}


/* ============================================================
   STEP VALIDATION
   ============================================================ */

function validateCurrentCreationStep() {

    const character =
        characterCreationState.character;


    const errors = [];


    switch (
        characterCreationState.currentStep
    ) {

        case "identity":

            if (
                !character.firstName
            ) {

                errors.push(
                    "Informe o nome."
                );

            }


            if (
                !character.lastName
            ) {

                errors.push(
                    "Informe o sobrenome."
                );

            }

            break;


        case "physical":

            if (
                character.age < 18
            ) {

                errors.push(
                    "A idade mínima é 18 anos."
                );

            }


            if (
                character.height < 150
            ) {

                errors.push(
                    "Informe uma altura válida."
                );

            }


            if (
                character.weight < 50
            ) {

                errors.push(
                    "Informe um peso válido."
                );

            }

            break;


        case "style":

            if (
                !character.fightingStyle
            ) {

                errors.push(
                    "Escolha um estilo de luta."
                );

            }

            break;


        case "personality":

            if (
                !character.personality
            ) {

                errors.push(
                    "Escolha uma personalidade."
                );

            }

            break;


        default:

            break;

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* ============================================================
   REFRESH
   ============================================================ */

function refreshCharacterCreation(
    container
) {

    if (
        !container
    ) {

        return;

    }


    renderCharacterCreation(
        container
    );

}


/* ============================================================
   MESSAGE
   ============================================================ */

function showCreationMessage(
    message
) {

    const toast =
        document.getElementById(
            "game-toast-container"
        );


    if (
        toast
    ) {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "game-toast";


        element.textContent =
            message;


        toast.appendChild(
            element
        );


        setTimeout(
            () => {

                element.remove();

            },
            3000
        );


        return;

    }


    console.log(
        "[MMA LIFE]",
        message
    );

}


/* ============================================================
   HTML ESCAPE
   ============================================================ */

function escapeCreationHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   INJECT DEFAULT STYLES
   ============================================================ */

function injectCharacterCreationStyles() {

    if (
        document.getElementById(
            "mma-life-character-creation-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "mma-life-character-creation-styles";


    style.textContent = `

        .character-creation {
            width: min(1180px, calc(100% - 32px));
            margin: 0 auto;
            padding: 32px 0 60px;
        }


        .creation-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 24px;
        }


        .creation-kicker {
            display: block;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
            opacity: .55;
            margin-bottom: 8px;
        }


        .creation-header h1 {
            margin: 0;
            font-size: clamp(30px, 5vw, 48px);
            line-height: 1;
        }


        .creation-header p {
            margin: 10px 0 0;
            opacity: .6;
        }


        .creation-step {
            font-size: 13px;
            opacity: .55;
            white-space: nowrap;
        }


        .creation-progress {
            display: flex;
            gap: 8px;
            margin-bottom: 18px;
        }


        .creation-progress-step {
            width: 36px;
            height: 6px;
            padding: 0;
            border: 0;
            border-radius: 99px;
            background: rgba(255,255,255,.12);
            font-size: 0;
        }


        .creation-progress-step.active {
            background: #fff;
        }


        .creation-layout {
            display: grid;
            grid-template-columns:
                minmax(0, 1fr)
                320px;
            gap: 18px;
        }


        .creation-panel,
        .creation-preview {
            border:
                1px solid
                rgba(255,255,255,.09);
            border-radius: 16px;
            background:
                rgba(255,255,255,.035);
        }


        .creation-panel {
            padding: 24px;
        }


        .creation-preview {
            padding: 24px;
            height: fit-content;
            position: sticky;
            top: 20px;
        }


        .creation-title {
            display: flex;
            gap: 16px;
            align-items: flex-start;
            margin-bottom: 28px;
        }


        .creation-title > span {
            font-size: 12px;
            font-weight: 900;
            opacity: .4;
        }


        .creation-title h2 {
            margin: 0;
            font-size: 25px;
        }


        .creation-title p {
            margin: 7px 0 0;
            opacity: .55;
            font-size: 14px;
        }


        .creation-form-grid {
            display: grid;
            grid-template-columns:
                repeat(2, minmax(0, 1fr));
            gap: 16px;
        }


        .creation-form-grid label {
            display: grid;
            gap: 8px;
        }


        .creation-form-grid label > span {
            font-size: 12px;
            font-weight: 700;
            opacity: .65;
        }


        .creation-form-grid input,
        .creation-form-grid select {
            width: 100%;
            min-height: 48px;
            border:
                1px solid
                rgba(255,255,255,.10);
            border-radius: 10px;
            background: rgba(0,0,0,.25);
            color: #fff;
            padding: 0 13px;
            outline: none;
        }


        .creation-form-grid input:focus,
        .creation-form-grid select:focus {
            border-color:
                rgba(255,255,255,.35);
        }


        .creation-info,
        .creation-warning {
            margin-top: 20px;
            padding: 15px;
            border-radius: 11px;
            background:
                rgba(255,255,255,.045);
        }


        .creation-info strong,
        .creation-warning strong {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: .7px;
        }


        .creation-info p,
        .creation-warning p {
            margin: 7px 0 0;
            font-size: 13px;
            line-height: 1.5;
            opacity: .58;
        }


        .creation-choice-grid {
            display: grid;
            grid-template-columns:
                repeat(2, minmax(0, 1fr));
            gap: 12px;
        }


        .creation-choice {
            text-align: left;
            min-height: 110px;
            padding: 17px;
            border:
                1px solid
                rgba(255,255,255,.09);
            border-radius: 12px;
            background:
                rgba(255,255,255,.025);
            color: #fff;
        }


        .creation-choice strong {
            display: block;
            margin-bottom: 8px;
        }


        .creation-choice span {
            display: block;
            font-size: 13px;
            line-height: 1.45;
            opacity: .55;
        }


        .creation-choice.selected {
            border-color:
                rgba(255,255,255,.55);
            background:
                rgba(255,255,255,.09);
        }


        .creation-subsection {
            margin-top: 25px;
        }


        .creation-subsection h3 {
            margin: 0 0 12px;
            font-size: 14px;
        }


        .creation-inline-options {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }


        .creation-option {
            padding: 11px 15px;
            border:
                1px solid
                rgba(255,255,255,.10);
            border-radius: 9px;
            background:
                rgba(255,255,255,.025);
            color: #fff;
        }


        .creation-option.selected {
            background: #fff;
            color: #000;
        }


        .creation-navigation {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top:
                1px solid
                rgba(255,255,255,.07);
        }


        .creation-button {
            min-height: 46px;
            padding: 0 18px;
            border-radius: 10px;
            border: 0;
            font-weight: 800;
        }


        .creation-button.primary {
            background: #fff;
            color: #000;
        }


        .creation-button.secondary {
            background:
                rgba(255,255,255,.07);
            color: #fff;
        }


        .creation-button:disabled {
            opacity: .25;
            cursor: not-allowed;
        }


        .preview-label {
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 1.7px;
            opacity: .45;
        }


        .creation-preview h2 {
            margin: 8px 0 0;
            font-size: 27px;
        }


        .preview-nickname {
            margin-top: 4px;
            opacity: .55;
            font-size: 13px;
        }


        .preview-grid {
            display: grid;
            grid-template-columns:
                repeat(2, 1fr);
            gap: 10px;
            margin-top: 22px;
        }


        .preview-grid > div {
            padding: 12px;
            border-radius: 9px;
            background:
                rgba(255,255,255,.045);
        }


        .preview-grid span,
        .preview-section > span {
            display: block;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 1px;
            opacity: .42;
            margin-bottom: 5px;
        }


        .preview-grid strong,
        .preview-section strong {
            font-size: 13px;
        }


        .preview-section {
            margin-top: 15px;
            padding-top: 15px;
            border-top:
                1px solid
                rgba(255,255,255,.07);
        }


        .preview-bar {
            width: 100%;
            height: 5px;
            overflow: hidden;
            border-radius: 99px;
            background:
                rgba(255,255,255,.09);
            margin: 8px 0;
        }


        .preview-bar div {
            height: 100%;
            background: #fff;
            border-radius: inherit;
        }


        .confirmation-card {
            padding: 20px;
            border-radius: 13px;
            background:
                rgba(255,255,255,.045);
        }


        .confirmation-card h2 {
            margin: 0;
            font-size: 28px;
        }


        .confirmation-card > p {
            margin: 6px 0 20px;
            opacity: .55;
        }


        .confirmation-grid {
            display: grid;
            grid-template-columns:
                repeat(2, minmax(0, 1fr));
            gap: 10px;
        }


        .confirmation-grid > div {
            padding: 12px;
            border-radius: 9px;
            background:
                rgba(0,0,0,.18);
        }


        .confirmation-grid span {
            display: block;
            font-size: 10px;
            opacity: .45;
            margin-bottom: 5px;
        }


        .confirmation-grid strong {
            font-size: 13px;
        }


        @media (
            max-width: 820px
        ) {

            .creation-layout {
                grid-template-columns: 1fr;
            }

            .creation-preview {
                position: static;
                order: -1;
            }

        }


        @media (
            max-width: 560px
        ) {

            .character-creation {
                width:
                    min(
                        100% - 20px,
                        1180px
                    );
                padding-top: 20px;
            }

            .creation-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .creation-panel,
            .creation-preview {
                padding: 17px;
                border-radius: 13px;
            }

            .creation-form-grid,
            .creation-choice-grid,
            .confirmation-grid {
                grid-template-columns: 1fr;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* ============================================================
   INITIALIZE
   ============================================================ */

function initializeCharacterCreation() {

    injectCharacterCreationStyles();

    characterCreationState.initialized =
        true;


    return {

        success: true,

        state:
            getCharacterCreationData()

    };

}


/* ============================================================
   API
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

    setIdentity:
        setIdentity,

    setLocation:
        setLocation,

    getCities:
        getCitiesForCountry,

    setPhysical:
        setPhysicalData,

    setStyle:
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
        renderCharacterCreation

};


/* ============================================================
   GLOBAL
   ============================================================ */

if (
    typeof globalThis !==
    "undefined"
) {

    globalThis.characterCreationAPI =
        characterCreationAPI;

}


/* ============================================================
   EXPORT
   ============================================================ */

export {

    CHARACTER_CREATION_VERSION,

    CREATION_STEPS,

    CREATION_OPTIONS,

    characterCreationState,

    characterCreationAPI,

    initializeCharacterCreation,

    resetCharacterCreation,

    getCharacterCreationState,

    getCharacterCreationData,

    getCurrentCreationStep,

    getCreationOptions,

    setCharacterField,

    setIdentity,

    setLocation,

    getCitiesForCountry,

    setPhysicalData,

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

    renderCharacterCreation

};


export default characterCreationAPI;
