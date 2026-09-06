/* ============================================================
   MMA LIFE DYNASTY
   MEDIA — NEWS ENGINE
   ------------------------------------------------------------
   Sistema completo de notícias do mundo do MMA.

   Responsabilidades:
   - Gerar notícias dinamicamente
   - Manchetes e textos variados
   - Notícias do jogador
   - Notícias de outros lutadores
   - Lutas e resultados
   - Títulos
   - Rankings
   - Contratos
   - Patrocínios
   - Rivalidades
   - Controvérsias
   - Redes sociais
   - Mudanças de organização
   - Lesões
   - Aposentadoria
   - Retorno
   - Prêmios / Hall da Fama
   - Família / Dinastia
   - Feed de notícias
   - Notícias em alta
   - Impacto e alcance
   - Histórico e estatísticas

   Este módulo é propositalmente independente.
============================================================ */

const NEWS_VERSION = 1;

/* ============================================================
   CONFIGURAÇÃO
============================================================ */

const NEWS_CONFIG = {
    maxNews: 500,
    maxHistory: 1000,
    recentLimit: 30,
    trendingLimit: 10,

    importance: {
        MIN: 1,
        MAX: 100
    },

    reach: {
        base: 100,
        fameMultiplier: 18,
        popularityMultiplier: 15,
        followersMultiplier: 0.0025,
        reputationMultiplier: 8,
        marketabilityMultiplier: 12
    },

    decay: {
        weekly: 0.82,
        minimumImportance: 1
    },

    sources: [
        "MMA Global News",
        "MMA World",
        "Fight Report",
        "Combat Daily",
        "MMA Insider",
        "Fight Central",
        "Octagon News",
        "Combat Sports Network",
        "MMA Press",
        "World Combat Media"
    ]
};

/* ============================================================
   CATEGORIAS
============================================================ */

const NEWS_CATEGORIES = {
    FIGHT: "fight",
    TITLE: "title",
    RANKING: "ranking",
    CONTRACT: "contract",
    PROMOTION: "promotion",
    SPONSOR: "sponsor",
    RIVALRY: "rivalry",
    CONTROVERSY: "controversy",
    SOCIAL: "social",
    TRAINING: "training",
    INJURY: "injury",
    RETIREMENT: "retirement",
    COMEBACK: "comeback",
    AWARD: "award",
    LEGACY: "legacy",
    FAMILY: "family",
    DYNASTY: "dynasty",
    EVENT: "event",
    BUSINESS: "business",
    OTHER: "other"
};

/* ============================================================
   TIPOS
============================================================ */

const NEWS_TYPES = {
    FIGHT_RESULT: "fight_result",
    UPSET: "upset",
    KNOCKOUT: "knockout",
    SUBMISSION: "submission",
    DECISION: "decision",

    TITLE_WIN: "title_win",
    TITLE_DEFENSE: "title_defense",
    TITLE_LOSS: "title_loss",
    TITLE_VACATED: "title_vacated",

    RANKING_RISE: "ranking_rise",
    RANKING_FALL: "ranking_fall",
    RANKING_ENTRY: "ranking_entry",
    RANKING_EXIT: "ranking_exit",

    CONTRACT_SIGNING: "contract_signing",
    CONTRACT_RENEWAL: "contract_renewal",
    CONTRACT_EXTENSION: "contract_extension",
    FREE_AGENT: "free_agent",

    PROMOTION_CHANGE: "promotion_change",
    PROMOTION_DEBUT: "promotion_debut",
    PROMOTION_RETURN: "promotion_return",

    SPONSORSHIP: "sponsorship",
    ENDORSEMENT: "endorsement",

    RIVALRY_START: "rivalry_start",
    RIVALRY_ESCALATION: "rivalry_escalation",
    RIVALRY_FIGHT: "rivalry_fight",
    RIVALRY_END: "rivalry_end",

    CONTROVERSY: "controversy",
    SCANDAL: "scandal",
    SUSPENSION: "suspension",

    VIRAL_POST: "viral_post",
    SOCIAL_MILESTONE: "social_milestone",
    SOCIAL_CONTROVERSY: "social_controversy",

    TRAINING_CAMP: "training_camp",
    INJURY: "injury",
    RECOVERY: "recovery",

    RETIREMENT: "retirement",
    COMEBACK: "comeback",

    AWARD: "award",
    HALL_OF_FAME: "hall_of_fame",

    FAMILY_EVENT: "family_event",
    DYNASTY_EVENT: "dynasty_event",
    LEGACY_EVENT: "legacy_event",

    EVENT_ANNOUNCEMENT: "event_announcement",
    MAIN_EVENT: "main_event",
    TOURNAMENT: "tournament",

    BUSINESS: "business",
    OTHER: "other"
};

/* ============================================================
   UTILITÁRIOS
============================================================ */

function clamp(value, min, max) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.min(max, Math.max(min, number));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return null;
    }

    return array[randomInt(0, array.length - 1)];
}

function safeString(value, fallback = "") {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function normalizeName(value, fallback = "Lutador") {
    const name = safeString(value).trim();

    return name || fallback;
}

function capitalize(value) {
    const text = safeString(value);

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return Math.round(number).toLocaleString("pt-BR");
}

function createId(prefix = "news") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}

function nowISO() {
    return new Date().toISOString();
}

/* ============================================================
   ESTADO
============================================================ */

function createNewsState() {
    return {
        version: NEWS_VERSION,

        articles: [],

        history: [],

        trending: [],

        headlines: [],

        statistics: {
            totalGenerated: 0,
            totalRead: 0,

            byCategory: {},
            byType: {},

            importantNews: 0,
            breakingNews: 0,
            playerNews: 0,
            worldNews: 0,

            lastGeneratedAt: null,
            lastWeeklyProcess: null
        },

        settings: {
            enabled: true,
            worldNews: true,
            playerNews: true,
            familyNews: true,
            businessNews: true,
            socialNews: true
        }
    };
}

function ensureNews(database) {
    if (!database) {
        return createNewsState();
    }

    if (!database.media) {
        database.media = {};
    }

    if (!database.media.news) {
        database.media.news = createNewsState();
    }

    const news = database.media.news;

    if (!Array.isArray(news.articles)) {
        news.articles = [];
    }

    if (!Array.isArray(news.history)) {
        news.history = [];
    }

    if (!Array.isArray(news.trending)) {
        news.trending = [];
    }

    if (!Array.isArray(news.headlines)) {
        news.headlines = [];
    }

    if (!news.statistics) {
        news.statistics = createNewsState().statistics;
    }

    if (!news.settings) {
        news.settings = createNewsState().settings;
    }

    /*
       Mantém compatibilidade com versões do estado que
       também possuam world.news.
    */
    if (database.world) {
        if (!Array.isArray(database.world.news)) {
            database.world.news = [];
        }
    }

    return news;
}

/* ============================================================
   NORMALIZAÇÃO DE ENTIDADES
============================================================ */

function getEntityName(entity, fallback = null) {
    if (!entity) {
        return fallback;
    }

    if (typeof entity === "string") {
        return entity;
    }

    return (
        entity.name ||
        entity.fullName ||
        entity.displayName ||
        entity.nickname ||
        entity.title ||
        fallback
    );
}

