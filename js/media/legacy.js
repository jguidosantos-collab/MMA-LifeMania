// ============================================================
// MMA LIFE DYNASTY
// MEDIA — LEGACY ENGINE
// File: js/media/legacy.js
// Version: 1.0
// ============================================================

const LEGACY_VERSION = 1;

const LEGACY_CONFIG = {
  score: {
    min: 0,
    max: 1000,
    base: 0
  },

  categories: {
    career: 0,
    championships: 0,
    wins: 0,
    qualityWins: 0,
    longevity: 0,
    popularity: 0,
    fame: 0,
    reputation: 0,
    rivalries: 0,
    awards: 0,
    records: 0,
    international: 0,
    dynasty: 0
  },

  points: {
    fight: 1,
    win: 4,
    loss: -1,
    draw: 1,

    majorWin: 8,
    upsetWin: 10,
    koWin: 7,
    submissionWin: 7,

    titleWin: 30,
    titleDefense: 18,
    titleReignWeek: 1,
    interimTitle: 15,

    numberOneRanking: 12,
    topFiveRanking: 7,
    topTenRanking: 4,

    rivalryCreated: 3,
    rivalryHeated: 8,
    rivalryLegendary: 20,

    award: 8,
    majorAward: 15,
    fighterOfYear: 25,
    fightOfYear: 20,
    hallOfFame: 80,

    comeback: 15,
    retirement: 20,
    farewell: 10,

    record: 15,
    recordMajor: 30,

    internationalFight: 5,
    internationalTitle: 25,

    longevityYear: 5,
    generationImpact: 10,
    familyLegacy: 20
  },

  levels: [
    {
      min: 0,
      max: 49,
      id: "unknown",
      label: "Desconhecido"
    },
    {
      min: 50,
      max: 99,
      id: "local",
      label: "Nome Local"
    },
    {
      min: 100,
      max: 199,
      id: "regional",
      label: "Nome Regional"
    },
    {
      min: 200,
      max: 349,
      id: "national",
      label: "Nome Nacional"
    },
    {
      min: 350,
      max: 499,
      id: "international",
      label: "Nome Internacional"
    },
    {
      min: 500,
      max: 649,
      id: "star",
      label: "Estrela"
    },
    {
      min: 650,
      max: 799,
      id: "superstar",
      label: "Superastro"
    },
    {
      min: 800,
      max: 899,
      id: "legend",
      label: "Lenda"
    },
    {
      min: 900,
      max: 1000,
      id: "all_time_great",
      label: "Um dos Maiores da História"
    }
  ],

  hallOfFame: {
    minimumScore: 650,
    minimumAge: 35,
    minimumFights: 15,
    minimumWins: 10
  },

  history: {
    maxEvents: 2000,
    maxAchievements: 500,
    maxRecords: 500
  }
};

// ============================================================
// UTILITIES
// ============================================================

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function safeString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function createId(prefix = "legacy") {
  return `${prefix}_${Date.now()}_${randomInt(1000, 9999)}`;
}

function nowISO() {
  return new Date().toISOString();
}

function getDatabase(database) {
  if (!database || typeof database !== "object") {
    return null;
  }

  return database;
}

function getPlayer(database) {
  return database?.player || null;
}

function getPlayerId(database) {
  const player = getPlayer(database);

  return (
    player?.id ||
    player?.fighterId ||
    player?.identity?.id ||
    "player"
  );
}

function getPlayerName(database) {
  const player = getPlayer(database);

  return (
    player?.name ||
    player?.identity?.name ||
    player?.fullName ||
    "Jogador"
  );
}

// ============================================================
// STATE
// ============================================================

function createLegacyState() {
  return {
    version: LEGACY_VERSION,

    score: 0,

    level: {
      id: "unknown",
      label: "Desconhecido"
    },

    categories: {
      career: 0,
      championships: 0,
      wins: 0,
      qualityWins: 0,
      longevity: 0,
      popularity: 0,
      fame: 0,
      reputation: 0,
      rivalries: 0,
      awards: 0,
      records: 0,
      international: 0,
      dynasty: 0
    },

    achievements: [],

    records: [],

    milestones: [],

    history: [],

    hallOfFame: {
      eligible: false,
      inducted: false,
      inductionDate: null,
      inductionYear: null,
      inductionReason: null
    },

    postCareer: {
      path: null,
      achievements: [],
      influence: 0
    },

    dynastyImpact: {
      childrenInspired: 0,
      descendantsInspired: 0,
      familyReputation: 0,
      inheritedLegacy: 0,
      generationsImpacted: 0
    },

    statistics: {
      fights: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      titles: 0,
      titleWins: 0,
      titleDefenses: 0,
      awards: 0,
      records: 0,
      rivalries: 0,
      yearsActive: 0
    },

    lastUpdated: nowISO()
  };
}

