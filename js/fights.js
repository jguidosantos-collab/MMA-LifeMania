/* =========================================================
   MMA LIFE DYNASTY
   FIGHT.JS
   SISTEMA DEFINITIVO DE LUTAS
========================================================= */


/* =========================================================
   UTILIDADES
========================================================= */

function fightGetPlayer() {

    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {

        if (
            typeof window.createDefaultPlayer === "function"
        ) {

            window.player =
                window.createDefaultPlayer();

        }

    }

    return window.player;

}


function fightSave() {

    if (
        typeof window.saveGame === "function"
    ) {

        window.saveGame();

    }

}


/* =========================================================
   GARANTIR ESTRUTURAS
========================================================= */

function ensureFightData() {

    const player =
        fightGetPlayer();

    if (!player) {
        return null;
    }


    if (!player.amateur) {

        player.amateur = {

            wins: 0,
            losses: 0,
            draws: 0,
            ranking: 50

        };

    }


    if (!player.professional) {

        player.professional = {

            active: false,
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: null

        };

    }


    if (!player.manager) {

        player.manager = {

            name: "Carlos Mendes",
            level: 1,
            reputation: 20,
            quality: 35,
            active: true

        };

    }


    if (!Array.isArray(player.managerOffers)) {

        player.managerOffers = [];

    }


    if (!Array.isArray(player.opportunities)) {

        player.opportunities = [];

    }


    if (!player.nextFight) {

        player.nextFight = null;

    }


    if (
        typeof player.fightRecoveryWeeks ===
        "undefined"
    ) {

        player.fightRecoveryWeeks = 0;

    }


    if (
        typeof player.fightRecoveryUntilWeek ===
        "undefined"
    ) {

        player.fightRecoveryUntilWeek = null;

    }


    if (
        typeof player.fightRecoveryUntilYear ===
        "undefined"
    ) {

        player.fightRecoveryUntilYear = null;

    }


    return player;

}


/* =========================================================
   PROFISSIONAL?
========================================================= */

function isProfessional() {

    const player =
        ensureFightData();

    if (!player) {
        return false;
    }

    return !!(
        player.professional &&
        player.professional.active
    );

}


/* =========================================================
   REQUISITOS PARA VIRAR PROFISSIONAL
========================================================= */

function getAmateurFightCount() {

    const player =
        ensureFightData();

    if (!player) {
        return 0;
    }

    const amateur =
        player.amateur || {};

    return (
        Number(amateur.wins || 0) +
        Number(amateur.losses || 0) +
        Number(amateur.draws || 0)
    );

}


function canBecomeProfessional() {

    const player =
        ensureFightData();

    if (!player) {
        return false;
    }

    return (
        Number(player.age || 0) >= 18 &&
        getAmateurFightCount() >= 3
    );

}


/* =========================================================
   PROMOÇÃO PARA PROFISSIONAL
========================================================= */

function checkProfessionalPromotion() {

    const player =
        ensureFightData();

    if (!player) {
        return false;

    }


    if (
        player.professional &&
        player.professional.active
    ) {

        return false;

    }


    if (!canBecomeProfessional()) {

        return false;

    }


    player.professional.active =
        true;


    player.careerStage =
        "regional";


    player.professional.ranking =
        50;


    player.log =
        player.log || [];


    player.log.unshift(

        "🎉 Você cumpriu os requisitos e se tornou um lutador profissional!"

    );


    player.media =
        player.media || {

            headlines: [],
            interviews: [],
            appearances: [],
            pressReputation: 0,
            publicImage: 0

        };


    player.media.headlines =
        player.media.headlines || [];


    player.media.headlines.unshift(

        "📰 NOVO PROFISSIONAL: Você está pronto para iniciar sua carreira profissional."

    );


    fightSave();


    return true;

}


/* =========================================================
   DISTÂNCIA ATÉ UMA DATA
========================================================= */

function getWeekDistance(
    currentWeek,
    currentYear,
    targetWeek,
    targetYear
) {

    const current =
        (
            Number(currentYear || 2026) * 52
        ) +
        Number(currentWeek || 1);


    const target =
        (
            Number(targetYear || 2026) * 52
        ) +
        Number(targetWeek || 1);


    return target - current;

}


/* =========================================================
   ESCOLHER INTERVALO DA LUTA
========================================================= */

