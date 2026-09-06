/* ============================================================
   MMA LIFE DYNASTY
   LIFE — CHILDREN
   Sistema de filhos, crescimento e continuidade familiar
   ============================================================ */

const CHILDREN_VERSION = 1;

/* ============================================================
   CONSTANTES
   ============================================================ */

const CHILD_GENDERS = {
  MALE: "male",
  FEMALE: "female"
};

const CHILD_STAGES = {
  BABY: "baby",
  CHILD: "child",
  TEEN: "teen",
  YOUNG_ADULT: "young_adult",
  ADULT: "adult"
};

const CHILD_STAGE_AGES = {
  baby: {
    min: 0,
    max: 2
  },

  child: {
    min: 3,
    max: 11
  },

  teen: {
    min: 12,
    max: 17
  },

  young_adult: {
    min: 18,
    max: 24
  },

  adult: {
    min: 25,
    max: 999
  }
};

const CHILD_PERSONALITIES = [
  "disciplined",
  "ambitious",
  "calm",
  "competitive",
  "charismatic",
  "intelligent",
  "creative",
  "social",
  "reserved",
  "adventurous",
  "loyal",
  "rebellious"
];

const CHILD_TRAITS = [
  "determined",
  "confident",
  "focused",
  "resilient",
  "athletic",
  "strategic",
  "leadership",
  "hardworking",
  "emotional",
  "independent",
  "curious",
  "brave"
];

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomItem(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }

  return array[Math.floor(Math.random() * array.length)];
}

function normalizeId(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value).trim();
}

function generateId(prefix = "child") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/* ============================================================
   ESTÁGIO DA VIDA
   ============================================================ */

function getChildStage(age) {
  const numericAge = Number(age);

  if (!Number.isFinite(numericAge)) {
    return CHILD_STAGES.BABY;
  }

  if (numericAge <= 2) {
    return CHILD_STAGES.BABY;
  }

  if (numericAge <= 11) {
    return CHILD_STAGES.CHILD;
  }

  if (numericAge <= 17) {
    return CHILD_STAGES.TEEN;
  }

  if (numericAge <= 24) {
    return CHILD_STAGES.YOUNG_ADULT;
  }

  return CHILD_STAGES.ADULT;
}

function getStageLabel(stage) {
  const labels = {
    baby: "Bebê",
    child: "Criança",
    teen: "Adolescente",
    young_adult: "Jovem adulto",
    adult: "Adulto"
  };

  return labels[stage] || "Desconhecido";
}

function getNextStageAge(stage) {
  const ages = {
    baby: 3,
    child: 12,
    teen: 18,
    young_adult: 25,
    adult: null
  };

  return ages[stage] ?? null;
}

/* ============================================================
   NOMES
   ============================================================ */

const DEFAULT_FIRST_NAMES_MALE = [
  "Arthur",
  "Miguel",
  "Gabriel",
  "Heitor",
  "Davi",
  "Bernardo",
  "Theo",
  "Samuel",
  "Lucas",
  "Rafael",
  "Enzo",
  "Matheus",
  "João",
  "Pedro",
  "Gustavo",
  "Henrique",
  "Nicolas",
  "Leonardo",
  "Caio",
  "Victor"
];

const DEFAULT_FIRST_NAMES_FEMALE = [
  "Alice",
  "Helena",
  "Laura",
  "Sophia",
  "Valentina",
  "Heloísa",
  "Manuela",
  "Isabella",
  "Júlia",
  "Luiza",
  "Cecília",
  "Maria",
  "Beatriz",
  "Lívia",
  "Lorena",
  "Clara",
  "Eloá",
  "Maitê",
  "Aurora",
  "Yasmin"
];

function generateChildName(gender, data = {}) {
  if (data.name) {
    return String(data.name);
  }

  if (Array.isArray(data.namePool) && data.namePool.length > 0) {
    return randomItem(data.namePool);
  }

  if (gender === CHILD_GENDERS.FEMALE) {
    return randomItem(DEFAULT_FIRST_NAMES_FEMALE);
  }

  return randomItem(DEFAULT_FIRST_NAMES_MALE);
}

