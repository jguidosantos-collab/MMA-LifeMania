/* ============================================================
   MMA LIFE DYNASTY
   MEDIA — SOCIAL MEDIA ENGINE
   ============================================================

   Sistema de redes sociais do lutador.

   Plataformas:
   - Instagram
   - X
   - YouTube
   - TikTok

   O sistema controla:
   - Seguidores por plataforma
   - Posts
   - Curtidas
   - Comentários
   - Compartilhamentos
   - Visualizações
   - Alcance
   - Engajamento
   - Viralização
   - Crescimento
   - Perda de seguidores
   - Conteúdo
   - Polêmicas
   - Interação com fãs
   - Histórico
   - Estatísticas
   - Marcos de audiência

   Integração:
   database.media.socialMedia

   Este módulo é independente e não depende de imports
   externos para evitar dependências circulares.
   ============================================================ */

const SOCIAL_MEDIA_VERSION = 1;


/* ============================================================
   CONFIGURATION
   ============================================================ */

const SOCIAL_MEDIA_CONFIG = {

    defaultFollowers: 25,

    platforms: {

        instagram: {

            id: "instagram",

            name: "Instagram",

            baseEngagement: 0.055,

            growthMultiplier: 1.15,

            viralMultiplier: 1.25,

            contentTypes: [
                "photo",
                "training",
                "fight",
                "lifestyle",
                "story",
                "reel"
            ]
        },

        x: {

            id: "x",

            name: "X",

            baseEngagement: 0.035,

            growthMultiplier: 0.90,

            viralMultiplier: 1.40,

            contentTypes: [
                "post",
                "opinion",
                "trash_talk",
                "fight",
                "announcement",
                "reply"
            ]
        },

        youtube: {

            id: "youtube",

            name: "YouTube",

            baseEngagement: 0.045,

            growthMultiplier: 0.75,

            viralMultiplier: 1.60,

            contentTypes: [
                "vlog",
                "training",
                "fight",
                "podcast",
                "documentary",
                "short"
            ]
        },

        tiktok: {

            id: "tiktok",

            name: "TikTok",

            baseEngagement: 0.075,

            growthMultiplier: 1.35,

            viralMultiplier: 1.80,

            contentTypes: [
                "short",
                "training",
                "fight",
                "funny",
                "challenge",
                "viral"
            ]
        }
    },

    content: {

        photo: {
            reach: 1.0,
            engagement: 1.0,
            viralChance: 0.01
        },

        training: {
            reach: 1.10,
            engagement: 1.10,
            viralChance: 0.015
        },

        fight: {
            reach: 1.60,
            engagement: 1.45,
            viralChance: 0.04
        },

        lifestyle: {
            reach: 1.05,
            engagement: 1.15,
            viralChance: 0.012
        },

        story: {
            reach: 0.75,
            engagement: 1.10,
            viralChance: 0.008
        },

        reel: {
            reach: 1.45,
            engagement: 1.35,
            viralChance: 0.035
        },

        post: {
            reach: 0.90,
            engagement: 1.0,
            viralChance: 0.01
        },

        opinion: {
            reach: 1.15,
            engagement: 1.20,
            viralChance: 0.025
        },

        trash_talk: {
            reach: 1.35,
            engagement: 1.50,
            viralChance: 0.05
        },

        announcement: {
            reach: 1.25,
            engagement: 1.10,
            viralChance: 0.02
        },

        reply: {
            reach: 0.70,
            engagement: 1.20,
            viralChance: 0.01
        },

        vlog: {
            reach: 1.35,
            engagement: 1.30,
            viralChance: 0.025
        },

        podcast: {
            reach: 1.25,
            engagement: 1.20,
            viralChance: 0.02
        },

        documentary: {
            reach: 1.75,
            engagement: 1.50,
            viralChance: 0.04
        },

        short: {
            reach: 1.60,
            engagement: 1.40,
            viralChance: 0.05
        },

        funny: {
            reach: 1.45,
            engagement: 1.50,
            viralChance: 0.055
        },

        challenge: {
            reach: 1.70,
            engagement: 1.55,
            viralChance: 0.065
        },

        viral: {
            reach: 2.50,
            engagement: 2.00,
            viralChance: 0.15
        }
    },

    viralLevels: {

        normal: {
            multiplier: 1,
            label: "Normal"
        },

        popular: {
            multiplier: 2,
            label: "Popular"
        },

        viral: {
            multiplier: 5,
            label: "Viral"
        },

        mega: {
            multiplier: 10,
            label: "Mega Viral"
        },

        legendary: {
            multiplier: 25,
            label: "Viral Histórico"
        }
    },

    milestones: [

        100,

        500,

        1000,

        5000,

        10000,

        50000,

        100000,

        500000,

        1000000,

        5000000,

        10000000,

        50000000,

        100000000
    ]
};


/* ============================================================
   HELPERS
   ============================================================ */

function clamp(
    value,
    min = 0,
    max = 100
) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
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


function integer(
    value
) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {

        return 0;
    }

    return Math.round(
        number
    );
}


function round(
    value,
    decimals = 2
) {

    const factor =
        10 ** decimals;

    return Math.round(
        Number(value) * factor
    ) / factor;
}


function nowISO() {

    return new Date()
        .toISOString();
}


function random() {

    return Math.random();
}


function ensureDatabase(
    database
) {

    if (
        !database ||
        typeof database !== "object"
    ) {

        throw new Error(
            "Social Media Engine: database inválido."
        );
    }

    if (
        !database.media ||
        typeof database.media !== "object"
    ) {

        database.media = {};
    }

    return database;
}


