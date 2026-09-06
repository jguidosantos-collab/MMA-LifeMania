/* ============================================================
   MMA LIFE DYNASTY
   LIFE — EDUCATION
   Sistema de educação, estudos e desenvolvimento intelectual
   ============================================================ */

const EDUCATION_VERSION = 1;

/* ============================================================
   NÍVEIS EDUCACIONAIS
   ============================================================ */

const EDUCATION_LEVELS = {
  NONE: "none",
  EARLY: "early",
  ELEMENTARY: "elementary",
  SECONDARY: "secondary",
  VOCATIONAL: "vocational",
  COLLEGE: "college",
  UNIVERSITY: "university",
  POSTGRADUATE: "postgraduate",
  MASTER: "master",
  DOCTORATE: "doctorate"
};

const EDUCATION_LEVEL_ORDER = [
  EDUCATION_LEVELS.NONE,
  EDUCATION_LEVELS.EARLY,
  EDUCATION_LEVELS.ELEMENTARY,
  EDUCATION_LEVELS.SECONDARY,
  EDUCATION_LEVELS.VOCATIONAL,
  EDUCATION_LEVELS.COLLEGE,
  EDUCATION_LEVELS.UNIVERSITY,
  EDUCATION_LEVELS.POSTGRADUATE,
  EDUCATION_LEVELS.MASTER,
  EDUCATION_LEVELS.DOCTORATE
];

/* ============================================================
   STATUS
   ============================================================ */

const EDUCATION_STATUS = {
  NOT_STARTED: "not_started",
  ENROLLED: "enrolled",
  ACTIVE: "active",
  COMPLETED: "completed",
  DROPPED_OUT: "dropped_out",
  SUSPENDED: "suspended"
};

/* ============================================================
   ÁREAS
   ============================================================ */

const EDUCATION_FIELDS = {
  GENERAL: "general",
  SPORTS: "sports",
  MMA: "mma",
  BUSINESS: "business",
  LAW: "law",
  MEDICINE: "medicine",
  ENGINEERING: "engineering",
  TECHNOLOGY: "technology",
  FINANCE: "finance",
  MARKETING: "marketing",
  MEDIA: "media",
  PSYCHOLOGY: "psychology",
  NUTRITION: "nutrition",
  PHYSICAL_EDUCATION: "physical_education",
  MANAGEMENT: "management",
  COMMUNICATION: "communication",
  ARTS: "arts",
  SCIENCE: "science",
  LANGUAGES: "languages"
};

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function randomInt(min, max) {
  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}

function randomFloat(min, max) {
  return Math.random() *
    (max - min) +
    min;
}

function randomItem(array) {
  if (
    !Array.isArray(array) ||
    array.length === 0
  ) {
    return null;
  }

  return array[
    Math.floor(
      Math.random() * array.length
    )
  ];
}

function normalizeId(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  return String(value).trim();
}

function generateId(prefix = "education") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/* ============================================================
   LABELS
   ============================================================ */

function getEducationLevelLabel(level) {
  const labels = {
    none: "Sem escolaridade",
    early: "Educação infantil",
    elementary: "Ensino fundamental",
    secondary: "Ensino médio",
    vocational: "Curso técnico",
    college: "Faculdade",
    university: "Universidade",
    postgraduate: "Pós-graduação",
    master: "Mestrado",
    doctorate: "Doutorado"
  };

  return labels[level] || "Desconhecido";
}

function getEducationStatusLabel(status) {
  const labels = {
    not_started: "Não iniciado",
    enrolled: "Matriculado",
    active: "Em andamento",
    completed: "Concluído",
    dropped_out: "Abandonado",
    suspended: "Suspenso"
  };

  return labels[status] || "Desconhecido";
}

function getEducationFieldLabel(field) {
  const labels = {
    general: "Formação geral",
    sports: "Esportes",
    mma: "MMA",
    business: "Negócios",
    law: "Direito",
    medicine: "Medicina",
    engineering: "Engenharia",
    technology: "Tecnologia",
    finance: "Finanças",
    marketing: "Marketing",
    media: "Mídia",
    psychology: "Psicologia",
    nutrition: "Nutrição",
    physical_education: "Educação Física",
    management: "Gestão",
    communication: "Comunicação",
    arts: "Artes",
    science: "Ciências",
    languages: "Idiomas"
  };

  return labels[field] || "Outra área";
}

/* ============================================================
   REQUISITOS POR IDADE
   ============================================================ */