function ensureLegacy(database) {
  const db = getDatabase(database);

  if (!db) {
    return createLegacyState();
  }

  if (!db.media) {
    db.media = {};
  }

  if (!db.media.legacy) {
    db.media.legacy = createLegacyState();
  }

  const state = db.media.legacy;

  if (!state.version) {
    state.version = LEGACY_VERSION;
  }

  if (!state.categories) {
    state.categories = {};
  }

  for (const key of Object.keys(LEGACY_CONFIG.categories)) {
    if (typeof state.categories[key] !== "number") {
      state.categories[key] = 0;
    }
  }

  if (!Array.isArray(state.achievements)) {
    state.achievements = [];
  }

  if (!Array.isArray(state.records)) {
    state.records = [];
  }

  if (!Array.isArray(state.milestones)) {
    state.milestones = [];
  }

  if (!Array.isArray(state.history)) {
    state.history = [];
  }

  if (!state.hallOfFame) {
    state.hallOfFame = createLegacyState().hallOfFame;
  }

  if (!state.postCareer) {
    state.postCareer = createLegacyState().postCareer;
  }

  if (!state.dynastyImpact) {
    state.dynastyImpact = createLegacyState().dynastyImpact;
  }

  if (!state.statistics) {
    state.statistics = createLegacyState().statistics;
  }

  state.score = clamp(
    state.score,
    LEGACY_CONFIG.score.min,
    LEGACY_CONFIG.score.max
  );

  updateLegacyLevel(database);

  return state;
}

// ============================================================
// LEVELS
// ============================================================

function getLegacyLevel(score) {
  const value = clamp(
    score,
    LEGACY_CONFIG.score.min,
    LEGACY_CONFIG.score.max
  );

  return (
    LEGACY_CONFIG.levels.find(
      level => value >= level.min && value <= level.max
    ) ||
    LEGACY_CONFIG.levels[0]
  );
}

function getLegacyLevelId(database) {
  return ensureLegacy(database).level.id;
}

function getLegacyLevelLabel(database) {
  return ensureLegacy(database).level.label;
}

function updateLegacyLevel(database) {
  const state = ensureLegacy(database);
  const level = getLegacyLevel(state.score);

  state.level = {
    id: level.id,
    label: level.label
  };

  return state.level;
}

// ============================================================
// SCORE
// ============================================================

function getLegacyScore(database) {
  return ensureLegacy(database).score;
}

function setLegacyScore(database, value) {
  const state = ensureLegacy(database);

  state.score = clamp(
    value,
    LEGACY_CONFIG.score.min,
    LEGACY_CONFIG.score.max
  );

  updateLegacyLevel(database);
  state.lastUpdated = nowISO();

  return state.score;
}

function addLegacyScore(database, amount, category = "career", reason = "") {
  const state = ensureLegacy(database);

  const value = Number(amount) || 0;

  state.score = clamp(
    state.score + value,
    LEGACY_CONFIG.score.min,
    LEGACY_CONFIG.score.max
  );

  if (Object.prototype.hasOwnProperty.call(state.categories, category)) {
    state.categories[category] = Math.max(
      0,
      Number(state.categories[category] || 0) + value
    );
  }

  addLegacyHistory(database, {
    type: "score",
    category,
    amount: value,
    reason
  });

  updateLegacyLevel(database);

  state.lastUpdated = nowISO();

  return state.score;
}

// ============================================================
// HISTORY
// ============================================================

function addLegacyHistory(database, event = {}) {
  const state = ensureLegacy(database);

  state.history.push({
    id: event.id || createId("legacy_event"),
    timestamp: event.timestamp || nowISO(),
    type: safeString(event.type, "event"),
    category: safeString(event.category, "career"),
    amount: Number(event.amount) || 0,
    reason: safeString(event.reason),
    description: safeString(event.description),
    data: event.data || {}
  });

  if (state.history.length > LEGACY_CONFIG.history.maxEvents) {
    state.history.splice(
      0,
      state.history.length - LEGACY_CONFIG.history.maxEvents
    );
  }

  return state.history[state.history.length - 1];
}