function getPromotionName(promotion) {
    return getEntityName(
        promotion,
        "uma grande organização"
    );
}

function getFighterName(fighter) {
    return getEntityName(
        fighter,
        "um lutador"
    );
}

function getEventName(event) {
    return getEntityName(
        event,
        "um grande evento"
    );
}

/* ============================================================
   NÍVEIS DE IMPORTÂNCIA
============================================================ */

function getNewsLevel(importance) {
    const score = clamp(importance, 1, 100);

    if (score >= 90) {
        return "breaking";
    }

    if (score >= 75) {
        return "major";
    }

    if (score >= 55) {
        return "important";
    }

    if (score >= 30) {
        return "normal";
    }

    return "minor";
}

function getNewsLevelLabel(level) {
    const labels = {
        breaking: "URGENTE",
        major: "DESTAQUE",
        important: "IMPORTANTE",
        normal: "NOTÍCIA",
        minor: "NOTA"
    };

    return labels[level] || "NOTÍCIA";
}

/* ============================================================
   CONTEXTO DO JOGADOR
============================================================ */

function getPlayer(database) {
    return database?.player || null;
}

function getPlayerId(database) {
    const player = getPlayer(database);

    return (
        player?.id ||
        player?.playerId ||
        database?.dynasty?.activeCharacterId ||
        null
    );
}

function isPlayerEntity(database, entity) {
    if (!entity) {
        return false;
    }

    const player = getPlayer(database);

    if (!player) {
        return false;
    }

    if (entity === player) {
        return true;
    }

    const entityId = entity.id || entity.playerId;
    const playerId = player.id || player.playerId;

    return Boolean(
        entityId &&
        playerId &&
        entityId === playerId
    );
}

/* ============================================================
   MÉTRICAS DE IMPACTO
============================================================ */

function readMetric(database, paths, fallback = 0) {
    for (const path of paths) {
        let current = database;

        for (const key of path) {
            if (
                current === null ||
                current === undefined
            ) {
                current = undefined;
                break;
            }

            current = current[key];
        }

        if (Number.isFinite(Number(current))) {
            return Number(current);
        }
    }

    return fallback;
}

function calculateNewsReach(database, options = {}) {
    const fame = clamp(
        options.fame ??
        readMetric(database, [
            ["media", "fame"],
            ["media", "fame", "score"]
        ]),
        0,
        100
    );

    const popularity = clamp(
        options.popularity ??
        readMetric(database, [
            ["media", "popularity"],
            ["media", "popularity", "score"]
        ]),
        0,
        100
    );

    const reputation = clamp(
        options.reputation ??
        readMetric(database, [
            ["media", "reputation"],
            ["media", "reputation", "score"]
        ]),
        0,
        100
    );

    const marketability = clamp(
        options.marketability ??
        readMetric(database, [
            ["media", "marketability"],
            ["media", "marketability", "score"]
        ]),
        0,
        100
    );

    const followers = Math.max(
        0,
        options.followers ??
        readMetric(database, [
            ["media", "followers"],
            ["media", "followers", "totalFollowers"]
        ])
    );

    const reach =
        NEWS_CONFIG.reach.base +
        fame * NEWS_CONFIG.reach.fameMultiplier +
        popularity * NEWS_CONFIG.reach.popularityMultiplier +
        followers * NEWS_CONFIG.reach.followersMultiplier +
        reputation * NEWS_CONFIG.reach.reputationMultiplier +
        marketability * NEWS_CONFIG.reach.marketabilityMultiplier;

    return Math.max(
        1,
        Math.round(reach)
    );
}

/* ============================================================
   TEMPLATES
============================================================ */

const HEADLINE_TEMPLATES = {
    fight_result: [
        "{fighter} vence e ganha destaque no {event}",
        "{fighter} conquista importante vitória no {event}",
        "{fighter} sai vencedor de grande duelo no {event}",
        "{fighter} confirma boa fase com vitória no {event}",
        "Vitória de {fighter} movimenta cenário do MMA"
    ],

    knockout: [
        "{fighter} impressiona com nocaute no {event}",
        "Nocaute de {fighter} vira destaque do {event}",
        "{fighter} encerra luta de forma brutal no {event}",
        "{fighter} consegue grande nocaute e chama atenção"
    ],

    submission: [
        "{fighter} finaliza adversário no {event}",
        "Finalização de {fighter} ganha destaque no {event}",
        "{fighter} mostra domínio no chão e vence por finalização"
    ],

    decision: [
        "{fighter} vence por decisão no {event}",
        "{fighter} leva decisão após batalha equilibrada",
        "{fighter} supera adversário em decisão dos juízes"
    ],

    upset: [
        "{fighter} surpreende favorito e conquista grande vitória",
        "Zebra! {fighter} choca o mundo do MMA",
        "{fighter} protagoniza uma das maiores surpresas do evento"
    ],

    title_win: [
        "{fighter} conquista o cinturão no {event}",
        "Novo campeão! {fighter} chega ao topo",
        "{fighter} se torna campeão e faz história",
        "Cinturão muda de mãos após vitória de {fighter}"
    ],

    title_defense: [
        "{fighter} defende o cinturão com sucesso",
        "Campeão {fighter} mantém seu título",
        "{fighter} confirma domínio e continua campeão"
    ],

    title_loss: [
        "{fighter} perde o cinturão em grande batalha",
        "Fim do reinado: {fighter} deixa de ser campeão",
        "Cinturão muda de mãos após derrota de {fighter}"
    ],

    ranking_rise: [
        "{fighter} sobe no ranking após grande atuação",
        "{fighter} ganha posições importantes no ranking",
        "Vitórias colocam {fighter} mais perto do topo"
    ],

    ranking_fall: [
        "{fighter} perde posições no ranking",
        "Derrota faz {fighter} cair no ranking",
        "{fighter} vê posição ameaçada após resultado recente"
    ],

    contract_signing: [
        "{fighter} assina novo contrato com {promotion}",
        "{promotion} anuncia contratação de {fighter}",
        "{fighter} fecha acordo e inicia nova fase da carreira"
    ],

    promotion_change: [
        "{fighter} muda de organização",
        "{fighter} anuncia novo capítulo na carreira",
        "Nova casa: {fighter} assina com {promotion}"
    ],

    sponsorship: [
        "{fighter} fecha novo patrocínio",
        "Marca aposta em {fighter} como novo embaixador",
        "{fighter} amplia presença comercial com novo acordo"
    ],

    rivalry_start: [
        "Nova rivalidade movimenta o MMA: {fighter} x {opponent}",
        "{fighter} e {opponent} trocam provocações",
        "Clima esquenta entre {fighter} e {opponent}"
    ],

    controversy: [
        "{fighter} se envolve em polêmica",
        "Polêmica coloca {fighter} no centro das atenções",
        "MMA repercute declaração controversa de {fighter}"
    ],

    viral_post: [
        "Publicação de {fighter} viraliza nas redes sociais",
        "{fighter} domina as redes após postagem viral",
        "Vídeo de {fighter} alcança enorme repercussão"
    ],

    social_milestone: [
        "{fighter} atinge nova marca de seguidores",
        "{fighter} ultrapassa marca histórica nas redes sociais",
        "Popularidade de {fighter} dispara nas redes"
    ],

    training_camp: [
        "{fighter} inicia preparação para próximo desafio",
        "{fighter} intensifica treinamento antes da próxima luta",
        "Camp de {fighter} chama atenção antes do combate"
    ],

    injury: [
        "{fighter} sofre lesão e preocupa equipe",
        "Lesão pode afastar {fighter} dos próximos eventos",
        "{fighter} terá recuperação antes de voltar ao cage"
    ],

    retirement: [
        "{fighter} anuncia aposentadoria do MMA",
        "Fim de uma era: {fighter} anuncia aposentadoria",
        "{fighter} encerra carreira após anos de competição"
    ],

    comeback: [
        "{fighter} anuncia retorno ao MMA",
        "De volta: {fighter} prepara comeback",
        "{fighter} confirma retorno ao cage"
    ],

    award: [
        "{fighter} recebe importante prêmio do MMA",
        "{fighter} é reconhecido por sua temporada",
        "Grande reconhecimento para {fighter}"
    ],

    hall_of_fame: [
        "{fighter} entra para o Hall da Fama",
        "{fighter} é eternizado na história do MMA",
        "Lenda: {fighter} recebe homenagem histórica"
    ],

    family_event: [
        "Momento pessoal de {fighter} repercute entre os fãs",
        "{fighter} compartilha importante momento familiar",
        "Vida pessoal de {fighter} ganha destaque"
    ],

    dynasty_event: [
        "Família de {fighter} ganha novo capítulo",
        "Nova geração da família de {fighter} chama atenção",
        "Legado de {fighter} começa a alcançar a próxima geração"
    ],

    event_announcement: [
        "{event} é anunciado oficialmente",
        "Grande evento {event} ganha data e programação",
        "MMA se prepara para o evento {event}"
    ],

    main_event: [
        "{fighter} é confirmado como atração principal do {event}",
        "{fighter} assume o main event do {event}",
        "Grande confronto liderará o {event}"
    ],

    tournament: [
        "Novo torneio movimenta o mundo do MMA",
        "MMA anuncia torneio com grandes nomes",
        "Competição promete definir novo desafiante"
    ],

    legacy_event: [
        "Legado de {fighter} cresce após nova conquista",
        "{fighter} consolida seu nome na história do MMA",
        "Carreira de {fighter} ganha novo capítulo histórico"
    ]
};