function getRecommendedEducationLevel(age) {
  const numericAge = Number(age);

  if (!Number.isFinite(numericAge)) {
    return EDUCATION_LEVELS.NONE;
  }

  if (numericAge < 3) {
    return EDUCATION_LEVELS.EARLY;
  }

  if (numericAge <= 11) {
    return EDUCATION_LEVELS.ELEMENTARY;
  }

  if (numericAge <= 17) {
    return EDUCATION_LEVELS.SECONDARY;
  }

  return EDUCATION_LEVELS.UNIVERSITY;
}

function canStartEducationLevel(
  level,
  age
) {
  const minimumAges = {
    none: 0,
    early: 2,
    elementary: 5,
    secondary: 12,
    vocational: 15,
    college: 17,
    university: 17,
    postgraduate: 21,
    master: 22,
    doctorate: 24
  };

  const minimumAge =
    minimumAges[level];

  if (
    minimumAge === undefined
  ) {
    return false;
  }

  return Number(age) >= minimumAge;
}

/* ============================================================
   CURSOS
   ============================================================ */

const DEFAULT_PROGRAMS = [
  {
    id: "basic_education",
    name: "Ensino Fundamental",
    level: EDUCATION_LEVELS.ELEMENTARY,
    field: EDUCATION_FIELDS.GENERAL,
    durationYears: 7,
    difficulty: 25,
    prestige: 20,
    cost: 0,
    intelligenceBonus: 8,
    disciplineBonus: 5
  },

  {
    id: "secondary_education",
    name: "Ensino Médio",
    level: EDUCATION_LEVELS.SECONDARY,
    field: EDUCATION_FIELDS.GENERAL,
    durationYears: 3,
    difficulty: 35,
    prestige: 30,
    cost: 0,
    intelligenceBonus: 12,
    disciplineBonus: 8
  },

  {
    id: "physical_education",
    name: "Educação Física",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.PHYSICAL_EDUCATION,
    durationYears: 4,
    difficulty: 45,
    prestige: 45,
    cost: 2500,
    intelligenceBonus: 15,
    disciplineBonus: 12
  },

  {
    id: "sports_science",
    name: "Ciência do Esporte",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.SPORTS,
    durationYears: 4,
    difficulty: 55,
    prestige: 55,
    cost: 3500,
    intelligenceBonus: 18,
    disciplineBonus: 14
  },

  {
    id: "mma_management",
    name: "Gestão Esportiva e MMA",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.MMA,
    durationYears: 4,
    difficulty: 50,
    prestige: 60,
    cost: 4000,
    intelligenceBonus: 18,
    disciplineBonus: 15
  },

  {
    id: "business",
    name: "Administração",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.BUSINESS,
    durationYears: 4,
    difficulty: 50,
    prestige: 60,
    cost: 4000,
    intelligenceBonus: 20,
    disciplineBonus: 15
  },

  {
    id: "finance",
    name: "Finanças",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.FINANCE,
    durationYears: 4,
    difficulty: 65,
    prestige: 70,
    cost: 5000,
    intelligenceBonus: 24,
    disciplineBonus: 16
  },

  {
    id: "technology",
    name: "Tecnologia da Informação",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.TECHNOLOGY,
    durationYears: 4,
    difficulty: 65,
    prestige: 65,
    cost: 4500,
    intelligenceBonus: 25,
    disciplineBonus: 14
  },

  {
    id: "medicine",
    name: "Medicina",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.MEDICINE,
    durationYears: 6,
    difficulty: 85,
    prestige: 90,
    cost: 9000,
    intelligenceBonus: 35,
    disciplineBonus: 25
  },

  {
    id: "law",
    name: "Direito",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.LAW,
    durationYears: 5,
    difficulty: 70,
    prestige: 75,
    cost: 5500,
    intelligenceBonus: 28,
    disciplineBonus: 20
  },

  {
    id: "marketing",
    name: "Marketing",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.MARKETING,
    durationYears: 4,
    difficulty: 45,
    prestige: 60,
    cost: 4000,
    intelligenceBonus: 18,
    disciplineBonus: 12
  },

  {
    id: "psychology",
    name: "Psicologia",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.PSYCHOLOGY,
    durationYears: 5,
    difficulty: 60,
    prestige: 70,
    cost: 5000,
    intelligenceBonus: 25,
    disciplineBonus: 18
  },

  {
    id: "nutrition",
    name: "Nutrição",
    level: EDUCATION_LEVELS.UNIVERSITY,
    field: EDUCATION_FIELDS.NUTRITION,
    durationYears: 4,
    difficulty: 55,
    prestige: 60,
    cost: 4500,
    intelligenceBonus: 20,
    disciplineBonus: 15
  }
];

/* ============================================================
   PROGRAMAS
   ============================================================ */

