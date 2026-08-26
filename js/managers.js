/* =========================================================
   MMA LIFE DYNASTY
   MANAGERS.JS
   SISTEMA DE EMPRESÁRIO
   VERSÃO CORRIGIDA — FLUXO COMPLETO
   FLUXO:
   1. Lutador está sem luta
   2. Empresário procura oportunidade
   3. Empresário apresenta UMA oferta
   4. Jogador aceita ou recusa
   5. Ao aceitar:
      - luta é marcada
      - camp começa
      - semanas de preparação são definidas
   6. Durante o camp:
      - não existe outra oferta
      - não existe outra luta
      - jogador treina normalmente
   7. Ao chegar ao dia da luta:
      - semana fica bloqueada
      - botão LUTAR AGORA aparece
   8. Depois da luta:
      - luta é encerrada
      - camp termina
      - empresário volta a procurar oportunidade
========================================================= */
/* =========================================================
   CONFIGURAÇÕES
========================================================= */
const MANAGER_CONFIG = {
    minCampWeeks: 4,
    maxCampWeeks: 8,
    searchCooldownWeeks: 2,
    firstFightWeek: 4,
    offerChance: 0.75,
    maxOfferAge: 1
};
/* =========================================================
   UTILIDADES
========================================================= */
function managerPlayer() {
    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {
        if (
            typeof window.createDefaultPlayer ===
            "function"
        ) {
            window.player =
                window.createDefaultPlayer();
        }
    }
    return window.player;
}
function managerSave() {
    if (
        typeof window.saveGame ===
        "function"
    ) {
        window.saveGame();
    }
}
function managerRandom(min, max) {
    return (
        Math.random() *
        (max - min)
    ) + min;
}
function managerRandomInt(min, max) {
    return Math.floor(
        managerRandom(
            min,
            max + 1
        )
    );
}
function managerClamp(value, min, max) {
    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}