/* ============================================================
   TEXTOS
============================================================ */

const BODY_TEMPLATES = {
    fight_result: [
        "{fighter} conquistou uma importante vitória no {event}, aumentando sua relevância no cenário competitivo.",
        "O resultado fortalece a posição de {fighter} e pode abrir novas oportunidades para a sequência da carreira.",
        "A atuação de {fighter} chamou atenção e deve influenciar os próximos passos de sua carreira."
    ],

    knockout: [
        "A vitória veio de forma contundente, com {fighter} encerrando o combate antes do limite.",
        "O resultado impressionou público e imprensa e aumenta a expectativa pelo próximo desafio de {fighter}.",
        "O nocaute rapidamente se tornou um dos principais momentos do evento."
    ],

    submission: [
        "{fighter} controlou o combate e encontrou a oportunidade para finalizar o adversário.",
        "A vitória demonstra a qualidade técnica de {fighter} e fortalece seu momento na divisão."
    ],

    decision: [
        "Após todos os rounds, os juízes deram a vitória para {fighter}.",
        "O combate chegou ao fim e {fighter} levou a decisão dos árbitros."
    ],

    upset: [
        "Poucos esperavam o resultado, mas {fighter} conseguiu superar as expectativas e derrotar um adversário considerado favorito.",
        "A vitória pode mudar completamente os planos da divisão."
    ],

    title_win: [
        "Com a vitória, {fighter} assume o topo da divisão e passa a carregar o cinturão.",
        "O resultado marca um dos maiores momentos da carreira de {fighter}.",
        "A conquista coloca {fighter} entre os principais nomes da organização."
    ],

    title_defense: [
        "{fighter} continua no topo da divisão após defender seu cinturão.",
        "A defesa aumenta o legado do campeão e mantém a divisão em expectativa pelo próximo desafiante."
    ],

    title_loss: [
        "O resultado encerra um capítulo importante da carreira de {fighter}.",
        "A divisão agora entra em uma nova fase após a mudança de campeão."
    ],

    ranking_rise: [
        "A sequência recente de resultados fez {fighter} ganhar posições importantes.",
        "A ascensão aproxima {fighter} de uma possível disputa pelo título."
    ],

    ranking_fall: [
        "O resultado recente fez {fighter} perder posições na classificação.",
        "A queda aumenta a pressão por uma recuperação no próximo combate."
    ],

    contract_signing: [
        "{fighter} chega a um novo acordo com {promotion}. Os detalhes do contrato devem definir os próximos passos da carreira.",
        "O acordo representa uma nova oportunidade para {fighter} crescer dentro da organização."
    ],

    promotion_change: [
        "A mudança marca uma nova etapa na carreira de {fighter}.",
        "A expectativa agora é saber como {fighter} irá se adaptar ao novo ambiente competitivo."
    ],

    sponsorship: [
        "O acordo reforça o valor comercial de {fighter} fora do cage.",
        "A parceria representa mais uma oportunidade comercial para o atleta."
    ],

    rivalry_start: [
        "As declarações recentes aumentaram a tensão entre os dois atletas.",
        "A rivalidade rapidamente começou a chamar atenção dos fãs."
    ],

    controversy: [
        "A situação provocou forte repercussão entre fãs e imprensa especializada.",
        "A organização ainda poderá se manifestar sobre o caso."
    ],

    viral_post: [
        "A publicação alcançou grande número de visualizações e compartilhamentos.",
        "A repercussão aumentou significativamente a presença de {fighter} nas redes."
    ],

    social_milestone: [
        "O crescimento demonstra o aumento da popularidade de {fighter} fora do cage.",
        "A nova marca reforça o potencial comercial e midiático do atleta."
    ],

    training_camp: [
        "A equipe de {fighter} vem trabalhando intensamente para preparar o atleta para o próximo desafio.",
        "A preparação promete ser decisiva para o desempenho no próximo combate."
    ],

    injury: [
        "A equipe médica deverá acompanhar a recuperação antes de uma nova luta.",
        "O tempo de afastamento dependerá da gravidade da lesão."
    ],

    retirement: [
        "Após anos de competição, {fighter} decidiu encerrar sua trajetória como lutador.",
        "A aposentadoria encerra uma importante fase da carreira e abre espaço para um novo capítulo."
    ],

    comeback: [
        "O retorno gera expectativa entre fãs e organizações.",
        "Agora, a grande questão é saber como {fighter} irá se apresentar após o período afastado."
    ],

    award: [
        "O reconhecimento destaca o desempenho de {fighter} ao longo da temporada.",
        "O prêmio adiciona mais um capítulo importante ao currículo do atleta."
    ],

    hall_of_fame: [
        "A homenagem reconhece a importância histórica de {fighter} para o esporte.",
        "O nome de {fighter} passa a ocupar um lugar permanente na história do MMA."
    ],

    family_event: [
        "O acontecimento repercutiu entre fãs que acompanham a vida do atleta.",
        "Fora do esporte, o momento representa uma nova etapa na vida de {fighter}."
    ],

    dynasty_event: [
        "A história da família começa a ganhar novos capítulos que poderão influenciar as próximas gerações.",
        "O legado familiar passa a fazer parte da narrativa da carreira."
    ],

    event_announcement: [
        "A expectativa cresce enquanto atletas e fãs aguardam a programação completa.",
        "O anúncio movimentou a comunidade do MMA."
    ],

    main_event: [
        "A luta será uma das principais atrações do calendário da organização.",
        "A confirmação aumenta a expectativa em torno do evento."
    ],

    tournament: [
        "O formato promete gerar confrontos importantes e movimentar os rankings.",
        "Os vencedores poderão ganhar oportunidades importantes dentro de suas divisões."
    ],

    legacy_event: [
        "A conquista adiciona peso ao currículo de {fighter} e fortalece seu legado.",
        "O momento poderá ser lembrado como um dos capítulos importantes da carreira."
    ]
};