function generateFightCampWeeks() {

    const roll =
        Math.random();


    /*
       Maior probabilidade:
       4 semanas

       Depois:
       6 semanas

       Depois:
       8 semanas

       12 semanas é raro.
    */

    if (roll < 0.55) {

        return 4;

    }

    if (roll < 0.80) {

        return 6;

    }

    if (roll < 0.95) {

        return 8;

    }

    return 12;

}


/* =========================================================
   ESCOLHER DATA FUTURA
========================================================= */

function calculateFutureFightDate(
    weeks
) {

    const player =
        ensureFightData();


    let week =
        Number(player.week || 1);


    let year =
        Number(player.year || 2026);


    week += weeks;


    while (week > 52) {

        week -= 52;

        year++;

    }


    return {

        week:
            week,

        year:
            year,

        campWeeks:
            weeks

    };

}


/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */

function generateFightOpponent() {

    const player =
        ensureFightData();


    const playerOVR =
        typeof window.getOverall === "function"
        ?
        Number(window.getOverall())
        :
        50;


    const names = [

        "Carlos Silva",
        "Lucas Ferreira",
        "Matheus Santos",
        "Rafael Oliveira",
        "Bruno Costa",
        "Diego Almeida",
        "Gabriel Souza",
        "Anderson Lima",
        "Felipe Rocha",
        "Victor Martins",
        "João Ribeiro",
        "Pedro Mendes",
        "Marcos Carvalho",
        "Thiago Alves",
        "Eduardo Santos",
        "Renato Barbosa",
        "Caio Martins",
        "Vinícius Rocha",
        "Thiago Costa",
        "Alexandre Lima"

    ];


    const styles = [

        "Striker",
        "Wrestler",
        "Grappler",
        "Completo"

    ];


    const randomName =
        names[
            Math.floor(
                Math.random() * names.length
            )
        ];


    const randomStyle =
        styles[
            Math.floor(
                Math.random() * styles.length
            )
        ];


    let variation;


    if (isProfessional()) {

        variation =
            Math.floor(
                Math.random() * 17
            ) - 8;

    }
    else {

        variation =
            Math.floor(
                Math.random() * 13
            ) - 6;

    }


    const power =
        Math.max(
            35,
            Math.min(
                95,
                playerOVR + variation
            )
        );


    return {

        displayName:
            randomName,

        name:
            randomName,

        power:
            power,

        ovr:
            power,

        style:
            randomStyle,

        country:
            "Brasil",

        wins:
            Math.floor(
                Math.random() * 12
            ),

        losses:
            Math.floor(
                Math.random() * 7
            ),

        draws:
            Math.random() < 0.1
            ?
            1
            :
            0

    };

}


/* =========================================================
   GERAR EVENTO
========================================================= */

function generateFightEvent() {

    const events = [

        "MMA NIGHT",
        "FIGHT NIGHT",
        "WARRIOR FC",
        "BRAZIL FIGHT",
        "MMA CHALLENGE",
        "COMBAT NIGHT",
        "RISING FIGHTERS",
        "ARENA COMBAT",
        "FIGHT ARENA",
        "WARRIOR CHAMPIONSHIP"

    ];


    const eventName =
        events[
            Math.floor(
                Math.random() * events.length
            )
        ];


    return {

        name:
            eventName,

        venue:
            "Arena MMA",

        city:
            "São Paulo",

        country:
            "Brasil"

    };

}


/* =========================================================
   GERAR FINANÇAS DA LUTA
========================================================= */

function generateFightFinancials(
    opponent,
    titleFight
) {

    const player =
        ensureFightData();


    const opponentOVR =
        Number(
            opponent.power || 50
        );


    let purse;


    let winBonus;


    if (!isProfessional()) {

        purse =
            Math.floor(
                100 +
                Math.random() * 201
            );


        winBonus =
            Math.floor(
                50 +
                Math.random() * 101
            );

    }
    else {

        purse =
            Math.floor(
                800 +
                (
                    opponentOVR * 35
                ) +
                Math.random() * 800
            );


        winBonus =
            Math.floor(
                300 +
                (
                    opponentOVR * 20
                ) +
                Math.random() * 500
            );

    }


    if (titleFight) {

        purse =
            Math.round(
                purse * 1.75
            );


        winBonus =
            Math.round(
                winBonus * 2
            );

    }


    /*
       Empresário influencia a proposta.
    */

    if (
        player.manager &&
        player.manager.quality
    ) {

        const quality =
            Number(
                player.manager.quality
            );


        const multiplier =
            1 +
            (
                quality / 500
            );


        purse =
            Math.round(
                purse * multiplier
            );


        winBonus =
            Math.round(
                winBonus * multiplier
            );

    }


    return {

        purse:
            purse,

        winBonus:
            winBonus

    };

}


