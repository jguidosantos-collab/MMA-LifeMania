/* ============================================================
   MMA LIFE DYNASTY
   LIFE ENGINE
   Orquestrador central da vida do personagem.

   Responsabilidades:
   - idade e passagem do tempo;
   - relacionamentos;
   - casamento;
   - filhos;
   - família;
   - educação;
   - emprego;
   - residência;
   - veículos;
   - lifestyle;
   - eventos de vida;
   - histórico;
   - ciclos mensal/anual;
   - preparação para a integração com DYNASTY.

   Este módulo é propositalmente independente.
   Os módulos específicos do LIFE serão conectados posteriormente.
   ============================================================ */

const LIFE_ENGINE_VERSION = 1;

/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */

const LIFE_ENGINE_CONFIG = {
  daysPerMonth: 30,
  monthsPerYear: 12,

  minimumAdultAge: 18,
  minimumMarriageAge: 18,
  minimumChildAge: 0,

  maximumHumanAge: 110,

  maxHistoryEntries: 1000,
  maxLifeEvents: 500,

  processRelationshipsMonthly: true,
  processMarriageMonthly: true,
  processChildrenMonthly: true,
  processEducationMonthly: true,
  processEmploymentMonthly: true,
  processResidenceMonthly: true,
  processVehiclesMonthly: true,
  processLifestyleMonthly: true,

  processAnnualSystems: true,

  allowDeathSimulation: false,
  allowRandomLifeEvents: true
};

/* ============================================================
   TIPOS DE EVENTO
   ============================================================ */

const LIFE_EVENT_TYPES = {
  BIRTH: "birth",
  AGE_UP: "age_up",
  RELATIONSHIP: "relationship",
  MARRIAGE: "marriage",
  DIVORCE: "divorce",
  CHILD_BIRTH: "child_birth",
  FAMILY: "family",
  EDUCATION: "education",
  EMPLOYMENT: "employment",
  RESIDENCE: "residence",
  VEHICLE: "vehicle",
  LIFESTYLE: "lifestyle",
  HEALTH: "health",
  FINANCE: "finance",
  TRAVEL: "travel",
  DEATH: "death",
  RETIREMENT: "retirement",
  OTHER: "other"
};

/* ============================================================
   STATUS
   ============================================================ */