/* ============================================================
   SUBSTITUIÇÃO DE VARIÁVEIS
============================================================ */

function replaceTemplate(template, data = {}) {
    return safeString(template).replace(
        /\{([^}]+)\}/g,
        (_, key) => {
            return safeString(
                data[key],
                `{${key}}`
            );
        }
    );
}

function getTemplateKey(type, category) {
    if (HEADLINE_TEMPLATES[type]) {
        return type;
    }

    if (HEADLINE_TEMPLATES[category]) {
        return category;
    }

    return "fight_result";
}

function generateHeadline(type, category, data = {}) {
    const key = getTemplateKey(type, category);

    const templates =
        HEADLINE_TEMPLATES[key] ||
        HEADLINE_TEMPLATES.fight_result;

    return replaceTemplate(
        randomItem(templates),
        data
    );
}

function generateBody(type, category, data = {}) {
    const templates =
        BODY_TEMPLATES[type] ||
        BODY_TEMPLATES[category] ||
        BODY_TEMPLATES.fight_result;

    return replaceTemplate(
        randomItem(templates),
        data
    );
}

/* ============================================================
   IMPORTÂNCIA
============================================================ */

function calculateImportance(database, options = {}) {
    let score = Number(
        options.importance
    );

    if (!Number.isFinite(score)) {
        score = 30;
    }

    const type = options.type;

    const bonuses = {
        [NEWS_TYPES.TITLE_WIN]: 35,
        [NEWS_TYPES.TITLE_DEFENSE]: 25,
        [NEWS_TYPES.TITLE_LOSS]: 30,
        [NEWS_TYPES.KNOCKOUT]: 20,
        [NEWS_TYPES.SUBMISSION]: 15,
        [NEWS_TYPES.UPSET]: 30,
        [NEWS_TYPES.RANKING_RISE]: 12,
        [NEWS_TYPES.CONTRACT_SIGNING]: 10,
        [NEWS_TYPES.PROMOTION_CHANGE]: 15,
        [NEWS_TYPES.RIVALRY_START]: 12,
        [NEWS_TYPES.CONTROVERSY]: 20,
        [NEWS_TYPES.SCANDAL]: 35,
        [NEWS_TYPES.VIRAL_POST]: 18,
        [NEWS_TYPES.RETIREMENT]: 35,
        [NEWS_TYPES.COMEBACK]: 25,
        [NEWS_TYPES.HALL_OF_FAME]: 40,
        [NEWS_TYPES.DYNASTY_EVENT]: 20
    };

    score += bonuses[type] || 0;

    const reach = calculateNewsReach(
        database,
        options
    );

    if (reach >= 10000) {
        score += 10;
    }

    if (reach >= 100000) {
        score += 15;
    }

    if (options.isPlayer) {
        score += 8;
    }

    return clamp(
        Math.round(score),
        NEWS_CONFIG.importance.MIN,
        NEWS_CONFIG.importance.MAX
    );
}

/* ============================================================
   CRIAÇÃO DE NOTÍCIA
============================================================ */

function createNewsArticle(database, options = {}) {
    const news = ensureNews(database);

    if (
        news.settings.enabled === false
    ) {
        return null;
    }

    const category =
        options.category ||
        NEWS_CATEGORIES.OTHER;

    const type =
        options.type ||
        NEWS_TYPES.OTHER;

    const fighterName =
        normalizeName(
            getFighterName(
                options.fighter
            ),
            null
        );

    const opponentName =
        normalizeName(
            getFighterName(
                options.opponent
            ),
            null
        );

    const promotionName =
        normalizeName(
            getPromotionName(
                options.promotion
            ),
            null
        );

    const eventName =
        normalizeName(
            getEventName(
                options.event
            ),
            null
        );

    const data = {
        fighter:
            fighterName || "O lutador",

        opponent:
            opponentName || "seu adversário",

        promotion:
            promotionName || "a organização",

        event:
            eventName || "o evento",

        title:
            options.title ||
            options.name ||
            "",

        ranking:
            options.ranking ??
            "",

        position:
            options.position ??
            "",

        oldPosition:
            options.oldPosition ??
            "",

        newPosition:
            options.newPosition ??
            "",

        amount:
            options.amount ??
            "",

        followers:
            options.followers ??
            "",

        division:
            options.division ??
            ""
    };

    const isPlayer =
        Boolean(
            options.isPlayer ||
            isPlayerEntity(
                database,
                options.fighter
            )
        );

    const importance =
        calculateImportance(
            database,
            {
                ...options,
                type,
                category,
                isPlayer
            }
        );

    const level =
        getNewsLevel(
            importance
        );

    const reach =
        calculateNewsReach(
            database,
            options
        );

    const article = {
        id:
            options.id ||
            createId("news"),

        version: NEWS_VERSION,

        timestamp:
            options.timestamp ||
            nowISO(),

        category,
        type,

        level,
        levelLabel:
            getNewsLevelLabel(level),

        title:
            options.title ||
            generateHeadline(
                type,
                category,
                data
            ),

        body:
            options.body ||
            generateBody(
                type,
                category,
                data
            ),

        source:
            options.source ||
            randomItem(
                NEWS_CONFIG.sources
            ),

        importance,

        reach,

        isPlayer,

        read: false,

        featured:
            Boolean(
                options.featured ||
                importance >= 75
            ),

        breaking:
            Boolean(
                options.breaking ||
                importance >= 90
            ),

        related: {
            fighterId:
                options.fighterId ||
                options.fighter?.id ||
                null,

            opponentId:
                options.opponentId ||
                options.opponent?.id ||
                null,

            eventId:
                options.eventId ||
                options.event?.id ||
                null,

            promotionId:
                options.promotionId ||
                options.promotion?.id ||
                null,

            titleId:
                options.titleId ||
                options.title?.id ||
                null
        },

        metadata: {
            fighterName:
                fighterName || null,

            opponentName:
                opponentName || null,

            promotionName:
                promotionName || null,

            eventName:
                eventName || null,

            division:
                data.division ||
                null,

            oldPosition:
                data.oldPosition ||
                null,

            newPosition:
                data.newPosition ||
                null
        },

        effects:
            options.effects ||
            {},

        tags:
            Array.isArray(options.tags)
                ? [...options.tags]
                : []
    };

    news.articles.unshift(article);

    news.history.unshift({
        ...article
    });

    news.statistics.totalGenerated += 1;

    news.statistics.lastGeneratedAt =
        article.timestamp;

    news.statistics.byCategory[category] =
        (news.statistics.byCategory[category] || 0) + 1;

    news.statistics.byType[type] =
        (news.statistics.byType[type] || 0) + 1;

    if (importance >= 75) {
        news.statistics.importantNews += 1;
    }

    if (article.breaking) {
        news.statistics.breakingNews += 1;
    }

    if (isPlayer) {
        news.statistics.playerNews += 1;
    } else {
        news.statistics.worldNews += 1;
    }

    trimNews(database);

    updateTrending(database);
    updateHeadlines(database);
    syncWorldNews(database);

    return article;
}

