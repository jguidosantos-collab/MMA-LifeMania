// ============================================================
// MMA LIFE DYNASTY
// MEDIA — MEDIA SYSTEM
// ============================================================
//
// Responsável por:
// - Fama
// - Reputação
// - Seguidores
// - Popularidade
// - Exposição
// - Presença na mídia
// - Impacto das lutas
// - Impacto das vitórias e derrotas
// - Impacto de títulos
// - Impacto de rivalidades
// - Impacto de entrevistas
// - Impacto de redes sociais
// - Crescimento e perda de seguidores
// - Perfil público do lutador
// - Histórico de mídia
//
// Arquivo independente para reduzir dependências circulares.
// ============================================================


// ============================================================
// VERSION
// ============================================================

const MEDIA_VERSION = 1;


// ============================================================
// CONFIG
// ============================================================

const MEDIA_CONFIG = Object.freeze({
  maxFame: 100,
  maxReputation: 100,
  maxPopularity: 100,
  maxExposure: 100,

  minFame: 0,
  minReputation: 0,
  minPopularity: 0,
  minExposure: 0,

  startingFollowers: 100,

  minimumFollowers: 0,

  weeklyDecayRate: 0.004,

  inactivityDecayRate: 0.008,

  victoryFameMultiplier: 1.15,

  defeatFameMultiplier: 0.45,

  finishBonus: 1.20,

  titleBonus: 1.75,

  championshipWinBonus: 8,

  championshipDefenseBonus: 5,

  upsetBonus: 1.50,

  rivalryBonus: 1.25,

  viralMultiplier: 2.00,

  socialMediaMultiplier: 1.00,

  interviewMultiplier: 0.65,

  controversyMultiplier: 0.80,

  retirementDecayRate: 0.02,

  historyLimit: 300,

  newsLimit: 200,

  followerCap: 1000000000
});


// ============================================================
// MEDIA EVENTS
// ============================================================

const MEDIA_EVENT_TYPES = Object.freeze({
  FIGHT_WIN: "fight_win",
  FIGHT_LOSS: "fight_loss",
  FIGHT_DRAW: "fight_draw",

  KO: "ko",
  TKO: "tko",
  SUBMISSION: "submission",

  UPSET: "upset",

  TITLE_WIN: "title_win",
  TITLE_DEFENSE: "title_defense",
  TITLE_LOSS: "title_loss",

  RIVALRY: "rivalry",

  INTERVIEW: "interview",
  PRESS_CONFERENCE: "press_conference",

  SOCIAL_POST: "social_post",
  VIRAL_POST: "viral_post",

  SPONSORSHIP: "sponsorship",
  ENDORSEMENT: "endorsement",

  CONTROVERSY: "controversy",

  RETIREMENT: "retirement",
  COMEBACK: "comeback",

  INACTIVITY: "inactivity",

  AWARD: "award",
  HALL_OF_FAME: "hall_of_fame",

  DEATH: "death"
});


// ============================================================
// MEDIA EVENT LABELS
// ============================================================

const MEDIA_EVENT_LABELS = Object.freeze({
  [MEDIA_EVENT_TYPES.FIGHT_WIN]:
    "Vitória em luta",

  [MEDIA_EVENT_TYPES.FIGHT_LOSS]:
    "Derrota em luta",

  [MEDIA_EVENT_TYPES.FIGHT_DRAW]:
    "Empate",

  [MEDIA_EVENT_TYPES.KO]:
    "Nocaute",

  [MEDIA_EVENT_TYPES.TKO]:
    "Nocaute técnico",

  [MEDIA_EVENT_TYPES.SUBMISSION]:
    "Finalização",

  [MEDIA_EVENT_TYPES.UPSET]:
    "Zebra",

  [MEDIA_EVENT_TYPES.TITLE_WIN]:
    "Conquista de título",

  [MEDIA_EVENT_TYPES.TITLE_DEFENSE]:
    "Defesa de título",

  [MEDIA_EVENT_TYPES.TITLE_LOSS]:
    "Perda de título",

  [MEDIA_EVENT_TYPES.RIVALRY]:
    "Rivalidade",

  [MEDIA_EVENT_TYPES.INTERVIEW]:
    "Entrevista",

  [MEDIA_EVENT_TYPES.PRESS_CONFERENCE]:
    "Coletiva de imprensa",

  [MEDIA_EVENT_TYPES.SOCIAL_POST]:
    "Publicação nas redes sociais",

  [MEDIA_EVENT_TYPES.VIRAL_POST]:
    "Publicação viral",

  [MEDIA_EVENT_TYPES.SPONSORSHIP]:
    "Patrocínio",

  [MEDIA_EVENT_TYPES.ENDORSEMENT]:
    "Publicidade",

  [MEDIA_EVENT_TYPES.CONTROVERSY]:
    "Controvérsia",

  [MEDIA_EVENT_TYPES.RETIREMENT]:
    "Aposentadoria",

  [MEDIA_EVENT_TYPES.COMEBACK]:
    "Retorno",

  [MEDIA_EVENT_TYPES.INACTIVITY]:
    "Inatividade",

  [MEDIA_EVENT_TYPES.AWARD]:
    "Prêmio",

  [MEDIA_EVENT_TYPES.HALL_OF_FAME]:
    "Hall da Fama",

  [MEDIA_EVENT_TYPES.DEATH]:
    "Falecimento"
});


// ============================================================
// MEDIA LEVELS
// ============================================================

const MEDIA_LEVELS = Object.freeze({
  UNKNOWN: "unknown",
  LOCAL: "local",
  REGIONAL: "regional",
  NATIONAL: "national",
  INTERNATIONAL: "international",
  STAR: "star",
  SUPERSTAR: "superstar",
  LEGEND: "legend"
});


const MEDIA_LEVEL_LABELS = Object.freeze({
  [MEDIA_LEVELS.UNKNOWN]:
    "Desconhecido",

  [MEDIA_LEVELS.LOCAL]:
    "Conhecido localmente",

  [MEDIA_LEVELS.REGIONAL]:
    "Nome regional",

  [MEDIA_LEVELS.NATIONAL]:
    "Nome nacional",

  [MEDIA_LEVELS.INTERNATIONAL]:
    "Nome internacional",

  [MEDIA_LEVELS.STAR]:
    "Estrela",

  [MEDIA_LEVELS.SUPERSTAR]:
    "Superestrela",

  [MEDIA_LEVELS.LEGEND]:
    "Lenda"
});


// ============================================================
// HELPERS
// ============================================================

function number(value, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}


function integer(value, fallback = 0) {
  return Math.trunc(
    number(value, fallback)
  );
}


function clamp(value, min, max) {
  return Math.min(
    max,
    Math.max(
      min,
      number(value, min)
    )
  );
}


function round(value, decimals = 2) {
  const factor =
    10 ** decimals;

  return (
    Math.round(
      number(value, 0) *
        factor
    ) / factor
  );
}