/* ============================================================
   PLATFORM STATE
   ============================================================ */

function createPlatformState(
    platformId
) {

    const config =
        SOCIAL_MEDIA_CONFIG
            .platforms[
                platformId
            ];

    const followers =
        SOCIAL_MEDIA_CONFIG
            .defaultFollowers;

    return {

        id:
            platformId,

        name:
            config
                ? config.name
                : platformId,

        followers,

        totalFollowersGained: 0,

        totalFollowersLost: 0,

        posts: 0,

        likes: 0,

        comments: 0,

        shares: 0,

        views: 0,

        reach: 0,

        engagementRate:
            config
                ? config.baseEngagement * 100
                : 5,

        growthRate: 0,

        momentum: 0,

        verified: false,

        active: true,

        history: [],

        viralPosts: [],

        milestones: [],

        statistics: {

            posts: 0,

            likes: 0,

            comments: 0,

            shares: 0,

            views: 0,

            followersGained: 0,

            followersLost: 0,

            viralPosts: 0,

            highPerformingPosts: 0,

            weeksProcessed: 0
        }
    };
}


/* ============================================================
   COMPLETE STATE
   ============================================================ */

function createSocialMediaState() {

    const platforms = {};

    for (
        const platformId
        of Object.keys(
            SOCIAL_MEDIA_CONFIG.platforms
        )
    ) {

        platforms[platformId] =
            createPlatformState(
                platformId
            );
    }

    return {

        version:
            SOCIAL_MEDIA_VERSION,

        active: true,

        totalFollowers: 0,

        totalReach: 0,

        totalViews: 0,

        totalEngagement: 0,

        overallEngagementRate: 0,

        socialInfluence: 0,

        socialMomentum: 0,

        posts: [],

        viralPosts: [],

        milestones: [],

        history: [],

        platforms,

        statistics: {

            totalPosts: 0,

            totalLikes: 0,

            totalComments: 0,

            totalShares: 0,

            totalViews: 0,

            totalReach: 0,

            followersGained: 0,

            followersLost: 0,

            viralPosts: 0,

            highPerformingPosts: 0,

            weeksProcessed: 0,

            fightsMentioned: 0,

            titlesMentioned: 0,

            rivalriesMentioned: 0,

            controversiesMentioned: 0
        },

        lastPost: null,

        lastUpdate: null
    };
}


/* ============================================================
   ENSURE SOCIAL MEDIA
   ============================================================ */

function ensureSocialMedia(
    database
) {

    ensureDatabase(
        database
    );

    if (
        !database.media.socialMedia ||
        typeof database.media.socialMedia !== "object"
    ) {

        database.media.socialMedia =
            createSocialMediaState();
    }

    const state =
        database.media.socialMedia;

    if (
        !state.platforms ||
        typeof state.platforms !== "object"
    ) {

        state.platforms = {};
    }

    for (
        const platformId
        of Object.keys(
            SOCIAL_MEDIA_CONFIG.platforms
        )
    ) {

        if (
            !state.platforms[
                platformId
            ]
        ) {

            state.platforms[
                platformId
            ] =
                createPlatformState(
                    platformId
                );
        }
    }

    if (
        !Array.isArray(
            state.posts
        )
    ) {

        state.posts = [];
    }

    if (
        !Array.isArray(
            state.viralPosts
        )
    ) {

        state.viralPosts = [];
    }

    if (
        !Array.isArray(
            state.milestones
        )
    ) {

        state.milestones = [];
    }

    if (
        !Array.isArray(
            state.history
        )
    ) {

        state.history = [];
    }

    if (
        !state.statistics ||
        typeof state.statistics !== "object"
    ) {

        state.statistics =
            createSocialMediaState()
                .statistics;
    }

    recalculateTotals(
        database
    );

    return state;
}


/* ============================================================
   GET PLATFORM
   ============================================================ */

function getPlatform(
    database,
    platformId
) {

    const state =
        ensureSocialMedia(
            database
        );

    if (
        !state.platforms[
            platformId
        ]
    ) {

        throw new Error(
            `Plataforma inválida: ${platformId}`
        );
    }

    return state.platforms[
        platformId
    ];
}


/* ============================================================
   FOLLOWERS
   ============================================================ */

function getFollowers(
    database,
    platformId = null
) {

    const state =
        ensureSocialMedia(
            database
        );

    if (
        platformId
    ) {

        return getPlatform(
            database,
            platformId
        ).followers;
    }

    return state.totalFollowers;
}


function setFollowers(
    database,
    platformId,
    amount
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    const previous =
        platform.followers;

    platform.followers =
        Math.max(
            0,
            integer(amount)
        );

    const difference =
        platform.followers -
        previous;

    if (
        difference > 0
    ) {

        platform.totalFollowersGained +=
            difference;

        platform.statistics
            .followersGained +=
            difference;
    }

    if (
        difference < 0
    ) {

        platform.totalFollowersLost +=
            Math.abs(
                difference
            );

        platform.statistics
            .followersLost +=
            Math.abs(
                difference
            );
    }

    recalculateTotals(
        database
    );

    checkMilestones(
        database,
        platformId
    );

    return platform.followers;
}