function getLegacyHistory(database, limit = 50) {
  const state = ensureLegacy(database);

  return state.history.slice(-Math.max(1, Number(limit) || 1)).reverse();
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

function addAchievement(database, achievement = {}) {
  const state = ensureLegacy(database);

  const entry = {
    id: achievement.id || createId("achievement"),
    date: achievement.date || nowISO(),
    type: safeString(achievement.type, "career"),
    title: safeString(achievement.title, "Grande feito"),
    description: safeString(
      achievement.description,
      "Feito importante na carreira."
    ),
    level: safeString(achievement.level, "career"),
    points: Number(achievement.points) || 0,
    data: achievement.data || {}
  };

  state.achievements.push(entry);

  if (
    state.achievements.length >
    LEGACY_CONFIG.history.maxAchievements
  ) {
    state.achievements.splice(
      0,
      state.achievements.length -
        LEGACY_CONFIG.history.maxAchievements
    );
  }

  if (entry.points !== 0) {
    addLegacyScore(
      database,
      entry.points,
      achievement.category || "career",
      entry.title
    );
  }

  return entry;
}

function getAchievements(database, limit = 100) {
  const state = ensureLegacy(database);

  return state.achievements
    .slice(-Math.max(1, Number(limit) || 1))
    .reverse();
}

function getAchievementCount(database) {
  return ensureLegacy(database).achievements.length;
}

// ============================================================
// RECORDS
// ============================================================

function addRecord(database, record = {}) {
  const state = ensureLegacy(database);

  const entry = {
    id: record.id || createId("record"),
    date: record.date || nowISO(),
    type: safeString(record.type, "career"),
    title: safeString(record.title, "Novo recorde"),
    description: safeString(
      record.description,
      "Recorde alcançado."
    ),
    value: Number(record.value) || 0,
    previousValue:
      record.previousValue !== undefined
        ? Number(record.previousValue)
        : null,
    major: Boolean(record.major),
    points:
      Number(record.points) ||
      (record.major
        ? LEGACY_CONFIG.points.recordMajor
        : LEGACY_CONFIG.points.record),
    data: record.data || {}
  };

  state.records.push(entry);
  state.statistics.records += 1;

  if (state.records.length > LEGACY_CONFIG.history.maxRecords) {
    state.records.splice(
      0,
      state.records.length - LEGACY_CONFIG.history.maxRecords
    );
  }

  addLegacyScore(
    database,
    entry.points,
    "records",
    entry.title
  );

  addLegacyHistory(database, {
    type: "record",
    category: "records",
    amount: entry.points,
    reason: entry.title,
    description: entry.description,
    data: entry
  });

  return entry;
}

function getRecords(database, limit = 100) {
  const state = ensureLegacy(database);

  return state.records
    .slice(-Math.max(1, Number(limit) || 1))
    .reverse();
}

// ============================================================
// MILESTONES
// ============================================================

function addMilestone(database, milestone = {}) {
  const state = ensureLegacy(database);

  const entry = {
    id: milestone.id || createId("milestone"),
    date: milestone.date || nowISO(),
    type: safeString(milestone.type, "career"),
    title: safeString(milestone.title, "Marco alcançado"),
    description: safeString(milestone.description),
    value: milestone.value ?? null,
    points: Number(milestone.points) || 0,
    data: milestone.data || {}
  };

  state.milestones.push(entry);

  if (entry.points) {
    addLegacyScore(
      database,
      entry.points,
      milestone.category || "career",
      entry.title
    );
  }

  return entry;
}

function hasMilestone(database, type) {
  return ensureLegacy(database).milestones.some(
    milestone => milestone.type === type
  );
}

function getMilestones(database) {
  return [...ensureLegacy(database).milestones].reverse();
}

// ============================================================
// FIGHT IMPACT
// ============================================================

function processFight(database, result = {}) {
  const state = ensureLegacy(database);

  const outcome = safeString(
    result.result || result.outcome
  ).toLowerCase();

  const isWin =
    outcome === "win" ||
    outcome === "victory" ||
    outcome === "vitoria" ||
    outcome === "vitória";

  const isLoss =
    outcome === "loss" ||
    outcome === "defeat" ||
    outcome === "derrota";

  const isDraw =
    outcome === "draw" ||
    outcome === "empate";

  state.statistics.fights += 1;

  addLegacyScore(
    database,
    LEGACY_CONFIG.points.fight,
    "career",
    "Luta realizada"
  );

  if (isWin) {
    state.statistics.wins += 1;

    addLegacyScore(
      database,
      LEGACY_CONFIG.points.win,
      "wins",
      "Vitória"
    );
  }

  if (isLoss) {
    state.statistics.losses += 1;

    addLegacyScore(
      database,
      LEGACY_CONFIG.points.loss,
      "wins",
      "Derrota"
    );
  }

  if (isDraw) {
    state.statistics.draws += 1;

    addLegacyScore(
      database,
      LEGACY_CONFIG.points.draw,
      "wins",
      "Empate"
    );
  }

  if (result.majorWin && isWin) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.majorWin,
      "qualityWins",
      "Vitória importante"
    );
  }

  if (result.upset && isWin) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.upsetWin,
      "qualityWins",
      "Upset"
    );
  }

  const method = safeString(
    result.method || result.finish
  ).toLowerCase();

  if (isWin && method.includes("ko")) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.koWin,
      "qualityWins",
      "Vitória por KO"
    );
  }

  if (
    isWin &&
    (
      method.includes("submission") ||
      method.includes("finalização") ||
      method.includes("finalizacao")
    )
  ) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.submissionWin,
      "qualityWins",
      "Vitória por finalização"
    );
  }

  if (result.international) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.internationalFight,
      "international",
      "Luta internacional"
    );
  }

  addLegacyHistory(database, {
    type: "fight",
    category: "career",
    amount: 0,
    reason: outcome || "fight",
    description: isWin
      ? "Vitória adicionada ao legado."
      : isLoss
        ? "Derrota registrada no legado."
        : "Resultado registrado no legado.",
    data: result
  });

  return state;
}