/* ============================================================
   SINCRONIZAÇÃO
============================================================ */

function syncWorldNews(database) {
    if (!database?.world) {
        return;
    }

    if (!Array.isArray(database.world.news)) {
        database.world.news = [];
    }

    const news = ensureNews(database);

    database.world.news =
        news.articles
            .slice(0, NEWS_CONFIG.maxNews)
            .map(article => ({
                ...article
            }));
}

/* ============================================================
   LIMPEZA
============================================================ */

function trimNews(database) {
    const news = ensureNews(database);

    if (
        news.articles.length >
        NEWS_CONFIG.maxNews
    ) {
        news.articles =
            news.articles.slice(
                0,
                NEWS_CONFIG.maxNews
            );
    }

    if (
        news.history.length >
        NEWS_CONFIG.maxHistory
    ) {
        news.history =
            news.history.slice(
                0,
                NEWS_CONFIG.maxHistory
            );
    }
}

/* ============================================================
   BUSCA
============================================================ */

function getNews(database, options = {}) {
    const news = ensureNews(database);

    let result = [
        ...news.articles
    ];

    if (options.category) {
        result = result.filter(
            article =>
                article.category ===
                options.category
        );
    }

    if (options.type) {
        result = result.filter(
            article =>
                article.type ===
                options.type
        );
    }

    if (options.level) {
        result = result.filter(
            article =>
                article.level ===
                options.level
        );
    }

    if (
        typeof options.playerOnly ===
        "boolean"
    ) {
        result = result.filter(
            article =>
                article.isPlayer ===
                options.playerOnly
        );
    }

    if (options.minImportance) {
        result = result.filter(
            article =>
                article.importance >=
                options.minImportance
        );
    }

    if (options.search) {
        const query =
            safeString(
                options.search
            ).toLowerCase();

        result = result.filter(
            article =>
                article.title
                    .toLowerCase()
                    .includes(query) ||
                article.body
                    .toLowerCase()
                    .includes(query) ||
                article.source
                    .toLowerCase()
                    .includes(query)
        );
    }

    if (options.relatedFighterId) {
        result = result.filter(
            article =>
                article.related
                    ?.fighterId ===
                options.relatedFighterId
        );
    }

    if (options.relatedEventId) {
        result = result.filter(
            article =>
                article.related
                    ?.eventId ===
                options.relatedEventId
        );
    }

    if (options.relatedPromotionId) {
        result = result.filter(
            article =>
                article.related
                    ?.promotionId ===
                options.relatedPromotionId
        );
    }

    if (options.unreadOnly) {
        result = result.filter(
            article =>
                !article.read
        );
    }

    if (options.featuredOnly) {
        result = result.filter(
            article =>
                article.featured
        );
    }

    if (options.breakingOnly) {
        result = result.filter(
            article =>
                article.breaking
        );
    }

    const limit =
        Number.isFinite(
            Number(options.limit)
        )
            ? Number(options.limit)
            : NEWS_CONFIG.recentLimit;

    return result.slice(
        0,
        Math.max(1, limit)
    );
}

/* ============================================================
   RECENTES
============================================================ */

function getRecentNews(database, limit = 20) {
    return getNews(
        database,
        {
            limit
        }
    );
}

function getPlayerNews(database, limit = 20) {
    return getNews(
        database,
        {
            playerOnly: true,
            limit
        }
    );
}

function getImportantNews(database, limit = 20) {
    return getNews(
        database,
        {
            minImportance: 55,
            limit
        }
    );
}

function getBreakingNews(database, limit = 10) {
    return getNews(
        database,
        {
            breakingOnly: true,
            limit
        }
    );
}

/* ============================================================
   MARCAR COMO LIDA
============================================================ */

function markNewsRead(database, newsId) {
    const news = ensureNews(database);

    const article =
        news.articles.find(
            item =>
                item.id === newsId
        );

    if (!article) {
        return false;
    }

    if (!article.read) {
        article.read = true;
        news.statistics.totalRead += 1;
    }

    return true;
}

function markAllNewsRead(database) {
    const news = ensureNews(database);

    let count = 0;

    for (const article of news.articles) {
        if (!article.read) {
            article.read = true;
            count += 1;
        }
    }

    news.statistics.totalRead += count;

    return count;
}

/* ============================================================
   TRENDING
============================================================ */

function calculateTrendingScore(article) {
    if (!article) {
        return 0;
    }

    return (
        article.importance * 2 +
        Math.log10(
            Math.max(
                10,
                article.reach
            )
        ) * 10 +
        (article.featured ? 15 : 0) +
        (article.breaking ? 25 : 0)
    );
}

function updateTrending(database) {
    const news = ensureNews(database);

    news.trending =
        [...news.articles]
            .sort(
                (a, b) =>
                    calculateTrendingScore(b) -
                    calculateTrendingScore(a)
            )
            .slice(
                0,
                NEWS_CONFIG.trendingLimit
            )
            .map(article => article.id);
}

function getTrendingNews(database, limit = 10) {
    const news = ensureNews(database);

    updateTrending(database);

    const ids =
        news.trending.slice(
            0,
            limit
        );

    return ids
        .map(id =>
            news.articles.find(
                article =>
                    article.id === id
            )
        )
        .filter(Boolean);
}

/* ============================================================
   HEADLINES
============================================================ */

function updateHeadlines(database) {
    const news = ensureNews(database);

    news.headlines =
        news.articles
            .filter(
                article =>
                    article.importance >= 55
            )
            .sort(
                (a, b) =>
                    b.importance -
                    a.importance
            )
            .slice(0, 10)
            .map(article => article.id);
}

function getHeadlines(database, limit = 10) {
    const news = ensureNews(database);

    updateHeadlines(database);

    return news.headlines
        .slice(0, limit)
        .map(id =>
            news.articles.find(
                article =>
                    article.id === id
            )
        )
        .filter(Boolean);
}

/* ============================================================
   NOTÍCIAS DE LUTAS
============================================================ */