function addFollowers(
    database,
    platformId,
    amount,
    reason = "Social media growth"
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    const change =
        integer(amount);

    if (
        change === 0
    ) {

        return platform.followers;
    }

    const before =
        platform.followers;

    const after =
        Math.max(
            0,
            before + change
        );

    const actualChange =
        after - before;

    platform.followers =
        after;

    if (
        actualChange > 0
    ) {

        platform.totalFollowersGained +=
            actualChange;

        platform.statistics
            .followersGained +=
            actualChange;
    }

    if (
        actualChange < 0
    ) {

        platform.totalFollowersLost +=
            Math.abs(
                actualChange
            );

        platform.statistics
            .followersLost +=
            Math.abs(
                actualChange
            );
    }

    recordPlatformHistory(
        database,
        platformId,
        actualChange,
        reason
    );

    recalculateTotals(
        database
    );

    checkMilestones(
        database,
        platformId
    );

    return platform.followers;
}


function removeFollowers(
    database,
    platformId,
    amount,
    reason = "Social media loss"
) {

    return addFollowers(
        database,
        platformId,
        -Math.abs(
            integer(amount)
        ),
        reason
    );
}


/* ============================================================
   PLATFORM HISTORY
   ============================================================ */

function recordPlatformHistory(
    database,
    platformId,
    amount,
    reason
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    const entry = {

        timestamp:
            nowISO(),

        amount:
            integer(amount),

        reason,

        followers:
            platform.followers
    };

    platform.history.push(
        entry
    );

    if (
        platform.history.length >
        300
    ) {

        platform.history.splice(
            0,
            platform.history.length - 300
        );
    }

    return entry;
}


/* ============================================================
   CONTENT TYPE
   ============================================================ */

function getContentConfig(
    contentType
) {

    return SOCIAL_MEDIA_CONFIG
        .content[
            contentType
        ] ||
        SOCIAL_MEDIA_CONFIG
            .content
            .post;
}


/* ============================================================
   PLATFORM INFLUENCE
   ============================================================ */

function getMediaValue(
    database,
    property,
    fallback = 0
) {

    ensureDatabase(
        database
    );

    const sources = [

        database.media
            ?.marketability,

        database.media
            ?.popularity,

        database.media
            ?.fame,

        database.media
            ?.reputation,

        database.media
            ?.persona
    ];

    for (
        const source
        of sources
    ) {

        if (
            source &&
            Number.isFinite(
                Number(
                    source[property]
                )
            )
        ) {

            return clamp(
                source[property]
            );
        }
    }

    return fallback;
}


function getSocialInfluence(
    database
) {

    const state =
        ensureSocialMedia(
            database
        );

    const fame =
        readMediaNumber(
            database,
            "fame",
            0
        );

    const popularity =
        readMediaNumber(
            database,
            "popularity",
            20
        );

    const reputation =
        readMediaNumber(
            database,
            "reputation",
            50
        );

    const persona =
        getPersonaScore(
            database
        );

    const followersScore =
        followerScale(
            state.totalFollowers
        );

    return clamp(

        fame * 0.20 +

        popularity * 0.25 +

        reputation * 0.15 +

        persona * 0.15 +

        followersScore * 0.25
    );
}


function readMediaNumber(
    database,
    property,
    fallback
) {

    ensureDatabase(
        database
    );

    const sourceMap = {

        fame:
            database.media.fame,

        popularity:
            database.media.popularity,

        reputation:
            database.media.reputation,

        marketability:
            database.media.marketability
    };

    const source =
        sourceMap[property];

    if (
        source &&
        typeof source === "object"
    ) {

        const direct =
            Number(
                source[property]
            );

        if (
            Number.isFinite(
                direct
            )
        ) {

            return clamp(
                direct
            );
        }

        if (
            Number.isFinite(
                Number(
                    source.score
                )
            )
        ) {

            return clamp(
                source.score
            );
        }

        if (
            Number.isFinite(
                Number(
                    source.overall
                )
            )
        ) {

            return clamp(
                source.overall
            );
        }
    }

    return clamp(
        fallback
    );
}


function getPersonaScore(
    database
) {

    const persona =
        database.media
            ?.persona;

    if (
        !persona ||
        typeof persona !== "object"
    ) {

        return 25;
    }

    const values = [

        persona.charisma,

        persona.showmanship,

        persona.fanConnection,

        persona.mediaAppeal,

        persona.commercialAppeal
    ]
        .map(Number)
        .filter(
            Number.isFinite
        );

    if (
        values.length === 0
    ) {

        return 25;
    }

    return clamp(

        values.reduce(
            (
                total,
                value
            ) =>
                total +
                clamp(value),
            0
        ) /
        values.length
    );
}


function followerScale(
    followers
) {

    const value =
        Math.max(
            0,
            integer(followers)
        );

    if (
        value <= 100
    ) {

        return 5;
    }

    if (
        value <= 1000
    ) {

        return 15;
    }

    if (
        value <= 10000
    ) {

        return 30;
    }

    if (
        value <= 100000
    ) {

        return 50;
    }

    if (
        value <= 1000000
    ) {

        return 70;
    }

    if (
        value <= 10000000
    ) {

        return 85;
    }

    return 100;
}


/* ============================================================
   CREATE POST
   ============================================================ */