function createEducationProgram(
  data = {}
) {
  return {
    id:
      normalizeId(data.id) ||
      generateId("program"),

    name:
      data.name ||
      "Curso",

    level:
      data.level ||
      EDUCATION_LEVELS.UNIVERSITY,

    field:
      data.field ||
      EDUCATION_FIELDS.GENERAL,

    durationYears:
      Math.max(
        1,
        Number(
          data.durationYears ?? 4
        )
      ),

    difficulty:
      clamp(
        Number(
          data.difficulty ?? 50
        ),
        1,
        100
      ),

    prestige:
      clamp(
        Number(
          data.prestige ?? 50
        ),
        1,
        100
      ),

    cost:
      Math.max(
        0,
        Number(
          data.cost ?? 0
        )
      ),

    intelligenceBonus:
      Number(
        data.intelligenceBonus ?? 0
      ),

    disciplineBonus:
      Number(
        data.disciplineBonus ?? 0
      ),

    careerBonus:
      Number(
        data.careerBonus ?? 0
      ),

    active:
      data.active !== false
  };
}

function getEducationProgram(
  programId
) {
  const id =
    normalizeId(programId);

  const program =
    DEFAULT_PROGRAMS.find(
      item =>
        normalizeId(item.id) === id
    );

  return program
    ? clone(program)
    : null;
}

function getAllEducationPrograms() {
  return DEFAULT_PROGRAMS.map(
    clone
  );
}

function getEducationProgramsByField(
  field
) {
  return DEFAULT_PROGRAMS
    .filter(
      program =>
        program.field === field
    )
    .map(clone);
}

function getEducationProgramsByLevel(
  level
) {
  return DEFAULT_PROGRAMS
    .filter(
      program =>
        program.level === level
    )
    .map(clone);
}

/* ============================================================
   CRIAÇÃO DO PERFIL EDUCACIONAL
   ============================================================ */

function createEducationProfile(
  data = {}
) {
  const age =
    Number.isFinite(
      Number(data.age)
    )
      ? Number(data.age)
      : 18;

  return {
    id:
      normalizeId(data.id) ||
      generateId("education"),

    currentLevel:
      data.currentLevel ||
      getRecommendedEducationLevel(
        age
      ),

    highestLevel:
      data.highestLevel ||
      EDUCATION_LEVELS.NONE,

    status:
      data.status ||
      EDUCATION_STATUS.NOT_STARTED,

    currentProgram:
      data.currentProgram
        ? clone(data.currentProgram)
        : null,

    completedPrograms:
      Array.isArray(
        data.completedPrograms
      )
        ? clone(
            data.completedPrograms
          )
        : [],

    interests:
      Array.isArray(data.interests)
        ? [...data.interests]
        : [],

    skills:
      data.skills
        ? clone(data.skills)
        : {
            intelligence: 50,
            discipline: 50,
            focus: 50,
            learning: 50,
            criticalThinking: 50,
            communication: 50,
            knowledge: 0
          },

    academicPerformance:
      clamp(
        Number(
          data.academicPerformance ??
            randomInt(45, 75)
        ),
        1,
        100
      ),

    attendance:
      clamp(
        Number(
          data.attendance ??
            randomInt(75, 100)
        ),
        0,
        100
      ),

    motivation:
      clamp(
        Number(
          data.motivation ??
            randomInt(50, 85)
        ),
        0,
        100
      ),

    scholarships:
      Array.isArray(
        data.scholarships
      )
        ? clone(data.scholarships)
        : [],

    debt:
      Math.max(
        0,
        Number(data.debt) || 0
      ),

    expenses:
      Math.max(
        0,
        Number(data.expenses) || 0
      ),

    careerImpact:
      data.careerImpact
        ? clone(data.careerImpact)
        : {
            careerBonus: 0,
            incomeBonus: 0,
            marketabilityBonus: 0,
            managementBonus: 0
          },

    history:
      Array.isArray(data.history)
        ? clone(data.history)
        : [],

    createdAt:
      data.createdAt ||
      new Date().toISOString(),

    updatedAt:
      data.updatedAt ||
      new Date().toISOString()
  };
}

/* ============================================================
   ESTADO
   ============================================================ */

function ensureEducationState(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (!database.life.education) {
    database.life.education = {};
  }

  const education =
    database.life.education;

  if (!education.profiles) {
    education.profiles = {};
  }

  if (!Array.isArray(education.programs)) {
    education.programs = [];
  }

  if (!Array.isArray(education.history)) {
    education.history = [];
  }

  return education;
}

/* ============================================================
   PERFIS
   ============================================================ */

