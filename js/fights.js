let currentOpponent = null;
let currentEvent = null;


/* =========================================================
   PROCURAR LUTA
========================================================= */

function findFight() {

    if (player.nextFight) {

        alert(
            "Você já tem uma luta marcada."
        );

        return;

    }


    /*
     * AMADOR
     *
     * Lutador amador pode lutar normalmente,
     * mas não utiliza contrato profissional.
     */

    if (!player.professional.active) {

        currentEvent =
            generateEvent();

        currentOpponent =
            generateFighter();


        currentOpponent.power +=
            currentEvent.level * 5;


        player.nextFight = {

            opponent:
                currentOpponent,

            event:
                currentEvent,

            purse:
                currentEvent.purse,

            week:
                player.week + 1,

            amateur:
                true

        };


        player.log.unshift(

            "🥋 Luta amadora marcada: " +
            currentEvent.name

        );


        save();

        fightScreen();

        return;

    }


    /*
     * PROFISSIONAL
     */

    currentEvent =
        generateEvent();


    currentOpponent =
        generateFighter();


    /*
     * Quanto maior o evento,
     * mais forte o adversário.
     */

    currentOpponent.power +=
        currentEvent.level * 5;


    /*
     * Bolsa:
     *
     * Se existe contrato ativo,
     * a bolsa vem do contrato.
     *
     * Caso contrário usa a bolsa
     * padrão do evento.
     */

    let purse =
        currentEvent.purse;


    if (
        player.currentContract &&
        player.currentContract.active
    ) {

        purse =
            player.currentContract.purse;

    }


    player.nextFight = {

        opponent:
            currentOpponent,

        event:
            currentEvent,

        purse:
            purse,

        week:
            player.week + 1,

        amateur:
            false

    };


    player.log.unshift(

        "📅 Luta profissional marcada: " +
        currentEvent.name

    );


    save();

    fightScreen();

}


/* =========================================================
   LUTAR
========================================================= */
function registerContractFight(won) {

    if (
        !player.currentContract ||
        !player.currentContract.active
    ) {

        return;

    }


    /*
     * Registra a luta.
     */

    player.currentContract.fightsCompleted =
        (
            player.currentContract.fightsCompleted ||
            0
        ) + 1;


    /*
     * Garante que o número de lutas
     * contratadas exista.
     */

    const totalFights =
        player.currentContract.fights || 3;


    /*
     * Verifica se o contrato terminou.
     */

    if (
        player.currentContract.fightsCompleted >=
        totalFights
    ) {

        player.currentContract.active =
            false;


        player.log.unshift(

            "📄 Contrato encerrado com " +
            player.currentContract.promotionName +
            "."

        );


        alert(

            "📄 CONTRATO ENCERRADO!\n\n" +

            player.currentContract.promotionName +
            "\n\n" +

            "Lutas realizadas: " +
            totalFights +

            "\n\n" +

            "Seu desempenho será usado " +
            "para negociar o próximo contrato."

        );


        /*
         * Guarda o contrato encerrado.
         */

        player.lastContract = {

            ...player.currentContract

        };


        /*
         * Remove o contrato atual.
         */

        player.currentContract =
            null;


        /*
         * A próxima proposta será
         * gerada posteriormente.
         */

        save();

        return;

    }


    /*
     * Ainda existem lutas no contrato.
     */

    const remaining =
        totalFights -
        player.currentContract.fightsCompleted;


    player.log.unshift(

        "📄 Contrato: " +
        remaining +
        " luta(s) restante(s)."

    );


    save();

}

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


    /*
     * =====================================================
     * FORÇA DO LUTADOR
     * =====================================================
     */

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


    /*
     * Experiência profissional.
     */

    fighterPower +=
        player.professional.wins * 1.5;


    /*
     * Experiência amadora também ajuda.
     */

    fighterPower +=
        player.amateur.wins * 0.5;


    /*
     * Equipe influencia.
     */

    if (player.team) {

        fighterPower +=
            player.team.quality / 8;

    }


    /*
     * Fadiga prejudica.
     */

    fighterPower -=
        player.fatigue / 5;


    /*
     * Pequena variação aleatória.
     */

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

        /*
         * =================================================
         * AMADOR
         * =================================================
         */

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


        /*
         * =================================================
         * PROFISSIONAL
         * =================================================
         */

        else {

            player.professional.wins++;


            opponent.losses++;


            /*
             * Bolsa do contrato.
             */

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


            /*
             * Soma bolsa + bônus.
             */

            let grossMoney =
                purse +
                winBonus;


            /*
             * Comissão do empresário.
             */

            let commission = 0;


            if (player.manager) {

                commission =
                    player.manager.commission || 0;

            }


            const finalMoney =
                grossMoney -
                (
                    grossMoney *
                    commission /
                    100
                );


            player.money +=
                finalMoney;


            /*
             * Fama proporcional ao nível.
             */

            player.fame +=
                event.level * 4;


            /*
             * Confiança.
             */

            player.attributes.confidence =
                Math.min(
                    100,
                    player.attributes.confidence + 3
                );


            /*
             * REGISTRA A LUTA NO CONTRATO
             */

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
                Math.round(grossMoney) +

                "\n" +

                "Recebido após comissão: $" +
                Math.round(finalMoney)

            );

        }

    }


    /* =====================================================
       DERROTA
    ===================================================== */

    else {

        /*
         * =================================================
         * AMADOR
         * =================================================
         */

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


        /*
         * =================================================
         * PROFISSIONAL
         * =================================================
         */

        else {

            player.professional.losses++;


            opponent.wins++;


            /*
             * Bolsa é paga mesmo em derrota.
             */

            let purse =
                event.purse;


            if (
                player.currentContract &&
                player.currentContract.active
            ) {

                purse =
                    player.currentContract.purse;

            }


            /*
             * Comissão do empresário.
             */

            let commission = 0;


            if (player.manager) {

                commission =
                    player.manager.commission || 0;

            }


            const finalMoney =
                purse -
                (
                    purse *
                    commission /
                    100
                );


            player.money +=
                finalMoney;


            /*
             * Perda de fama.
             */

            player.fame =
                Math.max(
                    0,
                    player.fame -
                    event.level * 2
                );


            /*
             * Confiança.

             */

            player.attributes.confidence =
                Math.max(
                    0,
                    player.attributes.confidence - 4
                );


            /*
             * REGISTRA A LUTA NO CONTRATO
             */

            registerContractFight(
                false
            );


            player.log.unshift(

                "❌ Derrota contra " +
                opponent.displayName

            );


            alert(

                "❌ DERROTA!\n\n" +

                opponent.displayName +

                "\n\n" +

                "Bolsa recebida: $" +
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

    updateCareerStage();


    updateRanking();


    save();


    home();

}