function createPost(
    database,
    platformId,
    contentType = "post",
    quality = 50,
    description = ""
) {

    const state =
        ensureSocialMedia(
            database
        );

    const platform =
        getPlatform(
            database,
            platformId
        );

    const platformConfig =
        SOCIAL_MEDIA_CONFIG
            .platforms[
                platformId
            ];

    const contentConfig =
        getContentConfig(
            contentType
        );

    const normalizedQuality =
        clamp(
            quality
        );

    const influence =
        getSocialInfluence(
            database
        );

    const qualityFactor =
        0.50 +
        normalizedQuality /
        100;

    const baseFollowers =
        Math.max(
            1,
            platform.followers
        );

    const reach =
        Math.max(

            1,

            Math.round(

                baseFollowers *

                contentConfig.reach *

                (
                    0.20 +
                    influence / 100
                ) *

                qualityFactor *

                (
                    platformConfig
                        ?.growthMultiplier ||
                    1
                )
            )
        );

    const engagementRate =
        Math.max(

            0.005,

            (
                platformConfig
                    ?.baseEngagement ||
                0.03
            ) *

            contentConfig.engagement *

            (
                0.60 +
                influence / 150
            ) *

            qualityFactor
        );

    const estimatedEngagement =
        Math.max(
            1,
            Math.round(
                reach *
                engagementRate
            )
        );

    const likes =
        Math.round(
            estimatedEngagement *
            0.70
        );

    const comments =
        Math.round(
            estimatedEngagement *
            0.12
        );

    const shares =
        Math.round(
            estimatedEngagement *
            0.08
        );

    const views =
        Math.max(
            reach,
            Math.round(
                reach *
                (
                    1.50 +
                    contentConfig
                        .engagement
                )
            )
        );

    const viralScore =
        calculateViralScore(
            database,
            platformId,
            contentType,
            normalizedQuality,
            reach,
            engagementRate
        );

    const viral =
        viralScore >= 70;

    const post = {

        id:
            `social_${Date.now()}_` +
            `${Math.floor(
                random() * 1000000
            )}`,

        timestamp:
            nowISO(),

        platform:
            platformId,

        platformName:
            platformConfig
                ?.name ||
            platformId,

        contentType,

        description,

        quality:
            normalizedQuality,

        reach,

        views,

        likes,

        comments,

        shares,

        engagementRate:
            round(
                engagementRate * 100,
                2
            ),

        engagement:

            likes +
            comments +
            shares,

        viralScore:
            round(
                viralScore
            ),

        viral,

        viralLevel:
            getViralLevel(
                viralScore
            ),

        followersGained: 0,

        followersLost: 0
    };

    if (
        viral
    ) {

        const viralFollowers =
            calculateViralFollowers(
                database,
                platformId,
                post
            );

        post.followersGained =
            viralFollowers;

        addFollowers(
            database,
            platformId,
            viralFollowers,
            `Viral ${contentType}`
        );

        platform.viralPosts.push(
            post.id
        );

        platform.statistics
            .viralPosts++;

        state.statistics
            .viralPosts++;

        state.viralPosts.push(
            post
        );
    }

    else {

        const normalGrowth =
            calculatePostFollowers(
                database,
                platformId,
                post
            );

        post.followersGained =
            normalGrowth;

        addFollowers(
            database,
            platformId,
            normalGrowth,
            `Post ${contentType}`
        );
    }

    platform.posts++;

    platform.likes +=
        likes;

    platform.comments +=
        comments;

    platform.shares +=
        shares;

    platform.views +=
        views;

    platform.reach +=
        reach;

    platform.statistics.posts++;

    platform.statistics.likes +=
        likes;

    platform.statistics.comments +=
        comments;

    platform.statistics.shares +=
        shares;

    platform.statistics.views +=
        views;

    if (
        quality >= 80
    ) {

        platform.statistics
            .highPerformingPosts++;

        state.statistics
            .highPerformingPosts++;
    }

    state.posts.push(
        post
    );

    state.statistics
        .totalPosts++;

    state.statistics
        .totalLikes +=
        likes;

    state.statistics
        .totalComments +=
        comments;

    state.statistics
        .totalShares +=
        shares;

    state.statistics
        .totalViews +=
        views;

    state.statistics
        .totalReach +=
        reach;

    state.lastPost =
        post;

    state.lastUpdate =
        nowISO();

    if (
        state.posts.length >
        500
    ) {

        state.posts.splice(
            0,
            state.posts.length - 500
        );
    }

    updatePlatformMetrics(
        database,
        platformId
    );

    recalculateTotals(
        database
    );

    checkMilestones(
        database,
        platformId
    );

    return {
        ...post
    };
}


/* ============================================================
   POST FOLLOWER GROWTH
   ============================================================ */

function calculatePostFollowers(
    database,
    platformId,
    post
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    const influence =
        getSocialInfluence(
            database
        );

    const conversion =
        0.002 +

        influence /
        100000;

    return Math.max(

        0,

        Math.round(

            post.reach *
            conversion *
            (
                1 +
                post.engagementRate /
                100
            )
        )
    );
}


/* ============================================================
   VIRAL SCORE
   ============================================================ */

function calculateViralScore(
    database,
    platformId,
    contentType,
    quality,
    reach,
    engagementRate
) {

    const platform =
        SOCIAL_MEDIA_CONFIG
            .platforms[
                platformId
            ];

    const content =
        getContentConfig(
            contentType
        );

    const influence =
        getSocialInfluence(
            database
        );

    const base =
        quality * 0.35 +

        engagementRate * 100 * 0.25 +

        influence * 0.20 +

        content.viralChance * 100 * 0.20;

    const platformBonus =
        (
            platform
                ?.viralMultiplier ||
            1
        ) * 10;

    return clamp(
        base +
        platformBonus -
        25
    );
}


/* ============================================================
   VIRAL LEVEL
   ============================================================ */

