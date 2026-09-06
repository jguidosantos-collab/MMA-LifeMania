// ============================================================
// MMA LIFE DYNASTY
// MEDIA — FAME ENGINE
// ============================================================
//
// Responsável exclusivamente pela evolução da FAMA.
//
// A fama representa o quanto o lutador é conhecido pelo público.
// Não é a mesma coisa que:
// - reputação
// - seguidores
// - popularidade
// - exposição
//
// Este módulo conversa com database.media, mas permanece
// independente para evitar dependências circulares.
// ============================================================


// ============================================================
// VERSION
// ============================================================

const FAME_VERSION = 1;


// ============================================================
// CONFIGURATION
// ============================================================

const FAME_CONFIG = Object.freeze({
  min: 0,
  max: 100,

  starting: 0,

  weeklyNaturalDecay: 0.004,

  inactivityDecay: 0.008,

  comebackBonus: 0.08,

  fight: {
    win: 2.5,
    loss: -1.5,
    draw: 0.5,

    rankedOpponentBonus: 1.20,
    topOpponentBonus: 1.50,

    finishBonus: 1.20,
    titleBonus: 1.75,
    upsetBonus: 1.50,
    rivalryBonus: 1.25
  },

  finish: {
    ko: 2.5,
    tko: 2.0,
    submission: 2.0
  },

  ranking: {
    top5: 2.5,
    top10: 1.5,
    top15: 0.75
  },

  title: {
    win: 8,
    defense: 5,
    loss: -3
  },

  media: {
    interview: 0.05,
    pressConference: 0.08,
    viral: 2.0,
    social: 0.025
  },

  rivalry: {
    minimum: 0.5,
    maximum: 8
  },

  award: {
    normal: 3,
    hallOfFame: 10
  },

  retirement: {
    announcement: 0
  }
});


// ============================================================
// FAME LEVELS
// ============================================================

const FAME_LEVELS = Object.freeze({
  UNKNOWN: "unknown",
  LOCAL: "local",
  REGIONAL: "regional",
  NATIONAL: "national",
  INTERNATIONAL: "international",
  STAR: "star",
  SUPERSTAR: "superstar",
  LEGEND: "legend"
});


