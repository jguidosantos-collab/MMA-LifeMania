/* =========================================================
   MMA LIFE DYNASTY
   PFL.JS
   SISTEMA PFL GRAND PRIX
   VERSÃO ATUALIZADA
========================================================= */
/* =========================================================
   CONFIGURAÇÃO
========================================================= */
const PFL_CONFIG = {
    name: "PFL",
    grandPrixName:
        "PFL Grand Prix",
    prize:
        1000000,
    fightersPerDivision:
        8,
    roundsNormal:
        3,
    roundsFinal:
        5,
    recoveryMin:
        4,
    recoveryMax:
        12
};
/* =========================================================
   GARANTIR ESTRUTURA
========================================================= */
function ensurePFL() {
    ensurePlayer();
    const player =
        window.player;
    if (!player.pfl) {
        player.pfl = {
            invited:
                false,
            accepted:
                false,
            active:
                false,
            year:
                null,
            division:
                null,
            round:
                null,
            wins:
                0,
            losses:
                0,
            champion:
                false,
            eliminated:
                false,
            opponent:
                null,
            bracket:
                [],
            prize:
                0,
            fightOffer:
                null,
            nextFightWeek:
                null,
            recoveryWeeks:
                0,
            recoveryUntilWeek:
                null
        };
    }
    /*
     * Compatibilidade com saves antigos.
     */
    if (
        typeof player.pfl.fightOffer ===
        "undefined"
    ) {
        player.pfl.fightOffer =
            null;
    }
    if (
        typeof player.pfl.bracket ===
        "undefined"
    ) {
        player.pfl.bracket =
            [];
    }
    if (
        typeof player.pfl.recoveryWeeks ===
        "undefined"
    ) {
        player.pfl.recoveryWeeks =
            0;
    }
    if (
        typeof player.pfl.recoveryUntilWeek ===
        "undefined"
    ) {
        player.pfl.recoveryUntilWeek =
            null;
    }
}
/* =========================================================
   VERIFICAR RECUPERAÇÃO
========================================================= */
function isPFLRecovering() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl.active
    ) {
        return false;
    }
    if (
        !player.pfl.recoveryUntilWeek
    ) {
        return false;
    }
    return (
        Number(player.week || 1)
        <
        Number(player.pfl.recoveryUntilWeek)
    );
}
/* =========================================================
   SEMANAS RESTANTES
========================================================= */
function getPFLRecoveryRemaining() {
    ensurePFL();
    const player =
        window.player;
    if (
        !isPFLRecovering()
    ) {
        return 0;
    }
    return Math.max(
        0,
        Number(
            player.pfl.recoveryUntilWeek
        ) -
        Number(
            player.week || 1
        )
    );
}
/* =========================================================
   EMPRESÁRIO APRESENTA GP
========================================================= */
function managerOfferPFLGrandPrix() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.professional ||
        !player.professional.active
    ) {
        alert(
            "Você precisa ser profissional para receber um convite para o PFL Grand Prix."
        );
        return;
    }
    if (!player.manager) {
        alert(
            "Você precisa ter um empresário para receber um convite do PFL."
        );
        return;
    }
    if (player.pfl.active) {
        alert(
            "Você já está participando do PFL Grand Prix."
        );
        return;
    }
    if (player.fightOffer) {
        alert(
            "Seu empresário já possui outra oferta de luta para você."
        );
        return;
    }
    if (player.pfl.invited) {
        pflScreen();
        return;
    }
    player.pfl.invited =
        true;
    player.pfl.year =
        player.year;
    player.pfl.division =
        player.weight;
    player.log =
        player.log || [];
    player.log.unshift(
        "🏆 Seu empresário recebeu um convite para o PFL Grand Prix."
    );
    save();
    pflScreen();
}
/* =========================================================
   CRIAR BRACKET
========================================================= */
function generatePFLBracket() {
    ensurePFL();
    const player =
        window.player;
    const fighters = [];
    /*
     * O jogador é um dos 8 participantes.
     */
    fighters.push({
        displayName:
            player.name,
        power:
            getOverall(),
        player:
            true,
        wins:
            0,
        losses:
            0
    });
    /*
     * Cria os outros 7 lutadores.
     */
    for (
        let i = 1;
        i < PFL_CONFIG.fightersPerDivision;
        i++
    ) {
        const fighter =
            generatePFLOpponent();
        fighter.player =
            false;
        fighters.push(
            fighter
        );
    }
    /*
     * Embaralha.
     */
    fighters.sort(
        function() {
            return Math.random() - 0.5;
        }
    );
    player.pfl.bracket =
        fighters;
    return fighters;
}
/* =========================================================
   ACEITAR GP
========================================================= */
function acceptPFLGrandPrix() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl.invited
    ) {
        return;
    }
    player.pfl.invited =
        false;
    player.pfl.accepted =
        true;
    player.pfl.active =
        true;
    player.pfl.year =
        player.year;
    player.pfl.division =
        player.weight;
    player.pfl.round =
        "Quartas de final";
    player.pfl.wins =
        0;
    player.pfl.losses =
        0;
    player.pfl.champion =
        false;
    player.pfl.eliminated =
        false;
    player.pfl.prize =
        0;
    player.pfl.fightOffer =
        null;
    player.pfl.recoveryWeeks =
        0;
    player.pfl.recoveryUntilWeek =
        null;
    generatePFLBracket();
    /*
     * Escolhe o primeiro adversário.
     */
    player.pfl.opponent =
        findPFLFirstOpponent();
    /*
     * A primeira luta será apresentada
     * como oferta do empresário.
     */
    createPFLFightOffer();
    player.log =
        player.log || [];
    player.log.unshift(
        "🏆 Convite aceito: PFL Grand Prix " +
        player.year
    );
    save();
    pflScreen();
}
/* =========================================================
   PRIMEIRO ADVERSÁRIO
========================================================= */
function findPFLFirstOpponent() {
    ensurePFL();
    const player =
        window.player;
    const bracket =
        player.pfl.bracket || [];
    const opponents =
        bracket.filter(
            function(fighter) {
                return !fighter.player;
            }
        );
    if (!opponents.length) {
        return generatePFLOpponent();
    }
    return opponents[0];
}
/* =========================================================
   RECUSAR GP
========================================================= */
function declinePFLGrandPrix() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl.invited
    ) {
        return;
    }
    player.pfl.invited =
        false;
    player.log =
        player.log || [];
    player.log.unshift(
        "❌ Convite para o PFL Grand Prix recusado."
    );
    save();
    pflScreen();
}
/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */
function generatePFLOpponent() {
    ensurePlayer();
    let opponent;
    if (
        typeof generateFighter ===
        "function"
    ) {
        opponent =
            generateFighter();
    }
    if (!opponent) {
        opponent = {
            displayName:
                "Adversário PFL",
            power:
                70,
            wins:
                0,
            losses:
                0
        };
    }
    opponent.power =
        Math.max(
            Number(
                opponent.power || 0
            ),
            65
        );
    opponent.power +=
        Math.random() * 10;
    return opponent;
}
/* =========================================================
   RISCO
========================================================= */
function getPFLRisk() {
    ensurePFL();
    const player =
        window.player;
    const opponent =
        player.pfl.opponent;
    if (!opponent) {
        return 50;
    }
    let risk =
        40;
    const playerOverall =
        getOverall();
    const difference =
        Math.abs(
            playerOverall -
            opponent.power
        );
    if (
        opponent.power >
        playerOverall
    ) {
        risk +=
            15;
    }
    if (
        difference < 5
    ) {
        risk +=
            10;
    }
    /*
     * A final é mais perigosa.
     */
    if (
        player.pfl.round ===
        "Final"
    ) {
        risk +=
            10;
    }
    risk =
        Math.max(
            25,
            Math.min(
                90,
                Math.round(risk)
            )
        );
    return risk;
}
/* =========================================================
   RECUPERAÇÃO
========================================================= */
function getPFLRecovery() {
    const risk =
        getPFLRisk();
    if (
        risk < 40
    ) {
        return 4;
    }
    if (
        risk < 55
    ) {
        return 6;
    }
    if (
        risk < 70
    ) {
        return 8;
    }
    if (
        risk < 80
    ) {
        return 10;
    }
    return 12;
}
/* =========================================================
   CRIAR OFERTA DE LUTA
========================================================= */
function createPFLFightOffer() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl.active
    ) {
        return;
    }
    if (
        !player.pfl.opponent
    ) {
        return;
    }
    if (
        isPFLRecovering()
    ) {
        return;
    }
    const risk =
        getPFLRisk();
    const recovery =
        getPFLRecovery();
    /*
     * A luta é proposta depois
     * do período de preparação.
     */
    const proposedWeek =
        Number(player.week || 1) + 2;
    player.pfl.fightOffer = {
        opponent:
            player.pfl.opponent,
        round:
            player.pfl.round,
        risk:
            risk,
        recoveryWeeks:
            recovery,
        proposedWeek:
            proposedWeek,
        prizeIfWinner:
            getPFLRoundPrize()
    };
    player.pfl.nextFightWeek =
        proposedWeek;
    player.log =
        player.log || [];
    player.log.unshift(
        "📩 Seu empresário apresentou uma luta do PFL Grand Prix."
    );
    save();
}
/* =========================================================
   PREMIAÇÃO POR FASE
========================================================= */
function getPFLRoundPrize() {
    ensurePFL();
    const player =
        window.player;
    if (
        player.pfl.round ===
        "Quartas de final"
    ) {
        return 100000;
    }
    if (
        player.pfl.round ===
        "Semifinal"
    ) {
        return 250000;
    }
    if (
        player.pfl.round ===
        "Final"
    ) {
        return PFL_CONFIG.prize;
    }
    return 0;
}
/* =========================================================
   ACEITAR OFERTA DO GP
========================================================= */
function acceptPFLFightOffer() {
    ensurePFL();
    const player =
        window.player;
    const offer =
        player.pfl.fightOffer;
    if (!offer) {
        return;
    }
    if (
        isPFLRecovering()
    ) {
        alert(
            "Você ainda está se recuperando da última luta."
        );
        return;
    }
    player.pfl.fightOffer =
        null;
    player.nextFight = {
        opponent:
            offer.opponent,
        event: {
            name:
                "PFL Grand Prix",
            level:
                5,
            purse:
                0
        },
        purse:
            0,
        week:
            offer.proposedWeek,
        risk:
            offer.risk,
        recoveryWeeks:
            offer.recoveryWeeks,
        amateur:
            false,
        pflGrandPrix:
            true,
        pflRound:
            offer.round
    };
    player.log =
        player.log || [];
    player.log.unshift(
        "📅 Luta do PFL Grand Prix aceita: " +
        offer.round
    );
    save();
    pflScreen();
}
/* =========================================================
   RECUSAR OFERTA DO GP
========================================================= */
function declinePFLFightOffer() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl.fightOffer
    ) {
        return;
    }
    player.log =
        player.log || [];
    player.log.unshift(
        "❌ Oferta do PFL Grand Prix recusada."
    );
    player.pfl.fightOffer =
        null;
    /*
     * O GP continua, mas o empresário
     * poderá apresentar outra oportunidade.
     */
    save();
    pflScreen();
}
/* =========================================================
   LUTAR NO GP
========================================================= */
function fightPFL() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl.active
    ) {
        return;
    }
    if (
        !player.nextFight ||
        !player.nextFight.pflGrandPrix
    ) {
        alert(
            "Você ainda não possui uma luta do GP aceita."
        );
        return;
    }
    if (
        Number(player.week || 1)
        <
        Number(player.nextFight.week)
    ) {
        alert(
            "Esta luta está marcada para a semana " +
            player.nextFight.week +
            "."
        );
        return;
    }
    const opponent =
        player.pfl.opponent;
    if (!opponent) {
        return;
    }
    const attributes =
        player.attributes || {};
    let fighterPower = (
        Number(attributes.strength || 50) +
        Number(attributes.striking || 50) +
        Number(attributes.wrestling || 50) +
        Number(attributes.grappling || 50) +
        Number(attributes.cardio || 50) +
        Number(attributes.technique || 50) +
        Number(attributes.defense || 50) +
        Number(attributes.fightIQ || 50) +
        Number(attributes.mental || 50) +
        Number(attributes.confidence || 50)
    ) / 10;
    fighterPower -=
        Number(player.fatigue || 0) / 5;
    fighterPower +=
        Math.random() * 20 - 10;
    const won =
        fighterPower >=
        Number(opponent.power);
    const risk =
        Number(
            player.nextFight.risk ||
            getPFLRisk()
        );
    const recovery =
        Number(
            player.nextFight.recoveryWeeks ||
            getPFLRecovery()
        );
    /* =====================================================
       VITÓRIA
    ===================================================== */
    if (won) {
        player.pfl.wins++;
        player.fame =
            Number(player.fame || 0) + 8;
        player.attributes.confidence =
            Math.min(
                100,
                Number(
                    player.attributes.confidence || 50
                ) + 4
            );
        /*
         * QUARTAS
         */
        if (
            player.pfl.round ===
            "Quartas de final"
        ) {
            player.pfl.round =
                "Semifinal";
            player.pfl.prize =
                100000;
            player.pfl.opponent =
                generatePFLOpponent();
            player.pfl.fightOffer =
                null;
            player.log.unshift(
                "🏆 Vitória nas quartas do PFL Grand Prix! Você avançou para a semifinal."
            );
            alert(
                "🏆 VITÓRIA NO PFL GRAND PRIX!\n\n" +
                opponent.displayName +
                "\n\n" +
                "Você avançou para a SEMIFINAL.\n\n" +
                "Premiação acumulada: $100.000\n\n" +
                "🩹 Recuperação: " +
                recovery +
                " semanas."
            );
        }
        /*
         * SEMIFINAL
         */
        else if (
            player.pfl.round ===
            "Semifinal"
        ) {
            player.pfl.round =
                "Final";
            player.pfl.prize =
                250000;
            player.pfl.opponent =
                generatePFLOpponent();
            player.pfl.fightOffer =
                null;
            player.log.unshift(
                "🔥 Vitória na semifinal do PFL! Você está na FINAL."
            );
            alert(
                "🔥 VOCÊ ESTÁ NA FINAL!\n\n" +
                opponent.displayName +
                "\n\n" +
                "Premiação acumulada: $250.000\n\n" +
                "🩹 Recuperação: " +
                recovery +
                " semanas."
            );
        }
        /*
         * FINAL
         */
        else if (
            player.pfl.round ===
            "Final"
        ) {
            player.pfl.champion =
                true;
            player.pfl.active =
                false;
            player.pfl.accepted =
                false;
            player.pfl.round =
                "Campeão";
            player.pfl.prize =
                PFL_CONFIG.prize;
            player.money =
                Number(player.money || 0) +
                PFL_CONFIG.prize;
            player.fame =
                Number(player.fame || 0) +
                30;
            player.log.unshift(
                "👑 CAMPEÃO DO PFL GRAND PRIX! Prêmio de $1.000.000."
            );
            alert(
                "👑 PFL GRAND PRIX — CAMPEÃO!\n\n" +
                "Você venceu a final!\n\n" +
                "💰 PRÊMIO: $1.000.000"
            );
        }
    }
    /* =====================================================
       DERROTA
    ===================================================== */
    else {
        player.pfl.losses++;
        player.pfl.active =
            false;
        player.pfl.accepted =
            false;
        player.pfl.eliminated =
            true;
        player.pfl.round =
            "Eliminado";
        player.fame =
            Math.max(
                0,
                Number(player.fame || 0) - 3
            );
        player.attributes.confidence =
            Math.max(
                0,
                Number(
                    player.attributes.confidence || 50
                ) - 5
            );
        player.log.unshift(
            "❌ Eliminado do PFL Grand Prix por " +
            opponent.displayName
        );
        alert(
            "❌ ELIMINADO DO PFL GRAND PRIX\n\n" +
            opponent.displayName +
            "\n\n" +
            "🩹 Recuperação: " +
            recovery +
            " semanas."
        );
    }
    /* =====================================================
       RECUPERAÇÃO
    ===================================================== */
    player.pfl.recoveryWeeks =
        Math.max(
            PFL_CONFIG.recoveryMin,
            Math.min(
                PFL_CONFIG.recoveryMax,
                recovery
            )
        );
    player.pfl.recoveryUntilWeek =
        Number(player.week || 1) +
        player.pfl.recoveryWeeks;
    player.recoveryWeeks =
        player.pfl.recoveryWeeks;
    player.recoveryUntilWeek =
        player.pfl.recoveryUntilWeek;
    player.health =
        Math.max(
            20,
            Number(player.health || 100) -
            (
                12 +
                Math.round(risk / 10)
            )
        );
    player.fatigue =
        Math.min(
            100,
            Number(player.fatigue || 0) + 35
        );
    /*
     * Limpa a luta atual.
     */
    player.nextFight =
        null;
    save();
    /*
     * Se ainda estiver no GP,
     * o empresário só apresenta a
     * próxima luta quando terminar
     * a recuperação.
     */
    pflScreen();
}
/* =========================================================
   PREPARAR PRÓXIMA OFERTA
========================================================= */
function processPFLWeek() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl.active
    ) {
        return;
    }
    if (
        player.pfl.fightOffer
    ) {
        return;
    }
    if (
        player.nextFight
    ) {
        return;
    }
    if (
        isPFLRecovering()
    ) {
        return;
    }
    if (
        !player.pfl.opponent
    ) {
        player.pfl.opponent =
            generatePFLOpponent();
    }
    createPFLFightOffer();
    save();
}
/* =========================================================
   TELA PFL
========================================================= */
function pflScreen() {
    ensurePFL();
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    const player =
        window.player;
    const pfl =
        player.pfl;
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏆 PFL
            </div>
            <p>
                PFL Grand Prix
            </p>
        </div>
        ${
            pfl.invited
            ?
            `
            <div class="card">
                <div class="title">
                    📩 CONVITE DO EMPRESÁRIO
                </div>
                <p>
                    Seu empresário recebeu
                    uma oportunidade especial:
                </p>
                <div class="statline">
                    <span>
                        Evento
                    </span>
                    <b>
                        PFL Grand Prix
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Categoria
                    </span>
                    <b>
                        ${player.weight}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Participantes
                    </span>
                    <b>
                        8 lutadores
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Formato
                    </span>
                    <b>
                        Quartas → Semifinal → Final
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Lutas necessárias
                    </span>
                    <b>
                        3 vitórias
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Prêmio do campeão
                    </span>
                    <b>
                        $1.000.000
                    </b>
                </div>
                <button
                    class="green"
                    onclick="acceptPFLGrandPrix()">
                    🏆 ACEITAR CONVITE
                </button>
                <button
                    class="gray"
                    onclick="declinePFLGrandPrix()">
                    ❌ RECUSAR
                </button>
            </div>
            `
            :
            ""
        }
        ${
            pfl.active
            ?
            `
            <div class="card">
                <div class="title">
                    🏆 SEU GP
                </div>
                <div class="statline">
                    <span>
                        Categoria
                    </span>
                    <b>
                        ${pfl.division}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Fase
                    </span>
                    <b>
                        ${pfl.round}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Vitórias
                    </span>
                    <b>
                        ${pfl.wins}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Adversário
                    </span>
                    <b>
                        ${
                            pfl.opponent
                            ?
                            pfl.opponent.displayName
                            :
                            "A definir"
                        }
                    </b>
                </div>
                ${
                    pfl.opponent
                    ?
                    `
                    <div class="statline">
                        <span>
                            OVR adversário
                        </span>
                        <b>
                            ${Math.round(
                                pfl.opponent.power
                            )}
                        </b>
                    </div>
                    `
                    :
                    ""
                }
                ${
                    isPFLRecovering()
                    ?
                    `
                    <div class="statline">
                        <span>
                            Recuperação
                        </span>
                        <b>
                            ${getPFLRecoveryRemaining()}
                            semanas restantes
                        </b>
                    </div>
                    <p>
                        🩹 Você ainda está se recuperando.
                        Seu empresário apresentará a próxima luta
                        quando estiver liberado.
                    </p>
                    `
                    :
                    ""
                }
            </div>
            `
            :
            ""
        }
        ${
            pfl.active &&
            pfl.fightOffer
            ?
            `
            <div class="card">
                <div class="title">
                    📩 OFERTA DO EMPRESÁRIO
                </div>
                <p>
                    Seu empresário encontrou
                    sua próxima luta no GP.
                </p>
                <div class="statline">
                    <span>
                        Fase
                    </span>
                    <b>
                        ${pfl.fightOffer.round}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Adversário
                    </span>
                    <b>
                        ${pfl.fightOffer.opponent.displayName}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        OVR
                    </span>
                    <b>
                        ${Math.round(
                            pfl.fightOffer.opponent.power
                        )}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Risco
                    </span>
                    <b>
                        ${pfl.fightOffer.risk}%
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Recuperação estimada
                    </span>
                    <b>
                        ${pfl.fightOffer.recoveryWeeks}
                        semanas
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Semana da luta
                    </span>
                    <b>
                        ${pfl.fightOffer.proposedWeek}
                    </b>
                </div>
                <button
                    class="green"
                    onclick="acceptPFLFightOffer()">
                    ✅ ACEITAR LUTA
                </button>
                <button
                    class="gray"
                    onclick="declinePFLFightOffer()">
                    ❌ RECUSAR
                </button>
            </div>
            `
            :
            ""
        }
        ${
            pfl.champion
            ?
            `
            <div class="card">
                <div class="title">
                    👑 CAMPEÃO
                </div>
                <p>
                    Você venceu o PFL Grand Prix.
                </p>
                <div class="statline">
                    <span>
                        Prêmio
                    </span>
                    <b>
                        $1.000.000
                    </b>
                </div>
            </div>
            `
            :
            ""
        }
        ${
            pfl.eliminated
            ?
            `
            <div class="card">
                <div class="title">
                    ❌ ELIMINADO
                </div>
                <p>
                    Você foi eliminado do PFL Grand Prix.
                </p>
            </div>
            `
            :
            ""
        }
    `;
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.managerOfferPFLGrandPrix =
    managerOfferPFLGrandPrix;
window.acceptPFLGrandPrix =
    acceptPFLGrandPrix;
window.declinePFLGrandPrix =
    declinePFLGrandPrix;
window.acceptPFLFightOffer =
    acceptPFLFightOffer;
window.declinePFLFightOffer =
    declinePFLFightOffer;
window.fightPFL =
    fightPFL;
window.pflScreen =
    pflScreen;
window.ensurePFL =
    ensurePFL;
window.processPFLWeek =
    processPFLWeek;
window.getPFLRisk =
    getPFLRisk;
window.getPFLRecovery =
    getPFLRecovery;
window.getPFLRecoveryRemaining =
    getPFLRecoveryRemaining;
