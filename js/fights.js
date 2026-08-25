function fight() {
    if (!player.nextFight) {
        return;
    }
    const opponent =
        player.nextFight.opponent;
    const event =
        player.nextFight.event;
    const a =
        player.attributes;
    const isAmateur =
        player.nextFight.amateur === true;
    /* =====================================================
       FORÇA DO LUTADOR
    ===================================================== */
    let fighterPower = (
        a.strength +
        a.striking +
        a.wrestling +
        a.grappling +
        a.cardio +
        a.technique +
        a.defense +
        a.fightIQ +
        a.mental +
        a.confidence
    ) / 10;
    fighterPower +=
        player.professional.wins * 1.5;
    fighterPower +=
        player.amateur.wins * 0.5;
    if (player.team) {
        fighterPower +=
            player.team.quality / 8;
    }
    fighterPower -=
        player.fatigue / 5;
    fighterPower +=
        Math.random() * 20 - 10;
    const enemyPower =
        opponent.power;
    const won =
        fighterPower >= enemyPower;
    /* =====================================================
       VITÓRIA
    ===================================================== */
    if (won) {
        /* =================================================
           AMADOR
        ================================================= */
        if (isAmateur) {
            player.amateur.wins++;
            player.fame +=
                1;
            player.attributes.confidence =
                Math.min(
                    100,
                    player.attributes.confidence + 2
                );
            player.log.unshift(
                "🥋 Vitória amadora contra " +
                opponent.displayName +
                " no " +
                event.name
            );
            alert(
                "🥋 VITÓRIA AMADORA!\n\n" +
                opponent.displayName +
                "\n\n" +
                "Bolsa: $0"
            );
        }
        /* =================================================
           PROFISSIONAL
        ================================================= */
        else {
            player.professional.wins++;
            opponent.losses++;
            let purse =
                event.purse;
            let winBonus =
                0;
            if (
                player.currentContract &&
                player.currentContract.active
            ) {
                purse =
                    player.currentContract.purse;
                winBonus =
                    player.currentContract.winBonus;
            }
            /* =================================================
               PAGAMENTO
            ================================================= */
            const payout =
                calculateFightPayout(
                    purse,
                    winBonus
                );
            const finalMoney =
                payout.net;
            player.money +=
                finalMoney;
            /* =================================================
               FAMA
            ================================================= */
            player.fame +=
                event.level * 4;
            player.attributes.confidence =
                Math.min(
                    100,
                    player.attributes.confidence + 3
                );
            /* =================================================
               CONTRATO
            ================================================= */
            registerContractFight(
                true
            );
            player.log.unshift(
                "🏆 Vitória contra " +
                opponent.displayName +
                " no " +
                event.name
            );
            alert(
                "🏆 VITÓRIA!\n\n" +
                opponent.displayName +
                "\n\n" +
                "Bolsa: $" +
                Math.round(purse) +
                "\n" +
                "Bônus de vitória: $" +
                Math.round(winBonus) +
                "\n\n" +
                "Total bruto: $" +
                Math.round(payout.gross) +
                "\n" +
                "Empresário: -$" +
                Math.round(payout.managerCut) +
                "\n" +
                "Academia: -$" +
                Math.round(payout.teamCut) +
                "\n\n" +
                "Você recebeu: $" +
                Math.round(finalMoney)
            );
        }
    }
    /* =====================================================
       DERROTA
    ===================================================== */
    else {
        /* =================================================
           AMADOR
        ================================================= */
        if (isAmateur) {
            player.amateur.losses++;
            player.fame =
                Math.max(
                    0,
                    player.fame - 1
                );
            player.attributes.confidence =
                Math.max(
                    0,
                    player.attributes.confidence - 2
                );
            player.log.unshift(
                "❌ Derrota amadora contra " +
                opponent.displayName
            );
            alert(
                "❌ DERROTA AMADORA!\n\n" +
                opponent.displayName
            );
        }
        /* =================================================
           PROFISSIONAL
        ================================================= */
        else {
            player.professional.losses++;
            opponent.wins++;
            let purse =
                event.purse;
            if (
                player.currentContract &&
                player.currentContract.active
            ) {
                purse =
                    player.currentContract.purse;
            }
            /* =================================================
               PAGAMENTO DA DERROTA
            ================================================= */
            const payout =
                calculateFightPayout(
                    purse,
                    0
                );
            const finalMoney =
                payout.net;
            player.money +=
                finalMoney;
            /* =================================================
               FAMA
            ================================================= */
            player.fame =
                Math.max(
                    0,
                    player.fame -
                    event.level * 2
                );
            player.attributes.confidence =
                Math.max(
                    0,
                    player.attributes.confidence - 4
                );
            /* =================================================
               CONTRATO
            ================================================= */
            registerContractFight(
                false
            );
            player.log.unshift(
                "❌ Derrota contra " +
                opponent.displayName +
                " no " +
                event.name
            );
            alert(
                "❌ DERROTA!\n\n" +
                opponent.displayName +
                "\n\n" +
                "Bolsa: $" +
                Math.round(purse) +
                "\n\n" +
                "Empresário: -$" +
                Math.round(payout.managerCut) +
                "\n" +
                "Academia: -$" +
                Math.round(payout.teamCut) +
                "\n\n" +
                "Você recebeu: $" +
                Math.round(finalMoney)
            );
        }
    }
    /* =====================================================
       DANO DA LUTA
    ===================================================== */
    player.health =
        Math.max(
            20,
            player.health -
            (
                10 +
                event.level * 2
            )
        );
    player.fatigue =
        Math.min(
            100,
            player.fatigue + 30
        );
    /* =====================================================
       LIMPAR LUTA
    ===================================================== */
    player.nextFight =
        null;
    currentOpponent =
        null;
    currentEvent =
        null;
    /* =====================================================
       ATUALIZAR CARREIRA
    ===================================================== */
    updateRanking();
    save();
    home();
}