/* =========================================================
   GERAR PROPOSTA
========================================================= */

function generateManagerFightOffer() {

    const player =
        ensureFightData();


    if (!player) {
        return null;
    }


    if (player.nextFight) {
        return null;
    }


    if (
        player.managerOffers &&
        player.managerOffers.length > 0
    ) {

        return null;

    }


    const opponent =
        generateFightOpponent();


    const event =
        generateFightEvent();


    const campWeeks =
        generateFightCampWeeks();


    const date =
        calculateFutureFightDate(
            campWeeks
        );


    /*
       Cinturão é muito raro no começo.
       Só aparece para profissionais
       mais avançados.
    */

    let titleFight =
        false;


    if (
        isProfessional() &&
        Number(player.fame || 0) >= 40 &&
        Math.random() < 0.08
    ) {

        titleFight = true;

    }


    const financials =
        generateFightFinancials(
            opponent,
            titleFight
        );


    const offer = {

        id:
            Date.now(),

        type:
            "fight",

        status:
            "pending",

        professional:
            isProfessional(),

        amateur:
            !isProfessional(),

        event:
            event,

        opponent:
            opponent,

        purse:
            financials.purse,

        winBonus:
            financials.winBonus,

        titleFight:
            titleFight,

        campWeeks:
            campWeeks,

        fightWeek:
            date.week,

        fightYear:
            date.year,

        offeredWeek:
            Number(
                player.week || 1
            ),

        offeredYear:
            Number(
                player.year || 2026
            )

    };


    player.managerOffers =
        player.managerOffers || [];


    player.managerOffers.push(
        offer
    );


    player.opportunities =
        player.opportunities || [];


    player.opportunities.unshift({

        type:
            "fight_offer",

        title:
            "📩 Nova proposta de luta",

        week:
            Number(
                player.week || 1
            ),

        year:
            Number(
                player.year || 2026
            ),

        opponent:
            opponent.displayName

    });


    player.log =
        player.log || [];


    player.log.unshift(

        `📩 Seu empresário encontrou uma luta contra ${opponent.displayName}.`

    );


    fightSave();


    return offer;

}


/* =========================================================
   MOSTRAR OFERTA
========================================================= */

