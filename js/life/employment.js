/* ============================================================
   MMA LIFE DYNASTY
   LIFE — EMPLOYMENT
   Sistema de empregos, profissões e carreira profissional
   ============================================================ */

const EMPLOYMENT_VERSION = 1;

/* ============================================================
   STATUS DE EMPREGO
   ============================================================ */

const EMPLOYMENT_STATUS = {
  UNEMPLOYED: "unemployed",
  EMPLOYED: "employed",
  SELF_EMPLOYED: "self_employed",
  ENTREPRENEUR: "entrepreneur",
  CONTRACTOR: "contractor",
  RETIRED: "retired",
  SUSPENDED: "suspended"
};

/* ============================================================
   TIPOS DE EMPREGO
   ============================================================ */

const EMPLOYMENT_TYPES = {
  FULL_TIME: "full_time",
  PART_TIME: "part_time",
  TEMPORARY: "temporary",
  CONTRACT: "contract",
  FREELANCE: "freelance",
  SELF_EMPLOYED: "self_employed",
  BUSINESS_OWNER: "business_owner"
};

/* ============================================================
   ÁREAS PROFISSIONAIS
   ============================================================ */

const CAREER_FIELDS = {
  GENERAL: "general",
  MMA: "mma",
  SPORTS: "sports",
  FITNESS: "fitness",
  BUSINESS: "business",
  MANAGEMENT: "management",
  FINANCE: "finance",
  MARKETING: "marketing",
  MEDIA: "media",
  COMMUNICATION: "communication",
  TECHNOLOGY: "technology",
  MEDICINE: "medicine",
  NUTRITION: "nutrition",
  PSYCHOLOGY: "psychology",
  LAW: "law",
  EDUCATION: "education",
  SECURITY: "security",
  RETAIL: "retail",
  HOSPITALITY: "hospitality",
  TRANSPORT: "transport",
  CONSTRUCTION: "construction",
  SCIENCE: "science",
  ARTS: "arts"
};

/* ============================================================
   NÍVEIS DE CARREIRA
   ============================================================ */