function random(min = 0, max = 1) {
  return (
    Math.random() *
      (max - min) +
    min
  );
}


function randomId(prefix = "media") {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
}


function clone(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return value;
  }

  return JSON.parse(
    JSON.stringify(value)
  );
}


function getDate(database) {
  return (
    database?.meta?.currentDate ||
    database?.calendar?.currentDate ||
    new Date()
      .toISOString()
      .slice(0, 10)
  );
}


function getWeek(database) {
  return integer(
    database?.meta?.currentWeek ??
      database?.calendar?.currentWeek,
    1
  );
}


function getYear(database) {
  return integer(
    database?.meta?.currentYear ??
      database?.calendar?.currentYear,
    1
  );
}


// ============================================================
// DATABASE INITIALIZATION
// ============================================================

function ensureMedia(
  database = {}
) {
  if (
    !database ||
    typeof database !== "object"
  ) {
    database = {};
  }

  if (!database.media) {
    database.media = {};
  }

  const media =
    database.media;

  if (
    !Number.isFinite(
      Number(media.fame)
    )
  ) {
    media.fame = 0;
  }

  if (
    !Number.isFinite(
      Number(media.reputation)
    )
  ) {
    media.reputation = 50;
  }

  if (
    !Number.isFinite(
      Number(media.popularity)
    )
  ) {
    media.popularity = 0;
  }

  if (
    !Number.isFinite(
      Number(media.exposure)
    )
  ) {
    media.exposure = 0;
  }

  if (
    !Number.isFinite(
      Number(media.followers)
    )
  ) {
    media.followers =
      MEDIA_CONFIG.startingFollowers;
  }

  if (!media.persona) {
    media.persona = {
      archetype: "unknown",
      publicImage: 50,
      charisma: 50,
      marketability: 50,
      controversy: 0
    };
  }

  if (
    !Array.isArray(
      media.news
    )
  ) {
    media.news = [];
  }

  if (
    !Array.isArray(
      media.history
    )
  ) {
    media.history = [];
  }

  if (
    !Array.isArray(
      media.viralMoments
    )
  ) {
    media.viralMoments = [];
  }

  if (
    !Array.isArray(
      media.rivalries
    )
  ) {
    media.rivalries = [];
  }

  if (
    !Array.isArray(
      media.interviews
    )
  ) {
    media.interviews = [];
  }

  if (
    !Array.isArray(
      media.socialPosts
    )
  ) {
    media.socialPosts = [];
  }

  if (
    !Array.isArray(
      media.awards
    )
  ) {
    media.awards = [];
  }

  if (!media.statistics) {
    media.statistics = {
      totalMediaEvents: 0,
      fightsCovered: 0,
      winsCovered: 0,
      lossesCovered: 0,
      viralMoments: 0,
      interviews: 0,
      socialPosts: 0,
      titleWins: 0,
      titleDefenses: 0,
      controversies: 0,
      awards: 0
    };
  }

  return database;
}


// ============================================================
// CREATE MEDIA STATE
// ============================================================

function createMediaState(
  options = {}
) {
  return {
    version:
      MEDIA_VERSION,

    fame: clamp(
      number(
        options.fame,
        0
      ),
      MEDIA_CONFIG.minFame,
      MEDIA_CONFIG.maxFame
    ),

    reputation: clamp(
      number(
        options.reputation,
        50
      ),
      MEDIA_CONFIG.minReputation,
      MEDIA_CONFIG.maxReputation
    ),

    popularity: clamp(
      number(
        options.popularity,
        0
      ),
      MEDIA_CONFIG.minPopularity,
      MEDIA_CONFIG.maxPopularity
    ),

    exposure: clamp(
      number(
        options.exposure,
        0
      ),
      MEDIA_CONFIG.minExposure,
      MEDIA_CONFIG.maxExposure
    ),

    followers: clamp(
      number(
        options.followers,
        MEDIA_CONFIG.startingFollowers
      ),
      MEDIA_CONFIG.minimumFollowers,
      MEDIA_CONFIG.followerCap
    ),

    persona: {
      archetype:
        options.archetype ||
        "unknown",

      publicImage:
        clamp(
          number(
            options.publicImage,
            50
          ),
          0,
          100
        ),

      charisma:
        clamp(
          number(
            options.charisma,
            50
          ),
          0,
          100
        ),

      marketability:
        clamp(
          number(
            options.marketability,
            50
          ),
          0,
          100
        ),

      controversy:
        clamp(
          number(
            options.controversy,
            0
          ),
          0,
          100
        )
    },

    news: [],
    history: [],
    viralMoments: [],
    rivalries: [],
    interviews: [],
    socialPosts: [],
    awards: [],

    statistics: {
      totalMediaEvents: 0,
      fightsCovered: 0,
      winsCovered: 0,
      lossesCovered: 0,
      viralMoments: 0,
      interviews: 0,
      socialPosts: 0,
      titleWins: 0,
      titleDefenses: 0,
      controversies: 0,
      awards: 0
    }
  };
}


// ============================================================
// GET MEDIA VALUES
// ============================================================

function getFame(database) {
  database =
    ensureMedia(database);

  return clamp(
    number(
      database.media.fame,
      0
    ),
    0,
    100
  );
}


function getReputation(database) {
  database =
    ensureMedia(database);

  return clamp(
    number(
      database.media.reputation,
      50
    ),
    0,
    100
  );
}


function getPopularity(database) {
  database =
    ensureMedia(database);

  return clamp(
    number(
      database.media.popularity,
      0
    ),
    0,
    100
  );
}


function getExposure(database) {
  database =
    ensureMedia(database);

  return clamp(
    number(
      database.media.exposure,
      0
    ),
    0,
    100
  );
}


function getFollowers(database) {
  database =
    ensureMedia(database);

  return clamp(
    number(
      database.media.followers,
      MEDIA_CONFIG.startingFollowers
    ),
    0,
    MEDIA_CONFIG.followerCap
  );
}


// ============================================================
// SET MEDIA VALUES
// ============================================================

function setFame(
  database,
  value
) {
  database =
    ensureMedia(database);

  database.media.fame =
    clamp(
      value,
      0,
      100
    );

  return database.media.fame;
}


function setReputation(
  database,
  value
) {
  database =
    ensureMedia(database);

  database.media.reputation =
    clamp(
      value,
      0,
      100
    );

  return database.media.reputation;
}


function setPopularity(
  database,
  value
) {
  database =
    ensureMedia(database);

  database.media.popularity =
    clamp(
      value,
      0,
      100
    );

  return database.media.popularity;
}


function setExposure(
  database,
  value
) {
  database =
    ensureMedia(database);

  database.media.exposure =
    clamp(
      value,
      0,
      100
    );

  return database.media.exposure;
}