function addEducationProfile(
  database,
  entityId,
  data = {}
) {
  const education =
    ensureEducationState(
      database
    );

  if (!education) {
    return null;
  }

  const id =
    normalizeId(entityId);

  if (!id) {
    return null;
  }

  const profile =
    createEducationProfile(
      {
        ...data,
        id:
          data.id ||
          `education_${id}`
      }
    );

  education.profiles[id] =
    profile;

  return clone(profile);
}

function getEducationProfile(
  database,
  entityId
) {
  const education =
    ensureEducationState(
      database
    );

  if (!education) {
    return null;
  }

  const id =
    normalizeId(entityId);

  const profile =
    education.profiles[id];

  return profile
    ? clone(profile)
    : null;
}

function findEducationProfileReference(
  database,
  entityId
) {
  const education =
    ensureEducationState(
      database
    );

  if (!education) {
    return null;
  }

  const id =
    normalizeId(entityId);

  return (
    education.profiles[id] ||
    null
  );
}

function getAllEducationProfiles(
  database
) {
  const education =
    ensureEducationState(
      database
    );

  if (!education) {
    return [];
  }

  return Object.entries(
    education.profiles
  ).map(
    ([entityId, profile]) => ({
      entityId,
      ...clone(profile)
    })
  );
}

function updateEducationProfile(
  database,
  entityId,
  updates = {}
) {
  const profile =
    findEducationProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  Object.keys(updates).forEach(
    key => {
      if (
        updates[key] !== undefined
      ) {
        profile[key] =
          clone(updates[key]);
      }
    }
  );

  profile.updatedAt =
    new Date().toISOString();

  return clone(profile);
}

/* ============================================================
   MATRÍCULA
   ============================================================ */

function canEnroll(
  profile,
  program,
  age
) {
  if (!profile || !program) {
    return false;
  }

  if (
    !canStartEducationLevel(
      program.level,
      age
    )
  ) {
    return false;
  }

  if (
    profile.currentProgram
  ) {
    return false;
  }

  if (
    profile.status ===
    EDUCATION_STATUS.SUSPENDED
  ) {
    return false;
  }

  return true;
}

function enrollInProgram(
  database,
  entityId,
  programId,
  options = {}
) {
  const profile =
    findEducationProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  const program =
    getEducationProgram(
      programId
    );

  if (!program) {
    return null;
  }

  const age =
    Number(
      options.age ??
      profile.age ??
      18
    );

  if (
    !canEnroll(
      profile,
      program,
      age
    )
  ) {
    return null;
  }

  const enrollment = {
    id:
      generateId("enrollment"),

    programId:
      program.id,

    programName:
      program.name,

    level:
      program.level,

    field:
      program.field,

    status:
      EDUCATION_STATUS.ACTIVE,

    startYear:
      options.startYear ??
      null,

    startDate:
      options.startDate ??
      new Date().toISOString(),

    durationYears:
      program.durationYears,

    progress:
      0,

    performance:
      profile.academicPerformance,

    attendance:
      profile.attendance,

    costPerYear:
      program.cost,

    totalCost:
      program.cost *
      program.durationYears
  };

  profile.currentProgram =
    enrollment;

  profile.status =
    EDUCATION_STATUS.ACTIVE;

  profile.currentLevel =
    program.level;

  addEducationHistory(
    profile,
    "enrollment",
    `Iniciou ${program.name}.`,
    {
      programId:
        program.id
    }
  );

  return clone(
    enrollment
  );
}

/* ============================================================
   PROGRESSO
   ============================================================ */

function calculateAcademicPerformance(
  profile,
  program
) {
  if (!profile) {
    return 50;
  }

  const intelligence =
    Number(
      profile.skills?.intelligence
    ) || 50;

  const discipline =
    Number(
      profile.skills?.discipline
    ) || 50;

  const focus =
    Number(
      profile.skills?.focus
    ) || 50;

  const motivation =
    Number(
      profile.motivation
    ) || 50;

  const base =
    (
      intelligence +
      discipline +
      focus +
      motivation
    ) / 4;

  const difficulty =
    Number(
      program?.difficulty
    ) || 50;

  const difficultyEffect =
    (50 - difficulty) * 0.25;

  return clamp(
    Math.round(
      base +
      difficultyEffect +
      randomFloat(-5, 5)
    ),
    1,
    100
  );
}