const CAREER_LEVELS = {
  INTERN: 1,
  ENTRY: 2,
  JUNIOR: 3,
  MID: 4,
  SENIOR: 5,
  SPECIALIST: 6,
  MANAGER: 7,
  DIRECTOR: 8,
  EXECUTIVE: 9,
  OWNER: 10
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
  return (
    Math.random() *
      (max - min) +
    min
  );
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

function generateId(prefix = "job") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/* ============================================================
   LABELS
   ============================================================ */

function getEmploymentStatusLabel(
  status
) {
  const labels = {
    unemployed: "Desempregado",
    employed: "Empregado",
    self_employed: "Autônomo",
    entrepreneur: "Empreendedor",
    contractor: "Contratado",
    retired: "Aposentado",
    suspended: "Suspenso"
  };

  return (
    labels[status] ||
    "Desconhecido"
  );
}

function getEmploymentTypeLabel(
  type
) {
  const labels = {
    full_time: "Tempo integral",
    part_time: "Meio período",
    temporary: "Temporário",
    contract: "Contrato",
    freelance: "Freelancer",
    self_employed: "Autônomo",
    business_owner: "Dono de negócio"
  };

  return (
    labels[type] ||
    "Outro"
  );
}

function getCareerFieldLabel(
  field
) {
  const labels = {
    general: "Geral",
    mma: "MMA",
    sports: "Esportes",
    fitness: "Fitness",
    business: "Negócios",
    management: "Gestão",
    finance: "Finanças",
    marketing: "Marketing",
    media: "Mídia",
    communication: "Comunicação",
    technology: "Tecnologia",
    medicine: "Medicina",
    nutrition: "Nutrição",
    psychology: "Psicologia",
    law: "Direito",
    education: "Educação",
    security: "Segurança",
    retail: "Comércio",
    hospitality: "Hotelaria",
    transport: "Transporte",
    construction: "Construção",
    science: "Ciência",
    arts: "Artes"
  };

  return (
    labels[field] ||
    "Outra área"
  );
}

function getCareerLevelLabel(
  level
) {
  const labels = {
    1: "Estágio",
    2: "Entrada",
    3: "Júnior",
    4: "Pleno",
    5: "Sênior",
    6: "Especialista",
    7: "Gerente",
    8: "Diretor",
    9: "Executivo",
    10: "Proprietário"
  };

  return (
    labels[level] ||
    "Nível desconhecido"
  );
}

/* ============================================================
   PROFISSÕES
   ============================================================ */

const DEFAULT_PROFESSIONS = [
  {
    id: "retail_worker",
    name: "Vendedor",
    field: CAREER_FIELDS.RETAIL,
    minimumAge: 16,
    educationLevel: "none",
    startingSalary: 1400,
    maximumSalary: 5000,
    careerDifficulty: 25,
    prestige: 20,
    stress: 40,
    stability: 70,
    progression: 45,
    physicalDemand: 25,
    flexibility: 45
  },

  {
    id: "office_assistant",
    name: "Assistente Administrativo",
    field: CAREER_FIELDS.BUSINESS,
    minimumAge: 16,
    educationLevel: "secondary",
    startingSalary: 1800,
    maximumSalary: 7000,
    careerDifficulty: 35,
    prestige: 30,
    stress: 35,
    stability: 75,
    progression: 55,
    physicalDemand: 15,
    flexibility: 40
  },

  {
    id: "security_guard",
    name: "Segurança",
    field: CAREER_FIELDS.SECURITY,
    minimumAge: 18,
    educationLevel: "secondary",
    startingSalary: 2200,
    maximumSalary: 7500,
    careerDifficulty: 40,
    prestige: 35,
    stress: 60,
    stability: 70,
    progression: 45,
    physicalDemand: 65,
    flexibility: 35
  },

  {
    id: "personal_trainer",
    name: "Personal Trainer",
    field: CAREER_FIELDS.FITNESS,
    minimumAge: 18,
    educationLevel: "vocational",
    startingSalary: 2500,
    maximumSalary: 12000,
    careerDifficulty: 45,
    prestige: 50,
    stress: 45,
    stability: 45,
    progression: 65,
    physicalDemand: 60,
    flexibility: 75
  },

  {
    id: "coach",
    name: "Treinador de MMA",
    field: CAREER_FIELDS.MMA,
    minimumAge: 18,
    educationLevel: "vocational",
    startingSalary: 3000,
    maximumSalary: 25000,
    careerDifficulty: 60,
    prestige: 65,
    stress: 55,
    stability: 50,
    progression: 75,
    physicalDemand: 55,
    flexibility: 65
  },

  {
    id: "fighter_manager",
    name: "Manager de Lutadores",
    field: CAREER_FIELDS.MMA,
    minimumAge: 18,
    educationLevel: "secondary",
    startingSalary: 3000,
    maximumSalary: 50000,
    careerDifficulty: 70,
    prestige: 70,
    stress: 60,
    stability: 45,
    progression: 85,
    physicalDemand: 15,
    flexibility: 80
  },

  {
    id: "sports_manager",
    name: "Gestor Esportivo",
    field: CAREER_FIELDS.MANAGEMENT,
    minimumAge: 18,
    educationLevel: "university",
    startingSalary: 4500,
    maximumSalary: 30000,
    careerDifficulty: 65,
    prestige: 65,
    stress: 55,
    stability: 65,
    progression: 80,
    physicalDemand: 10,
    flexibility: 50
  },

  {
    id: "sports_journalist",
    name: "Jornalista Esportivo",
    field: CAREER_FIELDS.MEDIA,
    minimumAge: 18,
    educationLevel: "university",
    startingSalary: 3000,
    maximumSalary: 20000,
    careerDifficulty: 60,
    prestige: 55,
    stress: 55,
    stability: 50,
    progression: 65,
    physicalDemand: 10,
    flexibility: 55
  },

  {
    id: "marketing_specialist",
    name: "Especialista em Marketing",
    field: CAREER_FIELDS.MARKETING,
    minimumAge: 18,
    educationLevel: "university",
    startingSalary: 4000,
    maximumSalary: 30000,
    careerDifficulty: 60,
    prestige: 65,
    stress: 50,
    stability: 65,
    progression: 80,
    physicalDemand: 10,
    flexibility: 60
  },

  {
    id: "software_developer",
    name: "Desenvolvedor de Software",
    field: CAREER_FIELDS.TECHNOLOGY,
    minimumAge: 18,
    educationLevel: "university",
    startingSalary: 5000,
    maximumSalary: 35000,
    careerDifficulty: 65,
    prestige: 70,
    stress: 45,
    stability: 75,
    progression: 85,
    physicalDemand: 10,
    flexibility: 80
  },

  {
    id: "accountant",
    name: "Contador",
    field: CAREER_FIELDS.FINANCE,
    minimumAge: 18,
    educationLevel: "university",
    startingSalary: 4500,
    maximumSalary: 25000,
    careerDifficulty: 65,
    prestige: 65,
    stress: 45,
    stability: 80,
    progression: 70,
    physicalDemand: 10,
    flexibility: 45
  },

  {
    id: "lawyer",
    name: "Advogado",
    field: CAREER_FIELDS.LAW,
    minimumAge: 22,
    educationLevel: "university",
    startingSalary: 5000,
    maximumSalary: 50000,
    careerDifficulty: 75,
    prestige: 80,
    stress: 60,
    stability: 60,
    progression: 80,
    physicalDemand: 10,
    flexibility: 45
  },

  {
    id: "nutritionist",
    name: "Nutricionista",
    field: CAREER_FIELDS.NUTRITION,
    minimumAge: 22,
    educationLevel: "university",
    startingSalary: 4000,
    maximumSalary: 25000,
    careerDifficulty: 60,
    prestige: 65,
    stress: 35,
    stability: 65,
    progression: 70,
    physicalDemand: 15,
    flexibility: 70
  },

  {
    id: "psychologist",
    name: "Psicólogo",
    field: CAREER_FIELDS.PSYCHOLOGY,
    minimumAge: 22,
    educationLevel: "university",
    startingSalary: 4000,
    maximumSalary: 30000,
    careerDifficulty: 60,
    prestige: 70,
    stress: 45,
    stability: 65,
    progression: 70,
    physicalDemand: 10,
    flexibility: 75
  },

  {
    id: "doctor",
    name: "Médico",
    field: CAREER_FIELDS.MEDICINE,
    minimumAge: 24,
    educationLevel: "university",
    startingSalary: 10000,
    maximumSalary: 80000,
    careerDifficulty: 90,
    prestige: 95,
    stress: 70,
    stability: 90,
    progression: 85,
    physicalDemand: 25,
    flexibility: 35
  },

  {
    id: "teacher",
    name: "Professor",
    field: CAREER_FIELDS.EDUCATION,
    minimumAge: 18,
    educationLevel: "university",
    startingSalary: 3000,
    maximumSalary: 18000,
    careerDifficulty: 50,
    prestige: 60,
    stress: 50,
    stability: 75,
    progression: 60,
    physicalDemand: 20,
    flexibility: 45
  },

  {
    id: "promoter",
    name: "Promotor de MMA",
    field: CAREER_FIELDS.MMA,
    minimumAge: 18,
    educationLevel: "secondary",
    startingSalary: 5000,
    maximumSalary: 100000,
    careerDifficulty: 80,
    prestige: 80,
    stress: 75,
    stability: 35,
    progression: 95,
    physicalDemand: 10,
    flexibility: 70
  },

  {
    id: "gym_owner",
    name: "Dono de Academia",
    field: CAREER_FIELDS.FITNESS,
    minimumAge: 18,
    educationLevel: "secondary",
    startingSalary: 5000,
    maximumSalary: 150000,
    careerDifficulty: 70,
    prestige: 70,
    stress: 65,
    stability: 50,
    progression: 90,
    physicalDemand: 35,
    flexibility: 70
  }
];

/* ============================================================
   PROFISSÕES
   ============================================================ */

function createProfession(
  data = {}
) {
  return {
    id:
      normalizeId(data.id) ||
      generateId("profession"),

    name:
      data.name ||
      "Profissão",

    field:
      data.field ||
      CAREER_FIELDS.GENERAL,

    minimumAge:
      Math.max(
        0,
        Number(
          data.minimumAge ?? 18
        )
      ),

    educationLevel:
      data.educationLevel ||
      "none",

    startingSalary:
      Math.max(
        0,
        Number(
          data.startingSalary ?? 0
        )
      ),

    maximumSalary:
      Math.max(
        0,
        Number(
          data.maximumSalary ?? 0
        )
      ),

    careerDifficulty:
      clamp(
        Number(
          data.careerDifficulty ?? 50
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

    stress:
      clamp(
        Number(
          data.stress ?? 50
        ),
        0,
        100
      ),

    stability:
      clamp(
        Number(
          data.stability ?? 50
        ),
        0,
        100
      ),

    progression:
      clamp(
        Number(
          data.progression ?? 50
        ),
        0,
        100
      ),

    physicalDemand:
      clamp(
        Number(
          data.physicalDemand ?? 20
        ),
        0,
        100
      ),

    flexibility:
      clamp(
        Number(
          data.flexibility ?? 50
        ),
        0,
        100
      ),

    active:
      data.active !== false
  };
}

function getProfession(
  professionId
) {
  const id =
    normalizeId(
      professionId
    );

  const profession =
    DEFAULT_PROFESSIONS.find(
      item =>
        normalizeId(item.id) === id
    );

  return profession
    ? clone(profession)
    : null;
}

function getAllProfessions() {
  return DEFAULT_PROFESSIONS.map(
    clone
  );
}

function getProfessionsByField(
  field
) {
  return DEFAULT_PROFESSIONS
    .filter(
      profession =>
        profession.field === field
    )
    .map(clone);
}

function searchProfessions(
  query
) {
  const term =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();

  if (!term) {
    return getAllProfessions();
  }

  return DEFAULT_PROFESSIONS
    .filter(
      profession =>
        profession.name
          .toLowerCase()
          .includes(term) ||
        profession.field
          .toLowerCase()
          .includes(term)
    )
    .map(clone);
}

/* ============================================================
   PERFIL PROFISSIONAL
   ============================================================ */

function createEmploymentProfile(
  data = {}
) {
  return {
    id:
      normalizeId(data.id) ||
      generateId("employment"),

    status:
      data.status ||
      EMPLOYMENT_STATUS.UNEMPLOYED,

    currentJob:
      data.currentJob
        ? clone(data.currentJob)
        : null,

    careerHistory:
      Array.isArray(
        data.careerHistory
      )
        ? clone(
            data.careerHistory
          )
        : [],

    skills:
      data.skills
        ? clone(data.skills)
        : {
            experience: 0,
            professionalism: 50,
            leadership: 50,
            communication: 50,
            productivity: 50,
            networking: 30,
            expertise: 0
          },

    satisfaction:
      clamp(
        Number(
          data.satisfaction ?? 60
        ),
        0,
        100
      ),

    motivation:
      clamp(
        Number(
          data.motivation ?? 60
        ),
        0,
        100
      ),

    performance:
      clamp(
        Number(
          data.performance ?? 60
        ),
        0,
        100
      ),

    reputation:
      clamp(
        Number(
          data.reputation ?? 0
        ),
        0,
        100
      ),

    totalIncome:
      Math.max(
        0,
        Number(
          data.totalIncome ?? 0
        )
      ),

    totalYearsWorked:
      Math.max(
        0,
        Number(
          data.totalYearsWorked ?? 0
        )
      ),

    unemploymentHistory:
      Array.isArray(
        data.unemploymentHistory
      )
        ? clone(
            data.unemploymentHistory
          )
        : [],

    goals:
      Array.isArray(data.goals)
        ? [...data.goals]
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

function ensureEmploymentState(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (!database.life.employment) {
    database.life.employment = {};
  }

  const employment =
    database.life.employment;

  if (!employment.profiles) {
    employment.profiles = {};
  }

  if (
    !Array.isArray(
      employment.jobs
    )
  ) {
    employment.jobs = [];
  }

  if (
    !Array.isArray(
      employment.history
    )
  ) {
    employment.history = [];
  }

  return employment;
}

/* ============================================================
   PERFIS — CRUD
   ============================================================ */

function addEmploymentProfile(
  database,
  entityId,
  data = {}
) {
  const employment =
    ensureEmploymentState(
      database
    );

  if (!employment) {
    return null;
  }

  const id =
    normalizeId(entityId);

  if (!id) {
    return null;
  }

  const profile =
    createEmploymentProfile(
      {
        ...data,
        id:
          data.id ||
          `employment_${id}`
      }
    );

  employment.profiles[id] =
    profile;

  return clone(profile);
}

function getEmploymentProfile(
  database,
  entityId
) {
  const employment =
    ensureEmploymentState(
      database
    );

  if (!employment) {
    return null;
  }

  const id =
    normalizeId(entityId);

  const profile =
    employment.profiles[id];

  return profile
    ? clone(profile)
    : null;
}

function findEmploymentProfileReference(
  database,
  entityId
) {
  const employment =
    ensureEmploymentState(
      database
    );

  if (!employment) {
    return null;
  }

  return (
    employment.profiles[
      normalizeId(entityId)
    ] || null
  );
}

function getAllEmploymentProfiles(
  database
) {
  const employment =
    ensureEmploymentState(
      database
    );

  if (!employment) {
    return [];
  }

  return Object.entries(
    employment.profiles
  ).map(
    ([entityId, profile]) => ({
      entityId,
      ...clone(profile)
    })
  );
}

function updateEmploymentProfile(
  database,
  entityId,
  updates = {}
) {
  const profile =
    findEmploymentProfileReference(
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
   REQUISITOS
   ============================================================ */

function hasRequiredEducation(
  educationLevel,
  requiredLevel
) {
  const order = {
    none: 0,
    early: 1,
    elementary: 2,
    secondary: 3,
    vocational: 4,
    college: 5,
    university: 6,
    postgraduate: 7,
    master: 8,
    doctorate: 9
  };

  return (
    (order[educationLevel] ?? 0) >=
    (order[requiredLevel] ?? 0)
  );
}

function canWorkProfession(
  profession,
  age,
  educationLevel = "none"
) {
  if (!profession) {
    return false;
  }

  if (
    Number(age) <
    profession.minimumAge
  ) {
    return false;
  }

  if (
    !hasRequiredEducation(
      educationLevel,
      profession.educationLevel
    )
  ) {
    return false;
  }

  return true;
}

/* ============================================================
   OFERTA DE EMPREGO
   ============================================================ */

function calculateStartingSalary(
  profession,
  profile = null
) {
  if (!profession) {
    return 0;
  }

  let salary =
    profession.startingSalary;

  if (profile) {
    const reputation =
      Number(
        profile.reputation
      ) || 0;

    const expertise =
      Number(
        profile.skills?.expertise
      ) || 0;

    salary *=
      1 +
      reputation / 500 +
      expertise / 1000;
  }

  const variation =
    randomFloat(
      0.9,
      1.15
    );

  return Math.round(
    salary * variation
  );
}

function generateJobOffer(
  professionId,
  options = {}
) {
  const profession =
    getProfession(
      professionId
    );

  if (!profession) {
    return null;
  }

  const salary =
    options.salary ??
    calculateStartingSalary(
      profession,
      options.profile
    );

  return {
    id:
      generateId("job_offer"),

    professionId:
      profession.id,

    professionName:
      profession.name,

    field:
      profession.field,

    type:
      options.type ||
      EMPLOYMENT_TYPES.FULL_TIME,

    company:
      options.company ||
      generateCompanyName(
        profession
      ),

    salary:
      Math.max(
        0,
        Number(salary)
      ),

    salaryPeriod:
      "monthly",

    careerLevel:
      options.careerLevel ||
      CAREER_LEVELS.ENTRY,

    workingHours:
      options.workingHours ||
      40,

    contractMonths:
      options.contractMonths ??
      12,

    benefits:
      Array.isArray(
        options.benefits
      )
        ? [...options.benefits]
        : [],

    remote:
      options.remote === true,

    generatedAt:
      new Date().toISOString()
  };
}

function generateCompanyName(
  profession
) {
  const prefixes = [
    "Prime",
    "Global",
    "Elite",
    "Nova",
    "Atlas",
    "United",
    "Vision",
    "Future",
    "Pro",
    "Impact"
  ];

  const suffixes = [
    "Group",
    "Solutions",
    "Sports",
    "Academy",
    "Management",
    "Services",
    "Corporation",
    "Performance"
  ];

  if (
    profession?.field ===
    CAREER_FIELDS.MMA
  ) {
    return `${randomItem([
      "Combat",
      "MMA",
      "Fight",
      "Warrior",
      "Elite Combat"
    ])} ${randomItem([
      "Management",
      "Group",
      "Sports",
      "Academy",
      "Promotion"
    ])}`;
  }

  return `${randomItem(
    prefixes
  )} ${randomItem(suffixes)}`;
}

/* ============================================================
   CONTRATAÇÃO
   ============================================================ */

function acceptJobOffer(
  database,
  entityId,
  offer,
  options = {}
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (!profile || !offer) {
    return null;
  }

  if (
    profile.status ===
    EMPLOYMENT_STATUS.RETIRED
  ) {
    return null;
  }

  if (
    profile.currentJob &&
    !options.allowReplacement
  ) {
    return null;
  }

  if (profile.currentJob) {
    resignFromJob(
      database,
      entityId,
      "new_job"
    );
  }

  const job = {
    id:
      generateId("job"),

    professionId:
      offer.professionId,

    professionName:
      offer.professionName,

    field:
      offer.field,

    type:
      offer.type,

    company:
      offer.company,

    salary:
      offer.salary,

    salaryPeriod:
      offer.salaryPeriod ||
      "monthly",

    careerLevel:
      offer.careerLevel ||
      CAREER_LEVELS.ENTRY,

    workingHours:
      offer.workingHours ||
      40,

    contractMonths:
      offer.contractMonths ??
      12,

    monthsWorked:
      0,

    performance:
      profile.performance,

    satisfaction:
      profile.satisfaction,

    remote:
      offer.remote === true,

    benefits:
      Array.isArray(
        offer.benefits
      )
        ? [...offer.benefits]
        : [],

    startDate:
      new Date().toISOString(),

    active: true
  };

  profile.currentJob =
    job;

  profile.status =
    offer.type ===
      EMPLOYMENT_TYPES.SELF_EMPLOYED
      ? EMPLOYMENT_STATUS.SELF_EMPLOYED
      : EMPLOYMENT_STATUS.EMPLOYED;

  addEmploymentHistory(
    profile,
    "hired",
    `Começou a trabalhar como ${job.professionName}.`,
    {
      jobId:
        job.id,
      company:
        job.company,
      salary:
        job.salary
    }
  );

  return clone(job);
}

/* ============================================================
   DEMISSÃO / PEDIDO DE DEMISSÃO
   ============================================================ */

function resignFromJob(
  database,
  entityId,
  reason = "resignation"
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !profile.currentJob
  ) {
    return null;
  }

  const previousJob =
    clone(
      profile.currentJob
    );

  previousJob.active =
    false;

  previousJob.endDate =
    new Date().toISOString();

  previousJob.endReason =
    reason;

  profile.careerHistory.push(
    previousJob
  );

  profile.currentJob =
    null;

  profile.status =
    EMPLOYMENT_STATUS.UNEMPLOYED;

  addEmploymentHistory(
    profile,
    "left_job",
    `Saiu do emprego de ${previousJob.professionName}.`,
    {
      reason,
      jobId:
        previousJob.id
    }
  );

  return clone(
    previousJob
  );
}

function fireFromJob(
  database,
  entityId,
  reason = "performance"
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !profile.currentJob
  ) {
    return null;
  }

  const previousJob =
    clone(
      profile.currentJob
    );

  previousJob.active =
    false;

  previousJob.endDate =
    new Date().toISOString();

  previousJob.endReason =
    "fired";

  previousJob.fireReason =
    reason;

  profile.careerHistory.push(
    previousJob
  );

  profile.currentJob =
    null;

  profile.status =
    EMPLOYMENT_STATUS.UNEMPLOYED;

  profile.satisfaction =
    clamp(
      profile.satisfaction - 15,
      0,
      100
    );

  profile.motivation =
    clamp(
      profile.motivation - 10,
      0,
      100
    );

  addEmploymentHistory(
    profile,
    "fired",
    `Foi demitido de ${previousJob.professionName}.`,
    {
      reason,
      jobId:
        previousJob.id
    }
  );

  return clone(
    previousJob
  );
}

/* ============================================================
   SALÁRIO
   ============================================================ */

function getMonthlySalary(
  database,
  entityId
) {
  const profile =
    getEmploymentProfile(
      database,
      entityId
    );

  if (
    !profile ||
    !profile.currentJob
  ) {
    return 0;
  }

  return Math.max(
    0,
    Number(
      profile.currentJob.salary
    ) || 0
  );
}

function calculateAnnualSalary(
  database,
  entityId
) {
  return (
    getMonthlySalary(
      database,
      entityId
    ) * 12
  );
}

/* ============================================================
   DESEMPENHO PROFISSIONAL
   ============================================================ */

function calculateJobPerformance(
  profile,
  profession
) {
  if (
    !profile ||
    !profession
  ) {
    return 50;
  }

  const professionalism =
    Number(
      profile.skills?.professionalism
    ) || 50;

  const expertise =
    Number(
      profile.skills?.expertise
    ) || 0;

  const experience =
    Number(
      profile.skills?.experience
    ) || 0;

  const motivation =
    Number(
      profile.motivation
    ) || 50;

  const base =
    professionalism * 0.3 +
    motivation * 0.25 +
    Math.min(
      100,
      experience
    ) * 0.2 +
    Math.min(
      100,
      expertise
    ) * 0.25;

  const difficultyPenalty =
    profession.careerDifficulty *
    0.1;

  return clamp(
    Math.round(
      base -
        difficultyPenalty +
        randomFloat(-4, 4)
    ),
    0,
    100
  );
}

/* ============================================================
   PROCESSAMENTO MENSAL
   ============================================================ */

function processEmploymentMonth(
  database,
  entityId
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    !profile.currentJob
  ) {
    processUnemploymentMonth(
      profile
    );

    return clone(profile);
  }

  const profession =
    getProfession(
      profile.currentJob
        .professionId
    );

  if (!profession) {
    return clone(profile);
  }

  const performance =
    calculateJobPerformance(
      profile,
      profession
    );

  profile.performance =
    performance;

  profile.currentJob.performance =
    performance;

  profile.currentJob.monthsWorked +=
    1;

  profile.totalYearsWorked +=
    1 / 12;

  profile.totalIncome +=
    Number(
      profile.currentJob.salary
    ) || 0;

  improveProfessionalSkills(
    profile,
    profession,
    performance
  );

  updateJobSatisfaction(
    profile,
    profession,
    performance
  );

  checkForPromotion(
    profile,
    profession
  );

  checkForDismissal(
    database,
    entityId,
    profession
  );

  checkContractExpiration(
    database,
    entityId
  );

  return clone(profile);
}

/* ============================================================
   DESEMPREGO
   ============================================================ */

function processUnemploymentMonth(
  profile
) {
  if (!profile) {
    return;
  }

  profile.unemploymentHistory.push(
    {
      date:
        new Date().toISOString(),

      durationMonths: 1
    }
  );

  profile.motivation =
    clamp(
      profile.motivation - 2,
      0,
      100
    );

  profile.satisfaction =
    clamp(
      profile.satisfaction - 1,
      0,
      100
    );

  profile.reputation =
    clamp(
      profile.reputation - 0.25,
      0,
      100
    );
}

/* ============================================================
   HABILIDADES
   ============================================================ */

function improveProfessionalSkills(
  profile,
  profession,
  performance
) {
  if (!profile) {
    return;
  }

  const multiplier =
    Math.max(
      0.25,
      performance / 100
    );

  profile.skills.experience =
    clamp(
      profile.skills.experience +
        1.5 * multiplier,
      0,
      1000
    );

  profile.skills.professionalism =
    clamp(
      profile.skills.professionalism +
        0.4 * multiplier,
      0,
      100
    );

  profile.skills.expertise =
    clamp(
      profile.skills.expertise +
        1.0 * multiplier,
      0,
      1000
    );

  profile.skills.communication =
    clamp(
      profile.skills.communication +
        0.25 * multiplier,
      0,
      100
    );

  profile.skills.productivity =
    clamp(
      profile.skills.productivity +
        0.35 * multiplier,
      0,
      100
    );

  if (
    profession.field ===
    CAREER_FIELDS.MANAGEMENT
  ) {
    profile.skills.leadership =
      clamp(
        profile.skills.leadership +
          0.5 * multiplier,
        0,
        100
      );
  }

  if (
    profession.field ===
      CAREER_FIELDS.MMA ||
    profession.field ===
      CAREER_FIELDS.MEDIA
  ) {
    profile.skills.networking =
      clamp(
        profile.skills.networking +
          0.5 * multiplier,
        0,
        100
      );
  }
}

/* ============================================================
   SATISFAÇÃO
   ============================================================ */

function updateJobSatisfaction(
  profile,
  profession,
  performance
) {
  if (!profile) {
    return;
  }

  const salary =
    profile.currentJob?.salary ||
    0;

  const salaryFactor =
    salary /
    Math.max(
      profession.maximumSalary,
      profession.startingSalary,
      1
    );

  let change = 0;

  change +=
    (performance - 50) *
    0.08;

  change +=
    salaryFactor *
    4;

  change -=
    profession.stress *
    0.025;

  profile.satisfaction =
    clamp(
      profile.satisfaction +
        change +
        randomFloat(-1.5, 1.5),
      0,
      100
    );
}

/* ============================================================
   PROMOÇÃO
   ============================================================ */

function checkForPromotion(
  profile,
  profession
) {
  if (
    !profile ||
    !profile.currentJob
  ) {
    return false;
  }

  const currentLevel =
    Number(
      profile.currentJob
        .careerLevel
    ) || CAREER_LEVELS.ENTRY;

  if (
    currentLevel >=
    CAREER_LEVELS.EXECUTIVE
  ) {
    return false;
  }

  const experience =
    Number(
      profile.skills.experience
    ) || 0;

  const performance =
    Number(
      profile.performance
    ) || 0;

  const chance =
    profession.progression *
      0.004 +
    performance *
      0.002 +
    Math.min(
      experience / 1000,
      1
    ) *
      0.05;

  if (
    Math.random() >
    chance
  ) {
    return false;
  }

  const newLevel =
    currentLevel + 1;

  profile.currentJob
    .careerLevel =
    newLevel;

  const oldSalary =
    Number(
      profile.currentJob.salary
    ) || 0;

  const salaryIncrease =
    randomFloat(
      1.08,
      1.25
    );

  profile.currentJob.salary =
    Math.min(
      profession.maximumSalary,
      Math.round(
        oldSalary *
          salaryIncrease
      )
    );

  profile.reputation =
    clamp(
      profile.reputation + 3,
      0,
      100
    );

  profile.satisfaction =
    clamp(
      profile.satisfaction + 8,
      0,
      100
    );

  addEmploymentHistory(
    profile,
    "promotion",
    `Foi promovido para ${getCareerLevelLabel(newLevel)}.`,
    {
      newLevel,
      salary:
        profile.currentJob.salary
    }
  );

  return true;
}

/* ============================================================
   DEMISSÃO AUTOMÁTICA
   ============================================================ */

function checkForDismissal(
  database,
  entityId,
  profession
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !profile.currentJob
  ) {
    return false;
  }

  const performance =
    Number(
      profile.performance
    ) || 50;

  if (
    performance >= 25
  ) {
    return false;
  }

  const risk =
    (25 - performance) *
    0.015 +
    (100 -
      profession.stability) *
      0.002;

  if (
    Math.random() <
    risk
  ) {
    fireFromJob(
      database,
      entityId,
      "baixo desempenho"
    );

    return true;
  }

  return false;
}

/* ============================================================
   CONTRATO
   ============================================================ */

function checkContractExpiration(
  database,
  entityId
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !profile.currentJob
  ) {
    return false;
  }

  const job =
    profile.currentJob;

  if (
    job.contractMonths ===
    null ||
    job.contractMonths ===
    undefined
  ) {
    return false;
  }

  if (
    job.monthsWorked <
    job.contractMonths
  ) {
    return false;
  }

  const renewalChance =
    clamp(
      0.25 +
        profile.performance /
          200 +
        profile.satisfaction /
          400,
      0,
      0.95
    );

  if (
    Math.random() <
    renewalChance
  ) {
    job.contractMonths +=
      12;

    job.salary =
      Math.round(
        job.salary *
          randomFloat(
            1.03,
            1.12
          )
      );

    addEmploymentHistory(
      profile,
      "contract_renewed",
      `Contrato renovado em ${job.company}.`,
      {
        salary:
          job.salary
      }
    );

    return true;
  }

  resignFromJob(
    database,
    entityId,
    "contract_expired"
  );

  return false;
}

/* ============================================================
   CARREIRA AUTÔNOMA
   ============================================================ */

function startSelfEmployment(
  database,
  entityId,
  professionId,
  options = {}
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  const profession =
    getProfession(
      professionId
    );

  if (
    !profile ||
    !profession
  ) {
    return null;
  }

  if (
    profile.currentJob
  ) {
    return null;
  }

  const baseIncome =
    options.monthlyIncome ??
    profession.startingSalary;

  const job = {
    id:
      generateId("self_employment"),

    professionId:
      profession.id,

    professionName:
      profession.name,

    field:
      profession.field,

    type:
      EMPLOYMENT_TYPES.SELF_EMPLOYED,

    company:
      options.company ||
      `${profession.name} Autônomo`,

    salary:
      Math.max(
        0,
        Number(
          baseIncome
        )
      ),

    salaryPeriod:
      "monthly",

    careerLevel:
      CAREER_LEVELS.SELF_EMPLOYED ??
      CAREER_LEVELS.ENTRY,

    workingHours:
      options.workingHours ||
      35,

    contractMonths:
      null,

    monthsWorked: 0,

    performance:
      profile.performance,

    satisfaction:
      profile.satisfaction,

    remote:
      options.remote === true,

    benefits: [],

    startDate:
      new Date().toISOString(),

    active: true
  };

  profile.currentJob =
    job;

  profile.status =
    EMPLOYMENT_STATUS.SELF_EMPLOYED;

  addEmploymentHistory(
    profile,
    "self_employed",
    `Começou a trabalhar como ${profession.name} por conta própria.`,
    {
      professionId:
        profession.id
    }
  );

  return clone(job);
}

/* ============================================================
   EMPREENDEDORISMO
   ============================================================ */

function startBusinessCareer(
  database,
  entityId,
  businessData = {}
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    profile.currentJob
  ) {
    return null;
  }

  const job = {
    id:
      generateId("business_owner"),

    professionId:
      businessData.professionId ||
      "business_owner",

    professionName:
      businessData.professionName ||
      "Empresário",

    field:
      businessData.field ||
      CAREER_FIELDS.BUSINESS,

    type:
      EMPLOYMENT_TYPES.BUSINESS_OWNER,

    company:
      businessData.company ||
      "Novo Negócio",

    salary:
      Math.max(
        0,
        Number(
          businessData.salary ??
            5000
        )
      ),

    salaryPeriod:
      "monthly",

    careerLevel:
      CAREER_LEVELS.OWNER,

    workingHours:
      businessData.workingHours ||
      45,

    contractMonths:
      null,

    monthsWorked: 0,

    performance:
      profile.performance,

    satisfaction:
      profile.satisfaction,

    remote:
      businessData.remote === true,

    benefits: [],

    startDate:
      new Date().toISOString(),

    active: true
  };

  profile.currentJob =
    job;

  profile.status =
    EMPLOYMENT_STATUS.ENTREPRENEUR;

  addEmploymentHistory(
    profile,
    "business_started",
    `Abriu o negócio ${job.company}.`,
    {
      company:
        job.company
    }
  );

  return clone(job);
}

/* ============================================================
   APOSENTADORIA
   ============================================================ */

function retireFromEmployment(
  database,
  entityId
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    profile.currentJob
  ) {
    resignFromJob(
      database,
      entityId,
      "retirement"
    );
  }

  profile.status =
    EMPLOYMENT_STATUS.RETIRED;

  addEmploymentHistory(
    profile,
    "retirement",
    "Aposentou-se da carreira profissional."
  );

  return clone(profile);
}