const FAME_LEVEL_LABELS = Object.freeze({
  [FAME_LEVELS.UNKNOWN]:
    "Desconhecido",

  [FAME_LEVELS.LOCAL]:
    "Conhecido localmente",

  [FAME_LEVELS.REGIONAL]:
    "Nome regional",

  [FAME_LEVELS.NATIONAL]:
    "Nome nacional",

  [FAME_LEVELS.INTERNATIONAL]:
    "Nome internacional",

  [FAME_LEVELS.STAR]:
    "Estrela",

  [FAME_LEVELS.SUPERSTAR]:
    "Superestrela",

  [FAME_LEVELS.LEGEND]:
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


function clone(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return value;
  }

  return JSON.parse(
    JSON.stringify(value)
  );
}


function randomId(prefix = "fame") {
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
// DATABASE
// ============================================================

function ensureFame(database = {}) {
  if (
    !database ||
    typeof database !== "object"
  ) {
    database = {};
  }

  if (!database.media) {
    database.media = {};
  }

  if (
    !Number.isFinite(
      Number(database.media.fame)
    )
  ) {
    database.media.fame =
      FAME_CONFIG.starting;
  }

  database.media.fame =
    clamp(
      database.media.fame,
      FAME_CONFIG.min,
      FAME_CONFIG.max
    );

  if (
    !Array.isArray(
      database.media.fameHistory
    )
  ) {
    database.media.fameHistory = [];
  }

  if (
    !database.media.fameStatistics
  ) {
    database.media.fameStatistics = {
      totalGain: 0,
      totalLoss: 0,

      fightWins: 0,
      fightLosses: 0,
      fightDraws: 0,

      finishes: 0,

      titleWins: 0,
      titleDefenses: 0,
      titleLosses: 0,

      upsets: 0,
      rivalries: 0,

      interviews: 0,
      viralMoments: 0,

      awards: 0,

      highestFame:
        database.media.fame
    };
  }

  return database;
}


// ============================================================
// CREATE FAME STATE
// ============================================================

function createFameState(
  startingFame = 0
) {
  return {
    version:
      FAME_VERSION,

    fame:
      clamp(
        startingFame,
        FAME_CONFIG.min,
        FAME_CONFIG.max
      ),

    history: [],

    statistics: {
      totalGain: 0,
      totalLoss: 0,

      fightWins: 0,
      fightLosses: 0,
      fightDraws: 0,

      finishes: 0,

      titleWins: 0,
      titleDefenses: 0,
      titleLosses: 0,

      upsets: 0,
      rivalries: 0,

      interviews: 0,
      viralMoments: 0,

      awards: 0,

      highestFame:
        clamp(
          startingFame,
          0,
          100
        )
    }
  };
}


// ============================================================
// GET / SET
// ============================================================

function getFame(database) {
  database =
    ensureFame(database);

  return clamp(
    database.media.fame,
    FAME_CONFIG.min,
    FAME_CONFIG.max
  );
}


function setFame(
  database,
  value,
  reason = "manual"
) {
  database =
    ensureFame(database);

  const previous =
    getFame(database);

  const next =
    clamp(
      value,
      FAME_CONFIG.min,
      FAME_CONFIG.max
    );

  database.media.fame =
    next;

  const change =
    round(
      next - previous,
      2
    );

  if (change > 0) {
    database.media.fameStatistics
      .totalGain += change;
  }

  if (change < 0) {
    database.media.fameStatistics
      .totalLoss +=
      Math.abs(change);
  }

  database.media.fameStatistics
    .highestFame =
    Math.max(
      database.media.fameStatistics
        .highestFame,
      next
    );

  recordFameHistory(
    database,
    {
      reason,
      previous,
      current: next,
      change
    }
  );

  return next;
}


function addFame(
  database,
  amount,
  reason = "event"
) {
  return setFame(
    database,
    getFame(database) +
      number(amount, 0),
    reason
  );
}


// ============================================================
// FAME LEVEL
// ============================================================

function getFameLevelFromValue(
  fame
) {
  const value =
    number(fame, 0);

  if (value < 5) {
    return FAME_LEVELS.UNKNOWN;
  }

  if (value < 15) {
    return FAME_LEVELS.LOCAL;
  }

  if (value < 30) {
    return FAME_LEVELS.REGIONAL;
  }

  if (value < 45) {
    return FAME_LEVELS.NATIONAL;
  }

  if (value < 65) {
    return FAME_LEVELS.INTERNATIONAL;
  }

  if (value < 80) {
    return FAME_LEVELS.STAR;
  }

  if (value < 95) {
    return FAME_LEVELS.SUPERSTAR;
  }

  return FAME_LEVELS.LEGEND;
}


function getFameLevel(
  database
) {
  return getFameLevelFromValue(
    getFame(database)
  );
}


function getFameLevelLabel(
  database
) {
  return (
    FAME_LEVEL_LABELS[
      getFameLevel(database)
    ] ||
    "Desconhecido"
  );
}


// ============================================================
// OPPONENT IMPACT
// ============================================================

function calculateOpponentBonus(
  opponent = {}
) {
  const opponentFame =
    clamp(
      number(
        opponent.fame ??
          opponent.media?.fame,
        0
      ),
      0,
      100
    );

  const rank =
    integer(
      opponent.rank ??
        opponent.ranking ??
        opponent.rankingPosition,
      999
    );

  let multiplier = 1;

  if (
    opponentFame >= 70
  ) {
    multiplier *=
      FAME_CONFIG
        .fight
        .topOpponentBonus;
  } else if (
    opponentFame >= 45
  ) {
    multiplier *=
      FAME_CONFIG
        .fight
        .rankedOpponentBonus;
  }

  if (
    rank <= 5
  ) {
    multiplier *=
      1.25;
  } else if (
    rank <= 10
  ) {
    multiplier *=
      1.15;
  } else if (
    rank <= 15
  ) {
    multiplier *=
      1.08;
  }

  return round(
    multiplier,
    3
  );
}


// ============================================================
// FIGHT FAME
// ============================================================

function calculateFightFame(
  database,
  options = {}
) {
  database =
    ensureFame(database);

  const outcome =
    String(
      options.outcome ||
      options.result ||
      ""
    ).toLowerCase();

  const method =
    String(
      options.method ||
      ""
    ).toLowerCase();

  const opponent =
    options.opponent ||
    {};

  const title =
    options.title === true ||
    options.isTitleFight === true;

  const upset =
    options.upset === true;

  const rivalry =
    options.rivalry === true;

  let change = 0;

  if (
    outcome === "win" ||
    outcome === "won" ||
    outcome === "victory"
  ) {
    change =
      FAME_CONFIG
        .fight
        .win;

    change *=
      calculateOpponentBonus(
        opponent
      );

  } else if (
    outcome === "loss" ||
    outcome === "lost" ||
    outcome === "defeat"
  ) {
    change =
      FAME_CONFIG
        .fight
        .loss;

    const opponentFame =
      number(
        opponent.fame ??
          opponent.media?.fame,
        0
      );

    if (
      opponentFame >= 70
    ) {
      change *=
        0.55;
    } else if (
      opponentFame >= 45
    ) {
      change *=
        0.75;
    }

  } else {
    change =
      FAME_CONFIG
        .fight
        .draw;
  }

  if (
    [
      "ko",
      "knockout"
    ].includes(method)
  ) {
    change *=
      FAME_CONFIG
        .fight
        .finishBonus;

    change +=
      FAME_CONFIG
        .finish
        .ko;

  } else if (
    method === "tko"
  ) {
    change *=
      FAME_CONFIG
        .fight
        .finishBonus;

    change +=
      FAME_CONFIG
        .finish
        .tko;

  } else if (
    method === "submission" ||
    method === "sub"
  ) {
    change *=
      FAME_CONFIG
        .fight
        .finishBonus;

    change +=
      FAME_CONFIG
        .finish
        .submission;
  }

  if (title) {
    if (
      change > 0
    ) {
      change *=
        FAME_CONFIG
          .fight
          .titleBonus;
    }
  }

  if (upset) {
    change *=
      FAME_CONFIG
        .fight
        .upsetBonus;
  }

  if (rivalry) {
    change *=
      FAME_CONFIG
        .fight
        .rivalryBonus;
  }

  return round(
    change,
    2
  );
}


function processFight(
  database,
  options = {}
) {
  database =
    ensureFame(database);

  const change =
    calculateFightFame(
      database,
      options
    );

  const outcome =
    String(
      options.outcome ||
      options.result ||
      ""
    ).toLowerCase();

  const method =
    String(
      options.method ||
      ""
    ).toLowerCase();

  const opponent =
    options.opponent ||
    {};

  const isFinish =
    [
      "ko",
      "knockout",
      "tko",
      "submission",
      "sub"
    ].includes(method);

  const upset =
    options.upset === true;

  const rivalry =
    options.rivalry === true;

  const title =
    options.title === true ||
    options.isTitleFight === true;

  addFame(
    database,
    change,
    "fight"
  );

  if (
    outcome === "win" ||
    outcome === "won" ||
    outcome === "victory"
  ) {
    database.media.fameStatistics
      .fightWins++;

  } else if (
    outcome === "loss" ||
    outcome === "lost" ||
    outcome === "defeat"
  ) {
    database.media.fameStatistics
      .fightLosses++;

  } else {
    database.media.fameStatistics
      .fightDraws++;
  }

  if (isFinish) {
    database.media.fameStatistics
      .finishes++;
  }

  if (upset) {
    database.media.fameStatistics
      .upsets++;
  }

  if (rivalry) {
    database.media.fameStatistics
      .rivalries++;
  }

  if (title) {
    if (
      change > 0
    ) {
      database.media.fameStatistics
        .titleWins++;
    }
  }

  return {
    change,

    fame:
      getFame(database),

    level:
      getFameLevel(database),

    label:
      getFameLevelLabel(database),

    opponentBonus:
      calculateOpponentBonus(
        opponent
      ),

    finish: isFinish,

    upset,

    rivalry,

    title
  };
}


// ============================================================
// TITLE
// ============================================================

function processTitleWin(
  database,
  titleName = "Título"
) {
  database =
    ensureFame(database);

  const change =
    FAME_CONFIG
      .title
      .win;

  addFame(
    database,
    change,
    "title_win"
  );

  database.media.fameStatistics
    .titleWins++;

  return {
    titleName,

    change,

    fame:
      getFame(database),

    level:
      getFameLevel(database)
  };
}


function processTitleDefense(
  database,
  titleName = "Título"
) {
  database =
    ensureFame(database);

  const change =
    FAME_CONFIG
      .title
      .defense;

  addFame(
    database,
    change,
    "title_defense"
  );

  database.media.fameStatistics
    .titleDefenses++;

  return {
    titleName,

    change,

    fame:
      getFame(database),

    level:
      getFameLevel(database)
  };
}


function processTitleLoss(
  database,
  titleName = "Título"
) {
  database =
    ensureFame(database);

  const change =
    FAME_CONFIG
      .title
      .loss;

  addFame(
    database,
    change,
    "title_loss"
  );

  database.media.fameStatistics
    .titleLosses++;

  return {
    titleName,

    change,

    fame:
      getFame(database),

    level:
      getFameLevel(database)
  };
}


// ============================================================
// RANKING FAME
// ============================================================

function calculateRankingBonus(
  ranking
) {
  const rank =
    integer(
      ranking,
      999
    );

  if (
    rank <= 5
  ) {
    return FAME_CONFIG
      .ranking
      .top5;
  }

  if (
    rank <= 10
  ) {
    return FAME_CONFIG
      .ranking
      .top10;
  }

  if (
    rank <= 15
  ) {
    return FAME_CONFIG
      .ranking
      .top15;
  }

  return 0;
}


function processRankingRise(
  database,
  previousRank,
  newRank
) {
  database =
    ensureFame(database);

  const oldRank =
    integer(
      previousRank,
      999
    );

  const currentRank =
    integer(
      newRank,
      999
    );

  if (
    currentRank >=
    oldRank
  ) {
    return {
      change: 0,
      fame:
        getFame(database)
    };
  }

  const oldBonus =
    calculateRankingBonus(
      oldRank
    );

  const newBonus =
    calculateRankingBonus(
      currentRank
    );

  const change =
    Math.max(
      0,
      newBonus -
        oldBonus
    );

  if (
    change > 0
  ) {
    addFame(
      database,
      change,
      "ranking_rise"
    );
  }

  return {
    previousRank:
      oldRank,

    newRank:
      currentRank,

    change,

    fame:
      getFame(database)
  };
}


// ============================================================
// RIVALRY
// ============================================================

function calculateRivalryFame(
  intensity = 50
) {
  const value =
    clamp(
      intensity,
      0,
      100
    );

  return clamp(
    value *
      0.04,
    FAME_CONFIG
      .rivalry
      .minimum,
    FAME_CONFIG
      .rivalry
      .maximum
  );
}


function processRivalry(
  database,
  intensity = 50
) {
  database =
    ensureFame(database);

  const change =
    calculateRivalryFame(
      intensity
    );

  addFame(
    database,
    change,
    "rivalry"
  );

  database.media.fameStatistics
    .rivalries++;

  return {
    intensity:
      clamp(
        intensity,
        0,
        100
      ),

    change,

    fame:
      getFame(database)
  };
}


// ============================================================
// INTERVIEW
// ============================================================

function processInterview(
  database,
  quality = 50
) {
  database =
    ensureFame(database);

  const value =
    clamp(
      quality,
      0,
      100
    );

  const change =
    round(
      value *
        FAME_CONFIG
          .media
          .interview,
      2
    );

  addFame(
    database,
    change,
    "interview"
  );

  database.media.fameStatistics
    .interviews++;

  return {
    quality:
      value,

    change,

    fame:
      getFame(database)
  };
}


function processPressConference(
  database,
  quality = 50
) {
  database =
    ensureFame(database);

  const value =
    clamp(
      quality,
      0,
      100
    );

  const change =
    round(
      value *
        FAME_CONFIG
          .media
          .pressConference,
      2
    );

  addFame(
    database,
    change,
    "press_conference"
  );

  return {
    quality:
      value,

    change,

    fame:
      getFame(database)
  };
}


// ============================================================
// SOCIAL MEDIA
// ============================================================

function processSocialPost(
  database,
  quality = 50,
  viral = false
) {
  database =
    ensureFame(database);

  const value =
    clamp(
      quality,
      0,
      100
    );

  let change =
    value *
    FAME_CONFIG
      .media
      .social;

  if (viral) {
    change *=
      FAME_CONFIG
        .media
        .viral;

    database.media.fameStatistics
      .viralMoments++;
  }

  change =
    round(
      change,
      2
    );

  addFame(
    database,
    change,
    viral
      ? "viral_social"
      : "social"
  );

  return {
    quality:
      value,

    viral:
      Boolean(viral),

    change,

    fame:
      getFame(database)
  };
}


// ============================================================
// AWARDS
// ============================================================

function processAward(
  database,
  awardName = "Prêmio"
) {
  database =
    ensureFame(database);

  const change =
    FAME_CONFIG
      .award
      .normal;

  addFame(
    database,
    change,
    "award"
  );

  database.media.fameStatistics
    .awards++;

  return {
    awardName,

    change,

    fame:
      getFame(database)
  };
}


function processHallOfFame(
  database
) {
  database =
    ensureFame(database);

  const change =
    FAME_CONFIG
      .award
      .hallOfFame;

  addFame(
    database,
    change,
    "hall_of_fame"
  );

  database.media.fameStatistics
    .awards++;

  return {
    change,

    fame:
      getFame(database),

    level:
      getFameLevel(database)
  };
}


// ============================================================
// INACTIVITY
// ============================================================

function calculateInactivityLoss(
  database,
  weeks = 1
) {
  database =
    ensureFame(database);

  const duration =
    Math.max(
      1,
      integer(
        weeks,
        1
      )
    );

  return round(
    getFame(database) *
      FAME_CONFIG
        .inactivityDecay *
      duration,
    2
  );
}


function processInactivity(
  database,
  weeks = 1
) {
  database =
    ensureFame(database);

  const loss =
    calculateInactivityLoss(
      database,
      weeks
    );

  addFame(
    database,
    -loss,
    "inactivity"
  );

  return {
    weeks:
      Math.max(
        1,
        integer(
          weeks,
          1
        )
      ),

    change:
      -loss,

    fame:
      getFame(database),

    level:
      getFameLevel(database)
  };
}


// ============================================================
// WEEKLY DECAY
// ============================================================

function processWeeklyDecay(
  database
) {
  database =
    ensureFame(database);

  const loss =
    round(
      getFame(database) *
        FAME_CONFIG
          .weeklyNaturalDecay,
      3
    );

  if (
    loss > 0
  ) {
    addFame(
      database,
      -loss,
      "weekly_decay"
    );
  }

  return {
    change:
      -loss,

    fame:
      getFame(database)
  };
}


// ============================================================
// COMEBACK
// ============================================================

function processComeback(
  database
) {
  database =
    ensureFame(database);

  const current =
    getFame(database);

  const change =
    clamp(
      current *
        FAME_CONFIG
          .comebackBonus,
      1,
      8
    );

  addFame(
    database,
    change,
    "comeback"
  );

  return {
    change,

    fame:
      getFame(database),

    level:
      getFameLevel(database)
  };
}


// ============================================================
// FAME MILESTONES
// ============================================================

function getNextFameMilestone(
  database
) {
  const fame =
    getFame(database);

  const milestones = [
    5,
    15,
    30,
    45,
    65,
    80,
    95,
    100
  ];

  const next =
    milestones.find(
      milestone =>
        milestone >
        fame
    );

  if (
    next === undefined
  ) {
    return {
      current: 100,
      next: null,
      remaining: 0,
      progress: 100
    };
  }

  const previous =
    milestones
      .filter(
        milestone =>
          milestone <=
          fame
      )
      .pop() || 0;

  const range =
    next - previous;

  const progress =
    range > 0
      ? (
          (fame - previous) /
          range
        ) *
        100
      : 100;

  return {
    current:
      previous,

    next,

    remaining:
      round(
        next - fame,
        2
      ),

    progress:
      round(
        progress,
        2
      )
  };
}


// ============================================================
// FAME HISTORY
// ============================================================

function recordFameHistory(
  database,
  options = {}
) {
  database =
    ensureFame(database);

  const item = {
    id:
      randomId("famehistory"),

    date:
      getDate(database),

    week:
      getWeek(database),

    year:
      getYear(database),

    reason:
      options.reason ||
      "unknown",

    previous:
      round(
        number(
          options.previous,
          getFame(database)
        ),
        2
      ),

    current:
      round(
        number(
          options.current,
          getFame(database)
        ),
        2
      ),

    change:
      round(
        number(
          options.change,
          0
        ),
        2
      )
  };

  database.media.fameHistory.push(
    item
  );

  while (
    database.media.fameHistory
      .length >
    300
  ) {
    database.media.fameHistory.shift();
  }

  return item;
}


function getFameHistory(
  database,
  limit = 30
) {
  database =
    ensureFame(database);

  return database.media.fameHistory
    .slice(
      -Math.max(
        1,
        integer(
          limit,
          30
        )
      )
    )
    .reverse()
    .map(clone);
}


// ============================================================
// FAME STATISTICS
// ============================================================

function getFameStatistics(
  database
) {
  database =
    ensureFame(database);

  const stats =
    database.media
      .fameStatistics;

  return {
    ...clone(stats),

    currentFame:
      getFame(database),

    level:
      getFameLevel(database),

    levelLabel:
      getFameLevelLabel(database),

    totalNetChange:
      round(
        number(
          stats.totalGain,
          0
        ) -
        number(
          stats.totalLoss,
          0
        ),
        2
      )
  };
}


// ============================================================
// FAME COMPARISON
// ============================================================

function compareFame(
  database,
  otherFame = 0
) {
  const current =
    getFame(database);

  const other =
    clamp(
      otherFame,
      0,
      100
    );

  return {
    current,
    other,

    difference:
      round(
        current - other,
        2
      ),

    ahead:
      current > other,

    behind:
      current < other,

    equal:
      current === other
  };
}


// ============================================================
// FAME PERCENTAGE
// ============================================================

function getFamePercentage(
  database
) {
  return round(
    (
      getFame(database) /
      FAME_CONFIG.max
    ) *
      100,
    2
  );
}


// ============================================================
// VALIDATION
// ============================================================

function validateFame(
  database
) {
  database =
    ensureFame(database);

  const errors = [];

  if (
    !Number.isFinite(
      Number(
        database.media.fame
      )
    )
  ) {
    errors.push(
      "Fama inválida."
    );
  }

  if (
    database.media.fame <
      FAME_CONFIG.min ||
    database.media.fame >
      FAME_CONFIG.max
  ) {
    errors.push(
      "Fama fora do intervalo permitido."
    );
  }

  if (
    !Array.isArray(
      database.media.fameHistory
    )
  ) {
    errors.push(
      "Histórico de fama inválido."
    );
  }

  if (
    !database.media.fameStatistics ||
    typeof database.media
      .fameStatistics !==
      "object"
  ) {
    errors.push(
      "Estatísticas de fama inválidas."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}


// ============================================================
// SNAPSHOT
// ============================================================

function createFameSnapshot(
  database,
  type = "manual"
) {
  database =
    ensureFame(database);

  const snapshot = {
    id:
      randomId("famesnapshot"),

    date:
      getDate(database),

    week:
      getWeek(database),

    year:
      getYear(database),

    type,

    fame:
      getFame(database),

    level:
      getFameLevel(database),

    levelLabel:
      getFameLevelLabel(database),

    percentage:
      getFamePercentage(database),

    milestone:
      getNextFameMilestone(
        database
      )
  };

  recordFameHistory(
    database,
    {
      reason:
        `snapshot:${type}`,

      previous:
        getFame(database),

      current:
        getFame(database),

      change: 0
    }
  );

  return clone(snapshot);
}


// ============================================================
// RESET
// ============================================================

function resetFame(
  database,
  startingFame = 0
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

  const state =
    createFameState(
      startingFame
    );

  database.media.fame =
    state.fame;

  database.media.fameHistory =
    state.history;

  database.media.fameStatistics =
    state.statistics;

  return database.media;
}


// ============================================================
// SUMMARY
// ============================================================

function getFameSummary(
  database
) {
  database =
    ensureFame(database);

  return {
    fame:
      getFame(database),

    level:
      getFameLevel(database),

    levelLabel:
      getFameLevelLabel(database),

    percentage:
      getFamePercentage(database),

    nextMilestone:
      getNextFameMilestone(
        database
      ),

    statistics:
      getFameStatistics(
        database
      )
  };
}


// ============================================================
// EXPORTS
// ============================================================

export {
  FAME_VERSION,

  FAME_CONFIG,

  FAME_LEVELS,

  FAME_LEVEL_LABELS,

  createFameState,

  ensureFame,

  getFame,

  setFame,

  addFame,

  getFameLevelFromValue,

  getFameLevel,

  getFameLevelLabel,

  calculateOpponentBonus,

  calculateFightFame,

  processFight,

  processTitleWin,

  processTitleDefense,

  processTitleLoss,

  calculateRankingBonus,

  processRankingRise,

  calculateRivalryFame,

  processRivalry,

  processInterview,

  processPressConference,

  processSocialPost,

  processAward,

  processHallOfFame,

  calculateInactivityLoss,

  processInactivity,

  processWeeklyDecay,

  processComeback,

  getNextFameMilestone,

  recordFameHistory,

  getFameHistory,

  getFameStatistics,

  compareFame,

  getFamePercentage,

  validateFame,

  createFameSnapshot,

  resetFame,

  getFameSummary
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  version:
    FAME_VERSION,

  config:
    FAME_CONFIG,

  levels:
    FAME_LEVELS,

  create:
    createFameState,

  ensure:
    ensureFame,

  get:
    getFame,

  set:
    setFame,

  add:
    addFame,

  getLevel:
    getFameLevel,

  getLevelLabel:
    getFameLevelLabel,

  calculateFight:
    calculateFightFame,

  processFight,

  processTitleWin,

  processTitleDefense,

  processTitleLoss,

  processRankingRise,

  processRivalry,

  processInterview,

  processPressConference,

  processSocialPost,

  processAward,

  processHallOfFame,

  processInactivity,

  processWeeklyDecay,

  processComeback,

  getNextMilestone:
    getNextFameMilestone,

  getHistory:
    getFameHistory,

  getStatistics:
    getFameStatistics,

  compare:
    compareFame,

  getPercentage:
    getFamePercentage,

  validate:
    validateFame,

  snapshot:
    createFameSnapshot,

  reset:
    resetFame,

  summary:
    getFameSummary
};