function setFollowers(
  database,
  value
) {
  database =
    ensureMedia(database);

  database.media.followers =
    clamp(
      value,
      0,
      MEDIA_CONFIG.followerCap
    );

  return database.media.followers;
}


// ============================================================
// ADD MEDIA VALUES
// ============================================================

function addFame(
  database,
  amount
) {
  return setFame(
    database,
    getFame(database) +
      number(amount, 0)
  );
}


function addReputation(
  database,
  amount
) {
  return setReputation(
    database,
    getReputation(database) +
      number(amount, 0)
  );
}


function addPopularity(
  database,
  amount
) {
  return setPopularity(
    database,
    getPopularity(database) +
      number(amount, 0)
  );
}


function addExposure(
  database,
  amount
) {
  return setExposure(
    database,
    getExposure(database) +
      number(amount, 0)
  );
}


function addFollowers(
  database,
  amount
) {
  return setFollowers(
    database,
    getFollowers(database) +
      number(amount, 0)
  );
}


// ============================================================
// MEDIA LEVEL
// ============================================================

function getMediaLevelFromFame(
  fame
) {
  const value =
    number(fame, 0);

  if (value < 5) {
    return MEDIA_LEVELS.UNKNOWN;
  }

  if (value < 15) {
    return MEDIA_LEVELS.LOCAL;
  }

  if (value < 30) {
    return MEDIA_LEVELS.REGIONAL;
  }

  if (value < 45) {
    return MEDIA_LEVELS.NATIONAL;
  }

  if (value < 65) {
    return MEDIA_LEVELS.INTERNATIONAL;
  }

  if (value < 80) {
    return MEDIA_LEVELS.STAR;
  }

  if (value < 95) {
    return MEDIA_LEVELS.SUPERSTAR;
  }

  return MEDIA_LEVELS.LEGEND;
}


function getMediaLevel(
  database
) {
  return getMediaLevelFromFame(
    getFame(database)
  );
}


function getMediaLevelLabel(
  database
) {
  const level =
    getMediaLevel(database);

  return (
    MEDIA_LEVEL_LABELS[level] ||
    "Desconhecido"
  );
}


// ============================================================
// FOLLOWER GROWTH
// ============================================================

function calculateFollowerGrowth(
  database,
  options = {}
) {
  database =
    ensureMedia(database);

  const fame =
    getFame(database);

  const popularity =
    getPopularity(database);

  const exposure =
    getExposure(database);

  const reputation =
    getReputation(database);

  const currentFollowers =
    getFollowers(database);

  const eventMultiplier =
    number(
      options.multiplier,
      1
    );

  const baseRate =
    0.008 +
    fame * 0.0008 +
    popularity * 0.0007 +
    exposure * 0.0005 +
    reputation * 0.0002;

  const growthRate =
    clamp(
      baseRate *
        eventMultiplier,
      -0.50,
      0.50
    );

  const growth =
    Math.max(
      0,
      Math.round(
        currentFollowers *
          growthRate
      )
    );

  return {
    currentFollowers,
    growth,
    growthRate:
      round(
        growthRate,
        5
      ),

    projectedFollowers:
      Math.min(
        MEDIA_CONFIG.followerCap,
        currentFollowers +
          growth
      )
  };
}


function applyFollowerGrowth(
  database,
  options = {}
) {
  const result =
    calculateFollowerGrowth(
      database,
      options
    );

  setFollowers(
    database,
    result.projectedFollowers
  );

  return result;
}


// ============================================================
// FAME GROWTH
// ============================================================

function calculateFameGain(
  database,
  options = {}
) {
  database =
    ensureMedia(database);

  const base =
    number(
      options.base,
      1
    );

  const multiplier =
    number(
      options.multiplier,
      1
    );

  const opponentFame =
    number(
      options.opponentFame,
      0
    );

  const opponentRank =
    number(
      options.opponentRank,
      999
    );

  const finish =
    options.finish === true;

  const title =
    options.title === true;

  const upset =
    options.upset === true;

  const rivalry =
    options.rivalry === true;

  let gain =
    base *
    multiplier;

  if (
    opponentFame > 60
  ) {
    gain *=
      1 +
      opponentFame /
        200;
  }

  if (
    opponentRank <= 10
  ) {
    gain *=
      1.20;
  }

  if (finish) {
    gain *=
      MEDIA_CONFIG.finishBonus;
  }

  if (title) {
    gain *=
      MEDIA_CONFIG.titleBonus;
  }

  if (upset) {
    gain *=
      MEDIA_CONFIG.upsetBonus;
  }

  if (rivalry) {
    gain *=
      MEDIA_CONFIG.rivalryBonus;
  }

  return round(
    gain,
    2
  );
}


function applyFameGain(
  database,
  options = {}
) {
  const gain =
    calculateFameGain(
      database,
      options
    );

  addFame(
    database,
    gain
  );

  return gain;
}


// ============================================================
// FAME LOSS
// ============================================================

function calculateFameLoss(
  database,
  options = {}
) {
  const base =
    number(
      options.base,
      1
    );

  const multiplier =
    number(
      options.multiplier,
      1
    );

  return round(
    Math.max(
      0,
      base *
        multiplier
    ),
    2
  );
}


function applyFameLoss(
  database,
  options = {}
) {
  const loss =
    calculateFameLoss(
      database,
      options
    );

  addFame(
    database,
    -loss
  );

  return loss;
}


// ============================================================
// FIGHT MEDIA IMPACT
// ============================================================