/* ============================================================
   PERSONALIDADE E TRAÇOS
   ============================================================ */

function generatePersonality() {
  return randomItem(CHILD_PERSONALITIES);
}

function generateTraits(count = 2) {
  const pool = [...CHILD_TRAITS];
  const traits = [];

  const amount = clamp(Number(count) || 0, 0, pool.length);

  for (let i = 0; i < amount; i++) {
    const index = Math.floor(Math.random() * pool.length);
    traits.push(pool.splice(index, 1)[0]);
  }

  return traits;
}

/* ============================================================
   GENÉTICA
   ============================================================ */

function inheritValue(parentA, parentB, min = 1, max = 100) {
  const a = Number(parentA);
  const b = Number(parentB);

  const validA = Number.isFinite(a);
  const validB = Number.isFinite(b);

  if (!validA && !validB) {
    return randomInt(min, max);
  }

  if (validA && !validB) {
    return clamp(Math.round(a + randomFloat(-10, 10)), min, max);
  }

  if (!validA && validB) {
    return clamp(Math.round(b + randomFloat(-10, 10)), min, max);
  }

  const average = (a + b) / 2;
  const variation = randomFloat(-12, 12);

  return clamp(
    Math.round(average + variation),
    min,
    max
  );
}

function calculateChildGenetics(parentA = null, parentB = null) {
  const a = parentA || {};
  const b = parentB || {};

  return {
    athleticism: inheritValue(
      a.athleticism ?? a.genetics?.athleticism,
      b.athleticism ?? b.genetics?.athleticism
    ),

    strength: inheritValue(
      a.strength ?? a.genetics?.strength,
      b.strength ?? b.genetics?.strength
    ),

    speed: inheritValue(
      a.speed ?? a.genetics?.speed,
      b.speed ?? b.genetics?.speed
    ),

    endurance: inheritValue(
      a.endurance ?? a.genetics?.endurance,
      b.endurance ?? b.genetics?.endurance
    ),

    coordination: inheritValue(
      a.coordination ?? a.genetics?.coordination,
      b.coordination ?? b.genetics?.coordination
    ),

    intelligence: inheritValue(
      a.intelligence ?? a.genetics?.intelligence,
      b.intelligence ?? b.genetics?.intelligence
    ),

    charisma: inheritValue(
      a.charisma ?? a.genetics?.charisma,
      b.charisma ?? b.genetics?.charisma
    ),

    resilience: inheritValue(
      a.resilience ?? a.genetics?.resilience,
      b.resilience ?? b.genetics?.resilience
    )
  };
}

/* ============================================================
   ATRIBUTOS INICIAIS
   ============================================================ */

function generateChildAttributes(genetics = {}) {
  const athleticism = Number(genetics.athleticism) || 50;
  const strength = Number(genetics.strength) || 50;
  const speed = Number(genetics.speed) || 50;
  const endurance = Number(genetics.endurance) || 50;
  const coordination = Number(genetics.coordination) || 50;
  const intelligence = Number(genetics.intelligence) || 50;
  const charisma = Number(genetics.charisma) || 50;
  const resilience = Number(genetics.resilience) || 50;

  return {
    athleticism: clamp(
      Math.round(athleticism * 0.65 + randomInt(15, 35)),
      1,
      100
    ),

    strength: clamp(
      Math.round(strength * 0.55 + randomInt(20, 40)),
      1,
      100
    ),

    speed: clamp(
      Math.round(speed * 0.55 + randomInt(20, 40)),
      1,
      100
    ),

    endurance: clamp(
      Math.round(endurance * 0.55 + randomInt(20, 40)),
      1,
      100
    ),

    coordination: clamp(
      Math.round(coordination * 0.65 + randomInt(15, 35)),
      1,
      100
    ),

    intelligence: clamp(
      Math.round(intelligence * 0.65 + randomInt(15, 35)),
      1,
      100
    ),

    charisma: clamp(
      Math.round(charisma * 0.65 + randomInt(15, 35)),
      1,
      100
    ),

    resilience: clamp(
      Math.round(resilience * 0.65 + randomInt(15, 35)),
      1,
      100
    )
  };
}