function createFightNews(database, options = {}) {
    const result =
        options.result ||
        options.outcome ||
        "decision";

    let type =
        NEWS_TYPES.FIGHT_RESULT;

    if (
        result === "KO" ||
        result === "TKO" ||
        result === "knockout" ||
        result === "nocaute"
    ) {
        type = NEWS_TYPES.KNOCKOUT;
    } else if (
        result === "SUB" ||
        result === "submission" ||
        result === "finalizacao"
    ) {
        type = NEWS_TYPES.SUBMISSION;
    } else if (
        result === "decision" ||
        result === "decisão"
    ) {
        type = NEWS_TYPES.DECISION;
    }

    if (options.upset) {
        type = NEWS_TYPES.UPSET;
    }

    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.FIGHT,

            type,

            importance:
                options.importance ??
                35
        }
    );
}

/* ============================================================
   TÍTULOS
============================================================ */

function createTitleWinNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.TITLE,

            type:
                NEWS_TYPES.TITLE_WIN,

            importance:
                options.importance ??
                60,

            featured: true
        }
    );
}

function createTitleDefenseNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.TITLE,

            type:
                NEWS_TYPES.TITLE_DEFENSE,

            importance:
                options.importance ??
                55,

            featured: true
        }
    );
}

function createTitleLossNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.TITLE,

            type:
                NEWS_TYPES.TITLE_LOSS,

            importance:
                options.importance ??
                60,

            featured: true
        }
    );
}

/* ============================================================
   RANKINGS
============================================================ */

function createRankingNews(database, options = {}) {
    const oldPosition =
        Number(options.oldPosition);

    const newPosition =
        Number(options.newPosition);

    let type =
        NEWS_TYPES.RANKING_RISE;

    if (
        Number.isFinite(oldPosition) &&
        Number.isFinite(newPosition)
    ) {
        if (newPosition > oldPosition) {
            type =
                NEWS_TYPES.RANKING_FALL;
        } else if (
            newPosition === oldPosition
        ) {
            type =
                NEWS_TYPES.RANKING_RISE;
        }
    }

    if (options.entry) {
        type =
            NEWS_TYPES.RANKING_ENTRY;
    }

    if (options.exit) {
        type =
            NEWS_TYPES.RANKING_EXIT;
    }

    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.RANKING,

            type,

            importance:
                options.importance ??
                35,

            tags: [
                ...(options.tags || []),
                "ranking"
            ]
        }
    );
}

/* ============================================================
   CONTRATOS
============================================================ */

function createContractNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.CONTRACT,

            type:
                options.type ||
                NEWS_TYPES.CONTRACT_SIGNING,

            importance:
                options.importance ??
                35
        }
    );
}

function createPromotionChangeNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.PROMOTION,

            type:
                NEWS_TYPES.PROMOTION_CHANGE,

            importance:
                options.importance ??
                40
        }
    );
}

/* ============================================================
   PATROCÍNIOS
============================================================ */

function createSponsorshipNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.SPONSOR,

            type:
                options.type ||
                NEWS_TYPES.SPONSORSHIP,

            importance:
                options.importance ??
                30
        }
    );
}

/* ============================================================
   RIVALIDADES
============================================================ */

function createRivalryNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.RIVALRY,

            type:
                options.type ||
                NEWS_TYPES.RIVALRY_START,

            importance:
                options.importance ??
                40,

            featured:
                options.featured ??
                true
        }
    );
}

/* ============================================================
   CONTROVÉRSIAS
============================================================ */

function createControversyNews(database, options = {}) {
    const type =
        options.scandal
            ? NEWS_TYPES.SCANDAL
            : NEWS_TYPES.CONTROVERSY;

    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.CONTROVERSY,

            type,

            importance:
                options.importance ??
                (
                    options.scandal
                        ? 75
                        : 55
                ),

            featured: true
        }
    );
}

/* ============================================================
   REDES SOCIAIS
============================================================ */

function createSocialNews(database, options = {}) {
    const type =
        options.type ||
        (
            options.milestone
                ? NEWS_TYPES.SOCIAL_MILESTONE
                : NEWS_TYPES.VIRAL_POST
        );

    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.SOCIAL,

            type,

            importance:
                options.importance ??
                40
        }
    );
}

/* ============================================================
   TREINO
============================================================ */

function createTrainingNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.TRAINING,

            type:
                NEWS_TYPES.TRAINING_CAMP,

            importance:
                options.importance ??
                25
        }
    );
}

/* ============================================================
   LESÃO
============================================================ */

function createInjuryNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.INJURY,

            type:
                NEWS_TYPES.INJURY,

            importance:
                options.importance ??
                50,

            featured:
                options.featured ??
                true
        }
    );
}

/* ============================================================
   APOSENTADORIA
============================================================ */

function createRetirementNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.RETIREMENT,

            type:
                NEWS_TYPES.RETIREMENT,

            importance:
                options.importance ??
                75,

            featured: true,
            breaking:
                options.breaking ??
                true
        }
    );
}

/* ============================================================
   RETORNO
============================================================ */

function createComebackNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.COMEBACK,

            type:
                NEWS_TYPES.COMEBACK,

            importance:
                options.importance ??
                60,

            featured: true
        }
    );
}

/* ============================================================
   PRÊMIOS
============================================================ */

function createAwardNews(database, options = {}) {
    const type =
        options.hallOfFame
            ? NEWS_TYPES.HALL_OF_FAME
            : NEWS_TYPES.AWARD;

    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.AWARD,

            type,

            importance:
                options.importance ??
                (
                    options.hallOfFame
                        ? 85
                        : 55
                ),

            featured: true
        }
    );
}

/* ============================================================
   FAMÍLIA
============================================================ */

function createFamilyNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.FAMILY,

            type:
                NEWS_TYPES.FAMILY_EVENT,

            importance:
                options.importance ??
                30
        }
    );
}

/* ============================================================
   DINASTIA
============================================================ */

function createDynastyNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.DYNASTY,

            type:
                NEWS_TYPES.DYNASTY_EVENT,

            importance:
                options.importance ??
                50,

            featured:
                options.featured ??
                true
        }
    );
}

/* ============================================================
   LEGADO
============================================================ */

function createLegacyNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.LEGACY,

            type:
                NEWS_TYPES.LEGACY_EVENT,

            importance:
                options.importance ??
                55,

            featured: true
        }
    );
}

/* ============================================================
   EVENTOS
============================================================ */

function createEventAnnouncementNews(
    database,
    options = {}
) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.EVENT,

            type:
                NEWS_TYPES.EVENT_ANNOUNCEMENT,

            importance:
                options.importance ??
                35
        }
    );
}

function createMainEventNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.EVENT,

            type:
                NEWS_TYPES.MAIN_EVENT,

            importance:
                options.importance ??
                50,

            featured: true
        }
    );
}

function createTournamentNews(database, options = {}) {
    return createNewsArticle(
        database,
        {
            ...options,

            category:
                NEWS_CATEGORIES.EVENT,

            type:
                NEWS_TYPES.TOURNAMENT,

            importance:
                options.importance ??
                50,

            featured: true
        }
    );
}