function calculateStudyProgress(
  profile,
  program,
  years = 1
) {
  if (!profile || !program) {
    return 0;
  }

  const performance =
    calculateAcademicPerformance(
      profile,
      program
    );

  const motivation =
    Number(
      profile.motivation
    ) || 50;

  const attendance =
    Number(
      profile.attendance
    ) || 80;

  const baseProgress =
    20 *
    Math.max(
      0.25,
      performance / 70
    ) *
    Math.max(
      0.25,
      attendance / 80
    ) *
    Math.max(
      0.25,
      motivation / 70
    );

  return clamp(
    baseProgress * years,
    0,
    100
  );
}

/* ============================================================
   ESTUDAR
   ============================================================ */

function study(
  database,
  entityId,
  years = 1
) {
  const profile =
    findEducationProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    !profile.currentProgram
  ) {
    return null;
  }

  const program =
    getEducationProgram(
      profile.currentProgram.programId
    );

  if (!program) {
    return null;
  }

  const amount =
    Math.max(
      0,
      Number(years) || 0
    );

  const progress =
    calculateStudyProgress(
      profile,
      program,
      amount
    );

  profile.currentProgram.progress =
    clamp(
      Number(
        profile.currentProgram.progress
      ) + progress,
      0,
      100
    );

  profile.currentProgram.performance =
    calculateAcademicPerformance(
      profile,
      program
    );

  profile.academicPerformance =
    profile.currentProgram.performance;

  profile.currentProgram.attendance =
    clamp(
      profile.attendance +
      randomFloat(-2, 2),
      0,
      100
    );

  profile.attendance =
    profile.currentProgram.attendance;

  profile.expenses +=
    program.cost * amount;

  improveEducationSkills(
    profile,
    program,
    amount
  );

  if (
    profile.currentProgram.progress >=
    100
  ) {
    completeCurrentProgram(
      database,
      entityId
    );
  }

  return clone(profile);
}

/* ============================================================
   DESENVOLVIMENTO
   ============================================================ */

function improveEducationSkills(
  profile,
  program,
  years = 1
) {
  if (!profile) {
    return;
  }

  const growth =
    Math.max(
      0,
      Number(years) || 0
    );

  const intensity =
    Math.max(
      0.1,
      (program?.difficulty || 50) /
        50
    );

  const learningGain =
    1.5 *
    growth *
    intensity;

  profile.skills.intelligence =
    clamp(
      profile.skills.intelligence +
      learningGain,
      0,
      100
    );

  profile.skills.discipline =
    clamp(
      profile.skills.discipline +
      learningGain * 0.8,
      0,
      100
    );

  profile.skills.focus =
    clamp(
      profile.skills.focus +
      learningGain * 0.75,
      0,
      100
    );

  profile.skills.learning =
    clamp(
      profile.skills.learning +
      learningGain,
      0,
      100
    );

  profile.skills.criticalThinking =
    clamp(
      profile.skills.criticalThinking +
      learningGain * 0.9,
      0,
      100
    );

  profile.skills.communication =
    clamp(
      profile.skills.communication +
      learningGain * 0.65,
      0,
      100
    );

  profile.skills.knowledge =
    clamp(
      profile.skills.knowledge +
      learningGain * 2,
      0,
      1000
    );
}

/* ============================================================
   CONCLUSÃO
   ============================================================ */

function completeCurrentProgram(
  database,
  entityId
) {
  const profile =
    findEducationProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !profile.currentProgram
  ) {
    return null;
  }

  const program =
    getEducationProgram(
      profile.currentProgram.programId
    );

  if (!program) {
    return null;
  }

  const completed = {
    ...clone(
      profile.currentProgram
    ),

    status:
      EDUCATION_STATUS.COMPLETED,

    completedDate:
      new Date().toISOString(),

    finalPerformance:
      profile.academicPerformance
  };

  profile.completedPrograms.push(
    completed
  );

  profile.highestLevel =
    getHigherEducationLevel(
      profile.highestLevel,
      program.level
    );

  profile.status =
    EDUCATION_STATUS.COMPLETED;

  profile.currentProgram =
    null;

  profile.currentLevel =
    program.level;

  applyCareerImpact(
    profile,
    program
  );

  addEducationHistory(
    profile,
    "completion",
    `Concluiu ${program.name}.`,
    {
      programId:
        program.id,
      finalPerformance:
        completed.finalPerformance
    }
  );

  return clone(
    completed
  );
}

/* ============================================================
   COMPARAÇÃO DE NÍVEIS
   ============================================================ */

function getEducationLevelIndex(
  level
) {
  return EDUCATION_LEVEL_ORDER.indexOf(
    level
  );
}

function getHigherEducationLevel(
  levelA,
  levelB
) {
  const indexA =
    getEducationLevelIndex(
      levelA
    );

  const indexB =
    getEducationLevelIndex(
      levelB
    );

  return indexB > indexA
    ? levelB
    : levelA;
}

