/* =========================================================
   MMA LIFE DYNASTY
   FIGHTS.JS
   FIGHT ENGINE — VERSÃO ATUALIZADA
   =========================================================
   FLUXO:
   EMPRESÁRIO OFERECE
        ↓
   JOGADOR ACEITA
        ↓
   CAMP DE PREPARAÇÃO
        ↓
   SEMANAS DE CAMP
        ↓
   DIA DA LUTA
        ↓
   LUTAR AGORA
        ↓
   COMBATE
        ↓
   RESULTADO
        ↓
   BOLSA / BÔNUS / RANKING / RECUPERAÇÃO
   IMPORTANTE:
   - NÃO cria luta sozinho.
   - NÃO inicia combate sozinho.
   - Luta só existe depois de aceita.
   - SemanasRemaining controla o camp.
   - No dia 0, a semana fica travada.
========================================================= */
/* =========================================================
   ESTADO GLOBAL
========================================================= */
window.mmaFight = null;
/* =========================================================
   UTILIDADES
========================================================= */
function fightPlayer() {
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
function fightSave() {
    if (
        typeof window.saveGame ===
        "function"
    ) {
        window.saveGame();
    }
}
function fightContent() {
    return document.getElementById(
        "content"
    );
}
function fightClamp(
    value,
    min,
    max
) {
    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}
function fightRandom(
    min,
    max
) {
    return (
        Math.random() *
        (
            max - min
        )
    ) + min;
}
function fightRandomInt(
    min,
    max
) {
    return Math.floor(
        fightRandom(
            min,
            max + 1
        )
    );
}
function fightNumber(
    value,
    fallback
) {
    const n =
        Number(value);
    return Number.isFinite(n)
        ? n
        : fallback;
}
function fightPercent(
    value
) {
    return fightClamp(
        fightNumber(value, 0),
        0,
        100
    );
}
/* =========================================================
   ATRIBUTOS
========================================================= */
function getFightAttributes(
    fighter
) {
    const a =
        fighter &&
        fighter.attributes
        ?
        fighter.attributes
        :
        {};
    return {
        strength:
            fightNumber(
                a.strength,
                45
            ),
        striking:
            fightNumber(
                a.striking,
                45
            ),
        wrestling:
            fightNumber(
                a.wrestling,
                45
            ),
        grappling:
            fightNumber(
                a.grappling,
                45
            ),
        cardio:
            fightNumber(
                a.cardio,
                45
            ),
        technique:
            fightNumber(
                a.technique,
                45
            ),
        defense:
            fightNumber(
                a.defense,
                45
            ),
        fightIQ:
            fightNumber(
                a.fightIQ,
                40
            ),
        chin:
            fightNumber(
                a.chin,
                45
            ),
        offense:
            fightNumber(
                a.offense,
                45
            ),
        blocking:
            fightNumber(
                a.blocking,
                45
            ),
        mental:
            fightNumber(
                a.mental,
                45
            ),
        confidence:
            fightNumber(
                a.confidence,
                40
            )
    };
}
/* =========================================================
   OVERALL DA LUTA
========================================================= */
function fightOverall(
    fighter
) {
    if (
        fighter &&
        typeof fighter.overall ===
        "number"
    ) {
        return fighter.overall;
    }
    const a =
        getFightAttributes(
            fighter
        );
    const values = [
        a.strength,
        a.striking,
        a.wrestling,
        a.grappling,
        a.cardio,
        a.technique,
        a.defense,
        a.fightIQ,
        a.chin,
        a.offense,
        a.blocking
    ];
    return Math.round(
        values.reduce(
            function(
                total,
                value
            ) {
                return total + value;
            },
            0
        ) /
        values.length
    );
}
/* =========================================================
   OBTER ADVERSÁRIO
========================================================= */
function getFightOpponent(
    fight
) {
    if (!fight) {
        return null;
    }
    return (
        fight.opponent ||
        fight.opponentData ||
        null
    );
}
/* =========================================================
   VERIFICAR SE EXISTE LUTA ACEITA
========================================================= */
function hasAcceptedFight() {
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    if (!fight) {
        return false;
    }
    /*
       Uma luta válida precisa estar
       explicitamente aceita/agendada.
    */
    if (
        fight.accepted === true ||
        fight.status === "accepted" ||
        fight.status === "scheduled" ||
        fight.status === "camp" ||
        fight.status === "ready"
    ) {
        return true;
    }
    /*
       Compatibilidade com versões antigas:
       se houver fightWeek ou weeksRemaining
       consideramos que já existe uma luta.
    */
    if (
        typeof fight.fightWeek ===
        "number"
    ) {
        return true;
    }
    if (
        typeof fight.weeksRemaining ===
        "number"
    ) {
        return true;
    }
    return false;
}
/* =========================================================
   SEMANAS DE CAMP
========================================================= */
function getFightWeeksRemaining() {
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    if (!fight) {
        return null;
    }
    if (
        typeof fight.weeksRemaining ===
        "number"
    ) {
        return Math.max(
            0,
            Math.floor(
                fight.weeksRemaining
            )
        );
    }
    if (
        typeof fight.fightWeek ===
        "number"
    ) {
        return Math.max(
            0,
            Number(
                fight.fightWeek
            ) -
            Number(
                p.week || 0
            )
        );
    }
    return null;
}
/* =========================================================
   DIA DA LUTA
========================================================= */
function fightIsToday() {
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    if (!fight) {
        return false;
    }
    const remaining =
        getFightWeeksRemaining();
    if (
        remaining !== null
    ) {
        return remaining <= 0;
    }
    return false;
}
/* =========================================================
   CRIAR CAMP
========================================================= */
function setupFightCamp(
    fight,
    weeks
) {
    const p =
        fightPlayer();
    if (!fight) {
        return false;
    }
    const campWeeks =
        Math.max(
            1,
            Math.floor(
                fightNumber(
                    weeks,
                    6
                )
            )
        );
    fight.accepted =
        true;
    fight.status =
        "camp";
    fight.campWeeks =
        campWeeks;
    fight.weeksRemaining =
        campWeeks;
    fight.startedWeek =
        Number(
            p.week || 1
        );
    fight.fightWeek =
        Number(
            p.week || 1
        ) +
        campWeeks;
    fight.result =
        null;
    fight.completed =
        false;
    fight.ready =
        false;
    return true;
}
/* =========================================================
   ACEITAR LUTA
   Pode ser chamado pelo MANAGERS.JS
========================================================= */
function acceptFight(
    fightData
) {
    const p =
        fightPlayer();
    if (!fightData) {
        fightData =
            p.managerFightOffer ||
            null;
    }
    if (!fightData) {
        alert(
            "Nenhuma proposta de luta disponível."
        );
        return false;
    }
    /*
       Se o objeto recebido for uma oferta
       do empresário, copiamos seus dados.
    */
    const fight = {
        event:
            fightData.event ||
            {
                name:
                    fightData.eventName ||
                    "Evento MMA"
            },
        opponent:
            fightData.opponent ||
            {
                name:
                    fightData.opponentName ||
                    "Adversário"
            },
        opponentName:
            fightData.opponentName ||
            (
                fightData.opponent
                &&
                (
                    fightData.opponent.displayName ||
                    fightData.opponent.name
                )
            ) ||
            "Adversário",
        purse:
            fightNumber(
                fightData.purse,
                0
            ),
        winBonus:
            fightNumber(
                fightData.winBonus,
                0
            ),
        accepted:
            true,
        status:
            "camp",
        completed:
            false,
        result:
            null
    };
    setupFightCamp(
        fight,
        fightData.campWeeks ||
        fightData.weeks ||
        6
    );
    p.nextFight =
        fight;
    p.managerFightOffer =
        null;
    p.log =
        p.log || [];
    p.log.unshift(
        `🥊 Luta aceita. Camp de ${fight.campWeeks} semanas iniciado.`
    );
    fightSave();
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
    return true;
}
/* =========================================================
   FUNÇÃO DE COMPATIBILIDADE
========================================================= */
window.acceptFight =
    acceptFight;
/* =========================================================
   AVANÇAR UMA SEMANA DO CAMP
========================================================= */
function processFightCampWeek() {
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    if (
        !fight ||
        !hasAcceptedFight()
    ) {
        return;
    }
    let remaining =
        getFightWeeksRemaining();
    if (
        remaining === null
    ) {
        return;
    }
    if (
        remaining > 0
    ) {
        remaining--;
        fight.weeksRemaining =
            remaining;
        if (
            remaining <= 0
        ) {
            fight.status =
                "ready";
            fight.ready =
                true;
            p.log =
                p.log || [];
            p.log.unshift(
                "🚨 Chegou o dia da luta!"
            );
        }
        else {
            fight.status =
                "camp";
        }
    }
}
/* =========================================================
   EXPORTAR CAMP
========================================================= */
window.processFightCampWeek =
    processFightCampWeek;
/* =========================================================
   STATUS DO CAMP
========================================================= */
function getCampStatus() {
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    if (
        !fight
    ) {
        return {
            active: false,
            weeksRemaining: null,
            ready: false
        };
    }
    const remaining =
        getFightWeeksRemaining();
    return {
        active:
            hasAcceptedFight(),
        weeksRemaining:
            remaining,
        ready:
            remaining !== null &&
            remaining <= 0
    };
}
/* =========================================================
   TELA DE LUTA
========================================================= */
function fightScreen() {
    const p =
        fightPlayer();
    const content =
        fightContent();
    if (!content) {
        return;
    }
    const fight =
        p.nextFight;
    /*
       NÃO EXISTE LUTA
    */
    if (
        !fight ||
        !hasAcceptedFight()
    ) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    ⚔️ LUTAS
                </div>
                <p>
                    Você não possui uma luta
                    marcada no momento.
                </p>
                <p>
                    Seu empresário precisa
                    encontrar uma oportunidade
                    e apresentar uma proposta.
                </p>
                <button
                    class="main-button"
                    onclick="home()">
                    🏠 VOLTAR
                </button>
            </div>
        `;
        return;
    }
    const opponent =
        getFightOpponent(
            fight
        );
    const opponentName =
        fight.opponentName ||
        (
            opponent &&
            (
                opponent.displayName ||
                opponent.name
            )
        ) ||
        "Adversário";
    const opponentOVR =
        opponent
        ?
        fightOverall(
            opponent
        )
        :
        0;
    const remaining =
        getFightWeeksRemaining();
    /*
       CAMP
    */
    if (
        remaining !== null &&
        remaining > 0
    ) {
        content.innerHTML = `
            <div class="card fight-header">
                <div class="title">
                    🥊 CAMP DE PREPARAÇÃO
                </div>
                <p>
                    Sua luta está marcada.
                    Prepare-se antes de entrar
                    no cage.
                </p>
            </div>
            <div class="card">
                <div class="title">
                    ⚔️ PRÓXIMO COMBATE
                </div>
                <div class="statline">
                    <span>
                        Evento
                    </span>
                    <b>
                        ${
                            fight.event &&
                            fight.event.name
                            ?
                            fight.event.name
                            :
                            "Evento MMA"
                        }
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Adversário
                    </span>
                    <b>
                        ${opponentName}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        OVR adversário
                    </span>
                    <b>
                        ${opponentOVR}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Camp restante
                    </span>
                    <b>
                        ${remaining}
                        ${
                            remaining === 1
                            ?
                            " semana"
                            :
                            " semanas"
                        }
                    </b>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    🏋️ PREPARAÇÃO
                </div>
                <div class="statline">
                    <span>
                        Saúde
                    </span>
                    <b>
                        ${Math.round(
                            p.health || 100
                        )}%
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Fadiga
                    </span>
                    <b>
                        ${Math.round(
                            p.fatigue || 0
                        )}%
                    </b>
                </div>
                <p>
                    Continue avançando as semanas
                    para concluir o camp.
                </p>
            </div>
            <button
                class="main-button"
                onclick="home()">
                🏠 VOLTAR
            </button>
        `;
        return;
    }
    /*
       DIA DA LUTA
    */
    content.innerHTML = `
        <div class="card fight-day-alert">
            <div class="title">
                🚨 DIA DA LUTA
            </div>
            <p>
                O camp terminou.
                É hora de lutar.
            </p>
        </div>
        <div class="card">
            <div class="title">
                ⚔️ ${opponentName}
            </div>
            <div class="statline">
                <span>
                    Seu OVR
                </span>
                <b>
                    ${fightOverall(p)}
                </b>
            </div>
            <div class="statline">
                <span>
                    OVR adversário
                </span>
                <b>
                    ${opponentOVR}
                </b>
            </div>
            <div class="statline">
                <span>
                    Evento
                </span>
                <b>
                    ${
                        fight.event &&
                        fight.event.name
                        ?
                        fight.event.name
                        :
                        "Evento MMA"
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Bolsa
                </span>
                <b>
                    $${Math.round(
                        fight.purse || 0
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Bônus
                </span>
                <b>
                    $${Math.round(
                        fight.winBonus || 0
                    )}
                </b>
            </div>
        </div>
        <div class="card">
            <button
                class="main-button"
                onclick="startFight()">
                👊 LUTAR AGORA
            </button>
            <button
                class="gray"
                onclick="home()">
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   INICIAR COMBATE
========================================================= */
function startFight() {
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    if (
        !fight ||
        !hasAcceptedFight()
    ) {
        alert(
            "Você não possui uma luta aceita."
        );
        return;
    }
    if (
        !fightIsToday()
    ) {
        alert(
            "A luta ainda não chegou. Continue o camp."
        );
        fightScreen();
        return;
    }
    const opponent =
        getFightOpponent(
            fight
        );
    if (!opponent) {
        alert(
            "O adversário da luta não foi encontrado."
        );
        return;
    }
    /*
       Criar estado interno da luta
    */
    window.mmaFight = {
        round:
            1,
        maxRounds:
            fight.titleFight
            ?
            5
            :
            3,
        player:
            {
                name:
                    p.name ||
                    "Você",
                health:
                    100,
                stamina:
                    100,
                damage:
                    0,
                momentum:
                    50,
                knockdowns:
                    0,
                takedowns:
                    0,
                significant:
                    0,
                totalStrikes:
                    0
            },
        opponent:
            {
                name:
                    opponent.displayName ||
                    opponent.name ||
                    "Adversário",
                health:
                    100,
                stamina:
                    100,
                damage:
                    0,
                momentum:
                    50,
                knockdowns:
                    0,
                takedowns:
                    0,
                significant:
                    0,
                totalStrikes:
                    0
            },
        playerRounds: [],
        opponentRounds: [],
        finished:
            false,
        result:
            null
    };
    renderFightRound();
}
/* =========================================================
   MOTOR DE ROUND
========================================================= */
function simulateFightExchange(
    action
) {
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    const state =
        window.mmaFight;
    if (
        !state ||
        state.finished
    ) {
        return;
    }
    const pa =
        getFightAttributes(
            p
        );
    const opponent =
        getFightOpponent(
            fight
        );
    const oa =
        getFightAttributes(
            opponent
        );
    /*
       MODIFICADORES DE ESTILO
    */
    let attackBonus =
        0;
    let defenseBonus =
        0;
    let grapplingBonus =
        0;
    if (
        p.style ===
        "Striker"
    ) {
        attackBonus += 6;
    }
    if (
        p.style ===
        "Wrestler"
    ) {
        grapplingBonus += 7;
    }
    if (
        p.style ===
        "Grappler"
    ) {
        grapplingBonus += 9;
    }
    if (
        p.style ===
        "Completo"
    ) {
        attackBonus += 2;
        defenseBonus += 2;
        grapplingBonus += 2;
    }
    /*
       STAMINA
    */
    const staminaCost = {
        jab: 3,
        power: 8,
        takedown: 7,
        submission: 10,
        defend: 2
    };
    state.player.stamina =
        fightClamp(
            state.player.stamina -
            (
                staminaCost[action] ||
                4
            ),
            0,
            100
        );
    /*
       ATAQUE
    */
    let attackPower =
        0;
    let targetDefense =
        0;
    if (
        action ===
        "jab"
    ) {
        attackPower =
            pa.striking * 0.45 +
            pa.technique * 0.20 +
            pa.offense * 0.20 +
            pa.speed * 0.15;
        targetDefense =
            oa.defense * 0.60 +
            oa.blocking * 0.40;
    }
    else if (
        action ===
        "power"
    ) {
        attackPower =
            pa.striking * 0.35 +
            pa.strength * 0.30 +
            pa.offense * 0.20 +
            pa.technique * 0.15;
        targetDefense =
            oa.defense * 0.60 +
            oa.chin * 0.40;
    }
    else if (
        action ===
        "takedown"
    ) {
        attackPower =
            pa.wrestling * 0.50 +
            pa.strength * 0.20 +
            pa.technique * 0.20 +
            pa.fightIQ * 0.10 +
            grapplingBonus;
        targetDefense =
            oa.wrestling * 0.50 +
            oa.strength * 0.20 +
            oa.defense * 0.30;
    }
    else if (
        action ===
        "submission"
    ) {
        attackPower =
            pa.grappling * 0.55 +
            pa.technique * 0.25 +
            pa.fightIQ * 0.20 +
            grapplingBonus;
        targetDefense =
            oa.grappling * 0.45 +
            oa.defense * 0.30 +
            oa.fightIQ * 0.25;
    }
    else {
        attackPower =
            pa.offense;
        targetDefense =
            oa.defense;
    }
    attackPower +=
        attackBonus;
    /*
       MOMENTUM
    */
    attackPower +=
        (
            state.player.momentum -
            50
        ) *
        0.15;
    /*
       FADIGA
    */
    attackPower *=
        (
            0.75 +
            (
                state.player.stamina /
                100
            ) *
            0.25
        );
    const roll =
        fightRandom(
            0,
            100
        );
    const successChance =
        fightClamp(
            50 +
            (
                attackPower -
                targetDefense
            ) *
            0.55 +
            (
                pa.fightIQ -
                oa.fightIQ
            ) *
            0.15,
            10,
            90
        );
    const success =
        roll <
        successChance;
    let damage =
        0;
    let text =
        "";
    /*
       RESULTADO DO GOLPE
    */
    if (
        action ===
        "takedown"
    ) {
        if (success) {
            state.player.takedowns++;
            state.player.momentum =
                fightClamp(
                    state.player.momentum + 7,
                    0,
                    100
                );
            state.opponent.momentum =
                fightClamp(
                    state.opponent.momentum - 6,
                    0,
                    100
                );
            damage =
                fightRandom(
                    2,
                    7
                );
            text =
                "🤼 Queda aplicada!";
        }
        else {
            text =
                "❌ Tentativa de queda defendida.";
        }
    }
    else if (
        action ===
        "submission"
    ) {
        if (success) {
            const finishRoll =
                fightRandom(
                    0,
                    100
                );
            if (
                finishRoll <
                12
            ) {
                state.finished =
                    true;
                state.result = {
                    winner:
                        "player",
                    method:
                        "Finalização",
                    round:
                        state.round
                };
                text =
                    "🦾 FINALIZAÇÃO!";
            }
            else {
                damage =
                    fightRandom(
                        3,
                        10
                    );
                state.opponent.health =
                    fightClamp(
                        state.opponent.health -
                        damage,
                        0,
                        100
                    );
                state.player.momentum =
                    fightClamp(
                        state.player.momentum + 8,
                        0,
                        100
                    );
                text =
                    "🥋 Tentativa de finalização!";
            }
        }
        else {
            text =
                "❌ Finalização defendida.";
        }
    }
    else {
        if (success) {
            damage =
                action ===
                "power"
                ?
                fightRandom(
                    4,
                    13
                )
                :
                fightRandom(
                    2,
                    7
                );
            state.opponent.health =
                fightClamp(
                    state.opponent.health -
                    damage,
                    0,
                    100
                );
            state.player.significant++;
            state.player.totalStrikes++;
            state.player.momentum =
                fightClamp(
                    state.player.momentum + 4,
                    0,
                    100
                );
            state.opponent.momentum =
                fightClamp(
                    state.opponent.momentum - 3,
                    0,
                    100
                );
            const knockdownChance =
                action ===
                "power"
                ?
                9
                :
                2;
            if (
                fightRandom(
                    0,
                    100
                ) <
                knockdownChance
            ) {
                state.player.knockdowns++;
                state.player.momentum =
                    fightClamp(
                        state.player.momentum + 10,
                        0,
                        100
                    );
                text =
                    "💥 GOLPE DURO! KNOCKDOWN!";
            }
            else {
                text =
                    action === "power"
                    ?
                    "💥 Golpe potente conectado!"
                    :
                    "👊 Golpe conectado!";
            }
        }
        else {
            state.player.totalStrikes++;
            text =
                "🛡️ O adversário defendeu.";
            state.player.momentum =
                fightClamp(
                    state.player.momentum - 1,
                    0,
                    100
                );
        }
    }
    /*
       QUEBRA DE QUEIXO
    */
    if (
        state.opponent.health <=
        20 &&
        fightRandom(
            0,
            100
        ) <
        (
            10 +
            (
                100 -
                oa.chin
            ) *
            0.15
        )
    ) {
        state.finished =
            true;
        state.result = {
            winner:
                "player",
            method:
                "KO",
            round:
                state.round
        };
        text =
            "💥💀 KNOCKOUT!";
    }
    /*
       IA DO ADVERSÁRIO
    */
    if (
        !state.finished
    ) {
        simulateOpponentAction(
            pa,
            oa
        );
    }
    return {
        text:
            text,
        damage:
            damage
    };
}
/* =========================================================
   IA DO ADVERSÁRIO
========================================================= */
function simulateOpponentAction(
    pa,
    oa
) {
    const state =
        window.mmaFight;
    if (
        !state ||
        state.finished
    ) {
        return;
    }
    const roll =
        fightRandom(
            0,
            100
        );
    let action =
        "jab";
    if (
        roll < 20
    ) {
        action =
            "jab";
    }
    else if (
        roll < 45
    ) {
        action =
            "power";
    }
    else if (
        roll < 70
    ) {
        action =
            "takedown";
    }
    else if (
        roll < 88
    ) {
        action =
            "submission";
    }
    else {
        action =
            "power";
    }
    /*
       STAMINA
    */
    const costs = {
        jab: 3,
        power: 8,
        takedown: 7,
        submission: 10
    };
    state.opponent.stamina =
        fightClamp(
            state.opponent.stamina -
            (
                costs[action] ||
                4
            ),
            0,
            100
        );
    let attack =
        0;
    let defense =
        0;
    if (
        action ===
        "takedown"
    ) {
        attack =
            oa.wrestling * 0.50 +
            oa.strength * 0.20 +
            oa.technique * 0.20 +
            oa.fightIQ * 0.10;
        defense =
            pa.wrestling * 0.50 +
            pa.strength * 0.20 +
            pa.defense * 0.30;
    }
    else if (
        action ===
        "submission"
    ) {
        attack =
            oa.grappling * 0.55 +
            oa.technique * 0.25 +
            oa.fightIQ * 0.20;
        defense =
            pa.grappling * 0.45 +
            pa.defense * 0.30 +
            pa.fightIQ * 0.25;
    }
    else if (
        action ===
        "power"
    ) {
        attack =
            oa.striking * 0.35 +
            oa.strength * 0.30 +
            oa.offense * 0.20 +
            oa.technique * 0.15;
        defense =
            pa.defense * 0.60 +
            pa.chin * 0.40;
    }
    else {
        attack =
            oa.striking * 0.45 +
            oa.technique * 0.20 +
            oa.offense * 0.20 +
            oa.fightIQ * 0.15;
        defense =
            pa.defense * 0.60 +
            pa.blocking * 0.40;
    }
    attack *=
        (
            0.75 +
            (
                state.opponent.stamina /
                100
            ) *
            0.25
        );
    const chance =
        fightClamp(
            50 +
            (
                attack -
                defense
            ) *
            0.55 +
            (
                oa.fightIQ -
                pa.fightIQ
            ) *
            0.15,
            10,
            90
        );
    if (
        fightRandom(
            0,
            100
        ) <
        chance
    ) {
        if (
            action ===
            "takedown"
        ) {
            state.opponent.takedowns++;
            state.opponent.momentum =
                fightClamp(
                    state.opponent.momentum + 6,
                    0,
                    100
                );
            state.player.momentum =
                fightClamp(
                    state.player.momentum - 5,
                    0,
                    100
                );
        }
        else if (
            action ===
            "submission"
        ) {
            if (
                fightRandom(
                    0,
                    100
                ) <
                8
            ) {
                state.finished =
                    true;
                state.result = {
                    winner:
                        "opponent",
                    method:
                        "Finalização",
                    round:
                        state.round
                };
            }
            else {
                state.player.health =
                    fightClamp(
                        state.player.health -
                        fightRandom(
                            3,
                            9
                        ),
                        0,
                        100
                    );
            }
        }
        else {
            const damage =
                action ===
                "power"
                ?
                fightRandom(
                    4,
                    12
                )
                :
                fightRandom(
                    2,
                    7
                );
            state.player.health =
                fightClamp(
                    state.player.health -
                    damage,
                    0,
                    100
                );
            state.opponent.significant++;
            state.opponent.totalStrikes++;
            state.opponent.momentum =
                fightClamp(
                    state.opponent.momentum + 4,
                    0,
                    100
                );
            state.player.momentum =
                fightClamp(
                    state.player.momentum - 3,
                    0,
                    100
                );
            if (
                state.player.health <=
                20 &&
                fightRandom(
                    0,
                    100
                ) <
                (
                    8 +
                    (
                        100 -
                        pa.chin
                    ) *
                    0.15
                )
            ) {
                state.finished =
                    true;
                state.result = {
                    winner:
                        "opponent",
                    method:
                        "KO",
                    round:
                        state.round
                };
            }
        }
    }
}
/* =========================================================
   RENDERIZAR ROUND
========================================================= */
function renderFightRound(
    message
) {
    const content =
        fightContent();
    const state =
        window.mmaFight;
    if (
        !content ||
        !state
    ) {
        return;
    }
    if (
        state.finished
    ) {
        finishFight();
        return;
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 ROUND
                ${state.round}
                /
                ${state.maxRounds}
            </div>
            ${
                message
                ?
                `
                    <p>
                        ${message}
                    </p>
                `
                :
                ""
            }
        </div>
        <div class="card">
            <div class="statline">
                <span>
                    ${state.player.name}
                </span>
                <b>
                    ❤️ ${Math.round(
                        state.player.health
                    )}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Stamina
                </span>
                <b>
                    ${Math.round(
                        state.player.stamina
                    )}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Momentum
                </span>
                <b>
                    ${Math.round(
                        state.player.momentum
                    )}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="statline">
                <span>
                    ${state.opponent.name}
                </span>
                <b>
                    ❤️ ${Math.round(
                        state.opponent.health
                    )}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Stamina
                </span>
                <b>
                    ${Math.round(
                        state.opponent.stamina
                    )}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Momentum
                </span>
                <b>
                    ${Math.round(
                        state.opponent.momentum
                    )}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🎯 ESCOLHA SUA AÇÃO
            </div>
            <button
                class="main-button"
                onclick="fightAction('jab')">
                👊 JAB / COMBINAÇÃO
            </button>
            <button
                class="main-button"
                onclick="fightAction('power')">
                💥 GOLPE POTENTE
            </button>
            <button
                class="main-button"
                onclick="fightAction('takedown')">
                🤼 TENTAR QUEDA
            </button>
            <button
                class="main-button"
                onclick="fightAction('submission')">
                🥋 BUSCAR FINALIZAÇÃO
            </button>
        </div>
    `;
}
/* =========================================================
   AÇÃO DO JOGADOR
========================================================= */
function fightAction(
    action
) {
    const state =
        window.mmaFight;
    if (
        !state ||
        state.finished
    ) {
        return;
    }
    const result =
        simulateFightExchange(
            action
        );
    if (
        state.finished
    ) {
        finishFight();
        return;
    }
    /*
       Pequena quantidade de ações
       por round antes de terminar.
    */
    if (
        !state.currentRoundActions
    ) {
        state.currentRoundActions =
            0;
    }
    state.currentRoundActions++;
    if (
        state.currentRoundActions >=
        4
    ) {
        endFightRound();
        return;
    }
    renderFightRound(
        result.text
    );
}
/* =========================================================
   FINALIZAR ROUND
========================================================= */
function endFightRound() {
    const state =
        window.mmaFight;
    if (
        !state ||
        state.finished
    ) {
        return;
    }
    /*
       Recuperação de stamina
    */
    state.player.stamina =
        fightClamp(
            state.player.stamina + 18,
            0,
            100
        );
    state.opponent.stamina =
        fightClamp(
            state.opponent.stamina + 18,
            0,
            100
        );
    state.playerRounds.push({
        strikes:
            state.player.significant,
        takedowns:
            state.player.takedowns,
        knockdowns:
            state.player.knockdowns,
        momentum:
            state.player.momentum
    });
    state.opponentRounds.push({
        strikes:
            state.opponent.significant,
        takedowns:
            state.opponent.takedowns,
        knockdowns:
            state.opponent.knockdowns,
        momentum:
            state.opponent.momentum
    });
    /*
       Reset de estatísticas do round
    */
    state.player.significant =
        0;
    state.player.takedowns =
        0;
    state.player.knockdowns =
        0;
    state.opponent.significant =
        0;
    state.opponent.takedowns =
        0;
    state.opponent.knockdowns =
        0;
    state.currentRoundActions =
        0;
    /*
       Próximo round
    */
    if (
        state.round >=
        state.maxRounds
    ) {
        state.finished =
            true;
        state.result =
            calculateDecision();
        finishFight();
        return;
    }
    state.round++;
    renderFightRound(
        "🔔 Fim do round. Prepare-se para o próximo."
    );
}
/* =========================================================
   DECISÃO
========================================================= */
function calculateDecision() {
    const state =
        window.mmaFight;
    let playerScore =
        0;
    let opponentScore =
        0;
    state.playerRounds.forEach(
        function(
            round,
            index
        ) {
            const opponent =
                state.opponentRounds[
                    index
                ] ||
                {};
            let p =
                round.strikes * 2 +
                round.takedowns * 4 +
                round.knockdowns * 10 +
                round.momentum * 0.05;
            let o =
                (
                    opponent.strikes ||
                    0
                ) * 2 +
                (
                    opponent.takedowns ||
                    0
                ) * 4 +
                (
                    opponent.knockdowns ||
                    0
                ) * 10 +
                (
                    opponent.momentum ||
                    0
                ) * 0.05;
            if (
                p >
                o
            ) {
                playerScore += 10;
            }
            else if (
                o >
                p
            ) {
                opponentScore += 10;
            }
            else {
                playerScore += 5;
                opponentScore += 5;
            }
        }
    );
    if (
        playerScore >
        opponentScore
    ) {
        return {
            winner:
                "player",
            method:
                "Decisão",
            round:
                state.maxRounds,
            score:
                `${playerScore}-${opponentScore}`
        };
    }
    if (
        opponentScore >
        playerScore
    ) {
        return {
            winner:
                "opponent",
            method:
                "Decisão",
            round:
                state.maxRounds,
            score:
                `${opponentScore}-${playerScore}`
        };
    }
    return {
        winner:
            "draw",
        method:
            "Empate",
        round:
            state.maxRounds,
        score:
            `${playerScore}-${opponentScore}`
    };
}
/* =========================================================
   FINALIZAR LUTA
========================================================= */
function finishFight() {
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    const state =
        window.mmaFight;
    if (
        !state ||
        !state.result
    ) {
        return;
    }
    const result =
        state.result;
    /*
       EVITAR PROCESSAMENTO DUPLICADO
    */
    if (
        fight &&
        fight.completed === true
    ) {
        renderFightResult(
            result
        );
        return;
    }
    if (!fight) {
        return;
    }
    /*
       RECORD
    */
    p.amateur =
        p.amateur || {
            wins: 0,
            losses: 0,
            draws: 0
        };
    p.professional =
        p.professional || {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0
        };
    const professional =
        p.professional.active ===
        true;
    /*
       RESULTADO
    */
    if (
        result.winner ===
        "player"
    ) {
        if (
            professional
        ) {
            p.professional.wins++;
        }
        else {
            p.amateur.wins++;
        }
    }
    else if (
        result.winner ===
        "opponent"
    ) {
        if (
            professional
        ) {
            p.professional.losses++;
        }
        else {
            p.amateur.losses++;
        }
    }
    else {
        if (
            professional
        ) {
            p.professional.draws++;
        }
        else {
            p.amateur.draws++;
        }
    }
    /*
       DINHEIRO
    */
    const purse =
        fightNumber(
            fight.purse,
            0
        );
    const bonus =
        result.winner ===
        "player"
        ?
        fightNumber(
            fight.winBonus,
            0
        )
        :
        0;
    const income =
        purse +
        bonus;
    p.money =
        fightNumber(
            p.money,
            0
        ) +
        income;
    p.fame =
        fightNumber(
            p.fame,
            0
        );
    if (
        result.winner ===
        "player"
    ) {
        p.fame +=
            result.method ===
            "KO"
            ?
            5
            :
            result.method ===
            "Finalização"
            ?
            5
            :
            3;
    }
    else if (
        result.winner ===
        "opponent"
    ) {
        p.fame +=
            0;
    }
    /*
       HISTÓRICO
    */
    p.log =
        p.log || [];
    const opponentName =
        fight.opponentName ||
        "Adversário";
    if (
        result.winner ===
        "player"
    ) {
        p.log.unshift(
            `🏆 Vitória sobre ${opponentName} por ${result.method}.`
        );
    }
    else if (
        result.winner ===
        "opponent"
    ) {
        p.log.unshift(
            `❌ Derrota para ${opponentName} por ${result.method}.`
        );
    }
    else {
        p.log.unshift(
            `🤝 Empate contra ${opponentName}.`
        );
    }
    /*
       HISTÓRICO DA LUTA
    */
    p.fightHistory =
        p.fightHistory || [];
    p.fightHistory.unshift({
        year:
            p.year,
        week:
            p.week,
        opponent:
            opponentName,
        event:
            fight.event &&
            fight.event.name
            ?
            fight.event.name
            :
            "Evento MMA",
        result:
            result.winner,
        method:
            result.method,
        round:
            result.round,
        purse:
            purse,
        bonus:
            bonus
    });
    /*
       CONTRATO
    */
    if (
        typeof window.processContractFightResult ===
        "function"
    ) {
        try {
            window.processContractFightResult(
                result
            );
        }
        catch (
            error
        ) {
            console.error(
                "Erro no contrato:",
                error
            );
        }
    }
    /*
       RANKING
    */
    if (
        typeof window.processRankingFightResult ===
        "function"
    ) {
        try {
            window.processRankingFightResult(
                result
            );
        }
        catch (
            error
        ) {
            console.error(
                "Erro no ranking:",
                error
            );
        }
    }
    /*
       MARCAR COMO COMPLETADA
    */
    fight.completed =
        true;
    fight.status =
        "completed";
    fight.result =
        result;
    /*
       NÃO APAGAR IMEDIATAMENTE:
       Mantemos os dados para a tela
       de resultado.
    */
    /*
       RECUPERAÇÃO
    */
    p.fatigue =
        fightClamp(
            fightNumber(
                p.fatigue,
                0
            ) + 30,
            0,
            100
        );
    p.health =
        fightClamp(
            fightNumber(
                p.health,
                100
            ) - fightRandom(
                5,
                20
            ),
            1,
            100
        );
    /*
       Confiança
    */
    if (
        p.attributes
    ) {
        p.attributes.confidence =
            fightClamp(
                fightNumber(
                    p.attributes.confidence,
                    40
                ) +
                (
                    result.winner ===
                    "player"
                    ?
                    5
                    :
                    result.winner ===
                    "opponent"
                    ?
                    -5
                    :
                    0
                ),
                0,
                100
            );
    }
    /*
       SALVAR
    */
    fightSave();
    renderFightResult(
        result
    );
}
/* =========================================================
   TELA DE RESULTADO
========================================================= */
function renderFightResult(
    result
) {
    const content =
        fightContent();
    const p =
        fightPlayer();
    const fight =
        p.nextFight;
    if (
        !content
    ) {
        return;
    }
    const opponentName =
        fight &&
        fight.opponentName
        ?
        fight.opponentName
        :
        "Adversário";
    let title =
        "";
    if (
        result.winner ===
        "player"
    ) {
        title =
            "🏆 VITÓRIA!";
    }
    else if (
        result.winner ===
        "opponent"
    ) {
        title =
            "❌ DERROTA";
    }
    else {
        title =
            "🤝 EMPATE";
    }
    const purse =
        fight
        ?
        fightNumber(
            fight.purse,
            0
        )
        :
        0;
    const bonus =
        fight &&
        result.winner ===
        "player"
        ?
        fightNumber(
            fight.winBonus,
            0
        )
        :
        0;
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ${title}
            </div>
            <p>
                ${p.name || "Lutador"}
                vs.
                ${opponentName}
            </p>
        </div>
        <div class="card">
            <div class="statline">
                <span>
                    Resultado
                </span>
                <b>
                    ${
                        result.method
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Round
                </span>
                <b>
                    ${
                        result.round
                    }
                </b>
            </div>
            ${
                result.score
                ?
                `
                    <div class="statline">
                        <span>
                            Placar
                        </span>
                        <b>
                            ${
                                result.score
                            }
                        </b>
                    </div>
                `
                :
                ""
            }
        </div>
        <div class="card">
            <div class="title">
                💰 FINANCEIRO
            </div>
            <div class="statline">
                <span>
                    Bolsa
                </span>
                <b>
                    $${Math.round(
                        purse
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Bônus
                </span>
                <b>
                    $${Math.round(
                        bonus
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Total
                </span>
                <b>
                    $${Math.round(
                        purse +
                        bonus
                    )}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📊 RECORD
            </div>
            <div class="statline">
                <span>
                    Amador
                </span>
                <b>
                    ${
                        p.amateur.wins
                    }-
                    ${
                        p.amateur.losses
                    }-
                    ${
                        p.amateur.draws
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Profissional
                </span>
                <b>
                    ${
                        p.professional.wins
                    }-
                    ${
                        p.professional.losses
                    }-
                    ${
                        p.professional.draws
                    }
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                ❤️ RECUPERAÇÃO
            </div>
            <div class="statline">
                <span>
                    Saúde
                </span>
                <b>
                    ${Math.round(
                        p.health
                    )}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Fadiga
                </span>
                <b>
                    ${Math.round(
                        p.fatigue
                    )}%
                </b>
            </div>
        </div>
        <button
            class="main-button"
            onclick="finishFightAndReturnHome()">
            🏠 CONTINUAR CARREIRA
        </button>
    `;
}
/* =========================================================
   SAIR DO RESULTADO
========================================================= */
function finishFightAndReturnHome() {
    const p =
        fightPlayer();
    /*
       Agora que o resultado já foi
       registrado, removemos a luta atual.
    */
    if (
        p.nextFight &&
        p.nextFight.completed ===
        true
    ) {
        p.nextFight =
            null;
    }
    window.mmaFight =
        null;
    fightSave();
    /*
       O empresário NÃO é chamado daqui.
       O próximo ciclo acontecerá pelo
       avanço normal das semanas.
    */
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
}
/* =========================================================
   COMPATIBILIDADE
========================================================= */
window.fightScreen =
    fightScreen;
window.startFight =
    startFight;
window.fightAction =
    fightAction;
window.renderFightRound =
    renderFightRound;
window.finishFight =
    finishFight;
window.getCampStatus =
    getCampStatus;
window.fightIsToday =
    fightIsToday;
/* =========================================================
   RECUPERAÇÃO PÓS-LUTA
========================================================= */
function processFightRecovery() {
    const p =
        fightPlayer();
    if (!p) {
        return;
    }
    /*
       Recuperação gradual.
    */
    p.fatigue =
        Math.max(
            0,
            fightNumber(
                p.fatigue,
                0
            ) - 12
        );
    p.health =
        Math.min(
            100,
            fightNumber(
                p.health,
                100
            ) + 4
        );
}
window.processFightRecovery =
    processFightRecovery;
/* =========================================================
   EXPORTAR ESTADO
========================================================= */
window.mmaFight =
    window.mmaFight || null;