/* ============================================================
   POTENCIAL
   ============================================================ */

function calculatePotential(genetics = {}, personality = null) {
  const values = [
    genetics.athleticism,
    genetics.strength,
    genetics.speed,
    genetics.endurance,
    genetics.coordination,
    genetics.intelligence,
    genetics.charisma,
    genetics.resilience
  ]
    .map(Number)
    .filter(Number.isFinite);

  const average =
    values.length > 0
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 50;

  let bonus = 0;

  if (personality === "ambitious") {
    bonus += 5;
  }

  if (personality === "competitive") {
    bonus += 5;
  }

  if (personality === "disciplined") {
    bonus += 4;
  }

  if (personality === "intelligent") {
    bonus += 3;
  }

  return clamp(
    Math.round(average + bonus + randomFloat(-8, 8)),
    1,
    100
  );
}

/* ============================================================
   SAÚDE
   ============================================================ */

function createChildHealth() {
  return {
    overall: randomInt(80, 100),
    physical: randomInt(80, 100),
    mental: randomInt(80, 100),
    injuries: [],
    chronicConditions: [],
    lastCheckup: null
  };
}

/* ============================================================
   EDUCAÇÃO
   ============================================================ */

function createChildEducation() {
  return {
    schoolLevel: "basic",
    academicPerformance: randomInt(40, 80),
    intelligenceDevelopment: randomInt(40, 70),
    discipline: randomInt(40, 80),
    interests: [],
    completedEducation: [],
    currentEducation: null
  };
}

/* ============================================================
   ESPORTES
   ============================================================ */

function createChildSports(genetics = {}) {
  const sports = [];

  const athleticism = Number(genetics.athleticism) || 50;

  if (athleticism >= 65) {
    sports.push("sports");
  }

  return {
    interested: sports,
    activeSport: null,
    training: false,
    trainingLevel: 0,
    combatSportsInterest: athleticism >= 70
  };
}

/* ============================================================
   RELACIONAMENTOS
   ============================================================ */

function createParentRelationship(parentId, type = "parent") {
  if (!parentId) {
    return null;
  }

  return {
    id: generateId("rel"),
    targetId: normalizeId(parentId),
    type,
    level: 5,
    score: randomInt(70, 100),
    createdAt: null,
    updatedAt: null
  };
}

/* ============================================================
   CRIAÇÃO DE FILHO
   ============================================================ */