function managerFightOfferScreen() {

    const player =
        ensureFightData();


    const content =
        document.getElementById(
            "content"
        );


    if (!content) {
        return;
    }


    const offer =
        player.managerOffers &&
        player.managerOffers.length
        ?
        player.managerOffers[0]
        :
        null;


    if (!offer) {

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    👔 EMPRESÁRIO
                </div>

                <p>
                    Seu empresário ainda está
                    procurando uma oportunidade.
                </p>

                <button
                    class="gray"
                    onclick="tab('home')">

                    ← VOLTAR

                </button>

            </div>

        `;

        return;

    }


    const manager =
        player.manager ||
        { name: "Seu empresário" };


    content.innerHTML = `

        <div class="card">

            <div class="title">
                📩 NOVA PROPOSTA DE LUTA
            </div>

            <p>
                <strong>
                    ${manager.name}
                </strong>
                encontrou uma oportunidade
                para você.
            </p>

        </div>


        <div class="card">

            <div class="title">
                🥊 EVENTO
            </div>

            <div class="statline">
                <span>
                    Evento
                </span>

                <b>
                    ${offer.event.name}
                </b>
            </div>

            <div class="statline">
                <span>
                    Local
                </span>

                <b>
                    ${offer.event.city}
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
                    Tipo
                </span>

                <b>
                    ${
                        offer.titleFight
                        ?
                        "🏆 DISPUTA DE CINTURÃO"
                        :
                        offer.professional
                        ?
                        "Profissional"
                        :
                        "Amador"
                    }
                </b>
            </div>

        </div>


        <div class="card">

            <div class="title">
                ⚔️ ADVERSÁRIO
            </div>

            <div class="fighter-card">

                <div class="fighter-avatar">
                    👊
                </div>

                <div class="fighter-info">

                    <h2>
                        ${offer.opponent.displayName}
                    </h2>

                    <p>
                        ${offer.opponent.country}
                    </p>

                    <p>
                        OVR:
                        <strong>
                            ${offer.opponent.power}
                        </strong>
                    </p>

                    <p>
                        Estilo:
                        ${offer.opponent.style}
                    </p>

                    <p>
                        Cartel:
                        ${offer.opponent.wins}-
                        ${offer.opponent.losses}-
                        ${offer.opponent.draws}
                    </p>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="title">
                💰 PROPOSTA
            </div>

            <div class="statline">

                <span>
                    Bolsa
                </span>

                <b>
                    $${offer.purse}
                </b>

            </div>

            <div class="statline">

                <span>
                    Bônus por vitória
                </span>

                <b>
                    $${offer.winBonus}
                </b>

            </div>

            <div class="statline">

                <span>
                    Camp
                </span>

                <b>
                    ${offer.campWeeks} semanas
                </b>

            </div>

            <div class="statline">

                <span>
                    Luta
                </span>

                <b>
                    Semana ${offer.fightWeek}
                    / ${offer.fightYear}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                🤝 DECISÃO
            </div>

            <p>
                Você aceita essa luta?
            </p>

            <button
                class="green"
                onclick="acceptManagerFightOffer()">

                ✅ ACEITAR LUTA

            </button>

            <button
                class="gray"
                onclick="rejectManagerFightOffer()">

                ❌ RECUSAR

            </button>

        </div>

    `;

}


/* =========================================================
   ACEITAR OFERTA
========================================================= */

function acceptManagerFightOffer() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    if (
        !player.managerOffers ||
        !player.managerOffers.length
    ) {

        managerFightOfferScreen();

        return;

    }


    const offer =
        player.managerOffers.shift();


    player.nextFight = {

        id:
            offer.id,

        event:
            offer.event,

        opponent:
            offer.opponent,

        purse:
            offer.purse,

        winBonus:
            offer.winBonus,

        titleFight:
            offer.titleFight,

        professional:
            offer.professional,

        amateur:
            offer.amateur,

        campWeeks:
            offer.campWeeks,

        fightWeek:
            offer.fightWeek,

        fightYear:
            offer.fightYear,

        acceptedWeek:
            Number(
                player.week || 1
            ),

        acceptedYear:
            Number(
                player.year || 2026
            ),

        campStarted:
            true,

        campCompleted:
            0,

        fightReady:
            false

    };


    player.log =
        player.log || [];


    player.log.unshift(

        `✅ Luta aceita contra ${offer.opponent.displayName}. O camp será de ${offer.campWeeks} semanas.`

    );


    player.opportunities =
        player.opportunities || [];


    player.opportunities.unshift({

        type:
            "fight_accepted",

        title:
            "🥊 Luta aceita",

        opponent:
            offer.opponent.displayName,

        week:
            player.nextFight.fightWeek,

        year:
            player.nextFight.fightYear

    });


    fightSave();


    fightScreen();

}


/* =========================================================
   RECUSAR OFERTA
========================================================= */

function rejectManagerFightOffer() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    if (
        player.managerOffers &&
        player.managerOffers.length
    ) {

        const offer =
            player.managerOffers.shift();


        player.log =
            player.log || [];


        player.log.unshift(

            `❌ Você recusou a luta contra ${offer.opponent.displayName}.`

        );

    }


    fightSave();


    if (
        typeof window.home === "function"
    ) {

        window.home();

    }

}


/* =========================================================
   TELA DE LUTA
========================================================= */

function fightScreen() {

    const player =
        ensureFightData();


    const content =
        document.getElementById(
            "content"
        );


    if (!content) {
        return;
    }


    if (!player) {
        return;
    }


    /*
       Se existe oferta pendente,
       ela aparece primeiro.
    */

    if (
        player.managerOffers &&
        player.managerOffers.length > 0
    ) {

        managerFightOfferScreen();

        return;

    }


    /*
       Sem luta marcada.
    */

    if (!player.nextFight) {

        const statusText =
            isProfessional()
            ?
            "Seu empresário está procurando uma oportunidade para você."
            :
            "Seu empresário ainda está começando a construir sua carreira amadora.";


        content.innerHTML = `

            <div class="card">

                <div class="title">
                    🥊 LUTAS
                </div>

                <p>
                    ${statusText}
                </p>

                <div class="statline">

                    <span>
                        Carreira
                    </span>

                    <b>
                        ${
                            isProfessional()
                            ?
                            "PROFISSIONAL"
                            :
                            "AMADOR"
                        }
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Lutas amadoras
                    </span>

                    <b>
                        ${getAmateurFightCount()}
                    </b>

                </div>

                ${
                    !isProfessional()
                    ?
                    `
                    <div class="statline">

                        <span>
                            Requisito profissional
                        </span>

                        <b>
                            ${
                                Number(player.age || 0) >= 18
                                ?
                                "18 anos ✓"
                                :
                                `${player.age || 15}/18 anos`
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
                    👔 EMPRESÁRIO
                </div>

                <p>
                    ${
                        player.manager
                        ?
                        player.manager.name
                        :
                        "Nenhum empresário"
                    }
                </p>

                <p>
                    Aguarde uma nova oportunidade.
                </p>

            </div>


            <button
                class="gray"
                onclick="tab('home')">

                ← VOLTAR

            </button>

        `;

        return;

    }


    const fight =
        player.nextFight;


    const opponent =
        fight.opponent;


    const event =
        fight.event;


    const currentWeek =
        Number(
            player.week || 1
        );


    const currentYear =
        Number(
            player.year || 2026
        );


    const distance =
        getWeekDistance(
            currentWeek,
            currentYear,
            fight.fightWeek,
            fight.fightYear
        );


    const playerOVR =
        typeof window.getOverall === "function"
        ?
        Number(window.getOverall())
        :
        50;


    /*
       Chegou a semana da luta.
    */

    const fightDay =
        distance <= 0;


    /*
       Camp atual.
    */

    const campElapsed =
        Math.max(
            0,
            (
                Number(
                    currentWeek
                ) -
                Number(
                    fight.acceptedWeek ||
                    currentWeek
                )
            )
        );


    const campProgress =
        Math.min(
            100,
            Math.round(
                (
                    campElapsed /
                    Math.max(
                        1,
                        Number(
                            fight.campWeeks || 4
                        )
                    )
                ) * 100
            )
        );


    content.innerHTML = `

        <div class="card">

            <div class="title">
                ${
                    fightDay
                    ?
                    "🥊 DIA DA LUTA"
                    :
                    "📅 PRÓXIMA LUTA"
                }
            </div>

            <div class="statline">

                <span>
                    Evento
                </span>

                <b>
                    ${event.name}
                </b>

            </div>

            <div class="statline">

                <span>
                    Local
                </span>

                <b>
                    ${event.city}
                </b>

            </div>

            <div class="statline">

                <span>
                    Data
                </span>

                <b>
                    Semana ${fight.fightWeek}
                    / ${fight.fightYear}
                </b>

            </div>

            <div class="statline">

                <span>
                    Faltam
                </span>

                <b>
                    ${
                        fightDay
                        ?
                        "HOJE"
                        :
                        `${distance} semana(s)`
                    }
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                ⚔️ CONFRONTO
            </div>

            <div class="fighter-card">

                <div class="fighter-avatar">
                    🥊
                </div>

                <div class="fighter-info">

                    <h2>
                        ${player.name || "Você"}
                    </h2>

                    <p>
                        ${player.country || "Brasil"}
                    </p>

                    <p>
                        OVR:
                        <strong>
                            ${playerOVR}
                        </strong>
                    </p>

                </div>

            </div>


            <div style="
                text-align:center;
                font-size:28px;
                margin:15px 0;
            ">
                VS
            </div>


            <div class="fighter-card">

                <div class="fighter-avatar">
                    👊
                </div>

                <div class="fighter-info">

                    <h2>
                        ${opponent.displayName}
                    </h2>

                    <p>
                        ${opponent.country}
                    </p>

                    <p>
                        OVR:
                        <strong>
                            ${opponent.power}
                        </strong>
                    </p>

                    <p>
                        ${opponent.style}
                    </p>

                </div>

            </div>

        </div>


        ${
            !fightDay
            ?
            `
            <div class="card">

                <div class="title">
                    🏋️ CAMP
                </div>

                <div class="statline">

                    <span>
                        Progresso
                    </span>

                    <b>
                        ${campProgress}%
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Camp
                    </span>

                    <b>
                        ${fight.campWeeks} semanas
                    </b>

                </div>

                <p>
                    Continue avançando as semanas
                    para completar sua preparação.
                </p>

            </div>
            `
            :
            `
            <div class="card">

                <div class="title">
                    🔒 SEMANA DA LUTA
                </div>

                <p>
                    A luta chegou.
                    Você não pode avançar para a
                    próxima semana sem lutar.
                </p>

            </div>
            `
        }


        <div class="card">

            <div class="title">
                💰 CONTRATO DA LUTA
            </div>

            <div class="statline">

                <span>
                    Bolsa
                </span>

                <b>
                    $${fight.purse || 0}
                </b>

            </div>

            <div class="statline">

                <span>
                    Bônus por vitória
                </span>

                <b>
                    $${fight.winBonus || 0}
                </b>

            </div>

        </div>


        <div class="card">

            ${
                fightDay
                ?
                `
                <button
                    class="main-button"
                    onclick="simulateFight()">

                    🥊 ENTRAR NO COMBATE

                </button>
                `
                :
                `
                <p>
                    O combate ainda não chegou.
                </p>

                <button
                    class="gray"
                    onclick="tab('home')">

                    ← VOLTAR

                </button>
                `
            }

        </div>

    `;

}


/* =========================================================
   PODE AVANÇAR SEMANA?
========================================================= */

function canAdvanceFightWeek() {

    const player =
        ensureFightData();


    if (!player) {
        return true;
    }


    if (!player.nextFight) {
        return true;
    }


    const distance =
        getWeekDistance(

            Number(
                player.week || 1
            ),

            Number(
                player.year || 2026
            ),

            Number(
                player.nextFight.fightWeek
            ),

            Number(
                player.nextFight.fightYear
            )

        );


    /*
       Se a luta é hoje ou já chegou,
       NÃO pode avançar.
    */

    if (distance <= 0) {

        return false;

    }


    return true;

}


/* =========================================================
   SIMULAR LUTA
========================================================= */

function simulateFight() {

    const player =
        ensureFightData();


    if (
        !player ||
        !player.nextFight
    ) {

        fightScreen();

        return;

    }


    const fight =
        player.nextFight;


    const distance =
        getWeekDistance(

            Number(
                player.week || 1
            ),

            Number(
                player.year || 2026
            ),

            Number(
                fight.fightWeek
            ),

            Number(
                fight.fightYear
            )

        );


    /*
       Impede lutar antes da data.
    */

    if (distance > 0) {

        alert(
            `A luta ainda não chegou. Faltam ${distance} semana(s).`
        );

        return;

    }


    const opponent =
        fight.opponent;


    const playerOVR =
        typeof window.getOverall === "function"
        ?
        Number(window.getOverall())
        :
        50;


    const opponentOVR =
        Number(
            opponent.power || 50
        );


    const health =
        Number(
            player.health || 100
        );


    const fatigue =
        Number(
            player.fatigue || 0
        );


    const confidence =
        Number(
            player.confidence ||
            (
                player.attributes &&
                player.attributes.confidence
            ) ||
            50
        );


    const playerScore =

        playerOVR

        +

        (
            health - 50
        ) * 0.10

        -

        fatigue * 0.10

        +

        (
            confidence - 50
        ) * 0.05

        +

        (
            Math.random() * 20 - 10
        );


    const opponentScore =

        opponentOVR

        +

        (
            Math.random() * 20 - 10
        );


    const playerWins =
        playerScore >= opponentScore;


    let record;


    if (isProfessional()) {

        record =
            player.professional;

    }
    else {

        record =
            player.amateur;

    }


    let resultText;


    if (playerWins) {

        record.wins =
            Number(record.wins || 0) + 1;


        resultText =
            "🏆 VITÓRIA!";


        player.fame =
            Number(player.fame || 0) + 3;


        player.money =
            Number(player.money || 0) +
            Number(fight.purse || 0) +
            Number(fight.winBonus || 0);


        player.confidence =
            Math.min(
                100,
                Number(confidence) + 8
            );


        if (
            player.attributes &&
            typeof player.attributes.confidence !==
            "undefined"
        ) {

            player.attributes.confidence =
                Math.min(
                    100,
                    Number(
                        player.attributes.confidence
                    ) + 8
                );

        }


        player.log =
            player.log || [];


        player.log.unshift(

            `🏆 Vitória sobre ${opponent.displayName}. Bolsa: $${fight.purse}. Bônus: $${fight.winBonus}.`

        );

    }
    else {

        record.losses =
            Number(record.losses || 0) + 1;


        resultText =
            "❌ DERROTA";


        player.fame =
            Math.max(
                0,
                Number(player.fame || 0) - 1
            );


        player.money =
            Number(player.money || 0) +
            Number(fight.purse || 0);


        player.confidence =
            Math.max(
                0,
                Number(confidence) - 8
            );


        if (
            player.attributes &&
            typeof player.attributes.confidence !==
            "undefined"
        ) {

            player.attributes.confidence =
                Math.max(
                    0,
                    Number(
                        player.attributes.confidence
                    ) - 8
                );

        }


        player.log =
            player.log || [];


        player.log.unshift(

            `❌ Derrota para ${opponent.displayName}. Bolsa recebida: $${fight.purse}.`

        );

    }


    /*
       DANO DA LUTA
    */

    const damageRoll =
        Math.random();


    let damage;


    if (damageRoll < 0.55) {

        damage =
            15 +
            Math.floor(
                Math.random() * 11
            );

    }
    else if (damageRoll < 0.85) {

        damage =
            25 +
            Math.floor(
                Math.random() * 16
            );

    }
    else {

        damage =
            40 +
            Math.floor(
                Math.random() * 21
            );

    }


    /*
       Títulos e lutas muito duras
       podem gerar recuperação longa.
    */

    let recoveryWeeks;


    if (fight.titleFight) {

        recoveryWeeks = 12;

    }
    else if (damage >= 50) {

        recoveryWeeks = 12;

    }
    else if (damage >= 40) {

        recoveryWeeks = 8;

    }
    else if (damage >= 30) {

        recoveryWeeks = 6;

    }
    else {

        recoveryWeeks = 4;

    }


    player.health =
        Math.max(
            25,
            Number(player.health || 100) -
            damage
        );


    player.fatigue =
        Math.min(
            100,
            Number(player.fatigue || 0) + 50
        );


    /*
       Define recuperação.
    */

    let recoveryWeek =
        Number(
            player.week || 1
        ) +
        recoveryWeeks;


    let recoveryYear =
        Number(
            player.year || 2026
        );


    while (
        recoveryWeek > 52
    ) {

        recoveryWeek -= 52;

        recoveryYear++;

    }


    player.fightRecoveryWeeks =
        recoveryWeeks;


    player.fightRecoveryUntilWeek =
        recoveryWeek;


    player.fightRecoveryUntilYear =
        recoveryYear;


    /*
       A luta acabou.
    */

    player.nextFight =
        null;


    /*
       Profissionalização automática
       após a luta, se cumprir requisitos.
    */

    const promoted =
        checkProfessionalPromotion();


    fightSave();


    showFightResult(

        resultText,

        opponent,

        playerWins,

        recoveryWeeks,

        damage,

        promoted

    );

}


/* =========================================================
   RESULTADO
========================================================= */

function showFightResult(

    resultText,

    opponent,

    playerWins,

    recoveryWeeks,

    damage,

    promoted

) {

    const player =
        ensureFightData();


    const content =
        document.getElementById(
            "content"
        );


    if (!content) {
        return;
    }


    const record =
        isProfessional()
        ?
        player.professional
        :
        player.amateur;


    content.innerHTML = `

        <div class="card">

            <div class="title">
                🥊 RESULTADO
            </div>

            <div style="
                text-align:center;
                font-size:32px;
                font-weight:bold;
                margin:25px 0;
            ">

                ${resultText}

            </div>

            <p style="
                text-align:center;
            ">

                ${player.name}

                <strong>
                    ${
                        playerWins
                        ?
                        " venceu "
                        :
                        " perdeu para "
                    }
                </strong>

                ${opponent.displayName}

            </p>

        </div>


        ${
            promoted
            ?
            `
            <div class="card">

                <div class="title">
                    🎉 PROMOÇÃO
                </div>

                <p>
                    Você completou os requisitos
                    e agora é oficialmente um
                    <strong>
                        LUTADOR PROFISSIONAL
                    </strong>.
                </p>

            </div>
            `
            :
            ""
        }


        <div class="card">

            <div class="title">
                📊 RECORDE
            </div>

            <div class="statline">

                <span>
                    Vitórias
                </span>

                <b>
                    ${record.wins || 0}
                </b>

            </div>

            <div class="statline">

                <span>
                    Derrotas
                </span>

                <b>
                    ${record.losses || 0}
                </b>

            </div>

            <div class="statline">

                <span>
                    Empates
                </span>

                <b>
                    ${record.draws || 0}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                🩸 PÓS-LUTA
            </div>

            <div class="statline">

                <span>
                    Dano sofrido
                </span>

                <b>
                    ${damage}%
                </b>

            </div>

            <div class="statline">

                <span>
                    Recuperação
                </span>

                <b>
                    ${recoveryWeeks} semanas
                </b>

            </div>

            <div class="statline">

                <span>
                    Saúde
                </span>

                <b>
                    ${Math.round(
                        player.health || 0
                    )}%
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                💰 PAGAMENTO
            </div>

            <div class="statline">

                <span>
                    Bolsa
                </span>

                <b>
                    $${Math.round(
                        playerWins
                        ?
                        (
                            player.nextFight &&
                            player.nextFight.purse
                        ) || 0
                        :
                        0
                    )}
                </b>

            </div>

            <p>
                O pagamento da luta já foi
                contabilizado no seu dinheiro.
            </p>

        </div>


        <div class="card">

            <button
                class="main-button"
                onclick="tab('home')">

                🏠 VOLTAR AO INÍCIO

            </button>

        </div>

    `;

}


/* =========================================================
   RECUPERAÇÃO
========================================================= */

function processFightRecovery() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    if (
        Number(
            player.fatigue || 0
        ) > 0
    ) {

        player.fatigue =
            Math.max(

                0,

                Number(
                    player.fatigue || 0
                ) - 8

            );

    }


    if (
        Number(
            player.health || 100
        ) < 100
    ) {

        player.health =
            Math.min(

                100,

                Number(
                    player.health || 100
                ) + 5

            );

    }


    if (
        Number(
            player.fightRecoveryWeeks || 0
        ) > 0
    ) {

        player.fightRecoveryWeeks =
            Math.max(
                0,
                Number(
                    player.fightRecoveryWeeks
                ) - 1
            );

    }

}