/* ============================================================
   IMPACTO PROFISSIONAL
   ============================================================ */

function applyCareerImpact(
  profile,
  program
) {
  if (
    !profile ||
    !program
  ) {
    return;
  }

  const prestige =
    Number(
      program.prestige
    ) || 50;

  const fieldBonus =
    calculateFieldCareerBonus(
      program.field
    );

  profile.careerImpact.careerBonus =
    clamp(
      profile.careerImpact.careerBonus +
      Math.round(
        prestige / 10
      ),
      0,
      100
    );

  profile.careerImpact.incomeBonus =
    clamp(
      profile.careerImpact.incomeBonus +
      Math.round(
        prestige / 20
      ),
      0,
      100
    );

  profile.careerImpact.marketabilityBonus =
    clamp(
      profile.careerImpact.marketabilityBonus +
      fieldBonus.marketability,
      0,
      100
    );

  profile.careerImpact.managementBonus =
    clamp(
      profile.careerImpact.managementBonus +
      fieldBonus.management,
      0,
      100
    );
}

function calculateFieldCareerBonus(
  field
) {
  const bonuses = {
    general: {
      marketability: 1,
      management: 1
    },

    sports: {
      marketability: 4,
      management: 3
    },

    mma: {
      marketability: 8,
      management: 8
    },

    business: {
      marketability: 4,
      management: 10
    },

    law: {
      marketability: 2,
      management: 8
    },

    medicine: {
      marketability: 5,
      management: 4
    },

    engineering: {
      marketability: 2,
      management: 5
    },

    technology: {
      marketability: 5,
      management: 6
    },

    finance: {
      marketability: 4,
      management: 10
    },

    marketing: {
      marketability: 10,
      management: 8
    },

    media: {
      marketability: 12,
      management: 5
    },

    psychology: {
      marketability: 5,
      management: 6
    },

    nutrition: {
      marketability: 5,
      management: 3
    },

    physical_education: {
      marketability: 7,
      management: 5
    },

    management: {
      marketability: 5,
      management: 12
    },

    communication: {
      marketability: 12,
      management: 6
    },

    arts: {
      marketability: 8,
      management: 3
    },

    science: {
      marketability: 4,
      management: 5
    },

    languages: {
      marketability: 8,
      management: 5
    }
  };

  return (
    bonuses[field] || {
      marketability: 1,
      management: 1
    }
  );
}

/* ============================================================
   BOLSAS
   ============================================================ */

function createScholarship(
  data = {}
) {
  return {
    id:
      normalizeId(data.id) ||
      generateId("scholarship"),

    name:
      data.name ||
      "Bolsa de estudos",

    percentage:
      clamp(
        Number(
          data.percentage ?? 50
        ),
        0,
        100
      ),

    durationYears:
      Math.max(
        1,
        Number(
          data.durationYears ?? 1
        )
      ),

    institution:
      data.institution ||
      null,

    reason:
      data.reason ||
      "Desempenho acadêmico",

    active:
      data.active !== false
  };
}

function addScholarship(
  database,
  entityId,
  data = {}
) {
  const profile =
    findEducationProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  const scholarship =
    createScholarship(data);

  profile.scholarships.push(
    scholarship
  );

  return clone(
    scholarship
  );
}

function calculateScholarshipValue(
  scholarship,
  annualCost
) {
  if (!scholarship) {
    return 0;
  }

  return Math.round(
    annualCost *
      (scholarship.percentage /
        100)
  );
}

/* ============================================================
   DESEMPENHO
   ============================================================ */

function calculateAcademicScore(
  profile
) {
  if (!profile) {
    return 0;
  }

  const values = [
    profile.academicPerformance,
    profile.attendance,
    profile.motivation,
    profile.skills?.intelligence,
    profile.skills?.discipline,
    profile.skills?.focus
  ]
    .map(Number)
    .filter(Number.isFinite);

  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  );
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function addEducationHistory(
  profile,
  type,
  description,
  data = {}
) {
  if (!profile) {
    return null;
  }

  if (
    !Array.isArray(
      profile.history
    )
  ) {
    profile.history = [];
  }

  const event = {
    id:
      generateId("education_history"),

    type,

    description,

    date:
      new Date().toISOString(),

    data:
      clone(data)
  };

  profile.history.push(
    event
  );

  return clone(event);
}

function getEducationHistory(
  database,
  entityId
) {
  const profile =
    getEducationProfile(
      database,
      entityId
    );

  if (!profile) {
    return [];
  }

  return (
    profile.history || []
  ).map(clone);
}

/* ============================================================
   EVOLUÇÃO POR IDADE
   ============================================================ */