function createChild(data = {}) {
  const id = normalizeId(data.id) || generateId();

  const gender =
    data.gender === CHILD_GENDERS.FEMALE
      ? CHILD_GENDERS.FEMALE
      : data.gender === CHILD_GENDERS.MALE
        ? CHILD_GENDERS.MALE
        : randomItem([
            CHILD_GENDERS.MALE,
            CHILD_GENDERS.FEMALE
          ]);

  const age = Math.max(
    0,
    Number.isFinite(Number(data.age))
      ? Number(data.age)
      : 0
  );

  const stage = getChildStage(age);

  const parentA =
    data.parentA ||
    data.father ||
    data.mother ||
    null;

  const parentB =
    data.parentB ||
    null;

  const genetics =
    data.genetics ||
    calculateChildGenetics(parentA, parentB);

  const personality =
    data.personality ||
    generatePersonality();

  const potential =
    Number.isFinite(Number(data.potential))
      ? clamp(Number(data.potential), 1, 100)
      : calculatePotential(genetics, personality);

  const attributes =
    data.attributes ||
    generateChildAttributes(genetics);

  const child = {
    id,

    version: CHILDREN_VERSION,

    identity: {
      name: generateChildName(gender, data),
      gender,
      nationality:
        data.nationality ||
        parentA?.nationality ||
        parentB?.nationality ||
        null,

      countryId:
        data.countryId ||
        parentA?.countryId ||
        parentB?.countryId ||
        null,

      cityId:
        data.cityId ||
        parentA?.cityId ||
        parentB?.cityId ||
        null
    },

    birth: {
      date: data.birthDate || null,
      year: data.birthYear ?? null,
      month: data.birthMonth ?? null,
      day: data.birthDay ?? null,

      birthOrder:
        Number.isFinite(Number(data.birthOrder))
          ? Number(data.birthOrder)
          : null,

      multipleBirth: Boolean(data.multipleBirth)
    },

    age,

    stage,

    parents: {
      fatherId:
        normalizeId(
          data.fatherId ||
          parentA?.gender === CHILD_GENDERS.MALE
            ? data.fatherId || parentA?.id
            : data.fatherId
        ),

      motherId:
        normalizeId(
          data.motherId ||
          parentA?.gender === CHILD_GENDERS.FEMALE
            ? data.motherId || parentA?.id
            : data.motherId
        ),

      parentIds: [
        data.fatherId || null,
        data.motherId || null
      ].filter(Boolean)
    },

    siblings: [],

    genetics,

    attributes,

    potential,

    personality,

    traits:
      Array.isArray(data.traits)
        ? [...data.traits]
        : generateTraits(randomInt(1, 3)),

    health:
      data.health
        ? clone(data.health)
        : createChildHealth(),

    education:
      data.education
        ? clone(data.education)
        : createChildEducation(),

    sports:
      data.sports
        ? clone(data.sports)
        : createChildSports(genetics),

    relationships: [],

    finances: {
      personalMoney: Number(data.personalMoney) || 0,
      inheritanceReceived: 0,
      assets: []
    },

    career: {
      active: false,
      profession: null,
      careerStage: null,
      organizationId: null,
      record: {
        wins: 0,
        losses: 0,
        draws: 0,
        noContests: 0
      }
    },

    dynasty: {
      generation: Number(data.generation) || 1,
      eligibleToContinueDynasty: age >= 18,
      canBecomeActiveCharacter: age >= 18,
      inheritedLegacy: 0,
      inheritedAssets: []
    },

    life: {
      alive: data.alive !== false,
      married: false,
      partnerId: null,
      childrenIds: [],
      residence: null
    },

    history: [],

    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  };

  return child;
}

/* ============================================================
   ESTADO
   ============================================================ */

function ensureChildrenState(database) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (!Array.isArray(database.life.children)) {
    database.life.children = [];
  }

  if (!database.life.childrenById) {
    database.life.childrenById = {};
  }

  return database.life;
}

/* ============================================================
   CONSULTAS
   ============================================================ */

function getChildren(database) {
  const state = ensureChildrenState(database);

  return state
    ? state.children.map(child => clone(child))
    : [];
}

function getChild(database, childId) {
  const state = ensureChildrenState(database);

  if (!state) {
    return null;
  }

  const id = normalizeId(childId);

  const child = state.children.find(
    item => normalizeId(item.id) === id
  );

  return child ? clone(child) : null;
}

function findChildReference(database, childId) {
  const state = ensureChildrenState(database);

  if (!state) {
    return null;
  }

  const id = normalizeId(childId);

  return (
    state.children.find(
      item => normalizeId(item.id) === id
    ) || null
  );
}

function getChildrenByParent(database, parentId) {
  const state = ensureChildrenState(database);

  if (!state) {
    return [];
  }

  const id = normalizeId(parentId);

  return state.children
    .filter(child =>
      child.parents?.parentIds?.some(
        parent => normalizeId(parent) === id
      )
    )
    .map(child => clone(child));
}

function getChildrenByStage(database, stage) {
  const state = ensureChildrenState(database);

  if (!state) {
    return [];
  }

  return state.children
    .filter(child => child.stage === stage)
    .map(child => clone(child));
}

function getLivingChildren(database) {
  const state = ensureChildrenState(database);

  if (!state) {
    return [];
  }

  return state.children
    .filter(child => child.life?.alive !== false)
    .map(child => clone(child));
}

function getAdultChildren(database) {
  const state = ensureChildrenState(database);

  if (!state) {
    return [];
  }

  return state.children
    .filter(child => Number(child.age) >= 18)
    .map(child => clone(child));
}

/* ============================================================
   ADICIONAR / REMOVER
   ============================================================ */

