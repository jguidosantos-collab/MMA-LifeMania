/* =========================================================
   MMA LIFE DYNASTY
   RANKING.JS
   PROJETO — RANKINGS + CAMPEÕES + UFC P4P
========================================================= */
/* =========================================================
   CONFIGURAÇÃO
========================================================= */
const RANKING_TOP_SIZE = 15;
const RANKING_WEIGHT_CLASSES = [
    "Peso Leve",
    "Peso Meio-Médio",
    "Peso Médio",
    "Peso Meio-Pesado",
    "Peso Pesado"
];
/* =========================================================
   ORGANIZAÇÕES
========================================================= */
const rankingOrganizations = [
    {
        id: "world_regional_brazil",
        name: "Circuito Regional Brasileiro",
        level: 1
    },
    {
        id: "world_shooto_brasil",
        name: "Shooto Brasil",
        level: 1
    },
    {
        id: "world_jungle_fight",
        name: "Jungle Fight",
        level: 2
    },
    {
        id: "world_lfa",
        name: "LFA",
        level: 2
    },
    {
        id: "world_pfl",
        name: "PFL",
        level: 4
    },
    {
        id: "world_one",
        name: "ONE Championship",
        level: 4
    },
    {
        id: "world_bellator",
        name: "Bellator",
        level: 4
    },
    {
        id: "world_rizin",
        name: "RIZIN",
        level: 4
    },
    {
        id: "world_ksw",
        name: "KSW",
        level: 4
    },
    {
        id: "world_uae",
        name: "UAE Warriors",
        level: 4
    },
    {
        id: "world_ufc",
        name: "UFC",
        level: 6
    }
];
/* =========================================================
   GARANTIR MUNDO
========================================================= */
function ensureRankingWorld() {
    if (
        typeof window.mmaWorld ===
        "undefined"
    ) {
        console.warn(
            "Mundo MMA ainda não foi carregado."
        );
        return false;
    }
    if (
        typeof window.initializeMMWorld ===
        "function"
    ) {
        window.initializeMMWorld();
    }
    if (
        !Array.isArray(
            window.mmaWorld.fighters
        )
    ) {
        window.mmaWorld.fighters = [];
    }
    if (
        !Array.isArray(
            window.mmaWorld.championships
        )
    ) {
        window.mmaWorld.championships = [];
    }
    return true;
}
/* =========================================================
   NORMALIZAR ORGANIZAÇÃO
========================================================= */
function normalizeRankingOrganization(
    organization
) {
    if (!organization) {
        return null;
    }
    if (
        typeof organization ===
        "object"
    ) {
        return (
            organization.name ||
            organization.id ||
            null
        );
    }
    return organization;
}
/* =========================================================
   OBTER LUTADORES DA ORGANIZAÇÃO
========================================================= */
function getRankingFighters(
    organization,
    weightClass
) {
    if (!ensureRankingWorld()) {
        return [];
    }
    const organizationName =
        normalizeRankingOrganization(
            organization
        );
    return window.mmaWorld.fighters
        .filter(
            fighter => {
                if (
                    fighter.active === false
                ) {
                    return false;
                }
                if (
                    fighter.organization !==
                    organizationName
                ) {
                    return false;
                }
                if (
                    weightClass &&
                    fighter.weight !==
                    weightClass
                ) {
                    return false;
                }
                return true;
            }
        );
}
/* =========================================================
   SCORE DO RANKING
========================================================= */
function calculateRankingScore(
    fighter
) {
    if (!fighter) {
        return 0;
    }
    const wins =
        Number(
            fighter.wins || 0
        );
    const losses =
        Number(
            fighter.losses || 0
        );
    const draws =
        Number(
            fighter.draws || 0
        );
    const power =
        Number(
            fighter.power || 0
        );
    const fame =
        Number(
            fighter.fame || 0
        );
    /*
     * Vitórias têm grande peso.
     * Poder representa a força atual.
     * Fama ajuda a diferenciar lutadores
     * de nível semelhante.
     *
     * Derrotas reduzem a pontuação,
     * mas não eliminam automaticamente
     * um lutador de alto nível.
     */
    return (
        wins * 8
    ) + (
        power * 1.5
    ) + (
        fame * 0.75
    ) - (
        losses * 5
    ) + (
        draws * 1
    );
}
/* =========================================================
   ORDENAR RANKING
========================================================= */
function sortRankingFighters(
    fighters
) {
    return [...fighters].sort(
        (
            fighterA,
            fighterB
        ) => {
            const scoreA =
                calculateRankingScore(
                    fighterA
                );
            const scoreB =
                calculateRankingScore(
                    fighterB
                );
            if (
                scoreB !== scoreA
            ) {
                return scoreB -
                       scoreA;
            }
            /*
             * Desempate por vitórias.
             */
            if (
                Number(fighterB.wins || 0) !==
                Number(fighterA.wins || 0)
            ) {
                return (
                    Number(fighterB.wins || 0) -
                    Number(fighterA.wins || 0)
                );
            }
            /*
             * Desempate por poder.
             */
            if (
                Number(fighterB.power || 0) !==
                Number(fighterA.power || 0)
            ) {
                return (
                    Number(fighterB.power || 0) -
                    Number(fighterA.power || 0)
                );
            }
            /*
             * Desempate por fama.
             */
            return (
                Number(fighterB.fame || 0) -
                Number(fighterA.fame || 0)
            );
        }
    );
}
/* =========================================================
   ATUALIZAR POSIÇÕES
========================================================= */
function updateRankingPositions(
    fighters
) {
    fighters.forEach(
        (
            fighter,
            index
        ) => {
            fighter.ranking =
                index + 1;
        }
    );
}
/* =========================================================
   RANKING DE UMA CATEGORIA
========================================================= */
function getOrganizationWeightRanking(
    organization,
    weightClass
) {
    const fighters =
        getRankingFighters(
            organization,
            weightClass
        );
    const ranking =
        sortRankingFighters(
            fighters
        );
    updateRankingPositions(
        ranking
    );
    return ranking.slice(
        0,
        RANKING_TOP_SIZE
    );
}
/* =========================================================
   RANKING TOP 15
========================================================= */
function getOrganizationTop15(
    organization,
    weightClass
) {
    return getOrganizationWeightRanking(
        organization,
        weightClass
    );
}
/* =========================================================
   CAMPEÃO
========================================================= */
function getRankingChampion(
    organization,
    weightClass
) {
    if (!ensureRankingWorld()) {
        return null;
    }
    const organizationName =
        normalizeRankingOrganization(
            organization
        );
    /*
     * Primeiro procura um cinturão
     * oficial já registrado no mundo.
     */
    const championship =
        window.mmaWorld.championships.find(
            belt =>
                belt.organization ===
                organizationName &&
                belt.weightClass ===
                weightClass
        );
    if (
        championship &&
        championship.champion
    ) {
        const champion =
            window.mmaWorld.fighters.find(
                fighter =>
                    fighter.id ===
                    championship.champion
            );
        if (champion) {
            return champion;
        }
    }
    /*
     * Caso o cinturão ainda não tenha
     * campeão registrado, o primeiro
     * do ranking ocupa a posição.
     */
    const ranking =
        getOrganizationWeightRanking(
            organizationName,
            weightClass
        );
    return ranking[0] || null;
}
/* =========================================================
   CAMPEÃO INTERINO
========================================================= */
function getRankingInterimChampion(
    organization,
    weightClass
) {
    if (!ensureRankingWorld()) {
        return null;
    }
    const organizationName =
        normalizeRankingOrganization(
            organization
        );
    const championship =
        window.mmaWorld.championships.find(
            belt =>
                belt.organization ===
                organizationName &&
                belt.weightClass ===
                weightClass
        );
    if (
        !championship ||
        !championship.interimChampion
    ) {
        return null;
    }
    return (
        window.mmaWorld.fighters.find(
            fighter =>
                fighter.id ===
                championship.interimChampion
        ) || null
    );
}
/* =========================================================
   INFORMAÇÃO COMPLETA DA CATEGORIA
========================================================= */
function getWeightDivisionRanking(
    organization,
    weightClass
) {
    const ranking =
        getOrganizationWeightRanking(
            organization,
            weightClass
        );
    const champion =
        getRankingChampion(
            organization,
            weightClass
        );
    const interimChampion =
        getRankingInterimChampion(
            organization,
            weightClass
        );
    return {
        organization:
            normalizeRankingOrganization(
                organization
            ),
        weightClass:
            weightClass,
        champion:
            champion,
        interimChampion:
            interimChampion,
        ranking:
            ranking
    };
}
/* =========================================================
   TODAS AS CATEGORIAS DA ORGANIZAÇÃO
========================================================= */
function getOrganizationFullRanking(
    organization
) {
    const result = [];
    RANKING_WEIGHT_CLASSES.forEach(
        weightClass => {
            result.push(
                getWeightDivisionRanking(
                    organization,
                    weightClass
                )
            );
        }
    );
    return result;
}
/* =========================================================
   RANKING COMPLETO DE TODAS AS ORGANIZAÇÕES
========================================================= */
function getAllOrganizationRankings() {
    const result = [];
    rankingOrganizations.forEach(
        organization => {
            result.push({
                id:
                    organization.id,
                name:
                    organization.name,
                level:
                    organization.level,
                divisions:
                    getOrganizationFullRanking(
                        organization.name
                    )
            });
        }
    );
    return result;
}
/* =========================================================
   UFC — POUND FOR POUND
========================================================= */
function calculateUFCP4PScore(
    fighter
) {
    if (!fighter) {
        return 0;
    }
    const rankingScore =
        calculateRankingScore(
            fighter
        );
    /*
     * O P4P considera força,
     * vitórias, fama e desempenho.
     *
     * Não considera diretamente
     * a categoria de peso.
     */
    return (
        rankingScore
    ) + (
        Number(fighter.power || 0) * 2
    ) + (
        Number(fighter.fame || 0)
    );
}
/* =========================================================
   RANKING UFC P4P
========================================================= */
function getUFCPoundForPound() {
    if (!ensureRankingWorld()) {
        return [];
    }
    const ufcFighters =
        window.mmaWorld.fighters
            .filter(
                fighter =>
                    fighter.active !== false &&
                    fighter.organization ===
                    "UFC"
            );
    const ranking =
        [...ufcFighters].sort(
            (
                fighterA,
                fighterB
            ) => {
                const scoreA =
                    calculateUFCP4PScore(
                        fighterA
                    );
                const scoreB =
                    calculateUFCP4PScore(
                        fighterB
                    );
                return scoreB -
                       scoreA;
            }
        );
    ranking.forEach(
        (
            fighter,
            index
        ) => {
            fighter.p4pRanking =
                index + 1;
        }
    );
    return ranking.slice(
        0,
        RANKING_TOP_SIZE
    );
}
/* =========================================================
   ATUALIZAR RANKING GERAL
========================================================= */
function updateAllRankings() {
    if (!ensureRankingWorld()) {
        return;
    }
    rankingOrganizations.forEach(
        organization => {
            RANKING_WEIGHT_CLASSES.forEach(
                weightClass => {
                    getOrganizationWeightRanking(
                        organization.name,
                        weightClass
                    );
                }
            );
        }
    );
    getUFCPoundForPound();
}
/* =========================================================
   LOCALIZAR JOGADOR NO RANKING
========================================================= */
function getPlayerRankingEntry(
    organization,
    weightClass
) {
    ensureRankingWorld();
    if (
        typeof window.player ===
        "undefined" ||
        !window.player
    ) {
        return null;
    }
    const organizationName =
        normalizeRankingOrganization(
            organization
        );
    const player =
        window.player;
    /*
     * O jogador não precisa existir
     * fisicamente dentro de mmaWorld
     * para consultarmos sua posição.
     *
     * Isso permite integração futura
     * com o ranking profissional.
     */
    const worldFighters =
        getRankingFighters(
            organizationName,
            weightClass
        );
    const ranking =
        sortRankingFighters(
            worldFighters
        );
    const playerName =
        player.name;
    const playerInWorld =
        ranking.find(
            fighter =>
                fighter.name ===
                playerName
        );
    if (playerInWorld) {
        return {
            fighter:
                playerInWorld,
            position:
                ranking.indexOf(
                    playerInWorld
                ) + 1
        };
    }
    return null;
}
/* =========================================================
   VERIFICAR SE JOGADOR ESTÁ NO TOP 15
========================================================= */
function isPlayerRanked(
    organization,
    weightClass
) {
    const entry =
        getPlayerRankingEntry(
            organization,
            weightClass
        );
    if (!entry) {
        return false;
    }
    return (
        entry.position <=
        RANKING_TOP_SIZE
    );
}
/* =========================================================
   RESUMO DO CAMPEÃO
========================================================= */
function getChampionSummary(
    organization,
    weightClass
) {
    const champion =
        getRankingChampion(
            organization,
            weightClass
        );
    if (!champion) {
        return {
            name:
                "Vago",
            id:
                null,
            record:
                "0-0-0",
            power:
                0,
            fame:
                0
        };
    }
    return {
        name:
            champion.name,
        id:
            champion.id,
        record:
            `${champion.wins || 0}-${champion.losses || 0}-${champion.draws || 0}`,
        power:
            Math.round(
                Number(
                    champion.power || 0
                )
            ),
        fame:
            Math.round(
                Number(
                    champion.fame || 0
                )
            )
    };
}
/* =========================================================
   HTML — LINHA DE LUTADOR
========================================================= */
function rankingFighterHTML(
    fighter,
    position
) {
    if (!fighter) {
        return "";
    }
    const record =
        `${fighter.wins || 0}-${fighter.losses || 0}-${fighter.draws || 0}`;
    return `
        <div class="ranking-row">
            <div class="ranking-position">
                #${position}
            </div>
            <div class="ranking-fighter">
                <strong>
                    ${fighter.name}
                </strong>
                <span>
                    ${fighter.country || ""}
                </span>
            </div>
            <div class="ranking-record">
                ${record}
            </div>
            <div class="ranking-power">
                OVR
                ${Math.round(
                    Number(
                        fighter.power || 0
                    )
                )}
            </div>
        </div>
    `;
}
/* =========================================================
   HTML — CATEGORIA
========================================================= */
function rankingDivisionHTML(
    division
) {
    const champion =
        division.champion;
    const interim =
        division.interimChampion;
    const ranking =
        division.ranking || [];
    let html = `
        <div class="card ranking-division">
            <div class="title">
                ⚖️
                ${division.weightClass}
            </div>
            <div class="ranking-champion">
                <span>
                    🏆 CAMPEÃO
                </span>
                <strong>
                    ${
                        champion
                        ?
                        champion.name
                        :
                        "Cinturão vago"
                    }
                </strong>
            </div>
    `;
    if (interim) {
        html += `
            <div class="ranking-interim">
                <span>
                    🥈 INTERINO
                </span>
                <strong>
                    ${interim.name}
                </strong>
            </div>
        `;
    }
    html += `
            <div class="ranking-list">
    `;
    ranking.forEach(
        (
            fighter,
            index
        ) => {
            html +=
                rankingFighterHTML(
                    fighter,
                    index + 1
                );
        }
    );
    if (
        ranking.length ===
        0
    ) {
        html += `
            <p>
                Nenhum lutador cadastrado.
            </p>
        `;
    }
    html += `
            </div>
        </div>
    `;
    return html;
}
/* =========================================================
   TELA DE RANKING
========================================================= */
function rankingScreen() {
    ensurePlayer();
    if (!ensureRankingWorld()) {
        const content =
            getContent();
        if (content) {
            content.innerHTML = `
                <div class="card">
                    <div class="title">
                        🏆 RANKING
                    </div>
                    <p>
                        O Mundo MMA ainda está sendo carregado.
                    </p>
                </div>
            `;
        }
        return;
    }
    updateAllRankings();
    const content =
        getContent();
    if (!content) {
        return;
    }
    let selectedOrganization =
        "UFC";
    /*
     * Se já existir uma seleção
     * anterior, preserva.
     */
    if (
        window.currentRankingOrganization
    ) {
        selectedOrganization =
            window.currentRankingOrganization;
    }
    const organization =
        rankingOrganizations.find(
            item =>
                item.name ===
                selectedOrganization
        ) ||
        rankingOrganizations[
            rankingOrganizations.length - 1
        ];
    window.currentRankingOrganization =
        organization.name;
    const divisions =
        getOrganizationFullRanking(
            organization.name
        );
    let html = `
        <div class="card">
            <div class="title">
                🏆 RANKINGS DO MUNDO MMA
            </div>
            <p>
                Top 15, campeões e categorias
                de todas as organizações.
            </p>
            <select
                id="rankingOrganizationSelect"
                onchange="changeRankingOrganization(this.value)"
            >
    `;
    rankingOrganizations.forEach(
        item => {
            html += `
                <option
                    value="${item.name}"
                    ${
                        item.name ===
                        organization.name
                        ?
                        "selected"
                        :
                        ""
                    }
                >
                    ${item.name}
                </option>
            `;
        }
    );
    html += `
            </select>
        </div>
    `;
    /*
     * P4P aparece no topo quando
     * estamos visualizando o UFC.
     */
    if (
        organization.name ===
        "UFC"
    ) {
        const p4p =
            getUFCPoundForPound();
        html += `
            <div class="card">
                <div class="title">
                    👑 UFC — POUND FOR POUND
                </div>
                <p>
                    Os melhores lutadores do UFC,
                    independentemente da categoria.
                </p>
                <div class="ranking-list">
        `;
        p4p.forEach(
            (
                fighter,
                index
            ) => {
                html +=
                    rankingFighterHTML(
                        fighter,
                        index + 1
                    );
            }
        );
        html += `
                </div>
            </div>
        `;
    }
    /*
     * Categorias da organização.
     */
    divisions.forEach(
        division => {
            html +=
                rankingDivisionHTML(
                    division
                );
        }
    );
    content.innerHTML =
        html;
}
/* =========================================================
   TROCAR ORGANIZAÇÃO
========================================================= */
function changeRankingOrganization(
    organization
) {
    window.currentRankingOrganization =
        organization;
    rankingScreen();
}
/* =========================================================
   ATUALIZAÇÃO SEMANAL
========================================================= */
function processRankingWeek() {
    if (!ensureRankingWorld()) {
        return;
    }
    /*
     * O ranking é atualizado depois
     * que o mundo realiza suas lutas.
     */
    updateAllRankings();
}
/* =========================================================
   NOTÍCIA — MUDANÇA DE CAMPEÃO
========================================================= */
function detectRankingChanges(
    previousChampions
) {
    if (!ensureRankingWorld()) {
        return [];
    }
    const changes = [];
    rankingOrganizations.forEach(
        organization => {
            RANKING_WEIGHT_CLASSES.forEach(
                weightClass => {
                    const champion =
                        getRankingChampion(
                            organization.name,
                            weightClass
                        );
                    const key =
                        organization.name +
                        "_" +
                        weightClass;
                    const previous =
                        previousChampions &&
                        previousChampions[key]
                        ?
                        previousChampions[key]
                        :
                        null;
                    if (
                        champion &&
                        previous &&
                        previous !==
                        champion.id
                    ) {
                        changes.push({
                            organization:
                                organization.name,
                            weightClass:
                                weightClass,
                            champion:
                                champion.name,
                            previousChampion:
                                previous
                        });
                    }
                }
            );
        }
    );
    return changes;
}
/* =========================================================
   CAPTURAR CAMPEÕES ATUAIS
========================================================= */
function captureCurrentChampions() {
    if (!ensureRankingWorld()) {
        return {};
    }
    const result = {};
    rankingOrganizations.forEach(
        organization => {
            RANKING_WEIGHT_CLASSES.forEach(
                weightClass => {
                    const champion =
                        getRankingChampion(
                            organization.name,
                            weightClass
                        );
                    const key =
                        organization.name +
                        "_" +
                        weightClass;
                    result[key] =
                        champion
                        ?
                        champion.id
                        :
                        null;
                }
            );
        }
    );
    return result;
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.getRankingFighters =
    getRankingFighters;
window.calculateRankingScore =
    calculateRankingScore;
window.getOrganizationWeightRanking =
    getOrganizationWeightRanking;
window.getOrganizationTop15 =
    getOrganizationTop15;
window.getRankingChampion =
    getRankingChampion;
window.getRankingInterimChampion =
    getRankingInterimChampion;
window.getWeightDivisionRanking =
    getWeightDivisionRanking;
window.getOrganizationFullRanking =
    getOrganizationFullRanking;
window.getAllOrganizationRankings =
    getAllOrganizationRankings;
window.getUFCPoundForPound =
    getUFCPoundForPound;
window.updateAllRankings =
    updateAllRankings;
window.getPlayerRankingEntry =
    getPlayerRankingEntry;
window.isPlayerRanked =
    isPlayerRanked;
window.getChampionSummary =
    getChampionSummary;
window.rankingScreen =
    rankingScreen;
window.changeRankingOrganization =
    changeRankingOrganization;
window.processRankingWeek =
    processRankingWeek;
window.detectRankingChanges =
    detectRankingChanges;
window.captureCurrentChampions =
    captureCurrentChampions;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
if (
    typeof window.mmaWorld !==
    "undefined" &&
    window.mmaWorld.initialized
) {
    updateAllRankings();
}