/* =========================================================
   GARANTIR ESTRUTURA DO EMPRESÁRIO
========================================================= */
function ensureManagerData() {
    const player =
        managerPlayer();
    if (!player.manager) {
        player.manager = {
            active: true,
            name: "Carlos Mendes",
            reputation: 60,
            experience: 50,
            negotiation: 55,
            network: 50
        };
    }
    if (!Array.isArray(player.managerOffers)) {
        player.managerOffers = [];
    }
    if (
        typeof player.managerSearchCooldown !==
        "number"
    ) {
        player.managerSearchCooldown = 0;
    }
    if (
        typeof player.managerLastOfferWeek !==
        "number"
    ) {
        player.managerLastOfferWeek = -999;
    }
    if (
        typeof player.managerOfferId !==
        "number"
    ) {
        player.managerOfferId = 0;
    }
    if (
        typeof player.managerSearching !==
        "boolean"
    ) {
        player.managerSearching = false;
    }
    if (
        typeof player.managerSearchWeek !==
        "number"
    ) {
        player.managerSearchWeek = -999;
    }
    if (
        typeof player.managerOfferPending !==
        "boolean"
    ) {
        player.managerOfferPending = false;
    }
}
/* =========================================================
   VERIFICAR SE O JOGADOR ESTÁ EM CAMP
========================================================= */
function isInFightCamp() {
    const player =
        managerPlayer();
    const fight =
        player.nextFight;
    if (!fight) {
        return false;
    }
    if (
        fight.status === "camp"
    ) {
        return true;
    }
    if (
        fight.status === "scheduled"
    ) {
        return true;
    }
    if (
        fight.status === "fight_day"
    ) {
        return true;
    }
    if (
        typeof fight.fightWeek ===
        "number"
    ) {
        return (
            Number(player.week) <=
            Number(fight.fightWeek)
        );
    }
    return false;
}
/* =========================================================
   VERIFICAR DIA DA LUTA
========================================================= */
function managerIsFightDay() {
    const player =
        managerPlayer();
    const fight =
        player.nextFight;
    if (!fight) {
        return false;
    }
    if (
        fight.status === "fight_day"
    ) {
        return true;
    }
    if (
        typeof fight.weeksRemaining ===
        "number"
    ) {
        return (
            fight.weeksRemaining <= 0
        );
    }
    if (
        typeof fight.fightWeek ===
        "number"
    ) {
        return (
            Number(player.week) >=
            Number(fight.fightWeek)
        );
    }
    return false;
}
/* =========================================================
   VERIFICAR SE PODE PROCURAR NOVA LUTA
========================================================= */
function managerCanSearchFight() {
    const player =
        managerPlayer();
    ensureManagerData();
    /* NÃO procurar se já existe luta */
    if (player.nextFight) {
        return false;
    }
    /* NÃO procurar se existe oferta */
    if (
        player.managerFightOffer
    ) {
        return false;
    }
    /* NÃO procurar se há oferta na lista */
    if (
        player.managerOffers &&
        player.managerOffers.length > 0
    ) {
        return false;
    }
    /* COOLDOWN */
    if (
        Number(
            player.managerSearchCooldown || 0
        ) > 0
    ) {
        return false;
    }
    return true;
}
/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */
function generateManagerOpponent() {
    const player =
        managerPlayer();
    const playerOverall =
        typeof window.getOverall ===
        "function"
        ?
        Number(
            window.getOverall()
        )
        :
        Number(
            player.overall || 45
        );
    const variation =
        managerRandomInt(
            -8,
            8
        );
    const opponentPower =
        managerClamp(
            playerOverall +
            variation,
            35,
            95
        );
    const names = [
        "Lucas Andrade",
        "Rafael Silva",
        "Bruno Costa",
        "Diego Oliveira",
        "Matheus Santos",
        "Gabriel Ferreira",
        "Pedro Almeida",
        "Victor Souza",
        "André Martins",
        "Felipe Rocha",
        "Carlos Ribeiro",
        "João Mendes",
        "Thiago Lima",
        "Renan Alves",
        "Gustavo Pereira",
        "Eduardo Carvalho",
        "Leonardo Ramos",
        "Marcelo Torres",
        "Caio Moreira",
        "Henrique Dias"
    ];
    let name =
        names[
            managerRandomInt(
                0,
                names.length - 1
            )
        ];
    if (
        player.name &&
        name === player.name
    ) {
        name =
            "Ricardo Martins";
    }
    return {
        id:
            "OPP-" +
            Date.now() +
            "-" +
            managerRandomInt(
                1000,
                9999
            ),
        name: name,
        displayName: name,
        power: opponentPower,
        overall: opponentPower,
        age:
            managerRandomInt(
                18,
                35
            ),
        country:
            player.country ||
            "Brasil",
        style: [
            "Striker",
            "Wrestler",
            "Grappler",
            "Completo"
        ][
            managerRandomInt(
                0,
                3
            )
        ],
        wins:
            managerRandomInt(
                0,
                12
            ),
        losses:
            managerRandomInt(
                0,
                6
            ),
        draws: 0
    };
}
/* =========================================================
   GERAR NOME DO EVENTO
========================================================= */
function generateManagerEvent() {
    const events = [
        "MMA Fight Night",
        "Brazil Combat",
        "Warriors Championship",
        "Fight Arena",
        "MMA Revolution",
        "National Combat",
        "Ultimate Fight League",
        "Future Fighters",
        "Combat Warriors",
        "Cage Warriors Brasil"
    ];
    return events[
        managerRandomInt(
            0,
            events.length - 1
        )
    ];
}
/* =========================================================
   CALCULAR BOLSA
========================================================= */
function calculateManagerPurse() {
    const player =
        managerPlayer();
    const overall =
        typeof window.getOverall ===
        "function"
        ?
        Number(
            window.getOverall()
        )
        :
        Number(
            player.overall || 45
        );
    if (
        player.professional &&
        player.professional.active
    ) {
        return Math.round(
            800 +
            overall * 35 +
            Number(player.fame || 0) * 15
        );
    }
    return Math.round(
        100 +
        overall * 8 +
        Number(player.fame || 0) * 3
    );
}
/* =========================================================
   GERAR OFERTA
========================================================= */
function generateManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    const opponent =
        generateManagerOpponent();
    const eventName =
        generateManagerEvent();
    const purse =
        calculateManagerPurse();
    const winBonus =
        Math.round(
            purse * 0.5
        );
    const campWeeks =
        managerRandomInt(
            MANAGER_CONFIG.minCampWeeks,
            MANAGER_CONFIG.maxCampWeeks
        );
    const offer = {
        id:
            ++player.managerOfferId,
        type:
            "fight",
        status:
            "pending",
        createdWeek:
            Number(
                player.week || 1
            ),
        createdYear:
            Number(
                player.year || 2026
            ),
        eventName:
            eventName,
        opponent:
            opponent,
        opponentName:
            opponent.displayName,
        purse:
            purse,
        winBonus:
            winBonus,
        campWeeks:
            campWeeks,
        expiresInWeeks:
            MANAGER_CONFIG.maxOfferAge,
        accepted:
            false
    };
    return offer;
}
/* =========================================================
   EMPRESÁRIO PROCURA LUTA
========================================================= */
function processManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    /*
       REGRA FUNDAMENTAL:
       SE JÁ EXISTE LUTA,
       EMPRESÁRIO NÃO PROCURA OUTRA.
    */
    if (player.nextFight) {
        return null;
    }
    /*
       SE JÁ EXISTE OFERTA,
       NÃO CRIAR OUTRA.
    */
    if (
        player.managerFightOffer
    ) {
        return player.managerFightOffer;
    }
    /*
       SE EXISTE OFERTA NA FILA,
       NÃO CRIAR OUTRA.
    */
    if (
        player.managerOffers.length > 0
    ) {
        player.managerFightOffer =
            player.managerOffers[0];
        player.managerOfferPending =
            true;
        managerSave();
        return player.managerFightOffer;
    }
    /*
       COOLDOWN
    */
    if (
        Number(
            player.managerSearchCooldown || 0
        ) > 0
    ) {
        player.managerSearchCooldown =
            Math.max(
                0,
                Number(
                    player.managerSearchCooldown
                ) - 1
            );
        managerSave();
        return null;
    }
    /*
       NÃO criar luta automaticamente
       na mesma semana da criação.
    */
    const currentWeek =
        Number(
            player.week || 1
        );
    const lastOfferWeek =
        Number(
            player.managerLastOfferWeek ||
            -999
        );
    if (
        currentWeek ===
        lastOfferWeek
    ) {
        return null;
    }
    /*
       PRIMEIRA OPORTUNIDADE
    */
    if (
        currentWeek <
        MANAGER_CONFIG.firstFightWeek
    ) {
        return null;
    }
    /*
       CHANCE DE APARECER OFERTA
    */
    if (
        Math.random() >
        MANAGER_CONFIG.offerChance
    ) {
        player.managerSearchCooldown =
            MANAGER_CONFIG.searchCooldownWeeks;
        player.managerLastOfferWeek =
            currentWeek;
        managerSave();
        return null;
    }
    /*
       GERAR OFERTA
    */
    const offer =
        generateManagerFightOffer();
    player.managerFightOffer =
        offer;
    player.managerOfferPending =
        true;
    player.managerSearching =
        false;
    player.managerSearchWeek =
        currentWeek;
    player.managerLastOfferWeek =
        currentWeek;
    player.managerOffers = [];
    managerSave();
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            `📩 Seu empresário encontrou uma luta contra ${offer.opponentName}.`
        );
    }
    return offer;
}
/* =========================================================
   ACEITAR OFERTA
========================================================= */
function acceptManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    const offer =
        player.managerFightOffer;
    if (!offer) {
        alert(
            "Não existe nenhuma proposta de luta."
        );
        return false;
    }
    if (
        player.nextFight
    ) {
        alert(
            "Você já possui uma luta marcada."
        );
        return false;
    }
    /*
       DEFINIR CAMP
    */
    const campWeeks =
        managerClamp(
            Number(
                offer.campWeeks ||
                MANAGER_CONFIG.minCampWeeks
            ),
            MANAGER_CONFIG.minCampWeeks,
            MANAGER_CONFIG.maxCampWeeks
        );
    const currentWeek =
        Number(
            player.week || 1
        );
    const fightWeek =
        currentWeek +
        campWeeks;
    /*
       CRIAR LUTA
    */
    player.nextFight = {
        id:
            "FIGHT-" +
            Date.now(),
        status:
            "camp",
        event: {
            name:
                offer.eventName
        },
        eventName:
            offer.eventName,
        opponent:
            offer.opponent,
        opponentName:
            offer.opponentName,
        purse:
            Number(
                offer.purse || 0
            ),
        winBonus:
            Number(
                offer.winBonus || 0
            ),
        campWeeks:
            campWeeks,
        campStartWeek:
            currentWeek,
        fightWeek:
            fightWeek,
        weeksRemaining:
            campWeeks,
        acceptedWeek:
            currentWeek,
        acceptedYear:
            Number(
                player.year || 2026
            ),
        result:
            null,
        completed:
            false
    };
    /*
       LIMPAR OFERTA
    */
    player.managerFightOffer =
        null;
    player.managerOfferPending =
        false;
    player.managerOffers = [];
    player.managerSearching =
        false;
    player.managerSearchCooldown =
        0;
    /*
       LOG
    */
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            `🥊 Luta aceita! ${player.name} enfrentará ${offer.opponentName} em ${offer.eventName}.`
        );
        player.log.unshift(
            `🏋️ Camp de ${campWeeks} semanas iniciado.`
        );
    }
    managerSave();
    /*
       ATUALIZAR TELA
    */
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
    return true;
}
/* =========================================================
   RECUSAR OFERTA
========================================================= */
function declineManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !player.managerFightOffer
    ) {
        alert(
            "Não existe nenhuma proposta."
        );
        return false;
    }
    const opponentName =
        player.managerFightOffer.opponentName ||
        "adversário";
    player.managerFightOffer =
        null;
    player.managerOfferPending =
        false;
    player.managerOffers =
        [];
    player.managerSearching =
        false;
    player.managerSearchCooldown =
        2;
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            `❌ Você recusou a luta contra ${opponentName}.`
        );
    }
    managerSave();
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
    return true;
}
/* =========================================================
   ATUALIZAR CAMP A CADA SEMANA
========================================================= */
function processManagerCampWeek() {
    const player =
        managerPlayer();
    ensureManagerData();
    const fight =
        player.nextFight;
    if (!fight) {
        return;
    }
    if (
        fight.status ===
        "completed"
    ) {
        return;
    }
    const currentWeek =
        Number(
            player.week || 1
        );
    const fightWeek =
        Number(
            fight.fightWeek ||
            currentWeek
        );
    const remaining =
        Math.max(
            0,
            fightWeek -
            currentWeek
        );
    fight.weeksRemaining =
        remaining;
    /*
       CAMP
    */
    if (
        currentWeek <
        fightWeek
    ) {
        fight.status =
            "camp";
        return;
    }
    /*
       DIA DA LUTA
    */
    fight.status =
        "fight_day";
    fight.weeksRemaining =
        0;
}
/* =========================================================
   PROCESSAR SEMANA DO EMPRESÁRIO
========================================================= */
function processManagerWeek() {
    const player =
        managerPlayer();
    ensureManagerData();
    /*
       SE EXISTE LUTA:
       atualizar camp.
    */
    if (
        player.nextFight
    ) {
        processManagerCampWeek();
        managerSave();
        return;
    }
    /*
       SE EXISTE OFERTA:
       não procurar outra.
    */
    if (
        player.managerFightOffer
    ) {
        managerSave();
        return;
    }
    /*
       SEM LUTA:
       procurar oportunidade.
    */
    processManagerFightOffer();
}
/* =========================================================
   PROCESSAR ANO DO CONTRATO
========================================================= */
function processManagerContractYear() {
    const player =
        managerPlayer();
    ensureManagerData();
    /*
       Pequeno aumento de experiência
       do empresário.
    */
    if (
        player.manager
    ) {
        player.manager.experience =
            managerClamp(
                Number(
                    player.manager.experience ||
                    50
                ) + 1,
                1,
                100
            );
        player.manager.network =
            managerClamp(
                Number(
                    player.manager.network ||
                    50
                ) + 1,
                1,
                100
            );
    }
    managerSave();
}
/* =========================================================
   CANCELAR LUTA
   Usado somente por sistemas externos.
========================================================= */
function cancelManagerFight(reason) {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !player.nextFight
    ) {
        return false;
    }
    const opponent =
        player.nextFight.opponentName ||
        "adversário";
    player.nextFight =
        null;
    player.managerFightOffer =
        null;
    player.managerOfferPending =
        false;
    player.managerSearchCooldown =
        2;
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            `⚠️ A luta contra ${opponent} foi cancelada${reason ? `: ${reason}` : "."}`
        );
    }
    managerSave();
    return true;
}
/* =========================================================
   FINALIZAR LUTA
   Chamado pelo FIGHTS.JS depois do combate.
========================================================= */
function completeManagerFight(result) {
    const player =
        managerPlayer();
    ensureManagerData();
    const fight =
        player.nextFight;
    if (!fight) {
        return;
    }
    fight.status =
        "completed";
    fight.completed =
        true;
    fight.result =
        result || null;
    /*
       LIMPAR LUTA ATUAL
    */
    player.nextFight =
        null;
    /*
       LIMPAR OFERTA
    */
    player.managerFightOffer =
        null;
    player.managerOffers =
        [];
    player.managerOfferPending =
        false;
    /*
       COOLDOWN PARA NOVA OFERTA
    */
    player.managerSearchCooldown =
        2;
    /*
       LOG
    */
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            "📋 O empresário encerrou o processo desta luta."
        );
    }
    managerSave();
}
/* =========================================================
   OFERTA PARA TESTE
   Útil para verificar o sistema sem esperar semanas.
========================================================= */
function createManagerTestOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        player.nextFight
    ) {
        return false;
    }
    const offer =
        generateManagerFightOffer();
    player.managerFightOffer =
        offer;
    player.managerOfferPending =
        true;
    player.managerOffers =
        [];
    managerSave();
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
    return true;
}
/* =========================================================
   GARANTIR SISTEMA APÓS CARREGAMENTO
========================================================= */
function initializeManagers() {
    ensureManagerData();
}
/* =========================================================
   EXPORTAR GLOBALMENTE
========================================================= */
window.ensureManagerData =
    ensureManagerData;
window.isInFightCamp =
    isInFightCamp;
window.managerIsFightDay =
    managerIsFightDay;
window.managerCanSearchFight =
    managerCanSearchFight;
window.processManagerFightOffer =
    processManagerFightOffer;
window.processManagerCampWeek =
    processManagerCampWeek;
window.processManagerWeek =
    processManagerWeek;
window.acceptManagerFightOffer =
    acceptManagerFightOffer;
window.declineManagerFightOffer =
    declineManagerFightOffer;
window.processManagerContractYear =
    processManagerContractYear;
window.completeManagerFight =
    completeManagerFight;
window.cancelManagerFight =
    cancelManagerFight;
window.createManagerTestOffer =
    createManagerTestOffer;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeManagers
    );
}
else {
    initializeManagers();
}