function addChild(database, data = {}) {
  const state = ensureChildrenState(database);

  if (!state) {
    return null;
  }

  const child = createChild(data);

  state.children.push(child);
  state.childrenById[child.id] = child;

  return clone(child);
}

function updateChild(database, childId, updates = {}) {
  const child = findChildReference(database, childId);

  if (!child) {
    return null;
  }

  Object.keys(updates).forEach(key => {
    if (
      updates[key] !== undefined &&
      key !== "id"
    ) {
      child[key] = clone(updates[key]);
    }
  });

  child.updatedAt = new Date().toISOString();

  return clone(child);
}

function removeChild(database, childId) {
  const state = ensureChildrenState(database);

  if (!state) {
    return false;
  }

  const id = normalizeId(childId);

  const index = state.children.findIndex(
    child => normalizeId(child.id) === id
  );

  if (index === -1) {
    return false;
  }

  state.children.splice(index, 1);

  delete state.childrenById[id];

  return true;
}

/* ============================================================
   IRMÃOS
   ============================================================ */

function addSibling(database, childId, siblingId) {
  const child = findChildReference(database, childId);

  if (!child || !siblingId) {
    return false;
  }

  const id = normalizeId(siblingId);

  if (!Array.isArray(child.siblings)) {
    child.siblings = [];
  }

  if (!child.siblings.includes(id)) {
    child.siblings.push(id);
  }

  return true;
}

function connectSiblings(database, childAId, childBId) {
  if (
    !findChildReference(database, childAId) ||
    !findChildReference(database, childBId)
  ) {
    return false;
  }

  addSibling(database, childAId, childBId);
  addSibling(database, childBId, childAId);

  return true;
}

function updateSiblingConnections(database) {
  const state = ensureChildrenState(database);

  if (!state) {
    return 0;
  }

  let connections = 0;

  for (let i = 0; i < state.children.length; i++) {
    for (let j = i + 1; j < state.children.length; j++) {
      const a = state.children[i];
      const b = state.children[j];

      const aParents =
        a.parents?.parentIds || [];

      const bParents =
        b.parents?.parentIds || [];

      const haveCommonParent =
        aParents.some(parent =>
          bParents.includes(parent)
        );

      if (haveCommonParent) {
        connectSiblings(
          database,
          a.id,
          b.id
        );

        connections++;
      }
    }
  }

  return connections;
}

/* ============================================================
   CRESCIMENTO
   ============================================================ */

function updateChildStage(child) {
  if (!child) {
    return null;
  }

  child.stage = getChildStage(child.age);

  if (child.age >= 18) {
    child.dynasty.canBecomeActiveCharacter = true;
    child.dynasty.eligibleToContinueDynasty = true;
  } else {
    child.dynasty.canBecomeActiveCharacter = false;
  }

  return child.stage;
}

function ageChild(child, years = 1) {
  if (!child) {
    return null;
  }

  const amount = Math.max(
    0,
    Number(years) || 0
  );

  child.age += amount;

  updateChildStage(child);

  child.attributes = growChildAttributes(
    child.attributes,
    child,
    amount
  );

  child.health = updateChildHealth(
    child.health,
    amount
  );

  child.education = updateChildEducation(
    child.education,
    child.age,
    amount
  );

  child.updatedAt = new Date().toISOString();

  return child;
}

function ageAllChildren(database, years = 1) {
  const state = ensureChildrenState(database);

  if (!state) {
    return [];
  }

  return state.children.map(child => {
    ageChild(child, years);
    return clone(child);
  });
}

/* ============================================================
   DESENVOLVIMENTO DOS ATRIBUTOS
   ============================================================ */

function growChildAttributes(
  attributes = {},
  child = {},
  years = 1
) {
  const result = {
    ...attributes
  };

  const age = Number(child.age) || 0;
  const potential = Number(child.potential) || 50;

  if (age < 3) {
    return result;
  }

  const development =
    age < 12
      ? 1
      : age < 18
        ? 2
        : 1;

  Object.keys(result).forEach(key => {
    const current =
      Number(result[key]) || 1;

    const potentialRoom =
      Math.max(
        0,
        potential - current
      );

    const growth =
      Math.min(
        potentialRoom,
        randomFloat(
          0,
          development * Math.max(1, years)
        )
      );

    result[key] = clamp(
      Math.round(current + growth),
      1,
      100
    );
  });

  return result;
}