const LIFE_ENGINE_STATUS = {
  READY: "ready",
  RUNNING: "running",
  PAUSED: "paused",
  COMPLETED: "completed",
  ERROR: "error"
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function clone(value) {
  return JSON.parse(
    JSON.stringify(value)
  );
}

function clamp(
  value,
  min,
  max
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function randomInt(
  min,
  max
) {
  return (
    Math.floor(
      Math.random() *
        (max - min + 1)
    ) + min
  );
}

function randomFloat(
  min,
  max
) {
  return (
    Math.random() *
      (max - min) +
    min
  );
}

function randomItem(
  array
) {
  if (
    !Array.isArray(array) ||
    array.length === 0
  ) {
    return null;
  }

  return array[
    Math.floor(
      Math.random() *
        array.length
    )
  ];
}

function normalizeId(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  return String(value).trim();
}

function generateId(
  prefix = "life"
) {
  return (
    `${prefix}_` +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 9)
  );
}

function nowISO() {
  return new Date().toISOString();
}

/* ============================================================
   ESTADO BASE DO LIFE ENGINE
   ============================================================ */

function createLifeEngineState(
  data = {}
) {
  return {
    version:
      LIFE_ENGINE_VERSION,

    status:
      data.status ||
      LIFE_ENGINE_STATUS.READY,

    currentDate:
      data.currentDate ||
      null,

    currentMonth:
      Number(
        data.currentMonth ??
          1
      ),

    currentYear:
      Number(
        data.currentYear ??
          1
      ),

    totalMonths:
      Number(
        data.totalMonths ??
          0
      ),

    totalYears:
      Number(
        data.totalYears ??
          0
      ),

    playerAge:
      Number(
        data.playerAge ??
          18
      ),

    playerBirthDate:
      data.playerBirthDate ||
      null,

    playerCharacterId:
      normalizeId(
        data.playerCharacterId
      ),

    alive:
      data.alive !== false,

    paused:
      Boolean(data.paused),

    lastProcessedMonth:
      data.lastProcessedMonth ||
      null,

    lastProcessedYear:
      data.lastProcessedYear ||
      null,

    monthlyProcessing:
      Boolean(
        data.monthlyProcessing
      ),

    annualProcessing:
      Boolean(
        data.annualProcessing
      ),

    lifeEvents:
      Array.isArray(
        data.lifeEvents
      )
        ? data.lifeEvents.map(
            clone
          )
        : [],

    history:
      Array.isArray(
        data.history
      )
        ? data.history.map(
            clone
          )
        : [],

    statistics: {
      monthsProcessed:
        Number(
          data.statistics
            ?.monthsProcessed ??
            0
        ),

      yearsProcessed:
        Number(
          data.statistics
            ?.yearsProcessed ??
            0
        ),

      lifeEvents:
        Number(
          data.statistics
            ?.lifeEvents ??
            0
        ),

      relationshipsProcessed:
        Number(
          data.statistics
            ?.relationshipsProcessed ??
            0
        ),

      marriagesProcessed:
        Number(
          data.statistics
            ?.marriagesProcessed ??
            0
        ),

      childrenProcessed:
        Number(
          data.statistics
            ?.childrenProcessed ??
            0
        ),

      educationProcessed:
        Number(
          data.statistics
            ?.educationProcessed ??
            0
        ),

      employmentProcessed:
        Number(
          data.statistics
            ?.employmentProcessed ??
            0
        ),

      residenceProcessed:
        Number(
          data.statistics
            ?.residenceProcessed ??
            0
        ),

      vehiclesProcessed:
        Number(
          data.statistics
            ?.vehiclesProcessed ??
            0
        ),

      lifestyleProcessed:
        Number(
          data.statistics
            ?.lifestyleProcessed ??
            0
        )
    },

    timestamps: {
      createdAt:
        data.timestamps
          ?.createdAt ||
        nowISO(),

      updatedAt:
        nowISO(),

      lastMonthlyProcess:
        data.timestamps
          ?.lastMonthlyProcess ||
        null,

      lastAnnualProcess:
        data.timestamps
          ?.lastAnnualProcess ||
        null
    }
  };
}

/* ============================================================
   ESTADO DO LIFE
   ============================================================ */

function ensureLifeEngineState(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (
    !database.life.engine
  ) {
    database.life.engine =
      createLifeEngineState();
  }

  return database.life.engine;
}

/* ============================================================
   PLAYER
   ============================================================ */

function getPlayer(
  database
) {
  if (!database) {
    return null;
  }

  return (
    database.player ||
    null
  );
}

function getPlayerId(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  const player =
    getPlayer(database);

  return (
    state.playerCharacterId ||
    normalizeId(
      player?.id
    ) ||
    normalizeId(
      player?.playerId
    ) ||
    "player"
  );
}

function getPlayerAge(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  const player =
    getPlayer(database);

  if (
    Number.isFinite(
      Number(
        player?.age
      )
    )
  ) {
    return Number(
      player.age
    );
  }

  return Number(
    state.playerAge ?? 18
  );
}

function setPlayerAge(
  database,
  age
) {
  const state =
    ensureLifeEngineState(
      database
    );

  const player =
    getPlayer(database);

  const normalizedAge =
    clamp(
      Number(age) || 0,
      0,
      LIFE_ENGINE_CONFIG
        .maximumHumanAge
    );

  state.playerAge =
    normalizedAge;

  if (player) {
    player.age =
      normalizedAge;
  }

  return normalizedAge;
}

/* ============================================================
   INTEGRAÇÃO GENÉRICA
   ============================================================ */

/*
 * O LIFE ENGINE não importa os módulos individuais.
 *
 * Isso evita dependências circulares.
 *
 * Quando o projeto principal estiver integrado,
 * funções específicas poderão ser registradas aqui.
 */

function ensureLifeModulesState(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (
    !database.life.relationships
  ) {
    database.life.relationships = {
      relationships: {},
      history: []
    };
  }

  if (
    !database.life.marriage
  ) {
    database.life.marriage = {
      marriages: {},
      history: []
    };
  }

  if (
    !database.life.children
  ) {
    database.life.children = {
      children: {},
      history: []
    };
  }

  if (
    !database.life.family
  ) {
    database.life.family = {
      members: {},
      relationships: {},
      history: []
    };
  }

  if (
    !database.life.education
  ) {
    database.life.education = {
      profiles: {},
      programs: {},
      history: []
    };
  }

  if (
    !database.life.employment
  ) {
    database.life.employment = {
      profiles: {},
      jobs: {},
      history: []
    };
  }

  if (
    !database.life.residence
  ) {
    database.life.residence = {
      profiles: {},
      properties: {},
      history: []
    };
  }

  if (
    !database.life.vehicles
  ) {
    database.life.vehicles = {
      profiles: {},
      vehicles: {},
      garages: {},
      history: []
    };
  }

  if (
    !database.life.lifestyle
  ) {
    database.life.lifestyle = {
      profiles: {},
      history: []
    };
  }

  return database.life;
}

/* ============================================================
   EVENTOS
   ============================================================ */

function createLifeEvent(
  data = {}
) {
  return {
    id:
      normalizeId(
        data.id
      ) ||
      generateId(
        "life_event"
      ),

    type:
      data.type ||
      LIFE_EVENT_TYPES.OTHER,

    title:
      data.title ||
      "Evento da vida",

    description:
      data.description ||
      "",

    characterId:
      normalizeId(
        data.characterId
      ),

    age:
      Number(
        data.age ?? 0
      ),

    month:
      Number(
        data.month ?? 0
      ),

    year:
      Number(
        data.year ?? 0
      ),

    date:
      data.date ||
      null,

    importance:
      clamp(
        Number(
          data.importance ?? 1
        ),
        1,
        10
      ),

    data:
      clone(
        data.data || {}
      ),

    generated:
      data.generated !== false,

    createdAt:
      nowISO()
  };
}

function addLifeEvent(
  database,
  data = {}
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  const event =
    createLifeEvent({
      ...data,

      characterId:
        data.characterId ||
        getPlayerId(database),

      age:
        data.age ??
        getPlayerAge(database),

      month:
        data.month ??
        state.currentMonth,

      year:
        data.year ??
        state.currentYear,

      date:
        data.date ||
        state.currentDate
    });

  state.lifeEvents.push(
    event
  );

  if (
    state.lifeEvents.length >
    LIFE_ENGINE_CONFIG
      .maxLifeEvents
  ) {
    state.lifeEvents =
      state.lifeEvents.slice(
        -LIFE_ENGINE_CONFIG
          .maxLifeEvents
      );
  }

  state.statistics
    .lifeEvents += 1;

  addLifeHistory(
    database,
    "event",
    event.title,
    {
      eventId:
        event.id,

      type:
        event.type
    }
  );

  return clone(event);
}

function getLifeEvents(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  return state
    ? state.lifeEvents.map(
        clone
      )
    : [];
}

function getLifeEventsByType(
  database,
  type
) {
  return getLifeEvents(
    database
  ).filter(
    event =>
      event.type === type
  );
}

function getLifeEventsByYear(
  database,
  year
) {
  return getLifeEvents(
    database
  ).filter(
    event =>
      Number(event.year) ===
      Number(year)
  );
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function addLifeHistory(
  database,
  type,
  description,
  data = {}
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  const entry = {
    id:
      generateId(
        "life_history"
      ),

    type,

    description,

    age:
      getPlayerAge(database),

    month:
      state.currentMonth,

    year:
      state.currentYear,

    date:
      state.currentDate,

    data:
      clone(data),

    createdAt:
      nowISO()
  };

  state.history.push(
    entry
  );

  if (
    state.history.length >
    LIFE_ENGINE_CONFIG
      .maxHistoryEntries
  ) {
    state.history =
      state.history.slice(
        -LIFE_ENGINE_CONFIG
          .maxHistoryEntries
      );
  }

  return clone(entry);
}

function getLifeHistory(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  return state
    ? state.history.map(
        clone
      )
    : [];
}

/* ============================================================
   DATA / CALENDÁRIO
   ============================================================ */

function initializeLifeDate(
  database,
  options = {}
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  state.currentDate =
    options.date ||
    state.currentDate ||
    null;

  state.currentMonth =
    clamp(
      Number(
        options.month ??
          state.currentMonth ??
          1
      ),
      1,
      12
    );

  state.currentYear =
    Math.max(
      1,
      Number(
        options.year ??
          state.currentYear ??
          1
      )
    );

  if (
    options.age !==
    undefined
  ) {
    setPlayerAge(
      database,
      options.age
    );
  }

  if (
    options.playerCharacterId
  ) {
    state.playerCharacterId =
      normalizeId(
        options.playerCharacterId
      );
  }

  return clone(state);
}

function advanceLifeMonth(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  state.currentMonth +=
    1;

  state.totalMonths +=
    1;

  if (
    state.currentMonth > 12
  ) {
    state.currentMonth = 1;
    state.currentYear += 1;
    state.totalYears += 1;
  }

  return {
    month:
      state.currentMonth,

    year:
      state.currentYear,

    totalMonths:
      state.totalMonths,

    totalYears:
      state.totalYears
  };
}

function advanceLifeYear(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  state.currentYear +=
    1;

  state.currentMonth = 1;

  state.totalYears +=
    1;

  state.totalMonths +=
    12;

  return {
    month:
      state.currentMonth,

    year:
      state.currentYear,

    totalMonths:
      state.totalMonths,

    totalYears:
      state.totalYears
  };
}

/* ============================================================
   IDADE
   ============================================================ */

function agePlayerOneYear(
  database
) {
  const currentAge =
    getPlayerAge(database);

  const nextAge =
    currentAge + 1;

  if (
    nextAge >
    LIFE_ENGINE_CONFIG
      .maximumHumanAge
  ) {
    return false;
  }

  setPlayerAge(
    database,
    nextAge
  );

  addLifeEvent(
    database,
    {
      type:
        LIFE_EVENT_TYPES.AGE_UP,

      title:
        `Completou ${nextAge} anos`,

      description:
        `O personagem completou ${nextAge} anos de idade.`,

      importance:
        nextAge === 18 ||
        nextAge === 30 ||
        nextAge === 40 ||
        nextAge === 50
          ? 3
          : 1
    }
  );

  return nextAge;
}

function processBirthday(
  database
) {
  const age =
    agePlayerOneYear(
      database
    );

  if (age === false) {
    return false;
  }

  addLifeHistory(
    database,
    "birthday",
    `Personagem completou ${age} anos.`,
    {
      age
    }
  );

  return age;
}

/* ============================================================
   RELACIONAMENTOS
   ============================================================ */

function getRelationshipState(
  database
) {
  return (
    database?.life
      ?.relationships ||
    null
  );
}

function processRelationships(
  database,
  options = {}
) {
  const state =
    getRelationshipState(
      database
    );

  if (!state) {
    return {
      processed: false,
      reason:
        "Estado de relacionamentos não encontrado."
    };
  }

  let processed = 0;

  const relationships =
    state.relationships || {};

  Object.values(
    relationships
  ).forEach(
    relationship => {
      if (
        relationship &&
        typeof relationship ===
          "object"
      ) {
        processed += 1;

        if (
          relationship.lastInteraction
        ) {
          relationship.lastProcessedAt =
            nowISO();
        }
      }
    }
  );

  if (
    options.applyDecay !==
    false
  ) {
    Object.values(
      relationships
    ).forEach(
      relationship => {
        if (
          relationship &&
          Number.isFinite(
            Number(
              relationship.level
            )
          )
        ) {
          relationship.level =
            clamp(
              Number(
                relationship.level
              ),
              -5,
              5
            );
        }
      }
    );
  }

  const engine =
    ensureLifeEngineState(
      database
    );

  engine.statistics
    .relationshipsProcessed +=
    processed;

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   CASAMENTO
   ============================================================ */

function getMarriageState(
  database
) {
  return (
    database?.life
      ?.marriage ||
    null
  );
}

function processMarriage(
  database
) {
  const state =
    getMarriageState(
      database
    );

  if (!state) {
    return {
      processed: false,
      count: 0
    };
  }

  const marriages =
    state.marriages || {};

  let processed = 0;

  Object.values(
    marriages
  ).forEach(
    marriage => {
      if (!marriage) {
        return;
      }

      processed += 1;

      if (
        Number.isFinite(
          Number(
            marriage.durationMonths
          )
        )
      ) {
        marriage.durationMonths +=
          1;
      }

      marriage.lastProcessedAt =
        nowISO();
    }
  );

  const engine =
    ensureLifeEngineState(
      database
    );

  engine.statistics
    .marriagesProcessed +=
    processed;

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   FILHOS
   ============================================================ */

function getChildrenState(
  database
) {
  return (
    database?.life
      ?.children ||
    null
  );
}

function processChildren(
  database
) {
  const state =
    getChildrenState(
      database
    );

  if (!state) {
    return {
      processed: false,
      count: 0
    };
  }

  const children =
    state.children || {};

  let processed = 0;

  Object.values(
    children
  ).forEach(
    child => {
      if (!child) {
        return;
      }

      processed += 1;

      if (
        Number.isFinite(
          Number(
            child.age
          )
        )
      ) {
        /*
         * A idade mensal detalhada pode
         * ser adicionada posteriormente.
         */
        child.ageMonths =
          Number(
            child.ageMonths ??
              0
          ) + 1;

        if (
          child.ageMonths >= 12
        ) {
          child.age +=
            Math.floor(
              child.ageMonths /
                12
            );

          child.ageMonths =
            child.ageMonths %
            12;
        }
      }

      child.lastProcessedAt =
        nowISO();
    }
  );

  const engine =
    ensureLifeEngineState(
      database
    );

  engine.statistics
    .childrenProcessed +=
    processed;

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   FAMÍLIA
   ============================================================ */

function processFamily(
  database
) {
  const state =
    database?.life
      ?.family;

  if (!state) {
    return {
      processed: false,
      count: 0
    };
  }

  const members =
    state.members || {};

  let processed = 0;

  Object.values(
    members
  ).forEach(
    member => {
      if (!member) {
        return;
      }

      processed += 1;

      if (
        Number.isFinite(
          Number(
            member.age
          )
        )
      ) {
        member.lastProcessedAt =
          nowISO();
      }
    }
  );

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   EDUCAÇÃO
   ============================================================ */

function getEducationState(
  database
) {
  return (
    database?.life
      ?.education ||
    null
  );
}

function processEducation(
  database
) {
  const state =
    getEducationState(
      database
    );

  if (!state) {
    return {
      processed: false,
      count: 0
    };
  }

  const profiles =
    state.profiles || {};

  let processed = 0;

  Object.values(
    profiles
  ).forEach(
    profile => {
      if (!profile) {
        return;
      }

      processed += 1;

      if (
        profile.status ===
          "active" ||
        profile.status ===
          "enrolled"
      ) {
        profile.monthsInProgram =
          Number(
            profile.monthsInProgram ??
              0
          ) + 1;
      }

      profile.lastProcessedAt =
        nowISO();
    }
  );

  const engine =
    ensureLifeEngineState(
      database
    );

  engine.statistics
    .educationProcessed +=
    processed;

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   EMPREGO
   ============================================================ */

function getEmploymentState(
  database
) {
  return (
    database?.life
      ?.employment ||
    null
  );
}

function processEmployment(
  database
) {
  const state =
    getEmploymentState(
      database
    );

  if (!state) {
    return {
      processed: false,
      count: 0
    };
  }

  const profiles =
    state.profiles || {};

  let processed = 0;

  Object.values(
    profiles
  ).forEach(
    profile => {
      if (!profile) {
        return;
      }

      processed += 1;

      if (
        profile.status ===
          "employed" ||
        profile.status ===
          "self_employed" ||
        profile.status ===
          "entrepreneur"
      ) {
        profile.totalMonthsWorked =
          Number(
            profile.totalMonthsWorked ??
              0
          ) + 1;
      }

      profile.lastProcessedAt =
        nowISO();
    }
  );

  const engine =
    ensureLifeEngineState(
      database
    );

  engine.statistics
    .employmentProcessed +=
    processed;

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   RESIDÊNCIA
   ============================================================ */

function getResidenceState(
  database
) {
  return (
    database?.life
      ?.residence ||
    null
  );
}

function processResidence(
  database
) {
  const state =
    getResidenceState(
      database
    );

  if (!state) {
    return {
      processed: false,
      count: 0
    };
  }

  const profiles =
    state.profiles || {};

  let processed = 0;

  Object.values(
    profiles
  ).forEach(
    profile => {
      if (!profile) {
        return;
      }

      processed += 1;

      profile.monthsOccupied =
        Number(
          profile.monthsOccupied ??
            0
        ) + 1;

      profile.lastProcessedAt =
        nowISO();
    }
  );

  const engine =
    ensureLifeEngineState(
      database
    );

  engine.statistics
    .residenceProcessed +=
    processed;

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   VEÍCULOS
   ============================================================ */

function getVehicleState(
  database
) {
  return (
    database?.life
      ?.vehicles ||
    null
  );
}

function processVehicles(
  database
) {
  const state =
    getVehicleState(
      database
    );

  if (!state) {
    return {
      processed: false,
      count: 0
    };
  }

  const profiles =
    state.profiles || {};

  let processed = 0;

  Object.values(
    profiles
  ).forEach(
    profile => {
      if (!profile) {
        return;
      }

      processed += 1;

      profile.monthsOwned =
        Number(
          profile.monthsOwned ??
            0
        ) + 1;

      profile.lastProcessedAt =
        nowISO();
    }
  );

  const engine =
    ensureLifeEngineState(
      database
    );

  engine.statistics
    .vehiclesProcessed +=
    processed;

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   LIFESTYLE
   ============================================================ */

function getLifestyleState(
  database
) {
  return (
    database?.life
      ?.lifestyle ||
    null
  );
}

function processLifestyle(
  database
) {
  const state =
    getLifestyleState(
      database
    );

  if (!state) {
    return {
      processed: false,
      count: 0
    };
  }

  const profiles =
    state.profiles || {};

  let processed = 0;

  Object.values(
    profiles
  ).forEach(
    profile => {
      if (!profile) {
        return;
      }

      processed += 1;

      const income =
        Number(
          profile.monthlyIncome ??
            0
        );

      const expenses =
        Number(
          profile.monthlyExpenses ??
            0
        );

      profile.monthlyBalance =
        Math.round(
          income -
            expenses
        );

      profile.lastProcessedAt =
        nowISO();
    }
  );

  const engine =
    ensureLifeEngineState(
      database
    );

  engine.statistics
    .lifestyleProcessed +=
    processed;

  return {
    processed: true,
    count: processed
  };
}

/* ============================================================
   SAÚDE
   ============================================================ */

function processLifeHealth(
  database
) {
  if (!database) {
    return {
      processed: false
    };
  }

  if (!database.health) {
    database.health = {};
  }

  const health =
    database.health;

  if (
    Number.isFinite(
      Number(
        health.age
      )
    )
  ) {
    health.age =
      getPlayerAge(database);
  }

  health.lastLifeProcess =
    nowISO();

  return {
    processed: true
  };
}

/* ============================================================
   EVENTOS ALEATÓRIOS
   ============================================================ */

function generateRandomLifeEvent(
  database
) {
  if (
    !LIFE_ENGINE_CONFIG
      .allowRandomLifeEvents
  ) {
    return null;
  }

  const age =
    getPlayerAge(database);

  const possibleEvents = [];

  if (
    age >= 18
  ) {
    possibleEvents.push(
      {
        type:
          LIFE_EVENT_TYPES
            .RELATIONSHIP,

        title:
          "Novo contato social",

        description:
          "O personagem conheceu uma nova pessoa."
      }
    );
  }

  if (
    age >= 18
  ) {
    possibleEvents.push(
      {
        type:
          LIFE_EVENT_TYPES
            .EMPLOYMENT,

        title:
          "Oportunidade profissional",

        description:
          "Uma nova oportunidade profissional surgiu."
      }
    );
  }

  if (
    age >= 18
  ) {
    possibleEvents.push(
      {
        type:
          LIFE_EVENT_TYPES
            .TRAVEL,

        title:
          "Possibilidade de viagem",

        description:
          "O personagem recebeu uma oportunidade de viajar."
      }
    );
  }

  possibleEvents.push(
    {
      type:
        LIFE_EVENT_TYPES
          .FAMILY,

      title:
        "Momento em família",

      description:
        "O personagem passou por um momento importante com a família."
    }
  );

  if (
    possibleEvents.length ===
    0
  ) {
    return null;
  }

  /*
   * Probabilidade pequena para não
   * poluir o jogo com eventos.
   */
  if (
    randomFloat(0, 1) >
      0.08
  ) {
    return null;
  }

  const selected =
    randomItem(
      possibleEvents
    );

  if (!selected) {
    return null;
  }

  return addLifeEvent(
    database,
    {
      ...selected,
      importance: 1,
      generated: true
    }
  );
}

/* ============================================================
   PROCESSAMENTO MENSAL
   ============================================================ */

function processLifeMonth(
  database,
  options = {}
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  if (
    !state.alive
  ) {
    return {
      processed: false,
      reason:
        "Personagem está morto."
    };
  }

  if (
    state.paused ||
    state.status ===
      LIFE_ENGINE_STATUS.PAUSED
  ) {
    return {
      processed: false,
      reason:
        "Life Engine está pausado."
    };
  }

  state.status =
    LIFE_ENGINE_STATUS.RUNNING;

  state.monthlyProcessing =
    true;

  ensureLifeModulesState(
    database
  );

  const results = {
    relationships: null,
    marriage: null,
    children: null,
    family: null,
    education: null,
    employment: null,
    residence: null,
    vehicles: null,
    lifestyle: null,
    health: null,
    randomEvent: null
  };

  if (
    LIFE_ENGINE_CONFIG
      .processRelationshipsMonthly
  ) {
    results.relationships =
      processRelationships(
        database,
        options
      );
  }

  if (
    LIFE_ENGINE_CONFIG
      .processMarriageMonthly
  ) {
    results.marriage =
      processMarriage(
        database
      );
  }

  if (
    LIFE_ENGINE_CONFIG
      .processChildrenMonthly
  ) {
    results.children =
      processChildren(
        database
      );
  }

  results.family =
    processFamily(
      database
    );

  if (
    LIFE_ENGINE_CONFIG
      .processEducationMonthly
  ) {
    results.education =
      processEducation(
        database
      );
  }

  if (
    LIFE_ENGINE_CONFIG
      .processEmploymentMonthly
  ) {
    results.employment =
      processEmployment(
        database
      );
  }

  if (
    LIFE_ENGINE_CONFIG
      .processResidenceMonthly
  ) {
    results.residence =
      processResidence(
        database
      );
  }

  if (
    LIFE_ENGINE_CONFIG
      .processVehiclesMonthly
  ) {
    results.vehicles =
      processVehicles(
        database
      );
  }

  if (
    LIFE_ENGINE_CONFIG
      .processLifestyleMonthly
  ) {
    results.lifestyle =
      processLifestyle(
        database
      );
  }

  results.health =
    processLifeHealth(
      database
    );

  if (
    options.randomEvents !==
      false
  ) {
    results.randomEvent =
      generateRandomLifeEvent(
        database
      );
  }

  const movement =
    advanceLifeMonth(
      database
    );

  state.statistics
    .monthsProcessed +=
    1;

  state.lastProcessedMonth =
    nowISO();

  state.timestamps
    .lastMonthlyProcess =
    nowISO();

  state.monthlyProcessing =
    false;

  state.status =
    LIFE_ENGINE_STATUS.READY;

  state.timestamps.updatedAt =
    nowISO();

  addLifeHistory(
    database,
    "monthly_process",
    "Ciclo mensal da vida processado.",
    {
      movement,
      results
    }
  );

  /*
   * O aniversário acontece quando
   * o calendário completa 12 meses.
   */
  if (
    movement.month === 1
  ) {
    processBirthday(
      database
    );

    if (
      LIFE_ENGINE_CONFIG
        .processAnnualSystems
    ) {
      processLifeYear(
        database,
        {
          fromMonthlyCycle:
            true
        }
      );
    }
  }

  return {
    processed: true,
    movement,
    results,
    age:
      getPlayerAge(database),
    month:
      state.currentMonth,
    year:
      state.currentYear
  };
}

/* ============================================================
   PROCESSAMENTO ANUAL
   ============================================================ */

function processLifeYear(
  database,
  options = {}
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  if (
    !state.alive
  ) {
    return {
      processed: false,
      reason:
        "Personagem está morto."
    };
  }

  if (
    state.annualProcessing
  ) {
    return {
      processed: false,
      reason:
        "Processamento anual já está em andamento."
    };
  }

  state.annualProcessing =
    true;

  const results = {
    birthday:
      null,

    children:
      null,

    education:
      null,

    employment:
      null,

    residence:
      null,

    vehicles:
      null,

    lifestyle:
      null
  };

  /*
   * Se não veio de processLifeMonth,
   * avançamos a idade aqui.
   */
  if (
    !options.fromMonthlyCycle
  ) {
    results.birthday =
      processBirthday(
        database
      );
  }

  /*
   * Processamento anual de filhos.
   */
  const childrenState =
    database.life
      ?.children;

  if (
    childrenState
  ) {
    Object.values(
      childrenState.children ||
        {}
    ).forEach(
      child => {
        if (
          child &&
          Number.isFinite(
            Number(
              child.age
            )
          )
        ) {
          /*
           * O processamento mensal
           * normalmente já atualiza
           * os filhos.
           */
          child.lastAnnualProcess =
            nowISO();
        }
      }
    );

    results.children = {
      processed: true
    };
  }

  /*
   * Educação.
   */
  if (
    database.life
      ?.education
  ) {
    Object.values(
      database.life
        .education
        .profiles ||
        {}
    ).forEach(
      profile => {
        if (!profile) {
          return;
        }

        profile.totalYears =
          Number(
            profile.totalYears ??
              0
          ) + 1;

        profile.lastAnnualProcess =
          nowISO();
      }
    );

    results.education = {
      processed: true
    };
  }

  /*
   * Emprego.
   */
  if (
    database.life
      ?.employment
  ) {
    Object.values(
      database.life
        .employment
        .profiles ||
        {}
    ).forEach(
      profile => {
        if (!profile) {
          return;
        }

        profile.totalYearsWorked =
          Number(
            profile.totalYearsWorked ??
              0
          );

        if (
          profile.status ===
            "employed" ||
          profile.status ===
            "self_employed" ||
          profile.status ===
            "entrepreneur"
        ) {
          profile.totalYearsWorked +=
            1;
        }

        profile.lastAnnualProcess =
          nowISO();
      }
    );

    results.employment = {
      processed: true
    };
  }

  /*
   * Residência.
   */
  if (
    database.life
      ?.residence
  ) {
    Object.values(
      database.life
        .residence
        .profiles ||
        {}
    ).forEach(
      profile => {
        if (!profile) {
          return;
        }

        profile.lastAnnualProcess =
          nowISO();
      }
    );

    results.residence = {
      processed: true
    };
  }

  /*
   * Veículos.
   */
  if (
    database.life
      ?.vehicles
  ) {
    Object.values(
      database.life
        .vehicles
        .profiles ||
        {}
    ).forEach(
      profile => {
        if (!profile) {
          return;
        }

        profile.lastAnnualProcess =
          nowISO();
      }
    );

    results.vehicles = {
      processed: true
    };
  }

  /*
   * Lifestyle.
   */
  if (
    database.life
      ?.lifestyle
  ) {
    Object.values(
      database.life
        .lifestyle
        .profiles ||
        {}
    ).forEach(
      profile => {
        if (!profile) {
          return;
        }

        if (
          profile.travel
        ) {
          profile.travel
            .tripsThisYear = 0;

          profile.travel
            .internationalTrips = 0;
        }

        profile.lastAnnualProcess =
          nowISO();
      }
    );

    results.lifestyle = {
      processed: true
    };
  }

  state.statistics
    .yearsProcessed +=
    1;

  state.lastProcessedYear =
    nowISO();

  state.timestamps
    .lastAnnualProcess =
    nowISO();

  state.annualProcessing =
    false;

  state.timestamps.updatedAt =
    nowISO();

  addLifeHistory(
    database,
    "annual_process",
    "Ciclo anual da vida processado.",
    {
      results,
      age:
        getPlayerAge(database)
    }
  );

  return {
    processed: true,
    results,
    age:
      getPlayerAge(database),
    year:
      state.currentYear
  };
}

/* ============================================================
   SIMULAR VÁRIOS MESES
   ============================================================ */

function processLifeMonths(
  database,
  months = 1,
  options = {}
) {
  const amount =
    clamp(
      Number(months) || 1,
      1,
      1200
    );

  const results = [];

  for (
    let index = 0;
    index < amount;
    index++
  ) {
    const result =
      processLifeMonth(
        database,
        options
      );

    results.push(
      result
    );

    if (
      !result?.processed
    ) {
      break;
    }

    const engine =
      ensureLifeEngineState(
        database
      );

    if (
      !engine?.alive
    ) {
      break;
    }
  }

  return results;
}

/* ============================================================
   SIMULAR VÁRIOS ANOS
   ============================================================ */

function processLifeYears(
  database,
  years = 1,
  options = {}
) {
  const amount =
    clamp(
      Number(years) || 1,
      1,
      100
    );

  const results = [];

  for (
    let index = 0;
    index < amount;
    index++
  ) {
    const yearResults = [];

    for (
      let month = 0;
      month < 12;
      month++
    ) {
      const result =
        processLifeMonth(
          database,
          options
        );

      yearResults.push(
        result
      );

      if (
        !result?.processed
      ) {
        break;
      }

      const engine =
        ensureLifeEngineState(
          database
        );

      if (
        !engine?.alive
      ) {
        break;
      }
    }

    results.push(
      yearResults
    );

    const engine =
      ensureLifeEngineState(
        database
      );

    if (
      !engine?.alive
    ) {
      break;
    }
  }

  return results;
}

/* ============================================================
   PAUSA
   ============================================================ */

function pauseLifeEngine(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return false;
  }

  state.paused =
    true;

  state.status =
    LIFE_ENGINE_STATUS.PAUSED;

  state.timestamps.updatedAt =
    nowISO();

  return true;
}

function resumeLifeEngine(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return false;
  }

  state.paused =
    false;

  state.status =
    LIFE_ENGINE_STATUS.READY;

  state.timestamps.updatedAt =
    nowISO();

  return true;
}

/* ============================================================
   MORTE
   ============================================================ */

function markCharacterDead(
  database,
  data = {}
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  state.alive = false;

  state.status =
    LIFE_ENGINE_STATUS.COMPLETED;

  const age =
    getPlayerAge(database);

  const event =
    addLifeEvent(
      database,
      {
        type:
          LIFE_EVENT_TYPES.DEATH,

        title:
          data.title ||
          "Falecimento",

        description:
          data.description ||
          `O personagem faleceu aos ${age} anos.`,

        importance: 10,

        data: {
          cause:
            data.cause ||
            "unknown",

          age,

          ...clone(
            data.data || {}
          )
        }
      }
    );

  addLifeHistory(
    database,
    "death",
    "Personagem marcado como falecido.",
    {
      age,
      cause:
        data.cause ||
        "unknown"
    }
  );

  return event;
}

function isCharacterAlive(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  return Boolean(
    state?.alive
  );
}

/* ============================================================
   ESTÁGIOS DA VIDA
   ============================================================ */

function getLifeStage(
  age
) {
  const normalizedAge =
    Number(age) || 0;

  if (
    normalizedAge < 3
  ) {
    return "infancy";
  }

  if (
    normalizedAge < 6
  ) {
    return "early_childhood";
  }

  if (
    normalizedAge < 13
  ) {
    return "childhood";
  }

  if (
    normalizedAge < 18
  ) {
    return "adolescence";
  }

  if (
    normalizedAge < 25
  ) {
    return "young_adult";
  }

  if (
    normalizedAge < 40
  ) {
    return "adult";
  }

  if (
    normalizedAge < 60
  ) {
    return "middle_age";
  }

  if (
    normalizedAge < 75
  ) {
    return "senior";
  }

  return "elderly";
}

function getLifeStageLabel(
  stage
) {
  const labels = {
    infancy: "Bebê",
    early_childhood:
      "Primeira infância",
    childhood: "Infância",
    adolescence:
      "Adolescência",
    young_adult:
      "Jovem adulto",
    adult: "Adulto",
    middle_age:
      "Meia-idade",
    senior: "Sênior",
    elderly: "Idoso"
  };

  return (
    labels[stage] ||
    "Desconhecido"
  );
}

/* ============================================================
   MILESTONES
   ============================================================ */

function getLifeMilestones(
  database
) {
  const age =
    getPlayerAge(database);

  const milestones = [
    {
      id: "childhood",
      age: 6,
      label: "Infância",
      reached:
        age >= 6
    },

    {
      id: "adolescence",
      age: 13,
      label: "Adolescência",
      reached:
        age >= 13
    },

    {
      id: "adult",
      age: 18,
      label: "Maioridade",
      reached:
        age >= 18
    },

    {
      id: "young_adult",
      age: 25,
      label: "Vida adulta",
      reached:
        age >= 25
    },

    {
      id: "middle_age",
      age: 40,
      label: "Meia-idade",
      reached:
        age >= 40
    },

    {
      id: "senior",
      age: 60,
      label: "Terceira idade",
      reached:
        age >= 60
    },

    {
      id: "elderly",
      age: 75,
      label: "Idade avançada",
      reached:
        age >= 75
    }
  ];

  return milestones;
}

/* ============================================================
   STATUS GERAL DA VIDA
   ============================================================ */

function calculateLifeScore(
  database
) {
  const player =
    getPlayer(database);

  const age =
    getPlayerAge(database);

  let score = 50;

  /*
   * Saúde.
   */
  const health =
    database?.health;

  if (
    health
  ) {
    const healthScore =
      Number(
        health.overall ??
          health.score ??
          health.condition ??
          50
      );

    score +=
      (
        clamp(
          healthScore,
          0,
          100
        ) -
        50
      ) *
      0.25;
  }

  /*
   * Lifestyle.
   */
  const lifestyleState =
    database?.life
      ?.lifestyle;

  if (
    lifestyleState
  ) {
    const profiles =
      Object.values(
        lifestyleState
          .profiles ||
          {}
      );

    const profile =
      profiles.find(
        item =>
          normalizeId(
            item.entityId
          ) ===
          getPlayerId(database)
      ) ||
      profiles[0];

    if (profile) {
      score +=
        (
          Number(
            profile.qualityOfLife ??
              50
          ) -
          50
        ) *
        0.30;
    }
  }

  /*
   * Família.
   */
  const childrenState =
    database?.life
      ?.children;

  if (
    childrenState
  ) {
    const childrenCount =
      Object.keys(
        childrenState
          .children ||
          {}
      ).length;

    score +=
      Math.min(
        childrenCount * 2,
        10
      );
  }

  /*
   * Idade não é necessariamente
   * positiva ou negativa.
   */
  if (
    age >= 18 &&
    age <= 45
  ) {
    score += 5;
  }

  /*
   * Pequeno bônus de identidade
   * caso o personagem exista.
   */
  if (
    player
  ) {
    score += 5;
  }

  return clamp(
    Math.round(score),
    0,
    100
  );
}

/* ============================================================
   RESUMO
   ============================================================ */

function getLifeSummary(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  const age =
    getPlayerAge(database);

  const stage =
    getLifeStage(age);

  return {
    version:
      LIFE_ENGINE_VERSION,

    status:
      state.status,

    alive:
      state.alive,

    paused:
      state.paused,

    characterId:
      getPlayerId(database),

    age,

    lifeStage:
      stage,

    lifeStageLabel:
      getLifeStageLabel(
        stage
      ),

    currentMonth:
      state.currentMonth,

    currentYear:
      state.currentYear,

    totalMonths:
      state.totalMonths,

    totalYears:
      state.totalYears,

    lifeScore:
      calculateLifeScore(
        database
      ),

    milestones:
      getLifeMilestones(
        database
      ),

    statistics:
      clone(
        state.statistics
      ),

    lastProcessedMonth:
      state.lastProcessedMonth,

    lastProcessedYear:
      state.lastProcessedYear
  };
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getLifeEngineSnapshot(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  if (!state) {
    return null;
  }

  return {
    version:
      LIFE_ENGINE_VERSION,

    engine:
      clone(state),

    summary:
      getLifeSummary(
        database
      ),

    lifeState:
      clone(
        database.life || {}
      )
  };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateLifeEngineState(
  database
) {
  const state =
    ensureLifeEngineState(
      database
    );

  const errors = [];

  if (!state) {
    errors.push(
      "Life Engine não inicializado."
    );

    return {
      valid: false,
      errors
    };
  }

  if (
    Number(state.currentMonth) <
      1 ||
    Number(state.currentMonth) >
      12
  ) {
    errors.push(
      "Mês atual inválido."
    );
  }

  if (
    Number(state.currentYear) <
    1
  ) {
    errors.push(
      "Ano atual inválido."
    );
  }

  if (
    Number(state.playerAge) <
      0 ||
    Number(state.playerAge) >
      LIFE_ENGINE_CONFIG
        .maximumHumanAge
  ) {
    errors.push(
      "Idade do personagem inválida."
    );
  }

  if (
    !Array.isArray(
      state.lifeEvents
    )
  ) {
    errors.push(
      "Lista de eventos da vida inválida."
    );
  }

  if (
    !Array.isArray(
      state.history
    )
  ) {
    errors.push(
      "Histórico da vida inválido."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initializeLifeEngine(
  database,
  options = {}
) {
  if (!database) {
    return null;
  }

  const state =
    ensureLifeEngineState(
      database
    );

  ensureLifeModulesState(
    database
  );

  initializeLifeDate(
    database,
    options
  );

  if (
    options.alive !==
    undefined
  ) {
    state.alive =
      Boolean(
        options.alive
      );
  }

  state.status =
    LIFE_ENGINE_STATUS.READY;

  state.paused =
    false;

  state.timestamps.updatedAt =
    nowISO();

  addLifeHistory(
    database,
    "initialization",
    "Life Engine inicializado.",
    {
      age:
        getPlayerAge(database),

      characterId:
        getPlayerId(database)
    }
  );

  return clone(state);
}

/* ============================================================
   RESET
   ============================================================ */

function resetLifeEngine(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  database.life.engine =
    createLifeEngineState();

  return database.life.engine;
}

/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

function getLifeEngineConfig() {
  return clone(
    LIFE_ENGINE_CONFIG
  );
}

function updateLifeEngineConfig(
  updates = {}
) {
  Object.keys(
    updates
  ).forEach(
    key => {
      if (
        Object.prototype
          .hasOwnProperty.call(
            LIFE_ENGINE_CONFIG,
            key
          )
      ) {
        LIFE_ENGINE_CONFIG[
          key
        ] = updates[key];
      }
    }
  );

  return getLifeEngineConfig();
}

/* ============================================================
   API
   ============================================================ */

const lifeEngineAPI = {
  LIFE_ENGINE_VERSION,

  LIFE_ENGINE_CONFIG,
  LIFE_EVENT_TYPES,
  LIFE_ENGINE_STATUS,

  createLifeEngineState,

  ensureLifeEngineState,
  ensureLifeModulesState,

  getPlayer,
  getPlayerId,
  getPlayerAge,
  setPlayerAge,

  createLifeEvent,
  addLifeEvent,
  getLifeEvents,
  getLifeEventsByType,
  getLifeEventsByYear,

  addLifeHistory,
  getLifeHistory,

  initializeLifeDate,
  advanceLifeMonth,
  advanceLifeYear,

  agePlayerOneYear,
  processBirthday,

  processRelationships,
  processMarriage,
  processChildren,
  processFamily,
  processEducation,
  processEmployment,
  processResidence,
  processVehicles,
  processLifestyle,
  processLifeHealth,

  generateRandomLifeEvent,

  processLifeMonth,
  processLifeYear,
  processLifeMonths,
  processLifeYears,

  pauseLifeEngine,
  resumeLifeEngine,

  markCharacterDead,
  isCharacterAlive,

  getLifeStage,
  getLifeStageLabel,
  getLifeMilestones,

  calculateLifeScore,
  getLifeSummary,
  getLifeEngineSnapshot,

  validateLifeEngineState,

  initializeLifeEngine,
  resetLifeEngine,

  getLifeEngineConfig,
  updateLifeEngineConfig
};

export default lifeEngineAPI;

export {
  LIFE_ENGINE_VERSION,

  LIFE_ENGINE_CONFIG,
  LIFE_EVENT_TYPES,
  LIFE_ENGINE_STATUS,

  createLifeEngineState,

  ensureLifeEngineState,
  ensureLifeModulesState,

  getPlayer,
  getPlayerId,
  getPlayerAge,
  setPlayerAge,

  createLifeEvent,
  addLifeEvent,
  getLifeEvents,
  getLifeEventsByType,
  getLifeEventsByYear,

  addLifeHistory,
  getLifeHistory,

  initializeLifeDate,
  advanceLifeMonth,
  advanceLifeYear,

  agePlayerOneYear,
  processBirthday,

  processRelationships,
  processMarriage,
  processChildren,
  processFamily,
  processEducation,
  processEmployment,
  processResidence,
  processVehicles,
  processLifestyle,
  processLifeHealth,

  generateRandomLifeEvent,

  processLifeMonth,
  processLifeYear,
  processLifeMonths,
  processLifeYears,

  pauseLifeEngine,
  resumeLifeEngine,

  markCharacterDead,
  isCharacterAlive,

  getLifeStage,
  getLifeStageLabel,
  getLifeMilestones,

  calculateLifeScore,
  getLifeSummary,
  getLifeEngineSnapshot,

  validateLifeEngineState,

  initializeLifeEngine,
  resetLifeEngine,

  getLifeEngineConfig,
  updateLifeEngineConfig,

  lifeEngineAPI
};