function processEducationYear(
  database,
  entityId,
  age
) {
  const profile =
    findEducationProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  profile.age = Number(age);

  const recommended =
    getRecommendedEducationLevel(
      age
    );

  const currentIndex =
    getEducationLevelIndex(
      profile.highestLevel
    );

  const recommendedIndex =
    getEducationLevelIndex(
      recommended
    );

  if (
    recommendedIndex >
    currentIndex &&
    !profile.currentProgram
  ) {
    profile.currentLevel =
      recommended;
  }

  if (
    profile.currentProgram
  ) {
    study(
      database,
      entityId,
      1
    );
  }

  return clone(profile);
}

/* ============================================================
   INTERESSES
   ============================================================ */

function addEducationInterest(
  database,
  entityId,
  field
) {
  const profile =
    findEducationProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return false;
  }

  if (
    !Object.values(
      EDUCATION_FIELDS
    ).includes(field)
  ) {
    return false;
  }

  if (
    !profile.interests.includes(
      field
    )
  ) {
    profile.interests.push(
      field
    );
  }

  return true;
}

function getEducationInterests(
  database,
  entityId
) {
  const profile =
    getEducationProfile(
      database,
      entityId
    );

  return profile
    ? [...profile.interests]
    : [];
}

/* ============================================================
   CARREIRA
   ============================================================ */

function getEducationCareerBonus(
  database,
  entityId
) {
  const profile =
    getEducationProfile(
      database,
      entityId
    );

  if (!profile) {
    return {
      careerBonus: 0,
      incomeBonus: 0,
      marketabilityBonus: 0,
      managementBonus: 0
    };
  }

  return clone(
    profile.careerImpact
  );
}

/* ============================================================
   BUSCA DE PROGRAMAS
   ============================================================ */