function processFightMedia(
  database,
  result = {}
) {
  database =
    ensureMedia(database);

  const outcome =
    String(
      result.outcome ||
      result.result ||
      ""
    ).toLowerCase();

  const method =
    String(
      result.method ||
      ""
    ).toLowerCase();

  const opponentFame =
    number(
      result.opponentFame,
      0
    );

  const opponentRank =
    number(
      result.opponentRank,
      999
    );

  const title =
    result.title === true ||
    result.isTitleFight === true;

  const upset =
    result.upset === true;

  const rivalry =
    result.rivalry === true;

  const finish =
    [
      "ko",
      "tko",
      "submission",
      "sub"
    ].includes(method);

  let fameChange = 0;
  let reputationChange = 0;
  let popularityChange = 0;
  let exposureChange = 0;

  let eventType =
    MEDIA_EVENT_TYPES.FIGHT_DRAW;

  if (
    outcome === "win" ||
    outcome === "won" ||
    outcome === "victory"
  ) {
    fameChange =
      calculateFameGain(
        database,
        {
          base: 2.5,
          opponentFame,
          opponentRank,
          finish,
          title,
          upset,
          rivalry
        }
      );

    reputationChange =
      1.5 +
      (
        finish
          ? 1.5
          : 0
      );

    popularityChange =
      2 +
      (
        finish
          ? 3
          : 0
      );

    exposureChange =
      4;

    eventType =
      MEDIA_EVENT_TYPES.FIGHT_WIN;

    database.media.statistics
      .winsCovered++;

  } else if (
    outcome === "loss" ||
    outcome === "lost" ||
    outcome === "defeat"
  ) {
    fameChange =
      -calculateFameLoss(
        database,
        {
          base:
            opponentFame > 70
              ? 0.75
              : 1.50
        }
      );

    reputationChange =
      finish
        ? -2
        : -0.75;

    popularityChange =
      -1;

    exposureChange =
      2;

    eventType =
      MEDIA_EVENT_TYPES.FIGHT_LOSS;

    database.media.statistics
      .lossesCovered++;

  } else {
    fameChange =
      0.5;

    reputationChange =
      0.25;

    popularityChange =
      0.50;

    exposureChange =
      1;
  }

  if (
    method === "ko" ||
    method === "knockout"
  ) {
    fameChange *=
      MEDIA_CONFIG.finishBonus;

    popularityChange +=
      4;

    createMediaEvent(
      database,
      {
        type:
          MEDIA_EVENT_TYPES.KO,

        fameChange,
        reputationChange: 1,
        popularityChange: 3,
        exposureChange: 3
      }
    );
  }

  if (
    method === "tko"
  ) {
    fameChange *=
      MEDIA_CONFIG.finishBonus;

    popularityChange +=
      3;

    createMediaEvent(
      database,
      {
        type:
          MEDIA_EVENT_TYPES.TKO,

        fameChange,
        reputationChange: 1,
        popularityChange: 2,
        exposureChange: 2
      }
    );
  }

  if (
    method === "submission" ||
    method === "sub"
  ) {
    fameChange *=
      MEDIA_CONFIG.finishBonus;

    popularityChange +=
      3;

    createMediaEvent(
      database,
      {
        type:
          MEDIA_EVENT_TYPES.SUBMISSION,

        fameChange,
        reputationChange: 1,
        popularityChange: 2,
        exposureChange: 2
      }
    );
  }

  if (upset) {
    fameChange *=
      MEDIA_CONFIG.upsetBonus;

    popularityChange +=
      5;

    createMediaEvent(
      database,
      {
        type:
          MEDIA_EVENT_TYPES.UPSET,

        fameChange:
          Math.max(
            1,
            fameChange
          ),

        reputationChange: 2,

        popularityChange: 4,

        exposureChange: 5
      }
    );
  }

  if (title) {
    fameChange +=
      MEDIA_CONFIG
        .championshipWinBonus;

    popularityChange +=
      8;

    exposureChange +=
      8;
  }

  addFame(
    database,
    fameChange
  );

  addReputation(
    database,
    reputationChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  applyFollowerGrowth(
    database,
    {
      multiplier:
        1 +
        Math.max(
          0,
          fameChange
        ) *
        0.04
    }
  );

  database.media.statistics
    .fightsCovered++;

  createMediaEvent(
    database,
    {
      type: eventType,

      fameChange,

      reputationChange,

      popularityChange,

      exposureChange,

      metadata: {
        opponentFame,
        opponentRank,
        method,
        title,
        upset,
        rivalry
      }
    }
  );

  return {
    fameChange:
      round(
        fameChange,
        2
      ),

    reputationChange:
      round(
        reputationChange,
        2
      ),

    popularityChange:
      round(
        popularityChange,
        2
      ),

    exposureChange:
      round(
        exposureChange,
        2
      ),

    followers:
      getFollowers(database),

    mediaLevel:
      getMediaLevel(database)
  };
}


// ============================================================
// TITLE MEDIA IMPACT
// ============================================================

function processTitleWin(
  database,
  titleName = "Título"
) {
  database =
    ensureMedia(database);

  const fameChange =
    MEDIA_CONFIG
      .championshipWinBonus;

  const reputationChange =
    6;

  const popularityChange =
    10;

  const exposureChange =
    12;

  addFame(
    database,
    fameChange
  );

  addReputation(
    database,
    reputationChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  database.media.statistics
    .titleWins++;

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES.TITLE_WIN,

      fameChange,

      reputationChange,

      popularityChange,

      exposureChange,

      metadata: {
        titleName
      }
    }
  );

  applyFollowerGrowth(
    database,
    {
      multiplier: 2
    }
  );

  return {
    titleName,
    fameChange,
    reputationChange,
    popularityChange,
    exposureChange
  };
}


function processTitleDefense(
  database,
  titleName = "Título"
) {
  database =
    ensureMedia(database);

  const fameChange =
    MEDIA_CONFIG
      .championshipDefenseBonus;

  const reputationChange =
    4;

  const popularityChange =
    6;

  const exposureChange =
    8;

  addFame(
    database,
    fameChange
  );

  addReputation(
    database,
    reputationChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  database.media.statistics
    .titleDefenses++;

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES.TITLE_DEFENSE,

      fameChange,

      reputationChange,

      popularityChange,

      exposureChange,

      metadata: {
        titleName
      }
    }
  );

  applyFollowerGrowth(
    database,
    {
      multiplier: 1.5
    }
  );

  return {
    titleName,
    fameChange,
    reputationChange,
    popularityChange,
    exposureChange
  };
}


function processTitleLoss(
  database,
  titleName = "Título"
) {
  database =
    ensureMedia(database);

  const fameChange =
    -3;

  const reputationChange =
    -2;

  const popularityChange =
    -2;

  const exposureChange =
    5;

  addFame(
    database,
    fameChange
  );

  addReputation(
    database,
    reputationChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES.TITLE_LOSS,

      fameChange,

      reputationChange,

      popularityChange,

      exposureChange,

      metadata: {
        titleName
      }
    }
  );

  return {
    titleName,
    fameChange,
    reputationChange,
    popularityChange,
    exposureChange
  };
}


// ============================================================
// RIVALRIES
// ============================================================

function createRivalry(
  database,
  opponent = {},
  intensity = 50
) {
  database =
    ensureMedia(database);

  const rivalry = {
    id:
      randomId("rivalry"),

    opponentId:
      opponent.id ||
      null,

    opponentName:
      opponent.name ||
      "Rival",

    intensity:
      clamp(
        intensity,
        0,
        100
      ),

    fameGenerated: 0,

    active: true,

    createdAt:
      getDate(database),

    lastUpdate:
      getDate(database)
  };

  database.media.rivalries.push(
    rivalry
  );

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES.RIVALRY,

      fameChange:
        intensity *
        0.04,

      reputationChange:
        1,

      popularityChange:
        intensity *
        0.05,

      exposureChange:
        intensity *
        0.06,

      metadata: {
        opponentId:
          rivalry.opponentId,

        opponentName:
          rivalry.opponentName,

        intensity:
          rivalry.intensity
      }
    }
  );

  return rivalry;
}