function getViralLevel(
    score
) {

    const value =
        clamp(
            score
        );

    if (
        value >= 95
    ) {

        return "legendary";
    }

    if (
        value >= 85
    ) {

        return "mega";
    }

    if (
        value >= 70
    ) {

        return "viral";
    }

    if (
        value >= 50
    ) {

        return "popular";
    }

    return "normal";
}


/* ============================================================
   VIRAL FOLLOWERS
   ============================================================ */

function calculateViralFollowers(
    database,
    platformId,
    post
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    const viralLevel =
        SOCIAL_MEDIA_CONFIG
            .viralLevels[
                post.viralLevel
            ];

    const multiplier =
        viralLevel
            ?.multiplier ||
        1;

    const base =
        Math.max(
            10,
            Math.round(
                post.reach *
                0.01
            )
        );

    return Math.max(

        1,

        Math.round(

            base *

            multiplier *

            (
                1 +
                getSocialInfluence(
                    database
                ) /
                100
            )
        )
    );
}


/* ============================================================
   PLATFORM METRICS
   ============================================================ */

function updatePlatformMetrics(
    database,
    platformId
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    if (
        platform.posts > 0
    ) {

        platform.engagementRate =

            (
                (
                    platform.likes +
                    platform.comments +
                    platform.shares
                ) /
                Math.max(
                    1,
                    platform.reach
                )
            ) * 100;
    }

    platform.growthRate =

        platform.followers > 0

            ? (
                platform.statistics
                    .followersGained /
                platform.followers
            ) * 100

            : 0;

    platform.momentum =
        clamp(

            (
                platform.statistics
                    .followersGained -
                platform.statistics
                    .followersLost
            ) /
            Math.max(
                1,
                platform.followers
            ) *
            100
        );

    return platform;
}


/* ============================================================
   TOTALS
   ============================================================ */

function recalculateTotals(
    database
) {

    const state =
        database.media
            ?.socialMedia;

    if (
        !state ||
        !state.platforms
    ) {

        return null;
    }

    let followers = 0;

    let reach = 0;

    let views = 0;

    let engagement = 0;

    for (
        const platform
        of Object.values(
            state.platforms
        )
    ) {

        followers +=
            integer(
                platform.followers
            );

        reach +=
            integer(
                platform.reach
            );

        views +=
            integer(
                platform.views
            );

        engagement +=

            integer(
                platform.likes
            ) +

            integer(
                platform.comments
            ) +

            integer(
                platform.shares
            );
    }

    state.totalFollowers =
        followers;

    state.totalReach =
        reach;

    state.totalViews =
        views;

    state.totalEngagement =
        engagement;

    state.overallEngagementRate =

        reach > 0

            ? (
                engagement /
                reach
            ) * 100

            : 0;

    state.socialInfluence =
        getSocialInfluence(
            database
        );

    state.socialMomentum =
        calculateSocialMomentum(
            database
        );

    return state;
}


/* ============================================================
   SOCIAL MOMENTUM
   ============================================================ */

function calculateSocialMomentum(
    database
) {

    const state =
        database.media
            ?.socialMedia;

    if (
        !state ||
        !state.platforms
    ) {

        return 0;
    }

    let gained = 0;

    let lost = 0;

    for (
        const platform
        of Object.values(
            state.platforms
        )
    ) {

        gained +=
            platform.statistics
                ?.followersGained ||
            0;

        lost +=
            platform.statistics
                ?.followersLost ||
            0;
    }

    const total =
        gained + lost;

    if (
        total <= 0
    ) {

        return 0;
    }

    return clamp(

        (
            (
                gained -
                lost
            ) /
            total
        ) * 100
    );
}


/* ============================================================
   WEEKLY GROWTH
   ============================================================ */

function processWeeklyGrowth(
    database,
    weeks = 1
) {

    const state =
        ensureSocialMedia(
            database
        );

    const duration =
        Math.max(
            0,
            integer(weeks)
        );

    for (
        let week = 0;
        week < duration;
        week++
    ) {

        for (
            const platformId
            of Object.keys(
                SOCIAL_MEDIA_CONFIG.platforms
            )
        ) {

            const platform =
                getPlatform(
                    database,
                    platformId
                );

            const influence =
                getSocialInfluence(
                    database
                );

            const baseRate =
                0.005 +

                influence /
                10000;

            const platformMultiplier =
                SOCIAL_MEDIA_CONFIG
                    .platforms[
                        platformId
                    ]
                    ?.growthMultiplier ||
                1;

            const growth =
                Math.max(

                    0,

                    Math.round(

                        platform.followers *

                        baseRate *

                        platformMultiplier
                    )
                );

            if (
                growth > 0
            ) {

                addFollowers(
                    database,
                    platformId,
                    growth,
                    "Weekly social growth"
                );
            }

            platform.statistics
                .weeksProcessed++;

            updatePlatformMetrics(
                database,
                platformId
            );
        }

        state.statistics
            .weeksProcessed++;

        state.history.push({

            timestamp:
                nowISO(),

            type:
                "weekly_growth",

            totalFollowers:
                state.totalFollowers
        });
    }

    if (
        state.history.length >
        300
    ) {

        state.history.splice(
            0,
            state.history.length - 300
        );
    }

    recalculateTotals(
        database
    );

    return getSocialMediaProfile(
        database
    );
}


/* ============================================================
   FIGHT CONTENT
   ============================================================ */