/* ============================================================
   SAÚDE
   ============================================================ */

function updateChildHealth(
  health = {},
  years = 1
) {
  const result = {
    ...health
  };

  const currentOverall =
    Number(result.overall) || 85;

  const naturalVariation =
    randomFloat(-2, 2) * years;

  result.overall = clamp(
    Math.round(
      currentOverall + naturalVariation
    ),
    1,
    100
  );

  result.physical = clamp(
    Math.round(
      Number(result.physical || 85) +
      randomFloat(-2, 2) * years
    ),
    1,
    100
  );

  result.mental = clamp(
    Math.round(
      Number(result.mental || 85) +
      randomFloat(-2, 2) * years
    ),
    1,
    100
  );

  return result;
}

/* ============================================================
   EDUCAÇÃO
   ============================================================ */

function updateChildEducation(
  education = {},
  age = 0,
  years = 1
) {
  const result = {
    ...education
  };

  if (age >= 3 && age <= 11) {
    result.schoolLevel = "basic";

    result.academicPerformance = clamp(
      Math.round(
        Number(result.academicPerformance || 50) +
        randomFloat(0, 3) * years
      ),
      1,
      100
    );
  }

  if (age >= 12 && age <= 17) {
    result.schoolLevel = "secondary";

    result.academicPerformance = clamp(
      Math.round(
        Number(result.academicPerformance || 50) +
        randomFloat(0, 3) * years
      ),
      1,
      100
    );
  }

  if (age >= 18) {
    result.schoolLevel = "adult";

    result.intelligenceDevelopment = clamp(
      Math.round(
        Number(result.intelligenceDevelopment || 50) +
        randomFloat(0, 2) * years
      ),
      1,
      100
    );
  }

  return result;
}

/* ============================================================
   ESPORTES / MMA
   ============================================================ */

function developCombatInterest(child) {
  if (!child) {
    return false;
  }

  if (!child.sports) {
    child.sports = createChildSports(
      child.genetics
    );
  }

  const athleticism =
    Number(child.genetics?.athleticism) || 50;

  const personality =
    child.personality;

  let chance = 0.1;

  if (athleticism >= 70) {
    chance += 0.25;
  }

  if (
    personality === "competitive" ||
    personality === "ambitious"
  ) {
    chance += 0.15;
  }

  if (
    child.age >= 8 &&
    child.age <= 17
  ) {
    chance += 0.10;
  }

  if (Math.random() < chance) {
    child.sports.combatSportsInterest = true;
    return true;
  }

  return false;
}

function startChildSport(
  child,
  sport = "mma"
) {
  if (!child || child.age < 6) {
    return false;
  }

  if (!child.sports) {
    child.sports = createChildSports(
      child.genetics
    );
  }

  if (!Array.isArray(child.sports.interested)) {
    child.sports.interested = [];
  }

  if (
    !child.sports.interested.includes(sport)
  ) {
    child.sports.interested.push(sport);
  }

  if (sport === "mma") {
    child.sports.combatSportsInterest = true;
  }

  child.sports.activeSport = sport;
  child.sports.training = true;

  return true;
}

/* ============================================================
   ADULTO / CARREIRA
   ============================================================ */

function canBecomeActiveCharacter(child) {
  if (!child) {
    return false;
  }

  return (
    child.life?.alive !== false &&
    Number(child.age) >= 18
  );
}

function canEnterProfessionalMMA(child) {
  if (!child) {
    return false;
  }

  return (
    child.life?.alive !== false &&
    Number(child.age) >= 18 &&
    Boolean(
      child.sports?.combatSportsInterest
    )
  );
}