function updateRivalry(
  database,
  rivalryId,
  options = {}
) {
  database =
    ensureMedia(database);

  const rivalry =
    database.media.rivalries
      .find(
        item =>
          item.id ===
          rivalryId
      );

  if (!rivalry) {
    return null;
  }

  if (
    options.intensity !==
    undefined
  ) {
    rivalry.intensity =
      clamp(
        options.intensity,
        0,
        100
      );
  }

  if (
    options.active !==
    undefined
  ) {
    rivalry.active =
      Boolean(
        options.active
      );
  }

  rivalry.lastUpdate =
    getDate(database);

  return rivalry;
}


function endRivalry(
  database,
  rivalryId
) {
  return updateRivalry(
    database,
    rivalryId,
    {
      active: false
    }
  );
}


// ============================================================
// INTERVIEWS
// ============================================================

function processInterview(
  database,
  options = {}
) {
  database =
    ensureMedia(database);

  const quality =
    clamp(
      number(
        options.quality,
        50
      ),
      0,
      100
    );

  const charisma =
    clamp(
      number(
        options.charisma ??
          database.media.persona
            ?.charisma,
        50
      ),
      0,
      100
    );

  const controversy =
    clamp(
      number(
        options.controversy,
        0
      ),
      0,
      100
    );

  const base =
    (
      quality +
      charisma
    ) / 2;

  const fameChange =
    round(
      base *
        0.045 *
        MEDIA_CONFIG
          .interviewMultiplier,
      2
    );

  const popularityChange =
    round(
      base *
        0.06,
      2
    );

  const exposureChange =
    round(
      5 +
        quality *
        0.06,
      2
    );

  const reputationChange =
    round(
      (
        quality -
        controversy
      ) *
        0.03,
      2
    );

  addFame(
    database,
    fameChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  addReputation(
    database,
    reputationChange
  );

  const interview = {
    id:
      randomId("interview"),

    date:
      getDate(database),

    quality,

    charisma,

    controversy,

    fameChange,

    popularityChange,

    exposureChange,

    reputationChange
  };

  database.media.interviews.push(
    interview
  );

  database.media.statistics
    .interviews++;

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES.INTERVIEW,

      fameChange,

      reputationChange,

      popularityChange,

      exposureChange,

      metadata: {
        quality,
        charisma,
        controversy
      }
    }
  );

  applyFollowerGrowth(
    database,
    {
      multiplier:
        1 +
        quality / 100
    }
  );

  return interview;
}


// ============================================================
// SOCIAL MEDIA
// ============================================================

function processSocialPost(
  database,
  options = {}
) {
  database =
    ensureMedia(database);

  const quality =
    clamp(
      number(
        options.quality,
        50
      ),
      0,
      100
    );

  const viral =
    options.viral === true ||
    quality >= 90;

  const engagement =
    clamp(
      number(
        options.engagement,
        quality
      ),
      0,
      100
    );

  let multiplier =
    MEDIA_CONFIG
      .socialMediaMultiplier;

  if (viral) {
    multiplier *=
      MEDIA_CONFIG.viralMultiplier;
  }

  const fameChange =
    round(
      quality *
        0.025 *
        multiplier,
      2
    );

  const popularityChange =
    round(
      engagement *
        0.05 *
        multiplier,
      2
    );

  const exposureChange =
    round(
      1 +
        engagement *
        0.08 *
        multiplier,
      2
    );

  addFame(
    database,
    fameChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  const post = {
    id:
      randomId("social"),

    date:
      getDate(database),

    quality,

    engagement,

    viral,

    fameChange,

    popularityChange,

    exposureChange
  };

  database.media.socialPosts.push(
    post
  );

  database.media.statistics
    .socialPosts++;

  if (viral) {
    database.media.statistics
      .viralMoments++;

    database.media.viralMoments.push(
      {
        id:
          randomId("viral"),

        date:
          getDate(database),

        postId:
          post.id,

        quality,

        engagement,

        fameGain:
          fameChange,

        followersGained:
          Math.max(
            1,
            Math.round(
              getFollowers(database) *
                0.05
            )
          )
      }
    );

    createMediaEvent(
      database,
      {
        type:
          MEDIA_EVENT_TYPES
            .VIRAL_POST,

        fameChange,

        reputationChange: 1,

        popularityChange,

        exposureChange,

        metadata: {
          quality,
          engagement
        }
      }
    );
  } else {
    createMediaEvent(
      database,
      {
        type:
          MEDIA_EVENT_TYPES
            .SOCIAL_POST,

        fameChange,

        reputationChange: 0,

        popularityChange,

        exposureChange,

        metadata: {
          quality,
          engagement
        }
      }
    );
  }

  applyFollowerGrowth(
    database,
    {
      multiplier:
        viral
          ? 4
          : 1 +
            engagement /
              100
    }
  );

  return post;
}


// ============================================================
// CONTROVERSY
// ============================================================

function processControversy(
  database,
  severity = 50
) {
  database =
    ensureMedia(database);

  const value =
    clamp(
      number(
        severity,
        50
      ),
      0,
      100
    );

  const fameChange =
    round(
      value *
        0.025 *
        MEDIA_CONFIG
          .controversyMultiplier,
      2
    );

  const reputationChange =
    -round(
      value *
        0.06,
      2
    );

  const popularityChange =
    round(
      value *
        0.025,
      2
    );

  const exposureChange =
    round(
      value *
        0.10,
      2
    );

  addFame(
    database,
    fameChange
  );

  addReputation(
    database,
    reputationChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  database.media.persona
    .controversy =
    clamp(
      database.media.persona
        .controversy +
        value *
        0.10,
      0,
      100
    );

  database.media.statistics
    .controversies++;

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES
          .CONTROVERSY,

      fameChange,

      reputationChange,

      popularityChange,

      exposureChange,

      metadata: {
        severity: value
      }
    }
  );

  applyFollowerGrowth(
    database,
    {
      multiplier:
        1 +
        value /
          100
    }
  );

  return {
    severity: value,
    fameChange,
    reputationChange,
    popularityChange,
    exposureChange
  };
}


// ============================================================
// SPONSORSHIP / ENDORSEMENT
// ============================================================

function processSponsorshipMedia(
  database,
  value = 0
) {
  database =
    ensureMedia(database);

  const financialValue =
    Math.max(
      0,
      number(value, 0)
    );

  const fameChange =
    clamp(
      Math.log10(
        financialValue + 1
      ) *
        0.75,
      0,
      8
    );

  const popularityChange =
    fameChange *
    0.75;

  const exposureChange =
    fameChange *
    1.25;

  addFame(
    database,
    fameChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES
          .SPONSORSHIP,

      fameChange,

      reputationChange: 0.5,

      popularityChange,

      exposureChange,

      metadata: {
        financialValue
      }
    }
  );

  return {
    fameChange:
      round(
        fameChange,
        2
      ),

    popularityChange:
      round(
        popularityChange,
        2
      ),

    exposureChange:
      round(
        exposureChange,
        2
      )
  };
}


