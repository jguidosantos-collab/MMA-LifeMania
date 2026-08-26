/* =========================================================
   MMA LIFE DYNASTY
   PFL.JS
   SISTEMA PFL GRAND PRIX
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
            invited: false,
            accepted: false,
            active: false,
            year: null,
            division: null,
            round: null,
            wins: 0,
            losses: 0,
            champion: false,
            eliminated: false,
            opponent: null,
            bracket: [],
            prize: 0
        };
    }
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
    if (
        !player.manager
    ) {
        alert(
            "Você precisa ter um empresário para receber um convite do PFL."
        );
        return;
    }
    if (
        player.pfl.active
    ) {
        alert(
            "Você já está participando do PFL Grand Prix."
        );
        return;
    }
    if (
        player.fightOffer
    ) {
        alert(
            "Seu empresário já possui uma oferta de luta para você."
        );
        return;
    }
    /*
     * O empresário apresenta a oportunidade.
     */
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
   ACEITAR GP
========================================================= */
function acceptPFLGrandPrix() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl ||
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
    /*
     * Gera o primeiro adversário.
     */
    player.pfl.opponent =
        generatePFLOpponent();
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
   RECUSAR GP
========================================================= */
function declinePFLGrandPrix() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl ||
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
   GERAR ADVERSÁRIO DO GP
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
    /*
     * O GP deve ter adversários fortes.
     */
    opponent.power =
        Math.max(
            opponent.power || 0,
            65
        );
    opponent.power +=
        Math.random() * 10;
    return opponent;
}
/* =========================================================
   RISCO DO GP
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
        45;
    const difference =
        Math.abs(
            getOverall() -
            opponent.power
        );
    if (
        opponent.power >
        getOverall()
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
   RECUPERAÇÃO DO GP
========================================================= */
function getPFLRecovery() {
    const risk =
        getPFLRisk();
    if (
        risk < 40
    ) {
        return 6;
    }
    if (
        risk < 55
    ) {
        return 8;
    }
    if (
        risk < 70
    ) {
        return 10;
    }
    return 12;
}
/* =========================================================
   LUTAR NO GP
========================================================= */
function fightPFL() {
    ensurePFL();
    const player =
        window.player;
    if (
        !player.pfl ||
        !player.pfl.active
    ) {
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
        opponent.power;
    const risk =
        getPFLRisk();
    const recovery =
        getPFLRecovery();
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
         * Próxima fase
         */
        if (
            player.pfl.round ===
            "Quartas de final"
        ) {
            player.pfl.round =
                "Semifinal";
            player.pfl.opponent =
                generatePFLOpponent();
            player.pfl.prize =
                100000;
            player.log.unshift(
                "🏆 Vitória no PFL Grand Prix! Você avançou para a semifinal."
            );
            alert(
                "🏆 VITÓRIA NO PFL GRAND PRIX!\n\n" +
                opponent.displayName +
                "\n\n" +
                "Você avançou para a SEMIFINAL.\n\n" +
                "Premiação acumulada: $100.000"
            );
        }
        else if (
            player.pfl.round ===
            "Semifinal"
        ) {
            player.pfl.round =
                "Final";
            player.pfl.opponent =
                generatePFLOpponent();
            player.pfl.prize =
                250000;
            player.log.unshift(
                "🔥 Vitória na semifinal do PFL! Você está na FINAL."
            );
            alert(
                "🔥 VOCÊ ESTÁ NA FINAL!\n\n" +
                opponent.displayName +
                "\n\n" +
                "Premiação acumulada: $250.000"
            );
        }
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
            opponent.displayName
        );
    }
    /* =====================================================
       RECUPERAÇÃO
    ===================================================== */
    player.recoveryWeeks =
        recovery;
    player.recoveryUntilWeek =
        Number(player.week || 1) +
        recovery;
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
    save();
    pflScreen();
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
                        Formato
                    </span>
                    <b>
                        8 lutadores — mata-mata
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
                            "Definindo..."
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
                    <div class="statline">
                        <span>
                            Risco
                        </span>
                        <b>
                            ${getPFLRisk()}%
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Recuperação
                        </span>
                        <b>
                            ${getPFLRecovery()} semanas
                        </b>
                    </div>
                    <button
                        class="main-button"
                        onclick="fightPFL()">
                        👊 LUTAR NO GP
                    </button>
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
window.fightPFL =
    fightPFL;
window.pflScreen =
    pflScreen;
window.ensurePFL =
    ensurePFL;