function prepareChildForCareer(child) {
  if (!child || child.age < 18) {
    return false;
  }

  child.dynasty.canBecomeActiveCharacter = true;

  child.dynasty.eligibleToContinueDynasty = true;

  if (
    child.sports?.combatSportsInterest
  ) {
    child.career.active = true;
    child.career.careerStage = "Amateur";
  }

  return true;
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function addChildHistory(
  child,
  type,
  description,
  data = {}
) {
  if (!child) {
    return false;
  }

  if (!Array.isArray(child.history)) {
    child.history = [];
  }

  child.history.push({
    id: generateId("child_history"),
    type,
    description,
    age: child.age,
    date: new Date().toISOString(),
    data: clone(data)
  });

  return true;
}

/* ============================================================
   EVENTOS DE VIDA
   ============================================================ */

function recordBirthday(child) {
  if (!child) {
    return false;
  }

  addChildHistory(
    child,
    "birthday",
    `Completou ${child.age} anos.`
  );

  return true;
}

function recordEducationEvent(
  child,
  description,
  data = {}
) {
  return addChildHistory(
    child,
    "education",
    description,
    data
  );
}

function recordSportEvent(
  child,
  description,
  data = {}
) {
  return addChildHistory(
    child,
    "sport",
    description,
    data
  );
}

function recordCareerEvent(
  child,
  description,
  data = {}
) {
  return addChildHistory(
    child,
    "career",
    description,
    data
  );
}

/* ============================================================
   MORTE
   ============================================================ */

function markChildDead(
  database,
  childId,
  reason = "natural"
) {
  const child = findChildReference(
    database,
    childId
  );

  if (!child) {
    return false;
  }

  child.life.alive = false;

  addChildHistory(
    child,
    "death",
    `Falecimento: ${reason}.`,
    {
      reason
    }
  );

  return true;
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

function calculateChildOverall(child) {
  if (!child) {
    return 0;
  }

  const attributes =
    child.attributes || {};

  const values = Object.values(
    attributes
  )
    .map(Number)
    .filter(Number.isFinite);

  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length
  );
}

function calculateFamilyChildrenStats(
  database,
  parentId = null
) {
  const children =
    parentId
      ? getChildrenByParent(
          database,
          parentId
        )
      : getChildren(database);

  const living = children.filter(
    child => child.life?.alive !== false
  );

  const adults = children.filter(
    child => Number(child.age) >= 18
  );

  const minors = children.filter(
    child => Number(child.age) < 18
  );

  const mmaInterested = children.filter(
    child =>
      child.sports?.combatSportsInterest
  );

  return {
    total: children.length,
    living: living.length,
    adults: adults.length,
    minors: minors.length,
    mmaInterested: mmaInterested.length,

    averageAge:
      children.length > 0
        ? Number(
            (
              children.reduce(
                (sum, child) =>
                  sum + Number(child.age || 0),
                0
              ) / children.length
            ).toFixed(1)
          )
        : 0,

    averagePotential:
      children.length > 0
        ? Math.round(
            children.reduce(
              (sum, child) =>
                sum +
                Number(
                  child.potential || 0
                ),
              0
            ) / children.length
          )
        : 0
  };
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getChildrenSnapshot(database) {
  const children =
    getChildren(database);

  return {
    version: CHILDREN_VERSION,

    total: children.length,

    living: children.filter(
      child => child.life?.alive !== false
    ).length,

    adults: children.filter(
      child => Number(child.age) >= 18
    ).length,

    children: children.map(
      child => ({
        id: child.id,
        name: child.identity?.name,
        gender: child.identity?.gender,
        age: child.age,
        stage: child.stage,
        potential: child.potential,
        overall:
          calculateChildOverall(child),
        alive:
          child.life?.alive !== false
      })
    )
  };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateChild(child) {
  const errors = [];

  if (!child || typeof child !== "object") {
    return {
      valid: false,
      errors: ["Filho inválido."]
    };
  }

  if (!child.id) {
    errors.push("ID ausente.");
  }

  if (!child.identity?.name) {
    errors.push("Nome ausente.");
  }

  if (
    !Number.isFinite(
      Number(child.age)
    )
  ) {
    errors.push("Idade inválida.");
  }

  if (
    !Object.values(
      CHILD_GENDERS
    ).includes(child.identity?.gender)
  ) {
    errors.push("Gênero inválido.");
  }

  if (
    !Number.isFinite(
      Number(child.potential)
    )
  ) {
    errors.push("Potencial inválido.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateChildren(database) {
  const children =
    getChildren(database);

  const results =
    children.map(child => ({
      id: child.id,
      ...validateChild(child)
    }));

  return {
    valid: results.every(
      result => result.valid
    ),
    total: results.length,
    results
  };
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initializeChildren(database) {
  const state =
    ensureChildrenState(database);

  if (!state) {
    return null;
  }

  updateSiblingConnections(database);

  state.children.forEach(child => {
    updateChildStage(child);

    if (!child.dynasty) {
      child.dynasty = {
        generation: 1,
        eligibleToContinueDynasty:
          Number(child.age) >= 18,
        canBecomeActiveCharacter:
          Number(child.age) >= 18,
        inheritedLegacy: 0,
        inheritedAssets: []
      };
    }
  });

  return state;
}

/* ============================================================
   EXPORTS
   ============================================================ */

const childrenAPI = {
  CHILDREN_VERSION,

  CHILD_GENDERS,
  CHILD_STAGES,
  CHILD_STAGE_AGES,
  CHILD_PERSONALITIES,
  CHILD_TRAITS,

  getChildStage,
  getStageLabel,
  getNextStageAge,

  generateChildName,
  generatePersonality,
  generateTraits,

  inheritValue,
  calculateChildGenetics,
  generateChildAttributes,
  calculatePotential,

  createChildHealth,
  createChildEducation,
  createChildSports,

  createParentRelationship,

  createChild,

  ensureChildrenState,

  getChildren,
  getChild,
  findChildReference,
  getChildrenByParent,
  getChildrenByStage,
  getLivingChildren,
  getAdultChildren,

  addChild,
  updateChild,
  removeChild,

  addSibling,
  connectSiblings,
  updateSiblingConnections,

  updateChildStage,
  ageChild,
  ageAllChildren,

  growChildAttributes,
  updateChildHealth,
  updateChildEducation,

  developCombatInterest,
  startChildSport,

  canBecomeActiveCharacter,
  canEnterProfessionalMMA,
  prepareChildForCareer,

  addChildHistory,
  recordBirthday,
  recordEducationEvent,
  recordSportEvent,
  recordCareerEvent,

  markChildDead,

  calculateChildOverall,
  calculateFamilyChildrenStats,

  getChildrenSnapshot,

  validateChild,
  validateChildren,

  initializeChildren
};

export default childrenAPI;

export {
  CHILDREN_VERSION,

  CHILD_GENDERS,
  CHILD_STAGES,
  CHILD_STAGE_AGES,
  CHILD_PERSONALITIES,
  CHILD_TRAITS,

  getChildStage,
  getStageLabel,
  getNextStageAge,

  generateChildName,
  generatePersonality,
  generateTraits,

  inheritValue,
  calculateChildGenetics,
  generateChildAttributes,
  calculatePotential,

  createChildHealth,
  createChildEducation,
  createChildSports,

  createParentRelationship,

  createChild,

  ensureChildrenState,

  getChildren,
  getChild,
  findChildReference,
  getChildrenByParent,
  getChildrenByStage,
  getLivingChildren,
  getAdultChildren,

  addChild,
  updateChild,
  removeChild,

  addSibling,
  connectSiblings,
  updateSiblingConnections,

  updateChildStage,
  ageChild,
  ageAllChildren,

  growChildAttributes,
  updateChildHealth,
  updateChildEducation,

  developCombatInterest,
  startChildSport,

  canBecomeActiveCharacter,
  canEnterProfessionalMMA,
  prepareChildForCareer,

  addChildHistory,
  recordBirthday,
  recordEducationEvent,
  recordSportEvent,
  recordCareerEvent,

  markChildDead,

  calculateChildOverall,
  calculateFamilyChildrenStats,

  getChildrenSnapshot,

  validateChild,
  validateChildren,

  initializeChildren,

  childrenAPI
};