function processEndorsementMedia(
  database,
  value = 0
) {
  database =
    ensureMedia(database);

  const financialValue =
    Math.max(
      0,
      number(value, 0)
    );

  const fameChange =
    clamp(
      Math.log10(
        financialValue + 1
      ),
      0,
      5
    );

  const popularityChange =
    fameChange *
    1.20;

  const exposureChange =
    fameChange *
    1.50;

  addFame(
    database,
    fameChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES
          .ENDORSEMENT,

      fameChange,

      reputationChange: 1,

      popularityChange,

      exposureChange,

      metadata: {
        financialValue
      }
    }
  );

  return {
    fameChange:
      round(
        fameChange,
        2
      ),

    popularityChange:
      round(
        popularityChange,
        2
      ),

    exposureChange:
      round(
        exposureChange,
        2
      )
  };
}


// ============================================================
// AWARDS / HALL OF FAME
// ============================================================

function processAward(
  database,
  awardName = "Prêmio"
) {
  database =
    ensureMedia(database);

  const fameChange =
    3;

  const reputationChange =
    5;

  const popularityChange =
    4;

  const exposureChange =
    6;

  addFame(
    database,
    fameChange
  );

  addReputation(
    database,
    reputationChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  const award = {
    id:
      randomId("award"),

    name:
      awardName,

    date:
      getDate(database)
  };

  database.media.awards.push(
    award
  );

  database.media.statistics
    .awards++;

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES.AWARD,

      fameChange,

      reputationChange,

      popularityChange,

      exposureChange,

      metadata: {
        awardName
      }
    }
  );

  return award;
}


function processHallOfFame(
  database,
  reason = "Carreira"
) {
  database =
    ensureMedia(database);

  const fameChange =
    10;

  const reputationChange =
    15;

  const popularityChange =
    12;

  const exposureChange =
    15;

  addFame(
    database,
    fameChange
  );

  addReputation(
    database,
    reputationChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES
          .HALL_OF_FAME,

      fameChange,

      reputationChange,

      popularityChange,

      exposureChange,

      metadata: {
        reason
      }
    }
  );

  return {
    fameChange,
    reputationChange,
    popularityChange,
    exposureChange
  };
}


// ============================================================
// RETIREMENT / COMEBACK
// ============================================================

function processRetirement(
  database
) {
  database =
    ensureMedia(database);

  const fame =
    getFame(database);

  const reputation =
    getReputation(database);

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES
          .RETIREMENT,

      fameChange: 0,

      reputationChange: 3,

      popularityChange: 5,

      exposureChange: 10,

      metadata: {
        fameAtRetirement:
          fame,

        reputationAtRetirement:
          reputation
      }
    }
  );

  addReputation(
    database,
    3
  );

  addPopularity(
    database,
    5
  );

  addExposure(
    database,
    10
  );

  return {
    fame,
    reputation,
    level:
      getMediaLevel(database)
  };
}


function processComeback(
  database
) {
  database =
    ensureMedia(database);

  const fame =
    getFame(database);

  const fameChange =
    clamp(
      fame *
        0.08,
      1,
      8
    );

  const popularityChange =
    5;

  const exposureChange =
    10;

  addFame(
    database,
    fameChange
  );

  addPopularity(
    database,
    popularityChange
  );

  addExposure(
    database,
    exposureChange
  );

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES
          .COMEBACK,

      fameChange,

      reputationChange: 2,

      popularityChange,

      exposureChange
    }
  );

  applyFollowerGrowth(
    database,
    {
      multiplier: 2
    }
  );

  return {
    fameChange,
    popularityChange,
    exposureChange
  };
}


// ============================================================
// INACTIVITY
// ============================================================

function processInactivity(
  database,
  weeks = 1
) {
  database =
    ensureMedia(database);

  const duration =
    Math.max(
      1,
      integer(
        weeks,
        1
      )
    );

  const fame =
    getFame(database);

  const exposure =
    getExposure(database);

  const fameLoss =
    fame *
    MEDIA_CONFIG
      .inactivityDecayRate *
    duration;

  const exposureLoss =
    exposure *
    MEDIA_CONFIG
      .inactivityDecayRate *
    0.75 *
    duration;

  const popularityLoss =
    getPopularity(database) *
    MEDIA_CONFIG
      .inactivityDecayRate *
    0.50 *
    duration;

  addFame(
    database,
    -fameLoss
  );

  addExposure(
    database,
    -exposureLoss
  );

  addPopularity(
    database,
    -popularityLoss
  );

  const followerGrowth =
    calculateFollowerGrowth(
      database,
      {
        multiplier:
          0.25
      }
    );

  const followerLoss =
    Math.round(
      getFollowers(database) *
        0.001 *
        duration
    );

  setFollowers(
    database,
    getFollowers(database) -
      followerLoss
  );

  createMediaEvent(
    database,
    {
      type:
        MEDIA_EVENT_TYPES
          .INACTIVITY,

      fameChange:
        -fameLoss,

      reputationChange: 0,

      popularityChange:
        -popularityLoss,

      exposureChange:
        -exposureLoss,

      metadata: {
        weeks: duration,
        followersLost:
          followerLoss
      }
    }
  );

  return {
    weeks: duration,

    fameLoss:
      round(
        fameLoss,
        2
      ),

    exposureLoss:
      round(
        exposureLoss,
        2
      ),

    popularityLoss:
      round(
        popularityLoss,
        2
      ),

    followersLost:
      followerLoss
  };
}


// ============================================================
// WEEKLY DECAY
// ============================================================

function processWeeklyDecay(
  database
) {
  database =
    ensureMedia(database);

  const fame =
    getFame(database);

  const exposure =
    getExposure(database);

  const popularity =
    getPopularity(database);

  const fameLoss =
    fame *
    MEDIA_CONFIG
      .weeklyDecayRate;

  const exposureLoss =
    exposure *
    MEDIA_CONFIG
      .weeklyDecayRate;

  const popularityLoss =
    popularity *
    MEDIA_CONFIG
      .weeklyDecayRate;

  addFame(
    database,
    -fameLoss
  );

  addExposure(
    database,
    -exposureLoss
  );

  addPopularity(
    database,
    -popularityLoss
  );

  return {
    fameLoss:
      round(
        fameLoss,
        3
      ),

    exposureLoss:
      round(
        exposureLoss,
        3
      ),

    popularityLoss:
      round(
        popularityLoss,
        3
      )
  };
}


// ============================================================
// MEDIA EVENT CREATION
// ============================================================