// ============================================================
// CHAMPIONSHIP IMPACT
// ============================================================

function processTitleWin(database, data = {}) {
  const state = ensureLegacy(database);

  state.statistics.titles += 1;
  state.statistics.titleWins += 1;

  addLegacyScore(
    database,
    LEGACY_CONFIG.points.titleWin,
    "championships",
    "Conquista de título"
  );

  if (data.interim) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.interimTitle,
      "championships",
      "Título interino"
    );
  }

  if (data.international) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.internationalTitle,
      "international",
      "Título internacional"
    );
  }

  addAchievement(database, {
    type: "title",
    category: "championships",
    title: data.title || "Campeão",
    description:
      data.description ||
      "Conquistou um título importante.",
    level: data.level || "elite",
    points: 0,
    data
  });

  return state.score;
}

function processTitleDefense(database, data = {}) {
  const state = ensureLegacy(database);

  state.statistics.titleDefenses += 1;

  addLegacyScore(
    database,
    LEGACY_CONFIG.points.titleDefense,
    "championships",
    "Defesa de título"
  );

  return state.score;
}

function processTitleReignWeek(database, weeks = 1) {
  const amount =
    Math.max(0, Number(weeks) || 0) *
    LEGACY_CONFIG.points.titleReignWeek;

  return addLegacyScore(
    database,
    amount,
    "championships",
    `${weeks} semana(s) como campeão`
  );
}

// ============================================================
// RANKINGS
// ============================================================

function processRanking(database, rank) {
  const value = Number(rank);

  if (!Number.isFinite(value) || value <= 0) {
    return ensureLegacy(database).score;
  }

  if (value === 1) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.numberOneRanking,
      "career",
      "Número 1 do ranking"
    );
  } else if (value <= 5) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.topFiveRanking,
      "career",
      "Top 5 do ranking"
    );
  } else if (value <= 10) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.topTenRanking,
      "career",
      "Top 10 do ranking"
    );
  }

  return ensureLegacy(database).score;
}

// ============================================================
// RIVALRIES
// ============================================================

function processRivalry(database, rivalry = {}) {
  const state = ensureLegacy(database);

  state.statistics.rivalries += 1;

  addLegacyScore(
    database,
    LEGACY_CONFIG.points.rivalryCreated,
    "rivalries",
    "Rivalidade criada"
  );

  const intensity = Number(
    rivalry.intensity || rivalry.heat || 0
  );

  if (intensity >= 80) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.rivalryLegendary,
      "rivalries",
      "Rivalidade lendária"
    );
  } else if (intensity >= 60) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.rivalryHeated,
      "rivalries",
      "Rivalidade acirrada"
    );
  }

  return state.score;
}

// ============================================================
// AWARDS
// ============================================================

function processAward(database, award = {}) {
  const state = ensureLegacy(database);

  state.statistics.awards += 1;

  let points = LEGACY_CONFIG.points.award;

  if (award.major) {
    points = LEGACY_CONFIG.points.majorAward;
  }

  const type = safeString(
    award.type
  ).toLowerCase();

  if (
    type.includes("fighter_of_year") ||
    type.includes("fighter of the year") ||
    type.includes("lutador do ano")
  ) {
    points = LEGACY_CONFIG.points.fighterOfYear;
  }

  if (
    type.includes("fight_of_year") ||
    type.includes("fight of the year") ||
    type.includes("luta do ano")
  ) {
    points = LEGACY_CONFIG.points.fightOfYear;
  }

  addLegacyScore(
    database,
    points,
    "awards",
    award.title || "Prêmio recebido"
  );

  addAchievement(database, {
    type: "award",
    category: "awards",
    title: award.title || "Prêmio",
    description:
      award.description ||
      "Reconhecimento recebido na carreira.",
    level: award.level || "national",
    points: 0,
    data: award
  });

  return state.score;
}