function searchEducationPrograms(
  query
) {
  const term =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();

  if (!term) {
    return getAllEducationPrograms();
  }

  return DEFAULT_PROGRAMS
    .filter(program =>
      String(
        program.name
      )
        .toLowerCase()
        .includes(term) ||

      String(
        getEducationFieldLabel(
          program.field
        )
      )
        .toLowerCase()
        .includes(term) ||

      String(
        getEducationLevelLabel(
          program.level
        )
      )
        .toLowerCase()
        .includes(term)
    )
    .map(clone);
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

function calculateEducationStats(
  database,
  entityId
) {
  const profile =
    getEducationProfile(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  return {
    currentLevel:
      profile.currentLevel,

    currentLevelLabel:
      getEducationLevelLabel(
        profile.currentLevel
      ),

    highestLevel:
      profile.highestLevel,

    highestLevelLabel:
      getEducationLevelLabel(
        profile.highestLevel
      ),

    status:
      profile.status,

    statusLabel:
      getEducationStatusLabel(
        profile.status
      ),

    academicScore:
      calculateAcademicScore(
        profile
      ),

    knowledge:
      Number(
        profile.skills?.knowledge
      ) || 0,

    intelligence:
      Number(
        profile.skills?.intelligence
      ) || 0,

    discipline:
      Number(
        profile.skills?.discipline
      ) || 0,

    focus:
      Number(
        profile.skills?.focus
      ) || 0,

    completedPrograms:
      profile.completedPrograms
        .length,

    interests:
      profile.interests.length,

    scholarships:
      profile.scholarships.length,

    expenses:
      profile.expenses,

    debt:
      profile.debt,

    careerImpact:
      clone(
        profile.careerImpact
      )
  };
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getEducationSnapshot(
  database
) {
  const profiles =
    getAllEducationProfiles(
      database
    );

  return {
    version:
      EDUCATION_VERSION,

    profiles:
      profiles.map(profile => ({
        entityId:
          profile.entityId,

        currentLevel:
          profile.currentLevel,

        highestLevel:
          profile.highestLevel,

        status:
          profile.status,

        academicScore:
          calculateAcademicScore(
            profile
          ),

        completedPrograms:
          profile.completedPrograms
            ?.length || 0,

        knowledge:
          profile.skills?.knowledge ||
          0
      })),

    totalProfiles:
      profiles.length,

    programs:
      getAllEducationPrograms()
  };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateEducationProfile(
  profile
) {
  const errors = [];

  if (!profile) {
    return {
      valid: false,
      errors: [
        "Perfil educacional inexistente."
      ]
    };
  }

  if (!profile.id) {
    errors.push(
      "ID educacional ausente."
    );
  }

  if (
    !Object.values(
      EDUCATION_LEVELS
    ).includes(
      profile.currentLevel
    )
  ) {
    errors.push(
      "Nível educacional atual inválido."
    );
  }

  if (
    !Object.values(
      EDUCATION_STATUS
    ).includes(
      profile.status
    )
  ) {
    errors.push(
      "Status educacional inválido."
    );
  }

  if (
    !Number.isFinite(
      Number(
        profile.academicPerformance
      )
    )
  ) {
    errors.push(
      "Desempenho acadêmico inválido."
    );
  }

  if (
    !Number.isFinite(
      Number(
        profile.attendance
      )
    )
  ) {
    errors.push(
      "Frequência inválida."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}

function validateEducation(
  database
) {
  const profiles =
    getAllEducationProfiles(
      database
    );

  const results =
    profiles.map(profile => ({
      entityId:
        profile.entityId,

      ...validateEducationProfile(
        profile
      )
    }));

  return {
    valid:
      results.every(
        result =>
          result.valid
      ),

    total:
      results.length,

    results
  };
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initializeEducation(
  database,
  entityId = null,
  data = {}
) {
  const education =
    ensureEducationState(
      database
    );

  if (!education) {
    return null;
  }

  if (entityId) {
    const existing =
      getEducationProfile(
        database,
        entityId
      );

    if (!existing) {
      addEducationProfile(
        database,
        entityId,
        data
      );
    }
  }

  return education;
}

/* ============================================================
   RESET
   ============================================================ */

function resetEducation(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  database.life.education = {
    profiles: {},
    programs: [],
    history: []
  };

  return database.life.education;
}

/* ============================================================
   API
   ============================================================ */

const educationAPI = {
  EDUCATION_VERSION,

  EDUCATION_LEVELS,
  EDUCATION_LEVEL_ORDER,
  EDUCATION_STATUS,
  EDUCATION_FIELDS,

  DEFAULT_PROGRAMS,

  getEducationLevelLabel,
  getEducationStatusLabel,
  getEducationFieldLabel,

  getRecommendedEducationLevel,
  canStartEducationLevel,

  createEducationProgram,
  getEducationProgram,
  getAllEducationPrograms,
  getEducationProgramsByField,
  getEducationProgramsByLevel,

  createEducationProfile,

  ensureEducationState,

  addEducationProfile,
  getEducationProfile,
  findEducationProfileReference,
  getAllEducationProfiles,
  updateEducationProfile,

  canEnroll,
  enrollInProgram,

  calculateAcademicPerformance,
  calculateStudyProgress,

  study,
  improveEducationSkills,

  completeCurrentProgram,

  getEducationLevelIndex,
  getHigherEducationLevel,

  applyCareerImpact,
  calculateFieldCareerBonus,

  createScholarship,
  addScholarship,
  calculateScholarshipValue,

  calculateAcademicScore,

  addEducationHistory,
  getEducationHistory,

  processEducationYear,

  addEducationInterest,
  getEducationInterests,

  getEducationCareerBonus,

  searchEducationPrograms,

  calculateEducationStats,
  getEducationSnapshot,

  validateEducationProfile,
  validateEducation,

  initializeEducation,
  resetEducation
};

export default educationAPI;

export {
  EDUCATION_VERSION,

  EDUCATION_LEVELS,
  EDUCATION_LEVEL_ORDER,
  EDUCATION_STATUS,
  EDUCATION_FIELDS,

  DEFAULT_PROGRAMS,

  getEducationLevelLabel,
  getEducationStatusLabel,
  getEducationFieldLabel,

  getRecommendedEducationLevel,
  canStartEducationLevel,

  createEducationProgram,
  getEducationProgram,
  getAllEducationPrograms,
  getEducationProgramsByField,
  getEducationProgramsByLevel,

  createEducationProfile,

  ensureEducationState,

  addEducationProfile,
  getEducationProfile,
  findEducationProfileReference,
  getAllEducationProfiles,
  updateEducationProfile,

  canEnroll,
  enrollInProgram,

  calculateAcademicPerformance,
  calculateStudyProgress,

  study,
  improveEducationSkills,

  completeCurrentProgram,

  getEducationLevelIndex,
  getHigherEducationLevel,

  applyCareerImpact,
  calculateFieldCareerBonus,

  createScholarship,
  addScholarship,
  calculateScholarshipValue,

  calculateAcademicScore,

  addEducationHistory,
  getEducationHistory,

  processEducationYear,

  addEducationInterest,
  getEducationInterests,

  getEducationCareerBonus,

  searchEducationPrograms,

  calculateEducationStats,
  getEducationSnapshot,

  validateEducationProfile,
  validateEducation,

  initializeEducation,
  resetEducation,

  educationAPI
};