function processFightPost(
    database,
    result = "win",
    quality = 75
) {

    const state =
        ensureSocialMedia(
            database
        );

    state.statistics
        .fightsMentioned++;

    const results = {

        win: {
            content: "fight",
            quality:
                quality + 10
        },

        loss: {
            content: "fight",
            quality:
                quality - 5
        },

        knockout: {
            content: "fight",
            quality:
                quality + 20
        },

        submission: {
            content: "fight",
            quality:
                quality + 15
        },

        upset: {
            content: "fight",
            quality:
                quality + 25
        }
    };

    const selected =
        results[result] ||
        results.win;

    const created = [];

    for (
        const platformId
        of Object.keys(
            SOCIAL_MEDIA_CONFIG.platforms
        )
    ) {

        const post =
            createPost(
                database,
                platformId,
                selected.content,
                clamp(
                    selected.quality
                ),
                `Fight result: ${result}`
            );

        created.push(
            post
        );
    }

    return created;
}


/* ============================================================
   TITLE CONTENT
   ============================================================ */

function processTitlePost(
    database,
    eventType = "win",
    titleName = "Championship"
) {

    const state =
        ensureSocialMedia(
            database
        );

    state.statistics
        .titlesMentioned++;

    let quality = 90;

    if (
        eventType === "defense"
    ) {

        quality = 85;
    }

    if (
        eventType === "loss"
    ) {

        quality = 70;
    }

    const created = [];

    for (
        const platformId
        of Object.keys(
            SOCIAL_MEDIA_CONFIG.platforms
        )
    ) {

        created.push(

            createPost(

                database,

                platformId,

                "fight",

                quality,

                `Title ${eventType}: ${titleName}`
            )
        );
    }

    return created;
}


/* ============================================================
   RIVALRY CONTENT
   ============================================================ */

function processRivalryPost(
    database,
    intensity = "medium"
) {

    const state =
        ensureSocialMedia(
            database
        );

    state.statistics
        .rivalriesMentioned++;

    const qualityMap = {

        low: 55,

        medium: 70,

        high: 85,

        extreme: 95
    };

    const quality =
        qualityMap[
            intensity
        ] ||
        70;

    const created = [];

    for (
        const platformId
        of Object.keys(
            SOCIAL_MEDIA_CONFIG.platforms
        )
    ) {

        created.push(

            createPost(

                database,

                platformId,

                "trash_talk",

                quality,

                `Rivalry intensity: ${intensity}`
            )
        );
    }

    return created;
}


/* ============================================================
   CONTROVERSY CONTENT
   ============================================================ */

function processControversyPost(
    database,
    severity = "medium"
) {

    const state =
        ensureSocialMedia(
            database
        );

    state.statistics
        .controversiesMentioned++;

    const qualityMap = {

        low: 40,

        medium: 55,

        high: 70,

        extreme: 85
    };

    const quality =
        qualityMap[
            severity
        ] ||
        55;

    const created = [];

    for (
        const platformId
        of Object.keys(
            SOCIAL_MEDIA_CONFIG.platforms
        )
    ) {

        created.push(

            createPost(

                database,

                platformId,

                "opinion",

                quality,

                `Controversy: ${severity}`
            )
        );
    }

    return created;
}


/* ============================================================
   TRAINING CONTENT
   ============================================================ */

function processTrainingPost(
    database,
    quality = 70,
    description = "Training session"
) {

    const created = [];

    for (
        const platformId
        of Object.keys(
            SOCIAL_MEDIA_CONFIG.platforms
        )
    ) {

        const contentType =

            platformId === "youtube"

                ? "vlog"

                : platformId === "tiktok"

                    ? "training"

                    : "training";

        created.push(

            createPost(

                database,

                platformId,

                contentType,

                quality,

                description
            )
        );
    }

    return created;
}


/* ============================================================
   FAN INTERACTION
   ============================================================ */

function processFanInteraction(
    database,
    quality = 70
) {

    const created = [];

    for (
        const platformId
        of Object.keys(
            SOCIAL_MEDIA_CONFIG.platforms
        )
    ) {

        created.push(

            createPost(

                database,

                platformId,

                "reply",

                quality,

                "Fan interaction"
            )
        );
    }

    return created;
}


/* ============================================================
   CHECK MILESTONES
   ============================================================ */

function checkMilestones(
    database,
    platformId = null
) {

    const state =
        ensureSocialMedia(
            database
        );

    const platforms =
        platformId

            ? [
                getPlatform(
                    database,
                    platformId
                )
            ]

            : Object.values(
                state.platforms
            );

    for (
        const platform
        of platforms
    ) {

        for (
            const milestone
            of SOCIAL_MEDIA_CONFIG
                .milestones
        ) {

            if (
                platform.followers >=
                milestone
            ) {

                const reached =
                    platform.milestones
                        .some(
                            item =>
                                item.value ===
                                milestone
                        );

                if (
                    !reached
                ) {

                    platform.milestones
                        .push({

                            value:
                                milestone,

                            reachedAt:
                                nowISO(),

                            followers:
                                platform.followers
                        });
                }
            }
        }
    }

    checkGlobalMilestones(
        database
    );

    return state.milestones;
}


function checkGlobalMilestones(
    database
) {

    const state =
        ensureSocialMedia(
            database
        );

    for (
        const milestone
        of SOCIAL_MEDIA_CONFIG
            .milestones
    ) {

        if (
            state.totalFollowers >=
            milestone
        ) {

            const reached =
                state.milestones
                    .some(
                        item =>
                            item.value ===
                            milestone
                    );

            if (
                !reached
            ) {

                state.milestones.push({

                    value:
                        milestone,

                    reachedAt:
                        nowISO(),

                    followers:
                        state.totalFollowers,

                    type:
                        "global"
                });
            }
        }
    }

    return state.milestones;
}