function processHallOfFame(database, data = {}) {
  const state = ensureLegacy(database);

  if (state.hallOfFame.inducted) {
    return false;
  }

  state.hallOfFame.inducted = true;
  state.hallOfFame.eligible = true;
  state.hallOfFame.inductionDate = nowISO();
  state.hallOfFame.inductionYear =
    getCurrentYear(database);
  state.hallOfFame.inductionReason =
    data.reason ||
    "Carreira de destaque histórico.";

  addLegacyScore(
    database,
    LEGACY_CONFIG.points.hallOfFame,
    "awards",
    "Hall da Fama"
  );

  addAchievement(database, {
    type: "hall_of_fame",
    category: "awards",
    title: "Hall da Fama",
    description:
      "Foi introduzido ao Hall da Fama.",
    level: "legendary",
    points: 0,
    data
  });

  return true;
}

// ============================================================
// FAME / POPULARITY / REPUTATION
// ============================================================

function syncMediaLegacy(database) {
  const state = ensureLegacy(database);
  const media = database?.media || {};

  const fame =
    Number(media.fame?.score) ||
    Number(media.fame) ||
    0;

  const popularity =
    Number(media.popularity?.score) ||
    Number(media.popularity) ||
    0;

  const reputation =
    Number(media.reputation?.overall) ||
    Number(media.reputation?.score) ||
    Number(media.reputation) ||
    0;

  const famePoints = fame * 0.4;
  const popularityPoints = popularity * 0.4;
  const reputationPoints = reputation * 0.2;

  const calculated =
    famePoints +
    popularityPoints +
    reputationPoints;

  state.categories.fame = famePoints;
  state.categories.popularity = popularityPoints;
  state.categories.reputation = reputationPoints;

  return calculated;
}

function applyMediaLegacyImpact(database) {
  const mediaScore = syncMediaLegacy(database);

  const state = ensureLegacy(database);

  const nonMediaScore =
    state.score -
    (
      state.categories.fame +
      state.categories.popularity +
      state.categories.reputation
    );

  state.score = clamp(
    nonMediaScore + mediaScore,
    LEGACY_CONFIG.score.min,
    LEGACY_CONFIG.score.max
  );

  updateLegacyLevel(database);

  return state.score;
}

// ============================================================
// LONGEVITY
// ============================================================

function processLongevity(database, years = 1) {
  const value = Math.max(0, Number(years) || 0);

  const points =
    value * LEGACY_CONFIG.points.longevityYear;

  const state = ensureLegacy(database);

  state.statistics.yearsActive += value;

  return addLegacyScore(
    database,
    points,
    "longevity",
    `${value} ano(s) de carreira`
  );
}

// ============================================================
// RETIREMENT
// ============================================================

function processRetirement(database, data = {}) {
  const state = ensureLegacy(database);

  addLegacyScore(
    database,
    LEGACY_CONFIG.points.retirement,
    "career",
    "Aposentadoria"
  );

  if (data.farewell) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.farewell,
      "career",
      "Luta de despedida"
    );
  }

  if (data.comeback) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.comeback,
      "longevity",
      "Retorno após aposentadoria"
    );
  }

  addAchievement(database, {
    type: "retirement",
    category: "career",
    title: "Fim de carreira",
    description:
      data.description ||
      "Encerrou sua carreira como lutador.",
    level: "career",
    points: 0,
    data
  });

  return state.score;
}

// ============================================================
// DYNASTY
// ============================================================

function processDynastyImpact(database, data = {}) {
  const state = ensureLegacy(database);

  const generations =
    Number(data.generationsImpacted) || 0;

  const children =
    Number(data.childrenInspired) || 0;

  const descendants =
    Number(data.descendantsInspired) || 0;

  const familyReputation =
    Number(data.familyReputation) || 0;

  state.dynastyImpact.generationsImpacted += generations;
  state.dynastyImpact.childrenInspired += children;
  state.dynastyImpact.descendantsInspired += descendants;
  state.dynastyImpact.familyReputation =
    clamp(
      state.dynastyImpact.familyReputation +
        familyReputation,
      0,
      100
    );

  if (generations > 0) {
    addLegacyScore(
      database,
      generations *
        LEGACY_CONFIG.points.generationImpact,
      "dynasty",
      "Impacto entre gerações"
    );
  }

  if (children > 0 || descendants > 0) {
    addLegacyScore(
      database,
      LEGACY_CONFIG.points.familyLegacy,
      "dynasty",
      "Legado familiar"
    );
  }

  return state.score;
}