/* =========================================================
   VERIFICAR SE ESTÁ EM RECUPERAÇÃO
========================================================= */

function isInFightRecovery() {

    const player =
        ensureFightData();


    if (!player) {
        return false;
    }


    return (
        Number(
            player.fightRecoveryWeeks || 0
        ) > 0
    );

}


/* =========================================================
   EMPRESÁRIO PROCURA LUTA
========================================================= */

function processManagerFightOffer() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    /*
       Não oferece luta durante recuperação.
    */

    if (isInFightRecovery()) {

        return;

    }


    /*
       Não oferece outra luta
       se já existe uma.
    */

    if (player.nextFight) {

        return;

    }


    /*
       Não oferece outra proposta
       se já existe uma pendente.
    */

    if (
        player.managerOffers &&
        player.managerOffers.length > 0
    ) {

        return;

    }


    /*
       Chance de oferta por semana.
    */

    const chance =
        isProfessional()
        ?
        0.22
        :
        0.28;


    if (
        Math.random() > chance
    ) {

        return;

    }


    generateManagerFightOffer();

}


/* =========================================================
   RECUPERAÇÃO / BLOQUEIO
========================================================= */

function fightBlocksWeekAdvance() {

    const player =
        ensureFightData();


    if (!player) {
        return false;
    }


    if (!player.nextFight) {
        return false;
    }


    const distance =
        getWeekDistance(

            Number(
                player.week || 1
            ),

            Number(
                player.year || 2026
            ),

            Number(
                player.nextFight.fightWeek
            ),

            Number(
                player.nextFight.fightYear
            )

        );


    return distance <= 0;

}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.ensureFightData =
    ensureFightData;


window.isProfessional =
    isProfessional;


window.getAmateurFightCount =
    getAmateurFightCount;


window.canBecomeProfessional =
    canBecomeProfessional;


window.checkProfessionalPromotion =
    checkProfessionalPromotion;


window.generateFightCampWeeks =
    generateFightCampWeeks;


window.generateFightOpponent =
    generateFightOpponent;


window.generateFightEvent =
    generateFightEvent;


window.generateManagerFightOffer =
    generateManagerFightOffer;


window.managerFightOfferScreen =
    managerFightOfferScreen;


window.acceptManagerFightOffer =
    acceptManagerFightOffer;


window.rejectManagerFightOffer =
    rejectManagerFightOffer;


window.fightScreen =
    fightScreen;


window.simulateFight =
    simulateFight;


window.processFightRecovery =
    processFightRecovery;


window.processManagerFightOffer =
    processManagerFightOffer;


window.canAdvanceFightWeek =
    canAdvanceFightWeek;


window.fightBlocksWeekAdvance =
    fightBlocksWeekAdvance;


window.isInFightRecovery =
    isInFightRecovery;