/* ============================================================
   PROCESSAMENTO DE RESULTADO
============================================================ */

function processFightResultNews(
    database,
    fight = {}
) {
    const winner =
        fight.winner ||
        fight.winnerFighter ||
        null;

    const loser =
        fight.loser ||
        fight.loserFighter ||
        null;

    const result =
        fight.method ||
        fight.result ||
        "decision";

    const isUpset =
        Boolean(
            fight.upset ||
            fight.isUpset
        );

    return createFightNews(
        database,
        {
            fighter: winner,
            opponent: loser,
            event: fight.event,
            fighterId:
                winner?.id ||
                fight.winnerId ||
                null,
            opponentId:
                loser?.id ||
                fight.loserId ||
                null,
            eventId:
                fight.event?.id ||
                fight.eventId ||
                null,
            promotion:
                fight.promotion ||
                null,
            promotionId:
                fight.promotion?.id ||
                fight.promotionId ||
                null,
            division:
                fight.division ||
                fight.weightClass ||
                "",
            result,
            upset: isUpset,
            isPlayer:
                isPlayerEntity(
                    database,
                    winner
                )
        }
    );
}

/* ============================================================
   PROCESSAMENTO DE TÍTULO
============================================================ */

function processTitleResultNews(
    database,
    titleResult = {}
) {
    const result =
        titleResult.result ||
        titleResult.type ||
        "win";

    if (
        result === "defense" ||
        result === "defend" ||
        result === "defesa"
    ) {
        return createTitleDefenseNews(
            database,
            titleResult
        );
    }

    if (
        result === "loss" ||
        result === "lost" ||
        result === "derrota"
    ) {
        return createTitleLossNews(
            database,
            titleResult
        );
    }

    return createTitleWinNews(
        database,
        titleResult
    );
}

/* ============================================================
   PROCESSAMENTO DE RANKING
============================================================ */

function processRankingMovementNews(
    database,
    ranking = {}
) {
    return createRankingNews(
        database,
        {
            ...ranking,

            fighterId:
                ranking.fighterId ||
                ranking.fighter?.id ||
                null,

            isPlayer:
                ranking.isPlayer ||
                isPlayerEntity(
                    database,
                    ranking.fighter
                )
        }
    );
}

/* ============================================================
   PROCESSAMENTO DE REDES
============================================================ */

function processViralSocialNews(
    database,
    social = {}
) {
    return createSocialNews(
        database,
        {
            ...social,

            type:
                NEWS_TYPES.VIRAL_POST,

            importance:
                social.importance ??
                55,

            featured: true,

            isPlayer:
                social.isPlayer ||
                isPlayerEntity(
                    database,
                    social.fighter
                )
        }
    );
}

/* ============================================================
   GERADOR DE NOTÍCIAS MUNDIAIS
============================================================ */

function generateWorldNews(
    database,
    options = {}
) {
    const types = [
        NEWS_TYPES.FIGHT_RESULT,
        NEWS_TYPES.RANKING_RISE,
        NEWS_TYPES.CONTRACT_SIGNING,
        NEWS_TYPES.PROMOTION_CHANGE,
        NEWS_TYPES.RIVALRY_START,
        NEWS_TYPES.TOURNAMENT,
        NEWS_TYPES.EVENT_ANNOUNCEMENT
    ];

    const type =
        options.type ||
        randomItem(types);

    const categoryMap = {
        [NEWS_TYPES.FIGHT_RESULT]:
            NEWS_CATEGORIES.FIGHT,

        [NEWS_TYPES.RANKING_RISE]:
            NEWS_CATEGORIES.RANKING,

        [NEWS_TYPES.CONTRACT_SIGNING]:
            NEWS_CATEGORIES.CONTRACT,

        [NEWS_TYPES.PROMOTION_CHANGE]:
            NEWS_CATEGORIES.PROMOTION,

        [NEWS_TYPES.RIVALRY_START]:
            NEWS_CATEGORIES.RIVALRY,

        [NEWS_TYPES.TOURNAMENT]:
            NEWS_CATEGORIES.EVENT,

        [NEWS_TYPES.EVENT_ANNOUNCEMENT]:
            NEWS_CATEGORIES.EVENT
    };

    return createNewsArticle(
        database,
        {
            ...options,

            category:
                options.category ||
                categoryMap[type] ||
                NEWS_CATEGORIES.OTHER,

            type,

            isPlayer: false,

            importance:
                options.importance ??
                randomInt(20, 55)
        }
    );
}

/* ============================================================
   NOTÍCIAS AUTOMÁTICAS DO JOGADOR
============================================================ */

function generatePlayerNews(
    database,
    options = {}
) {
    const player =
        getPlayer(database);

    if (!player) {
        return null;
    }

    return createNewsArticle(
        database,
        {
            ...options,

            fighter:
                options.fighter ||
                player,

            fighterId:
                options.fighterId ||
                player.id ||
                null,

            isPlayer: true
        }
    );
}

/* ============================================================
   PROCESSAMENTO SEMANAL
============================================================ */

function decayArticle(article) {
    if (!article) {
        return;
    }

    article.importance =
        Math.max(
            NEWS_CONFIG.decay.minimumImportance,
            Math.round(
                article.importance *
                NEWS_CONFIG.decay.weekly
            )
        );

    article.reach =
        Math.max(
            1,
            Math.round(
                article.reach *
                NEWS_CONFIG.decay.weekly
            )
        );

    article.level =
        getNewsLevel(
            article.importance
        );

    article.levelLabel =
        getNewsLevelLabel(
            article.level
        );

    article.featured =
        article.importance >= 75;

    article.breaking =
        article.importance >= 90;
}

function processWeeklyNews(database) {
    const news = ensureNews(database);

    for (const article of news.articles) {
        decayArticle(article);
    }

    news.statistics.lastWeeklyProcess =
        nowISO();

    updateTrending(database);
    updateHeadlines(database);

    trimNews(database);
    syncWorldNews(database);

    return getRecentNews(
        database,
        NEWS_CONFIG.recentLimit
    );
}

/* ============================================================
   HISTÓRICO
============================================================ */

function getNewsHistory(
    database,
    limit = 50
) {
    const news = ensureNews(database);

    return news.history
        .slice(0, limit);
}

/* ============================================================
   ESTATÍSTICAS
============================================================ */

function getNewsStatistics(database) {
    const news = ensureNews(database);

    return {
        ...news.statistics,

        currentArticles:
            news.articles.length,

        historySize:
            news.history.length,

        trendingCount:
            news.trending.length,

        headlineCount:
            news.headlines.length
    };
}

/* ============================================================
   PERFIL DE NOTÍCIA
============================================================ */

function getNewsProfile(
    database,
    newsId
) {
    const news = ensureNews(database);

    const article =
        news.articles.find(
            item =>
                item.id === newsId
        );

    if (!article) {
        return null;
    }

    return {
        ...article,

        ageScore:
            article.importance,

        level:
            article.level,

        levelLabel:
            article.levelLabel,

        trending:
            news.trending.includes(
                article.id
            ),

        headline:
            news.headlines.includes(
                article.id
            )
    };
}