function getDynastyImpact(database) {
  return {
    ...ensureLegacy(database).dynastyImpact
  };
}

// ============================================================
// POST CAREER
// ============================================================

function setPostCareerPath(database, path) {
  const state = ensureLegacy(database);

  state.postCareer.path = safeString(path, null);

  addLegacyHistory(database, {
    type: "post_career",
    category: "career",
    amount: 0,
    reason: "Novo caminho pós-carreira",
    description: `Caminho escolhido: ${state.postCareer.path}.`
  });

  return state.postCareer.path;
}

function addPostCareerAchievement(database, achievement = {}) {
  const state = ensureLegacy(database);

  const entry = {
    id: achievement.id || createId("postcareer"),
    date: achievement.date || nowISO(),
    title: safeString(
      achievement.title,
      "Conquista pós-carreira"
    ),
    description: safeString(
      achievement.description
    ),
    points: Number(achievement.points) || 0,
    data: achievement.data || {}
  };

  state.postCareer.achievements.push(entry);

  state.postCareer.influence = clamp(
    state.postCareer.influence +
      Math.max(0, entry.points),
    0,
    1000
  );

  addLegacyScore(
    database,
    entry.points,
    "legacy",
    entry.title
  );

  return entry;
}

// ============================================================
// LEGACY SCORE CALCULATION
// ============================================================

function calculateLegacyFromCareer(database) {
  const state = ensureLegacy(database);

  const stats = state.statistics;

  let score = 0;

  score += stats.fights * LEGACY_CONFIG.points.fight;
  score += stats.wins * LEGACY_CONFIG.points.win;
  score += stats.losses * LEGACY_CONFIG.points.loss;
  score += stats.draws * LEGACY_CONFIG.points.draw;

  score +=
    stats.titleWins *
    LEGACY_CONFIG.points.titleWin;

  score +=
    stats.titleDefenses *
    LEGACY_CONFIG.points.titleDefense;

  score +=
    stats.awards *
    LEGACY_CONFIG.points.award;

  score +=
    stats.records *
    LEGACY_CONFIG.points.record;

  score +=
    stats.rivalries *
    LEGACY_CONFIG.points.rivalryCreated;

  score +=
    stats.yearsActive *
    LEGACY_CONFIG.points.longevityYear;

  return clamp(
    score,
    LEGACY_CONFIG.score.min,
    LEGACY_CONFIG.score.max
  );
}

function recalculateLegacy(database) {
  const state = ensureLegacy(database);

  const careerScore =
    calculateLegacyFromCareer(database);

  const achievementsScore =
    state.achievements.reduce(
      (total, achievement) =>
        total + (Number(achievement.points) || 0),
      0
    );

  const recordsScore =
    state.records.reduce(
      (total, record) =>
        total + (Number(record.points) || 0),
      0
    );

  const dynastyScore =
    state.categories.dynasty || 0;

  const mediaScore =
    syncMediaLegacy(database);

  const total =
    careerScore +
    achievementsScore +
    recordsScore +
    dynastyScore +
    mediaScore;

  state.score = clamp(
    total,
    LEGACY_CONFIG.score.min,
    LEGACY_CONFIG.score.max
  );

  updateLegacyLevel(database);

  state.lastUpdated = nowISO();

  return state.score;
}

// ============================================================
// HALL OF FAME ELIGIBILITY
// ============================================================

function getCurrentAge(database) {
  const player = getPlayer(database);

  return Number(
    player?.age ||
    player?.identity?.age ||
    database?.meta?.age ||
    0
  );
}

function getCurrentYear(database) {
  return Number(
    database?.meta?.currentYear ||
    database?.calendar?.currentYear ||
    database?.year ||
    1
  );
}

function checkHallOfFameEligibility(database) {
  const state = ensureLegacy(database);

  const age = getCurrentAge(database);
  const fights = state.statistics.fights;
  const wins = state.statistics.wins;
  const score = state.score;

  const scoreEligible =
    score >= LEGACY_CONFIG.hallOfFame.minimumScore;

  const careerEligible =
    fights >= LEGACY_CONFIG.hallOfFame.minimumFights &&
    wins >= LEGACY_CONFIG.hallOfFame.minimumWins;

  const ageEligible =
    age >= LEGACY_CONFIG.hallOfFame.minimumAge ||
    database?.career?.retired === true ||
    database?.career?.retirement?.active === true;

  state.hallOfFame.eligible =
    scoreEligible &&
    careerEligible &&
    ageEligible;

  return state.hallOfFame.eligible;
}