/* ============================================================
   PLATFORM PROFILE
   ============================================================ */

function getPlatformProfile(
    database,
    platformId
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    updatePlatformMetrics(
        database,
        platformId
    );

    return {

        id:
            platform.id,

        name:
            platform.name,

        followers:
            platform.followers,

        formattedFollowers:
            formatNumber(
                platform.followers
            ),

        posts:
            platform.posts,

        likes:
            platform.likes,

        comments:
            platform.comments,

        shares:
            platform.shares,

        views:
            platform.views,

        reach:
            platform.reach,

        engagementRate:
            round(
                platform.engagementRate
            ),

        growthRate:
            round(
                platform.growthRate
            ),

        momentum:
            round(
                platform.momentum
            ),

        verified:
            platform.verified,

        active:
            platform.active,

        milestones:
            platform.milestones
                .map(
                    item => ({
                        ...item
                    })
                ),

        statistics: {

            ...platform.statistics
        }
    };
}


/* ============================================================
   COMPLETE PROFILE
   ============================================================ */

function getSocialMediaProfile(
    database
) {

    const state =
        ensureSocialMedia(
            database
        );

    recalculateTotals(
        database
    );

    const platformProfiles = {};

    for (
        const platformId
        of Object.keys(
            state.platforms
        )
    ) {

        platformProfiles[
            platformId
        ] =
            getPlatformProfile(
                database,
                platformId
            );
    }

    return {

        version:
            state.version,

        totalFollowers:
            state.totalFollowers,

        formattedFollowers:
            formatNumber(
                state.totalFollowers
            ),

        totalReach:
            state.totalReach,

        totalViews:
            state.totalViews,

        totalEngagement:
            state.totalEngagement,

        engagementRate:
            round(
                state.overallEngagementRate
            ),

        socialInfluence:
            round(
                state.socialInfluence
            ),

        socialMomentum:
            round(
                state.socialMomentum
            ),

        platforms:
            platformProfiles,

        milestones:
            state.milestones
                .map(
                    item => ({
                        ...item
                    })
                ),

        lastPost:
            state.lastPost,

        statistics: {

            ...state.statistics
        }
    };
}


/* ============================================================
   FORMAT NUMBERS
   ============================================================ */

function formatNumber(
    value
) {

    const number =
        Math.max(
            0,
            integer(value)
        );

    if (
        number < 1000
    ) {

        return String(
            number
        );
    }

    if (
        number < 1000000
    ) {

        return `${round(
            number / 1000,
            1
        )}K`;
    }

    if (
        number < 1000000000
    ) {

        return `${round(
            number / 1000000,
            1
        )}M`;
    }

    return `${round(
        number / 1000000000,
        2
    )}B`;
}


/* ============================================================
   RECENT POSTS
   ============================================================ */

function getRecentPosts(
    database,
    limit = 20
) {

    const state =
        ensureSocialMedia(
            database
        );

    const amount =
        Math.max(
            1,
            integer(limit)
        );

    return state.posts
        .slice(-amount)
        .reverse()
        .map(
            post => ({
                ...post
            })
        );
}


/* ============================================================
   VIRAL POSTS
   ============================================================ */

function getViralPosts(
    database,
    limit = 20
) {

    const state =
        ensureSocialMedia(
            database
        );

    const amount =
        Math.max(
            1,
            integer(limit)
        );

    return state.viralPosts
        .slice(-amount)
        .reverse()
        .map(
            post => ({
                ...post
            })
        );
}


/* ============================================================
   HISTORY
   ============================================================ */

function getSocialMediaHistory(
    database,
    limit = 50
) {

    const state =
        ensureSocialMedia(
            database
        );

    const amount =
        Math.max(
            1,
            integer(limit)
        );

    return state.history
        .slice(-amount)
        .reverse()
        .map(
            item => ({
                ...item
            })
        );
}


/* ============================================================
   STATISTICS
   ============================================================ */

function getSocialMediaStatistics(
    database
) {

    const state =
        ensureSocialMedia(
            database
        );

    recalculateTotals(
        database
    );

    return {

        ...state.statistics,

        totalFollowers:
            state.totalFollowers,

        totalReach:
            state.totalReach,

        totalViews:
            state.totalViews,

        totalEngagement:
            state.totalEngagement,

        engagementRate:
            round(
                state.overallEngagementRate
            ),

        socialInfluence:
            round(
                state.socialInfluence
            ),

        socialMomentum:
            round(
                state.socialMomentum
            )
    };
}


/* ============================================================
   VERIFY ACCOUNT
   ============================================================ */

function verifyPlatform(
    database,
    platformId,
    verified = true
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    platform.verified =
        Boolean(
            verified
        );

    return platform.verified;
}


/* ============================================================
   ACTIVATE / DEACTIVATE
   ============================================================ */

function setPlatformActive(
    database,
    platformId,
    active = true
) {

    const platform =
        getPlatform(
            database,
            platformId
        );

    platform.active =
        Boolean(
            active
        );

    return platform.active;
}


/* ============================================================
   SOCIAL MEDIA OPPORTUNITY
   ============================================================ */