function createMediaEvent(
  database,
  options = {}
) {
  database =
    ensureMedia(database);

  const event = {
    id:
      options.id ||
      randomId("mediaevent"),

    type:
      options.type ||
      "generic",

    label:
      MEDIA_EVENT_LABELS[
        options.type
      ] ||
      options.type ||
      "Evento de mídia",

    date:
      getDate(database),

    week:
      getWeek(database),

    year:
      getYear(database),

    fameChange:
      round(
        number(
          options.fameChange,
          0
        ),
        2
      ),

    reputationChange:
      round(
        number(
          options.reputationChange,
          0
        ),
        2
      ),

    popularityChange:
      round(
        number(
          options.popularityChange,
          0
        ),
        2
      ),

    exposureChange:
      round(
        number(
          options.exposureChange,
          0
        ),
        2
      ),

    metadata:
      clone(
        options.metadata ||
        {}
      )
  };

  database.media.history.push(
    event
  );

  database.media.statistics
    .totalMediaEvents++;

  database.media.news.push(
    {
      id:
        randomId("news"),

      type:
        event.type,

      title:
        event.label,

      date:
        event.date,

      week:
        event.week,

      year:
        event.year,

      fameChange:
        event.fameChange,

      popularityChange:
        event.popularityChange,

      exposureChange:
        event.exposureChange,

      metadata:
        clone(
          event.metadata
        )
    }
  );

  trimMediaHistory(
    database
  );

  return event;
}


// ============================================================
// NEWS
// ============================================================

function addNews(
  database,
  news = {}
) {
  database =
    ensureMedia(database);

  const item = {
    id:
      news.id ||
      randomId("news"),

    type:
      news.type ||
      "general",

    title:
      news.title ||
      "Notícia",

    body:
      news.body ||
      "",

    date:
      getDate(database),

    week:
      getWeek(database),

    year:
      getYear(database),

    importance:
      clamp(
        number(
          news.importance,
          50
        ),
        0,
        100
      ),

    read:
      false
  };

  database.media.news.push(
    item
  );

  while (
    database.media.news.length >
    MEDIA_CONFIG.newsLimit
  ) {
    database.media.news.shift();
  }

  return item;
}


function getNews(
  database,
  limit = 20
) {
  database =
    ensureMedia(database);

  return database.media.news
    .slice(
      -Math.max(
        1,
        integer(
          limit,
          20
        )
      )
    )
    .reverse()
    .map(clone);
}


function markNewsRead(
  database,
  newsId
) {
  database =
    ensureMedia(database);

  const item =
    database.media.news.find(
      news =>
        news.id ===
        newsId
    );

  if (!item) {
    return false;
  }

  item.read = true;

  return true;
}


// ============================================================
// PERSONA
// ============================================================

function updatePersona(
  database,
  changes = {}
) {
  database =
    ensureMedia(database);

  const persona =
    database.media.persona;

  if (
    changes.archetype
  ) {
    persona.archetype =
      changes.archetype;
  }

  if (
    changes.publicImage !==
    undefined
  ) {
    persona.publicImage =
      clamp(
        changes.publicImage,
        0,
        100
      );
  }

  if (
    changes.charisma !==
    undefined
  ) {
    persona.charisma =
      clamp(
        changes.charisma,
        0,
        100
      );
  }

  if (
    changes.marketability !==
    undefined
  ) {
    persona.marketability =
      clamp(
        changes.marketability,
        0,
        100
      );
  }

  if (
    changes.controversy !==
    undefined
  ) {
    persona.controversy =
      clamp(
        changes.controversy,
        0,
        100
      );
  }

  return persona;
}


function calculateMarketability(
  database
) {
  database =
    ensureMedia(database);

  const fame =
    getFame(database);

  const reputation =
    getReputation(database);

  const popularity =
    getPopularity(database);

  const persona =
    database.media.persona;

  const value =
    fame * 0.35 +
    reputation * 0.20 +
    popularity * 0.20 +
    persona.charisma * 0.10 +
    persona.publicImage * 0.05 +
    persona.marketability * 0.10;

  return clamp(
    round(value, 2),
    0,
    100
  );
}


// ============================================================
// PUBLIC PROFILE
// ============================================================

function getMediaProfile(
  database
) {
  database =
    ensureMedia(database);

  return {
    version:
      MEDIA_VERSION,

    fame:
      round(
        getFame(database),
        2
      ),

    reputation:
      round(
        getReputation(database),
        2
      ),

    popularity:
      round(
        getPopularity(database),
        2
      ),

    exposure:
      round(
        getExposure(database),
        2
      ),

    followers:
      getFollowers(database),

    level:
      getMediaLevel(database),

    levelLabel:
      getMediaLevelLabel(
        database
      ),

    marketability:
      calculateMarketability(
        database
      ),

    persona:
      clone(
        database.media.persona
      ),

    activeRivalries:
      database.media.rivalries
        .filter(
          rivalry =>
            rivalry.active
        )
        .length,

    statistics:
      clone(
        database.media.statistics
      )
  };
}


// ============================================================
// MEDIA VALUE
// ============================================================

function calculateMediaValue(
  database
) {
  database =
    ensureMedia(database);

  const fame =
    getFame(database);

  const reputation =
    getReputation(database);

  const popularity =
    getPopularity(database);

  const exposure =
    getExposure(database);

  const followers =
    getFollowers(database);

  const followerScore =
    Math.min(
      100,
      Math.log10(
        followers + 1
      ) *
        10
    );

  return round(
    fame * 0.30 +
    reputation * 0.15 +
    popularity * 0.20 +
    exposure * 0.15 +
    followerScore * 0.20,
    2
  );
}


// ============================================================
// FAME RANK
// ============================================================

function calculateFameRank(
  database,
  allFighters = []
) {
  database =
    ensureMedia(database);

  if (
    !Array.isArray(
      allFighters
    ) ||
    allFighters.length === 0
  ) {
    return 1;
  }

  const playerFame =
    getFame(database);

  const values =
    allFighters
      .map(
        fighter =>
          number(
            fighter.fame ??
              fighter.media?.fame,
            0
          )
      )
      .sort(
        (a, b) =>
          b - a
      );

  let rank = 1;

  for (
    const value
    of values
  ) {
    if (
      value >
      playerFame
    ) {
      rank++;
    }
  }

  return rank;
}


// ============================================================
// MEDIA SNAPSHOT
// ============================================================

function createMediaSnapshot(
  database,
  type = "manual"
) {
  database =
    ensureMedia(database);

  const snapshot = {
    id:
      randomId("mediasnapshot"),

    date:
      getDate(database),

    week:
      getWeek(database),

    year:
      getYear(database),

    type,

    fame:
      getFame(database),

    reputation:
      getReputation(database),

    popularity:
      getPopularity(database),

    exposure:
      getExposure(database),

    followers:
      getFollowers(database),

    level:
      getMediaLevel(database),

    marketability:
      calculateMarketability(
        database
      )
  };

  database.media.history.push(
    snapshot
  );

  trimMediaHistory(
    database
  );

  return clone(snapshot);
}


// ============================================================
// HISTORY
// ============================================================

function getMediaHistory(
  database,
  limit = 30
) {
  database =
    ensureMedia(database);

  return database.media.history
    .slice(
      -Math.max(
        1,
        integer(
          limit,
          30
        )
      )
    )
    .map(clone);
}