function autoInductHallOfFame(database) {
  const eligible =
    checkHallOfFameEligibility(database);

  if (!eligible) {
    return false;
  }

  const state = ensureLegacy(database);

  if (state.hallOfFame.inducted) {
    return false;
  }

  return processHallOfFame(database, {
    reason:
      "Critérios históricos de carreira atingidos."
  });
}

// ============================================================
// MILESTONE CHECKS
// ============================================================

function checkLegacyMilestones(database) {
  const state = ensureLegacy(database);

  const milestones = [
    {
      type: "first_win",
      condition: state.statistics.wins >= 1,
      title: "Primeira vitória",
      description:
        "A primeira vitória profissional foi registrada no legado.",
      points: 5
    },
    {
      type: "ten_wins",
      condition: state.statistics.wins >= 10,
      title: "10 vitórias",
      description:
        "Alcançou 10 vitórias na carreira.",
      points: 10
    },
    {
      type: "twenty_wins",
      condition: state.statistics.wins >= 20,
      title: "20 vitórias",
      description:
        "Alcançou 20 vitórias na carreira.",
      points: 15
    },
    {
      type: "fifty_wins",
      condition: state.statistics.wins >= 50,
      title: "50 vitórias",
      description:
        "Alcançou 50 vitórias na carreira.",
      points: 30
    },
    {
      type: "first_title",
      condition: state.statistics.titleWins >= 1,
      title: "Primeiro título",
      description:
        "Conquistou o primeiro cinturão.",
      points: 20
    },
    {
      type: "five_defenses",
      condition: state.statistics.titleDefenses >= 5,
      title: "Cinco defesas de título",
      description:
        "Defendeu um título cinco vezes.",
      points: 25
    },
    {
      type: "legend",
      condition: state.score >= 800,
      title: "Status de Lenda",
      description:
        "O legado alcançou o nível de Lenda.",
      points: 20
    },
    {
      type: "all_time_great",
      condition: state.score >= 900,
      title: "Um dos maiores da história",
      description:
        "Entrou na elite histórica do MMA.",
      points: 30
    }
  ];

  const created = [];

  for (const milestone of milestones) {
    if (
      milestone.condition &&
      !hasMilestone(database, milestone.type)
    ) {
      created.push(
        addMilestone(database, {
          type: milestone.type,
          category: "career",
          title: milestone.title,
          description: milestone.description,
          points: milestone.points
        })
      );
    }
  }

  checkHallOfFameEligibility(database);

  return created;
}

// ============================================================
// COMPARISON
// ============================================================

function compareLegacy(database, other = {}) {
  const state = ensureLegacy(database);

  const otherScore =
    Number(
      other.score ??
      other.legacyScore ??
      other.legacy?.score
    ) || 0;

  const difference =
    state.score - otherScore;

  return {
    playerScore: state.score,
    otherScore,
    difference,
    playerAhead: difference > 0,
    tied: difference === 0,
    percentage:
      otherScore > 0
        ? Number(
            ((state.score / otherScore) * 100).toFixed(2)
          )
        : state.score > 0
          ? 100
          : 0
  };
}

// ============================================================
// NEXT LEVEL
// ============================================================

function getNextLegacyLevel(database) {
  const state = ensureLegacy(database);

  const current = getLegacyLevel(state.score);

  const next =
    LEGACY_CONFIG.levels.find(
      level => level.min > current.max
    ) || null;

  if (!next) {
    return {
      current,
      next: null,
      pointsNeeded: 0,
      progress: 100
    };
  }

  const range =
    next.min - current.min;

  const progress =
    range > 0
      ? clamp(
          ((state.score - current.min) / range) * 100,
          0,
          100
        )
      : 100;

  return {
    current,
    next,
    pointsNeeded: Math.max(
      0,
      next.min - state.score
    ),
    progress
  };
}

// ============================================================
// PROFILE
// ============================================================

function getLegacyProfile(database) {
  const state = ensureLegacy(database);

  return {
    score: state.score,
    level: {
      ...state.level
    },

    statistics: {
      ...state.statistics
    },

    hallOfFame: {
      ...state.hallOfFame
    },

    categories: {
      ...state.categories
    },

    achievementsCount:
      state.achievements.length,

    recordsCount:
      state.records.length,

    milestonesCount:
      state.milestones.length,

    dynastyImpact: {
      ...state.dynastyImpact
    },

    postCareer: {
      ...state.postCareer,
      achievements: [
        ...state.postCareer.achievements
      ]
    },

    nextLevel: getNextLegacyLevel(database),

    lastUpdated: state.lastUpdated
  };
}

// ============================================================
// SUMMARY
// ============================================================