function canGoViral(
    database,
    platformId,
    contentType = "post",
    quality = 70
) {

    getPlatform(
        database,
        platformId
    );

    const content =
        getContentConfig(
            contentType
        );

    const influence =
        getSocialInfluence(
            database
        );

    const score =

        quality * 0.40 +

        influence * 0.30 +

        content.viralChance *
        100 *
        0.30;

    return {

        possible:
            score >= 55,

        score:
            round(
                score
            ),

        level:
            getViralLevel(
                score
            )
    };
}


/* ============================================================
   RESET
   ============================================================ */

function resetSocialMedia(
    database
) {

    ensureDatabase(
        database
    );

    database.media.socialMedia =
        createSocialMediaState();

    return database.media.socialMedia;
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateSocialMedia(
    database
) {

    try {

        const state =
            ensureSocialMedia(
                database
            );

        const problems = [];

        if (
            !state.platforms
        ) {

            problems.push(
                "Platforms missing."
            );
        }

        for (
            const platformId
            of Object.keys(
                SOCIAL_MEDIA_CONFIG.platforms
            )
        ) {

            const platform =
                state.platforms[
                    platformId
                ];

            if (
                !platform
            ) {

                problems.push(
                    `Missing platform: ${platformId}`
                );

                continue;
            }

            if (
                !Number.isFinite(
                    Number(
                        platform.followers
                    )
                )
            ) {

                problems.push(
                    `Invalid followers: ${platformId}`
                );
            }

            if (
                platform.followers < 0
            ) {

                problems.push(
                    `Negative followers: ${platformId}`
                );
            }

            if (
                !Array.isArray(
                    platform.history
                )
            ) {

                problems.push(
                    `Invalid history: ${platformId}`
                );
            }
        }

        if (
            !Array.isArray(
                state.posts
            )
        ) {

            problems.push(
                "Posts is not an array."
            );
        }

        if (
            !Array.isArray(
                state.viralPosts
            )
        ) {

            problems.push(
                "Viral posts is not an array."
            );
        }

        return {

            valid:
                problems.length === 0,

            problems
        };

    } catch (
        error
    ) {

        return {

            valid: false,

            problems: [
                error.message
            ]
        };
    }
}


/* ============================================================
   SUMMARY
   ============================================================ */

function getSocialMediaSummary(
    database
) {

    const profile =
        getSocialMediaProfile(
            database
        );

    return {

        followers:
            profile.totalFollowers,

        formattedFollowers:
            profile.formattedFollowers,

        reach:
            profile.totalReach,

        views:
            profile.totalViews,

        engagement:
            profile.totalEngagement,

        engagementRate:
            profile.engagementRate,

        influence:
            profile.socialInfluence,

        momentum:
            profile.socialMomentum,

        instagram:
            profile.platforms
                .instagram
                ?.followers ||
            0,

        x:
            profile.platforms
                .x
                ?.followers ||
            0,

        youtube:
            profile.platforms
                .youtube
                ?.followers ||
            0,

        tiktok:
            profile.platforms
                .tiktok
                ?.followers ||
            0
    };
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const SocialMediaEngine = {

    SOCIAL_MEDIA_VERSION,

    SOCIAL_MEDIA_CONFIG,

    createPlatformState,

    createSocialMediaState,

    ensureSocialMedia,

    getPlatform,

    getFollowers,

    setFollowers,

    addFollowers,

    removeFollowers,

    recordPlatformHistory,

    getContentConfig,

    getMediaValue,

    getSocialInfluence,

    getPersonaScore,

    createPost,

    calculatePostFollowers,

    calculateViralScore,

    getViralLevel,

    calculateViralFollowers,

    updatePlatformMetrics,

    recalculateTotals,

    calculateSocialMomentum,

    processWeeklyGrowth,

    processFightPost,

    processTitlePost,

    processRivalryPost,

    processControversyPost,

    processTrainingPost,

    processFanInteraction,

    checkMilestones,

    checkGlobalMilestones,

    getPlatformProfile,

    getSocialMediaProfile,

    formatNumber,

    getRecentPosts,

    getViralPosts,

    getSocialMediaHistory,

    getSocialMediaStatistics,

    verifyPlatform,

    setPlatformActive,

    canGoViral,

    resetSocialMedia,

    validateSocialMedia,

    getSocialMediaSummary
};


/* ============================================================
   NAMED EXPORTS
   ============================================================ */

export {

    SOCIAL_MEDIA_VERSION,

    SOCIAL_MEDIA_CONFIG,

    createPlatformState,

    createSocialMediaState,

    ensureSocialMedia,

    getPlatform,

    getFollowers,

    setFollowers,

    addFollowers,

    removeFollowers,

    recordPlatformHistory,

    getContentConfig,

    getMediaValue,

    getSocialInfluence,

    getPersonaScore,

    createPost,

    calculatePostFollowers,

    calculateViralScore,

    getViralLevel,

    calculateViralFollowers,

    updatePlatformMetrics,

    recalculateTotals,

    calculateSocialMomentum,

    processWeeklyGrowth,

    processFightPost,

    processTitlePost,

    processRivalryPost,

    processControversyPost,

    processTrainingPost,

    processFanInteraction,

    checkMilestones,

    checkGlobalMilestones,

    getPlatformProfile,

    getSocialMediaProfile,

    formatNumber,

    getRecentPosts,

    getViralPosts,

    getSocialMediaHistory,

    getSocialMediaStatistics,

    verifyPlatform,

    setPlatformActive,

    canGoViral,

    resetSocialMedia,

    validateSocialMedia,

    getSocialMediaSummary
};


export default SocialMediaEngine;