/* ============================================================
   COMPARAÇÃO
============================================================ */

function compareNews(
    articleA,
    articleB
) {
    if (!articleA || !articleB) {
        return null;
    }

    return {
        importanceDifference:
            articleA.importance -
            articleB.importance,

        reachDifference:
            articleA.reach -
            articleB.reach,

        moreImportant:
            articleA.importance >
            articleB.importance
                ? articleA.id
                : articleB.id,

        greaterReach:
            articleA.reach >
            articleB.reach
                ? articleA.id
                : articleB.id
    };
}

/* ============================================================
   VALIDAÇÃO
============================================================ */

function validateNewsArticle(article) {
    const errors = [];

    if (!article) {
        errors.push(
            "Notícia inexistente."
        );

        return {
            valid: false,
            errors
        };
    }

    if (!article.id) {
        errors.push(
            "Notícia sem ID."
        );
    }

    if (!article.title) {
        errors.push(
            "Notícia sem título."
        );
    }

    if (!article.body) {
        errors.push(
            "Notícia sem corpo."
        );
    }

    if (!article.category) {
        errors.push(
            "Notícia sem categoria."
        );
    }

    if (!article.type) {
        errors.push(
            "Notícia sem tipo."
        );
    }

    if (
        !Number.isFinite(
            Number(article.importance)
        )
    ) {
        errors.push(
            "Importância inválida."
        );
    }

    if (
        !Number.isFinite(
            Number(article.reach)
        )
    ) {
        errors.push(
            "Alcance inválido."
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

/* ============================================================
   VALIDAÇÃO DO SISTEMA
============================================================ */

function validateNewsSystem(database) {
    const news =
        ensureNews(database);

    const errors = [];

    if (!Array.isArray(news.articles)) {
        errors.push(
            "articles não é um array."
        );
    }

    if (!Array.isArray(news.history)) {
        errors.push(
            "history não é um array."
        );
    }

    if (!Array.isArray(news.trending)) {
        errors.push(
            "trending não é um array."
        );
    }

    if (!Array.isArray(news.headlines)) {
        errors.push(
            "headlines não é um array."
        );
    }

    for (const article of news.articles) {
        const validation =
            validateNewsArticle(
                article
            );

        if (!validation.valid) {
            errors.push(
                ...validation.errors.map(
                    error =>
                        `${article?.id || "unknown"}: ${error}`
                )
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

/* ============================================================
   RESET
============================================================ */

function resetNews(database) {
    if (!database) {
        return createNewsState();
    }

    database.media =
        database.media || {};

    database.media.news =
        createNewsState();

    if (database.world) {
        database.world.news = [];
    }

    return database.media.news;
}

/* ============================================================
   RESUMO
============================================================ */

function getNewsSummary(database) {
    const news =
        ensureNews(database);

    const recent =
        getRecentNews(
            database,
            5
        );

    const trending =
        getTrendingNews(
            database,
            5
        );

    return {
        version: NEWS_VERSION,

        total:
            news.articles.length,

        unread:
            news.articles.filter(
                article =>
                    !article.read
            ).length,

        important:
            news.articles.filter(
                article =>
                    article.importance >= 55
            ).length,

        breaking:
            news.articles.filter(
                article =>
                    article.breaking
            ).length,

        playerNews:
            news.articles.filter(
                article =>
                    article.isPlayer
            ).length,

        recent,

        trending,

        headlines:
            getHeadlines(
                database,
                5
            )
    };
}

/* ============================================================
   CONFIGURAÇÕES
============================================================ */

function setNewsSetting(
    database,
    setting,
    value
) {
    const news =
        ensureNews(database);

    if (
        !Object.prototype.hasOwnProperty.call(
            news.settings,
            setting
        )
    ) {
        return false;
    }

    news.settings[setting] =
        Boolean(value);

    return true;
}

function getNewsSettings(database) {
    const news =
        ensureNews(database);

    return {
        ...news.settings
    };
}

/* ============================================================
   EXPORTS
============================================================ */

export {
    NEWS_VERSION,
    NEWS_CONFIG,

    NEWS_CATEGORIES,
    NEWS_TYPES,

    createNewsState,
    ensureNews,

    getNewsLevel,
    getNewsLevelLabel,

    calculateNewsReach,
    calculateImportance,

    generateHeadline,
    generateBody,

    createNewsArticle,

    getNews,
    getRecentNews,
    getPlayerNews,
    getImportantNews,
    getBreakingNews,

    markNewsRead,
    markAllNewsRead,

    updateTrending,
    getTrendingNews,

    updateHeadlines,
    getHeadlines,

    createFightNews,
    createTitleWinNews,
    createTitleDefenseNews,
    createTitleLossNews,

    createRankingNews,

    createContractNews,
    createPromotionChangeNews,

    createSponsorshipNews,

    createRivalryNews,
    createControversyNews,

    createSocialNews,
    createTrainingNews,
    createInjuryNews,

    createRetirementNews,
    createComebackNews,

    createAwardNews,

    createFamilyNews,
    createDynastyNews,
    createLegacyNews,

    createEventAnnouncementNews,
    createMainEventNews,
    createTournamentNews,

    processFightResultNews,
    processTitleResultNews,
    processRankingMovementNews,
    processViralSocialNews,

    generateWorldNews,
    generatePlayerNews,

    processWeeklyNews,

    getNewsHistory,
    getNewsStatistics,
    getNewsProfile,

    compareNews,

    validateNewsArticle,
    validateNewsSystem,

    resetNews,
    getNewsSummary,

    setNewsSetting,
    getNewsSettings
};

export default {
    NEWS_VERSION,
    NEWS_CONFIG,

    NEWS_CATEGORIES,
    NEWS_TYPES,

    createNewsState,
    ensureNews,

    getNewsLevel,
    getNewsLevelLabel,

    calculateNewsReach,
    calculateImportance,

    generateHeadline,
    generateBody,

    createNewsArticle,

    getNews,
    getRecentNews,
    getPlayerNews,
    getImportantNews,
    getBreakingNews,

    markNewsRead,
    markAllNewsRead,

    updateTrending,
    getTrendingNews,

    updateHeadlines,
    getHeadlines,

    createFightNews,
    createTitleWinNews,
    createTitleDefenseNews,
    createTitleLossNews,

    createRankingNews,

    createContractNews,
    createPromotionChangeNews,

    createSponsorshipNews,

    createRivalryNews,
    createControversyNews,

    createSocialNews,
    createTrainingNews,
    createInjuryNews,

    createRetirementNews,
    createComebackNews,

    createAwardNews,

    createFamilyNews,
    createDynastyNews,
    createLegacyNews,

    createEventAnnouncementNews,
    createMainEventNews,
    createTournamentNews,

    processFightResultNews,
    processTitleResultNews,
    processRankingMovementNews,
    processViralSocialNews,

    generateWorldNews,
    generatePlayerNews,

    processWeeklyNews,

    getNewsHistory,
    getNewsStatistics,
    getNewsProfile,

    compareNews,

    validateNewsArticle,
    validateNewsSystem,

    resetNews,
    getNewsSummary,

    setNewsSetting,
    getNewsSettings
};