function getLegacySummary(database) {
  const state = ensureLegacy(database);

  return {
    name: getPlayerName(database),
    score: state.score,
    level: state.level.label,
    levelId: state.level.id,
    hallOfFame:
      state.hallOfFame.inducted,
    hallOfFameEligible:
      state.hallOfFame.eligible,
    fights:
      state.statistics.fights,
    wins:
      state.statistics.wins,
    titles:
      state.statistics.titleWins,
    defenses:
      state.statistics.titleDefenses,
    awards:
      state.statistics.awards,
    records:
      state.statistics.records,
    achievements:
      state.achievements.length,
    nextLevel:
      getNextLegacyLevel(database)
  };
}

// ============================================================
// SNAPSHOT
// ============================================================

function getLegacySnapshot(database) {
  const state = ensureLegacy(database);

  return JSON.parse(
    JSON.stringify(state)
  );
}

// ============================================================
// VALIDATION
// ============================================================

function validateLegacy(database) {
  const state = ensureLegacy(database);

  const errors = [];
  const warnings = [];

  if (
    !Number.isFinite(state.score) ||
    state.score < 0 ||
    state.score > 1000
  ) {
    errors.push(
      "Legacy score inválido."
    );
  }

  if (!state.level || !state.level.id) {
    errors.push(
      "Nível de legado ausente."
    );
  }

  if (!Array.isArray(state.achievements)) {
    errors.push(
      "Lista de conquistas inválida."
    );
  }

  if (!Array.isArray(state.records)) {
    errors.push(
      "Lista de recordes inválida."
    );
  }

  if (
    state.statistics.fights > 0 &&
    state.statistics.wins +
      state.statistics.losses +
      state.statistics.draws >
      state.statistics.fights
  ) {
    warnings.push(
      "Resultados da carreira podem estar inconsistentes."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================================
// RESET
// ============================================================

function resetLegacy(database) {
  const db = getDatabase(database);

  if (!db) {
    return createLegacyState();
  }

  db.media = db.media || {};
  db.media.legacy = createLegacyState();

  return db.media.legacy;
}

// ============================================================
// API
// ============================================================

const legacyAPI = {
  LEGACY_VERSION,
  LEGACY_CONFIG,

  createLegacyState,
  ensureLegacy,

  getLegacyLevel,
  getLegacyLevelId,
  getLegacyLevelLabel,
  updateLegacyLevel,

  getLegacyScore,
  setLegacyScore,
  addLegacyScore,

  addLegacyHistory,
  getLegacyHistory,

  addAchievement,
  getAchievements,
  getAchievementCount,

  addRecord,
  getRecords,

  addMilestone,
  hasMilestone,
  getMilestones,

  processFight,

  processTitleWin,
  processTitleDefense,
  processTitleReignWeek,

  processRanking,

  processRivalry,

  processAward,
  processHallOfFame,

  syncMediaLegacy,
  applyMediaLegacyImpact,

  processLongevity,
  processRetirement,

  processDynastyImpact,
  getDynastyImpact,

  setPostCareerPath,
  addPostCareerAchievement,

  calculateLegacyFromCareer,
  recalculateLegacy,

  getCurrentAge,
  getCurrentYear,

  checkHallOfFameEligibility,
  autoInductHallOfFame,

  checkLegacyMilestones,

  compareLegacy,

  getNextLegacyLevel,

  getLegacyProfile,
  getLegacySummary,
  getLegacySnapshot,

  validateLegacy,

  resetLegacy
};

export {
  LEGACY_VERSION,
  LEGACY_CONFIG,

  createLegacyState,
  ensureLegacy,

  getLegacyLevel,
  getLegacyLevelId,
  getLegacyLevelLabel,
  updateLegacyLevel,

  getLegacyScore,
  setLegacyScore,
  addLegacyScore,

  addLegacyHistory,
  getLegacyHistory,

  addAchievement,
  getAchievements,
  getAchievementCount,

  addRecord,
  getRecords,

  addMilestone,
  hasMilestone,
  getMilestones,

  processFight,

  processTitleWin,
  processTitleDefense,
  processTitleReignWeek,

  processRanking,

  processRivalry,

  processAward,
  processHallOfFame,

  syncMediaLegacy,
  applyMediaLegacyImpact,

  processLongevity,
  processRetirement,

  processDynastyImpact,
  getDynastyImpact,

  setPostCareerPath,
  addPostCareerAchievement,

  calculateLegacyFromCareer,
  recalculateLegacy,

  getCurrentAge,
  getCurrentYear,

  checkHallOfFameEligibility,
  autoInductHallOfFame,

  checkLegacyMilestones,

  compareLegacy,

  getNextLegacyLevel,

  getLegacyProfile,
  getLegacySummary,
  getLegacySnapshot,

  validateLegacy,

  resetLegacy
};

export default legacyAPI;