/* ============================================================
   OBJETIVOS
   ============================================================ */

function addCareerGoal(
  database,
  entityId,
  goal
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (!profile || !goal) {
    return false;
  }

  if (
    !profile.goals.includes(
      goal
    )
  ) {
    profile.goals.push(
      goal
    );
  }

  return true;
}

function removeCareerGoal(
  database,
  entityId,
  goal
) {
  const profile =
    findEmploymentProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return false;
  }

  profile.goals =
    profile.goals.filter(
      item => item !== goal
    );

  return true;
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function addEmploymentHistory(
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
      profile.careerHistory
    )
  ) {
    profile.careerHistory = [];
  }

  const event = {
    id:
      generateId(
        "employment_history"
      ),

    type,

    description,

    date:
      new Date().toISOString(),

    data:
      clone(data)
  };

  profile.careerHistory.push(
    event
  );

  return clone(event);
}

function getCareerHistory(
  database,
  entityId
) {
  const profile =
    getEmploymentProfile(
      database,
      entityId
    );

  if (!profile) {
    return [];
  }

  return (
    profile.careerHistory || []
  ).map(clone);
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

function calculateEmploymentStats(
  database,
  entityId
) {
  const profile =
    getEmploymentProfile(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  const currentJob =
    profile.currentJob;

  return {
    status:
      profile.status,

    statusLabel:
      getEmploymentStatusLabel(
        profile.status
      ),

    currentProfession:
      currentJob
        ? currentJob.professionName
        : null,

    company:
      currentJob
        ? currentJob.company
        : null,

    monthlySalary:
      currentJob
        ? currentJob.salary
        : 0,

    annualSalary:
      currentJob
        ? currentJob.salary * 12
        : 0,

    careerLevel:
      currentJob
        ? currentJob.careerLevel
        : 0,

    careerLevelLabel:
      currentJob
        ? getCareerLevelLabel(
            currentJob.careerLevel
          )
        : "Nenhum",

    performance:
      profile.performance,

    satisfaction:
      profile.satisfaction,

    motivation:
      profile.motivation,

    reputation:
      profile.reputation,

    totalIncome:
      profile.totalIncome,

    totalYearsWorked:
      Number(
        profile.totalYearsWorked
      ).toFixed(1),

    experience:
      profile.skills?.experience ||
      0,

    expertise:
      profile.skills?.expertise ||
      0,

    careerHistory:
      profile.careerHistory.length
  };
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getEmploymentSnapshot(
  database
) {
  const profiles =
    getAllEmploymentProfiles(
      database
    );

  return {
    version:
      EMPLOYMENT_VERSION,

    totalProfiles:
      profiles.length,

    employed:
      profiles.filter(
        profile =>
          profile.currentJob
      ).length,

    unemployed:
      profiles.filter(
        profile =>
          profile.status ===
          EMPLOYMENT_STATUS.UNEMPLOYED
      ).length,

    retired:
      profiles.filter(
        profile =>
          profile.status ===
          EMPLOYMENT_STATUS.RETIRED
      ).length,

    totalIncome:
      profiles.reduce(
        (sum, profile) =>
          sum +
          Number(
            profile.totalIncome
          ),
        0
      ),

    professions:
      getAllProfessions()
  };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateEmploymentProfile(
  profile
) {
  const errors = [];

  if (!profile) {
    return {
      valid: false,
      errors: [
        "Perfil profissional inexistente."
      ]
    };
  }

  if (!profile.id) {
    errors.push(
      "ID profissional ausente."
    );
  }

  if (
    !Object.values(
      EMPLOYMENT_STATUS
    ).includes(
      profile.status
    )
  ) {
    errors.push(
      "Status profissional inválido."
    );
  }

  if (
    !Number.isFinite(
      Number(
        profile.satisfaction
      )
    )
  ) {
    errors.push(
      "Satisfação inválida."
    );
  }

  if (
    !Number.isFinite(
      Number(
        profile.performance
      )
    )
  ) {
    errors.push(
      "Desempenho inválido."
    );
  }

  if (
    profile.currentJob &&
    !profile.currentJob.professionId
  ) {
    errors.push(
      "Profissão do emprego atual ausente."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}

function validateEmployment(
  database
) {
  const profiles =
    getAllEmploymentProfiles(
      database
    );

  const results =
    profiles.map(profile => ({
      entityId:
        profile.entityId,

      ...validateEmploymentProfile(
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

function initializeEmployment(
  database,
  entityId = null,
  data = {}
) {
  const employment =
    ensureEmploymentState(
      database
    );

  if (!employment) {
    return null;
  }

  if (entityId) {
    const existing =
      getEmploymentProfile(
        database,
        entityId
      );

    if (!existing) {
      addEmploymentProfile(
        database,
        entityId,
        data
      );
    }
  }

  return employment;
}

/* ============================================================
   RESET
   ============================================================ */

function resetEmployment(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  database.life.employment = {
    profiles: {},
    jobs: [],
    history: []
  };

  return database.life.employment;
}

/* ============================================================
   API
   ============================================================ */

const employmentAPI = {
  EMPLOYMENT_VERSION,

  EMPLOYMENT_STATUS,
  EMPLOYMENT_TYPES,

  CAREER_FIELDS,
  CAREER_LEVELS,

  DEFAULT_PROFESSIONS,

  getEmploymentStatusLabel,
  getEmploymentTypeLabel,
  getCareerFieldLabel,
  getCareerLevelLabel,

  createProfession,
  getProfession,
  getAllProfessions,
  getProfessionsByField,
  searchProfessions,

  createEmploymentProfile,

  ensureEmploymentState,

  addEmploymentProfile,
  getEmploymentProfile,
  findEmploymentProfileReference,
  getAllEmploymentProfiles,
  updateEmploymentProfile,

  hasRequiredEducation,
  canWorkProfession,

  calculateStartingSalary,
  generateJobOffer,
  generateCompanyName,

  acceptJobOffer,

  resignFromJob,
  fireFromJob,

  getMonthlySalary,
  calculateAnnualSalary,

  calculateJobPerformance,

  processEmploymentMonth,
  processUnemploymentMonth,

  improveProfessionalSkills,
  updateJobSatisfaction,

  checkForPromotion,
  checkForDismissal,
  checkContractExpiration,

  startSelfEmployment,
  startBusinessCareer,

  retireFromEmployment,

  addCareerGoal,
  removeCareerGoal,

  addEmploymentHistory,
  getCareerHistory,

  calculateEmploymentStats,
  getEmploymentSnapshot,

  validateEmploymentProfile,
  validateEmployment,

  initializeEmployment,
  resetEmployment
};

export default employmentAPI;

export {
  EMPLOYMENT_VERSION,

  EMPLOYMENT_STATUS,
  EMPLOYMENT_TYPES,

  CAREER_FIELDS,
  CAREER_LEVELS,

  DEFAULT_PROFESSIONS,

  getEmploymentStatusLabel,
  getEmploymentTypeLabel,
  getCareerFieldLabel,
  getCareerLevelLabel,

  createProfession,
  getProfession,
  getAllProfessions,
  getProfessionsByField,
  searchProfessions,

  createEmploymentProfile,

  ensureEmploymentState,

  addEmploymentProfile,
  getEmploymentProfile,
  findEmploymentProfileReference,
  getAllEmploymentProfiles,
  updateEmploymentProfile,

  hasRequiredEducation,
  canWorkProfession,

  calculateStartingSalary,
  generateJobOffer,
  generateCompanyName,

  acceptJobOffer,

  resignFromJob,
  fireFromJob,

  getMonthlySalary,
  calculateAnnualSalary,

  calculateJobPerformance,

  processEmploymentMonth,
  processUnemploymentMonth,

  improveProfessionalSkills,
  updateJobSatisfaction,

  checkForPromotion,
  checkForDismissal,
  checkContractExpiration,

  startSelfEmployment,
  startBusinessCareer,

  retireFromEmployment,

  addCareerGoal,
  removeCareerGoal,

  addEmploymentHistory,
  getCareerHistory,

  calculateEmploymentStats,
  getEmploymentSnapshot,

  validateEmploymentProfile,
  validateEmployment,

  initializeEmployment,
  resetEmployment,

  employmentAPI
};