function getViralMoments(
  database,
  limit = 20
) {
  database =
    ensureMedia(database);

  return database.media.viralMoments
    .slice(
      -Math.max(
        1,
        integer(
          limit,
          20
        )
      )
    )
    .reverse()
    .map(clone);
}


function getRivalries(
  database,
  activeOnly = false
) {
  database =
    ensureMedia(database);

  const rivalries =
    activeOnly
      ? database.media.rivalries
          .filter(
            rivalry =>
              rivalry.active
          )
      : database.media.rivalries;

  return rivalries.map(clone);
}


// ============================================================
// MEDIA SUMMARY
// ============================================================

function getMediaSummary(
  database
) {
  database =
    ensureMedia(database);

  return {
    fame:
      round(
        getFame(database),
        2
      ),

    reputation:
      round(
        getReputation(database),
        2
      ),

    popularity:
      round(
        getPopularity(database),
        2
      ),

    exposure:
      round(
        getExposure(database),
        2
      ),

    followers:
      getFollowers(database),

    mediaLevel:
      getMediaLevel(database),

    mediaLevelLabel:
      getMediaLevelLabel(
        database
      ),

    mediaValue:
      calculateMediaValue(
        database
      ),

    marketability:
      calculateMarketability(
        database
      )
  };
}


// ============================================================
// VALIDATION
// ============================================================

function validateMedia(
  database
) {
  database =
    ensureMedia(database);

  const errors = [];

  const values = [
    [
      "fame",
      database.media.fame
    ],
    [
      "reputation",
      database.media.reputation
    ],
    [
      "popularity",
      database.media.popularity
    ],
    [
      "exposure",
      database.media.exposure
    ],
    [
      "followers",
      database.media.followers
    ]
  ];

  for (
    const [
      name,
      value
    ] of values
  ) {
    if (
      !Number.isFinite(
        Number(value)
      )
    ) {
      errors.push(
        `${name} inválido.`
      );
    }
  }

  if (
    !Array.isArray(
      database.media.history
    )
  ) {
    errors.push(
      "Histórico de mídia inválido."
    );
  }

  if (
    !Array.isArray(
      database.media.news
    )
  ) {
    errors.push(
      "Notícias inválidas."
    );
  }

  if (
    !Array.isArray(
      database.media.rivalries
    )
  ) {
    errors.push(
      "Rivalidades inválidas."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}


// ============================================================
// TRIM HISTORY
// ============================================================

function trimMediaHistory(
  database
) {
  database =
    ensureMedia(database);

  while (
    database.media.history
      .length >
    MEDIA_CONFIG.historyLimit
  ) {
    database.media.history.shift();
  }

  while (
    database.media.news
      .length >
    MEDIA_CONFIG.newsLimit
  ) {
    database.media.news.shift();
  }

  while (
    database.media.viralMoments
      .length >
    100
  ) {
    database.media.viralMoments.shift();
  }

  while (
    database.media.interviews
      .length >
    100
  ) {
    database.media.interviews.shift();
  }

  while (
    database.media.socialPosts
      .length >
    200
  ) {
    database.media.socialPosts.shift();
  }

  return database.media;
}


// ============================================================
// RESET
// ============================================================

function resetMedia(
  database
) {
  if (
    !database ||
    typeof database !== "object"
  ) {
    database = {};
  }

  database.media =
    createMediaState();

  return database.media;
}


// ============================================================
// EXPORTS
// ============================================================

export {
  MEDIA_VERSION,

  MEDIA_CONFIG,

  MEDIA_EVENT_TYPES,

  MEDIA_EVENT_LABELS,

  MEDIA_LEVELS,

  MEDIA_LEVEL_LABELS,

  createMediaState,

  ensureMedia,

  getFame,

  getReputation,

  getPopularity,

  getExposure,

  getFollowers,

  setFame,

  setReputation,

  setPopularity,

  setExposure,

  setFollowers,

  addFame,

  addReputation,

  addPopularity,

  addExposure,

  addFollowers,

  getMediaLevelFromFame,

  getMediaLevel,

  getMediaLevelLabel,

  calculateFollowerGrowth,

  applyFollowerGrowth,

  calculateFameGain,

  applyFameGain,

  calculateFameLoss,

  applyFameLoss,

  processFightMedia,

  processTitleWin,

  processTitleDefense,

  processTitleLoss,

  createRivalry,

  updateRivalry,

  endRivalry,

  processInterview,

  processSocialPost,

  processControversy,

  processSponsorshipMedia,

  processEndorsementMedia,

  processAward,

  processHallOfFame,

  processRetirement,

  processComeback,

  processInactivity,

  processWeeklyDecay,

  createMediaEvent,

  addNews,

  getNews,

  markNewsRead,

  updatePersona,

  calculateMarketability,

  getMediaProfile,

  calculateMediaValue,

  calculateFameRank,

  createMediaSnapshot,

  getMediaHistory,

  getViralMoments,

  getRivalries,

  getMediaSummary,

  validateMedia,

  trimMediaHistory,

  resetMedia
};


export default {
  version:
    MEDIA_VERSION,

  config:
    MEDIA_CONFIG,

  eventTypes:
    MEDIA_EVENT_TYPES,

  levels:
    MEDIA_LEVELS,

  create:
    createMediaState,

  ensure:
    ensureMedia,

  getFame,

  getReputation,

  getPopularity,

  getExposure,

  getFollowers,

  setFame,

  setReputation,

  setPopularity,

  setExposure,

  setFollowers,

  addFame,

  addReputation,

  addPopularity,

  addExposure,

  addFollowers,

  getLevel:
    getMediaLevel,

  getLevelLabel:
    getMediaLevelLabel,

  calculateFollowerGrowth,

  applyFollowerGrowth,

  calculateFameGain,

  applyFameGain,

  calculateFameLoss,

  applyFameLoss,

  processFight:
    processFightMedia,

  processTitleWin,

  processTitleDefense,

  processTitleLoss,

  createRivalry,

  updateRivalry,

  endRivalry,

  processInterview,

  processSocialPost,

  processControversy,

  processSponsorship:
    processSponsorshipMedia,

  processEndorsement:
    processEndorsementMedia,

  processAward,

  processHallOfFame,

  processRetirement,

  processComeback,

  processInactivity,

  processWeeklyDecay,

  createEvent:
    createMediaEvent,

  addNews,

  getNews,

  markNewsRead,

  updatePersona,

  calculateMarketability,

  getProfile:
    getMediaProfile,

  calculateMediaValue,

  calculateFameRank,

  createSnapshot:
    createMediaSnapshot,

  getHistory:
    getMediaHistory,

  getViralMoments,

  getRivalries,

  getSummary:
    getMediaSummary,

  validate:
    validateMedia,

  reset:
    resetMedia
};
