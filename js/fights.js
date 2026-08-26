/* =========================================================
   MMA LIFE DYNASTY
   FIGHT.JS
   SISTEMA COMPLETO DE LUTAS
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
            draws: 0

        };

    }


    if (!player.professional) {

        player.professional = {

            active: false,
            wins: 0,
            losses: 0,
            draws: 0

        };

    }


    if (
        typeof player.manager ===
        "undefined"
    ) {

        player.manager = null;

    }


    if (
        typeof player.managerOffer ===
        "undefined"
    ) {

        player.managerOffer = null;

    }


    if (
        typeof player.professionalOffer ===
        "undefined"
    ) {

        player.professionalOffer = null;

    }


    if (
        typeof player.nextFight ===
        "undefined"
    ) {

        player.nextFight = null;

    }


    if (
        typeof player.fightCamp ===
        "undefined"
    ) {

        player.fightCamp = null;

    }


    if (
        typeof player.fightLocked ===
        "undefined"
    ) {

        player.fightLocked = false;

    }


    if (
        typeof player.recoveryWeeks ===
        "undefined"
    ) {

        player.recoveryWeeks = 0;

    }


    return player;

}


/* =========================================================
   EMPRESÁRIOS
========================================================= */

const MMA_MANAGERS = [

    {
        id: "local_01",
        name: "Carlos Mendes",
        level: 1,
        reputation: 25,
        negotiation: 25,
        contacts: 20,
        fee: 5,
        description:
            "Empresário local que trabalha com jovens talentos."
    },

    {
        id: "regional_01",
        name: "Rafael Costa",
        level: 2,
        reputation: 40,
        negotiation: 45,
        contacts: 40,
        fee: 8,
        description:
            "Conhecido no circuito regional brasileiro."
    },

    {
        id: "national_01",
        name: "André Martins",
        level: 3,
        reputation: 60,
        negotiation: 65,
        contacts: 60,
        fee: 10,
        description:
            "Empresário respeitado nas principais organizações nacionais."
    },

    {
        id: "international_01",
        name: "Eduardo Silva",
        level: 4,
        reputation: 78,
        negotiation: 80,
        contacts: 82,
        fee: 12,
        description:
            "Empresário internacional com contatos em grandes organizações."
    },

    {
        id: "elite_01",
        name: "Marcelo Almeida",
        level: 5,
        reputation: 95,
        negotiation: 95,
        contacts: 98,
        fee: 15,
        description:
            "Um dos maiores empresários do MMA."
    }

];


/* =========================================================
   NÍVEL DO LUTADOR
========================================================= */

function getFighterCareerLevel() {

    const player =
        ensureFightData();

    if (!player) {
        return 1;
    }


    const amateur =
        player.amateur || {};

    const pro =
        player.professional || {};


    const amateurFights =

        Number(amateur.wins || 0) +

        Number(amateur.losses || 0) +

        Number(amateur.draws || 0);


    const proFights =

        Number(pro.wins || 0) +

        Number(pro.losses || 0) +

        Number(pro.draws || 0);


    const fame =
        Number(player.fame || 0);


    const ovr =

        typeof window.getOverall ===
        "function"

        ?

        Number(window.getOverall())

        :

        50;


    if (
        proFights >= 15 &&
        (
            fame >= 100 ||
            ovr >= 80
        )
    ) {

        return 5;

    }


    if (
        proFights >= 8 &&
        (
            fame >= 50 ||
            ovr >= 70
        )
    ) {

        return 4;

    }


    if (
        proFights >= 4 &&
        (
            fame >= 25 ||
            ovr >= 60
        )
    ) {

        return 3;

    }


    if (
        amateurFights >= 3
    ) {

        return 2;

    }


    return 1;

}


/* =========================================================
   REQUISITOS PARA SER PROFISSIONAL
========================================================= */

function canBecomeProfessional() {

    const player =
        ensureFightData();

    if (!player) {
        return false;
    }


    const age =
        Number(player.age || 0);


    const amateur =
        player.amateur || {};


    const amateurFights =

        Number(amateur.wins || 0) +

        Number(amateur.losses || 0) +

        Number(amateur.draws || 0);


    return (

        age >= 18 &&

        amateurFights >= 3 &&

        !(
            player.professional &&
            player.professional.active
        )

    );

}


/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */

function generateFightOpponent() {

    const player =
        fightGetPlayer();


    const playerOVR =

        typeof window.getOverall ===
        "function"

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
        "Gustavo Rocha",
        "Henrique Costa",
        "Paulo Mendes",
        "Renato Alves",
        "Leonardo Souza"

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
                Math.random() *
                names.length
            )
        ];


    const randomStyle =
        styles[
            Math.floor(
                Math.random() *
                styles.length
            )
        ];


    const variation =

        Math.floor(
            Math.random() * 15
        ) - 7;


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
                Math.random() * 15
            ),

        losses:
            Math.floor(
                Math.random() * 8
            ),

        draws:
            0

    };

}


/* =========================================================
   GERAR EVENTO
========================================================= */

function generateFightEvent(
    professional = false
) {

    const amateurEvents = [

        "TORNEIO MMA FUTURO",
        "CIRCUITO AMADOR",
        "MMA ROOKIES",
        "FUTURE FIGHTERS",
        "AMATEUR COMBAT",
        "NOVOS GUERREIROS"

    ];


    const professionalEvents = [

        "MMA NIGHT",
        "FIGHT NIGHT",
        "WARRIOR FC",
        "BRAZIL FIGHT",
        "MMA CHALLENGE",
        "COMBAT NIGHT",
        "RISING FIGHTERS",
        "FIGHT LEAGUE",
        "GLOBAL COMBAT"

    ];


    const events =

        professional
        ?
        professionalEvents
        :
        amateurEvents;


    const eventName =
        events[
            Math.floor(
                Math.random() *
                events.length
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
            "Brasil",

        professional:
            professional

    };

}


/* =========================================================
   ESCOLHER TEMPO ATÉ A LUTA
========================================================= */

function generateFightWeeks(
    professional = false,
    titleFight = false
) {

    const random =
        Math.random();


    /*
       12 semanas é raro.
       É usado principalmente em
       grandes lutas e cinturões.
    */

    if (
        professional &&
        titleFight
    ) {

        if (random < 0.55) {
            return 12;
        }

        if (random < 0.80) {
            return 8;
        }

        if (random < 0.95) {
            return 6;
        }

        return 4;

    }


    /*
       Luta profissional normal.
    */

    if (professional) {

        if (random < 0.55) {
            return 4;
        }

        if (random < 0.82) {
            return 6;
        }

        if (random < 0.98) {
            return 8;
        }

        return 12;

    }


    /*
       Amador.
    */

    if (random < 0.65) {
        return 4;
    }

    if (random < 0.90) {
        return 6;
    }

    return 8;

}


/* =========================================================
   CRIAR LUTA
========================================================= */

function createFight(
    professional = false,
    titleFight = false
) {

    const player =
        ensureFightData();


    if (!player) {
        return null;
    }


    const opponent =
        generateFightOpponent();


    const event =
        generateFightEvent(
            professional
        );


    const weeks =
        generateFightWeeks(
            professional,
            titleFight
        );


    const currentWeek =
        Number(
            player.week || 1
        );


    let fightWeek =
        currentWeek + weeks;


    let fightYear =
        Number(
            player.year || 2026
        );


    while (
        fightWeek > 52
    ) {

        fightWeek -= 52;
        fightYear++;

    }


    return {

        event:
            event,

        opponent:
            opponent,

        week:
            fightWeek,

        year:
            fightYear,

        weeksUntilFight:
            weeks,

        professional:
            professional,

        titleFight:
            titleFight,

        campWeeks:
            weeks,

        campCompleted:
            0

    };

}


/* =========================================================
   PROCURAR LUTA AMADORA
========================================================= */

function searchFight() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    /*
       Se é profissional,
       NÃO pode procurar luta.
    */

    if (
        player.professional &&
        player.professional.active
    ) {

        fightScreen();

        return;

    }


    /*
       Se já existe luta.
    */

    if (player.nextFight) {

        fightScreen();

        return;

    }


    const fight =
        createFight(
            false,
            false
        );


    player.nextFight =
        fight;


    player.fightLocked =
        false;


    player.fightCamp = {

        totalWeeks:
            fight.campWeeks,

        completedWeeks:
            0,

        active:
            true

    };


    player.log =
        player.log || [];


    player.log.unshift(

        `📅 Luta amadora marcada contra ${fight.opponent.displayName}. Evento em ${fight.weeksUntilFight} semanas.`

    );


    fightSave();


    fightScreen();

}


/* =========================================================
   OFERTA DE EMPRESÁRIO
========================================================= */

function generateManagerOffer() {

    const player =
        ensureFightData();


    if (!player) {
        return null;
    }


    if (player.manager) {
        return null;
    }


    const careerLevel =
        getFighterCareerLevel();


    /*
       Empresários muito grandes
       não aparecem no começo.
    */

    const available =
        MMA_MANAGERS.filter(

            function(manager) {

                return (
                    manager.level <=
                    careerLevel
                );

            }

        );


    if (
        available.length === 0
    ) {

        return null;

    }


    const manager =
        available[
            Math.floor(
                Math.random() *
                available.length
            )
        ];


    return {

        manager:
            manager,

        createdWeek:
            Number(
                player.week || 1
            ),

        createdYear:
            Number(
                player.year || 2026
            )

    };

}


/* =========================================================
   EMPRESÁRIO APARECE
========================================================= */

function processManagerDiscovery() {

    const player =
        ensureFightData();


    if (!player) {
        return;

    }


    /*
       Já possui empresário.
    */

    if (player.manager) {
        return;
    }


    /*
       Já existe uma oferta.
    */

    if (player.managerOffer) {
        return;
    }


    const amateur =
        player.amateur || {};


    const fights =

        Number(amateur.wins || 0) +

        Number(amateur.losses || 0) +

        Number(amateur.draws || 0);


    /*
       Quanto mais experiência,
       maior a chance de ser observado.
    */

    let chance = 0.02;


    if (fights >= 1) {
        chance = 0.04;
    }

    if (fights >= 2) {
        chance = 0.07;
    }

    if (fights >= 3) {
        chance = 0.12;
    }


    /*
       Vitória aumenta visibilidade.
    */

    if (
        Number(amateur.wins || 0) >= 3
    ) {

        chance += 0.05;

    }


    /*
       O empresário não aparece
       necessariamente logo.
    */

    if (
        Math.random() > chance
    ) {

        return;

    }


    const offer =
        generateManagerOffer();


    if (!offer) {
        return;
    }


    player.managerOffer =
        offer;


    player.log =
        player.log || [];


    player.log.unshift(

        `📩 ${offer.manager.name} demonstrou interesse em representar você.`

    );


    fightSave();

}


/* =========================================================
   ACEITAR EMPRESÁRIO
========================================================= */

function acceptManagerOffer() {

    const player =
        ensureFightData();


    if (
        !player ||
        !player.managerOffer
    ) {

        return;

    }


    player.manager =
        player.managerOffer.manager;


    player.managerOffer =
        null;


    player.log =
        player.log || [];


    player.log.unshift(

        `🤝 ${player.manager.name} agora é seu empresário.`

    );


    fightSave();


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }

}


/* =========================================================
   RECUSAR EMPRESÁRIO
========================================================= */

function declineManagerOffer() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    if (
        !player.managerOffer
    ) {

        return;

    }


    const name =
        player.managerOffer.manager.name;


    player.managerOffer =
        null;


    player.log =
        player.log || [];


    player.log.unshift(

        `🚪 Você recusou a proposta de ${name}.`

    );


    fightSave();


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }

}


/* =========================================================
   EMPRESÁRIO OFERECE PROFISSIONAL
========================================================= */

function processProfessionalEligibility() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    if (
        player.professional &&
        player.professional.active
    ) {

        return;

    }


    /*
       Precisa de empresário.
    */

    if (!player.manager) {
        return;
    }


    /*
       Requisitos:
       18 anos + 3 lutas amadoras.
    */

    if (
        !canBecomeProfessional()
    ) {

        return;

    }


    /*
       Já existe proposta.
    */

    if (
        player.professionalOffer
    ) {

        return;

    }


    const manager =
        player.manager;


    player.professionalOffer = {

        promotionName:
            "Brasil Fight",

        contractFights:
            4,

        purse:
            1200 +
            (
                manager.level * 500
            ),

        winBonus:
            500 +
            (
                manager.level * 250
            ),

        managerName:
            manager.name,

        createdWeek:
            Number(
                player.week || 1
            ),

        createdYear:
            Number(
                player.year || 2026
            )

    };


    player.log =
        player.log || [];


    player.log.unshift(

        `📄 Seu empresário conseguiu uma proposta de contrato profissional.`

    );


    fightSave();

}


/* =========================================================
   ACEITAR CONTRATO PROFISSIONAL
========================================================= */

function acceptProfessionalOffer() {

    const player =
        ensureFightData();


    if (
        !player ||
        !player.professionalOffer
    ) {

        return;

    }


    const offer =
        player.professionalOffer;


    player.professional =
        player.professional || {};


    player.professional.active =
        true;


    player.professional.wins =
        Number(
            player.professional.wins || 0
        );


    player.professional.losses =
        Number(
            player.professional.losses || 0
        );


    player.professional.draws =
        Number(
            player.professional.draws || 0
        );


    player.currentContract = {

        active:
            true,

        promotionName:
            offer.promotionName,

        fights:
            offer.contractFights,

        fightsCompleted:
            0,

        purse:
            offer.purse,

        winBonus:
            offer.winBonus

    };


    player.professionalOffer =
        null;


    player.careerStage =
        "regional";


    player.log =
        player.log || [];


    player.log.unshift(

        `🥊 VOCÊ VIROU PROFISSIONAL! Contrato assinado com ${offer.promotionName}.`

    );


    fightSave();


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }

}


/* =========================================================
   RECUSAR CONTRATO PROFISSIONAL
========================================================= */

function declineProfessionalOffer() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    player.professionalOffer =
        null;


    player.log =
        player.log || [];


    player.log.unshift(

        "🚪 Você recusou a primeira proposta profissional."

    );


    fightSave();


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }

}


/* =========================================================
   EMPRESÁRIO PROCURA LUTA PROFISSIONAL
========================================================= */

function processManagerFightOffer() {

    const player =
        ensureFightData();


    if (!player) {
        return;

    }


    /*
       Só empresário procura luta
       profissional.
    */

    if (
        !(
            player.professional &&
            player.professional.active
        )
    ) {

        return;

    }


    if (!player.manager) {
        return;
    }


    /*
       Já possui luta.
    */

    if (player.nextFight) {
        return;
    }


    /*
       Recuperação.
    */

    if (
        Number(
            player.recoveryWeeks || 0
        ) > 0
    ) {

        return;

    }


    /*
       Pequena chance por semana.
    */

    let chance = 0.18;


    chance +=

        Number(
            player.manager.contacts || 0
        ) * 0.001;


    if (
        Math.random() >
        chance
    ) {

        return;

    }


    const titleFight =

        Number(
            player.fame || 0
        ) >= 80 &&

        Number(
            player.professional.wins || 0
        ) >= 5 &&

        Math.random() < 0.08;


    const fight =
        createFight(
            true,
            titleFight
        );


    player.nextFight =
        fight;


    player.fightLocked =
        false;


    player.fightCamp = {

        totalWeeks:
            fight.campWeeks,

        completedWeeks:
            0,

        active:
            true

    };


    player.log =
        player.log || [];


    player.log.unshift(

        `📩 ${player.manager.name} conseguiu uma luta profissional contra ${fight.opponent.displayName}.`

    );


    fightSave();

}


/* =========================================================
   CAMP
========================================================= */

function processFightCampWeek() {

    const player =
        ensureFightData();


    if (
        !player ||
        !player.nextFight ||
        !player.fightCamp
    ) {

        return;

    }


    const camp =
        player.fightCamp;


    if (
        !camp.active
    ) {

        return;

    }


    camp.completedWeeks =

        Number(
            camp.completedWeeks || 0
        ) + 1;


    /*
       Pequena melhora de confiança
       durante o camp.
    */

    player.confidence =

        Math.min(

            100,

            Number(
                player.confidence || 50
            ) + 1

        );


    /*
       Camp também gera fadiga.
    */

    player.fatigue =

        Math.min(

            100,

            Number(
                player.fatigue || 0
            ) + 3

        );


    if (
        camp.completedWeeks >=
        camp.totalWeeks
    ) {

        camp.active =
            false;

    }

}


/* =========================================================
   VERIFICAR DIA DA LUTA
========================================================= */

function isFightDay() {

    const player =
        ensureFightData();


    if (
        !player ||
        !player.nextFight
    ) {

        return false;

    }


    const fight =
        player.nextFight;


    return (

        Number(player.week || 1) ===
        Number(fight.week || 1)

        &&

        Number(player.year || 2026) ===
        Number(fight.year || 2026)

    );

}


/* =========================================================
   BLOQUEAR CALENDÁRIO
========================================================= */

function processFightCalendarLock() {

    const player =
        ensureFightData();


    if (!player) {
        return false;
    }


    if (
        isFightDay()
    ) {

        player.fightLocked =
            true;

        return true;

    }


    player.fightLocked =
        false;

    return false;

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

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    ⚔️ LUTA
                </div>

                <p>
                    Nenhum lutador carregado.
                </p>

            </div>

        `;

        return;

    }


    /*
       OFERTA DE EMPRESÁRIO
    */

    if (
        player.managerOffer
    ) {

        const manager =
            player.managerOffer.manager;


        content.innerHTML = `

            <div class="card">

                <div class="title">
                    👔 NOVO EMPRESÁRIO
                </div>

                <p>
                    Um empresário observou
                    sua carreira e quer
                    representar você.
                </p>

                <div class="statline">

                    <span>
                        Empresário
                    </span>

                    <b>
                        ${manager.name}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Nível
                    </span>

                    <b>
                        ${manager.level} / 5
                    </b>

                </div>

                <p>
                    ${manager.description}
                </p>

                <div class="statline">

                    <span>
                        Reputação
                    </span>

                    <b>
                        ${manager.reputation}
                    </b>

                </div>

                <button
                    class="green"
                    onclick="acceptManagerOffer()">

                    🤝 ACEITAR EMPRESÁRIO

                </button>

                <button
                    class="gray"
                    onclick="declineManagerOffer()">

                    🚪 RECUSAR

                </button>

            </div>

        `;

        return;

    }


    /*
       OFERTA PROFISSIONAL
    */

    if (
        player.professionalOffer
    ) {

        const offer =
            player.professionalOffer;


        content.innerHTML = `

            <div class="card">

                <div class="title">
                    📄 CONTRATO PROFISSIONAL
                </div>

                <p>
                    Seu empresário conseguiu
                    uma oportunidade profissional.
                </p>

                <div class="statline">

                    <span>
                        Organização
                    </span>

                    <b>
                        ${offer.promotionName}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Lutas
                    </span>

                    <b>
                        ${offer.contractFights}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Bolsa
                    </span>

                    <b>
                        $${Math.round(
                            offer.purse
                        )}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Bônus por vitória
                    </span>

                    <b>
                        $${Math.round(
                            offer.winBonus
                        )}
                    </b>

                </div>

                <button
                    class="green"
                    onclick="acceptProfessionalOffer()">

                    🥊 ASSINAR CONTRATO

                </button>

                <button
                    class="gray"
                    onclick="declineProfessionalOffer()">

                    🚪 RECUSAR

                </button>

            </div>

        `;

        return;

    }


    /*
       SEM LUTA
    */

    if (
        !player.nextFight
    ) {

        const isProfessional =

            player.professional &&
            player.professional.active;


        content.innerHTML = `

            <div class="card">

                <div class="title">
                    ⚔️ LUTA
                </div>

                ${
                    isProfessional

                    ?

                    `
                    <p>
                        👔 Seu empresário está
                        procurando uma oportunidade.
                    </p>

                    <p>
                        Você não precisa procurar
                        lutas profissionais.
                    </p>
                    `

                    :

                    `
                    <p>
                        Você ainda não possui
                        uma luta amadora marcada.
                    </p>

                    <button
                        class="main-button"
                        onclick="searchFight()">

                        🔎 PROCURAR LUTA AMADORA

                    </button>
                    `
                }

                <button
                    class="gray"
                    onclick="tab('home')">

                    ← VOLTAR

                </button>

            </div>

        `;

        return;

    }


    const fight =
        player.nextFight;


    const opponent =
        fight.opponent;


    const event =
        fight.event;


    const playerOVR =

        typeof window.getOverall ===
        "function"

        ?

        window.getOverall()

        :

        50;


    const fightDay =
        isFightDay();


    content.innerHTML = `

        <div class="card">

            <div class="title">
                ${
                    fightDay
                    ?
                    "🔴 HOJE É DIA DE LUTA"
                    :
                    "⚔️ PRÓXIMA LUTA"
                }
            </div>

            <div class="statline">

                <span>
                    Tipo
                </span>

                <b>
                    ${
                        fight.professional
                        ?
                        "Profissional"
                        :
                        "Amador"
                    }
                </b>

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
                    Semana
                </span>

                <b>
                    ${fight.week}
                    /
                    ${fight.year}
                </b>

            </div>

            <div class="statline">

                <span>
                    Camp
                </span>

                <b>
                    ${fight.campWeeks}
                    semanas
                </b>

            </div>

            ${
                fight.titleFight
                ?
                `
                <div class="statline">

                    <span>
                        🏆 Categoria
                    </span>

                    <b>
                        DISPUTA DE CINTURÃO
                    </b>

                </div>
                `
                :
                ""
            }

        </div>


        <div class="card">

            <div class="title">
                🥊 CARD DO EVENTO
            </div>

            <p>
                O evento está sendo montado.
                Sua luta faz parte do card.
            </p>

            <div class="statline">

                <span>
                    Preliminar 1
                </span>

                <b>
                    Pedro Mendes vs Lucas Rocha
                </b>

            </div>

            <div class="statline">

                <span>
                    Preliminar 2
                </span>

                <b>
                    Diego Silva vs Bruno Costa
                </b>

            </div>

            <div class="statline">

                <span>
                    Co-main event
                </span>

                <b>
                    Rafael Lima vs Marcos Santos
                </b>

            </div>

            <div class="statline">

                <span>
                    Sua luta
                </span>

                <b>
                    ${player.name}
                    vs
                    ${opponent.displayName}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                🥊 CONFRONTO
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
                        Estilo:
                        ${opponent.style}
                    </p>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="title">
                ❤️ SUA CONDIÇÃO
            </div>

            <div class="statline">

                <span>
                    Saúde
                </span>

                <b>
                    ${Math.round(
                        player.health || 100
                    )}%
                </b>

            </div>

            <div class="statline">

                <span>
                    Fadiga
                </span>

                <b>
                    ${Math.round(
                        player.fatigue || 0
                    )}%
                </b>

            </div>

        </div>


        ${
            fightDay

            ?

            `
            <div class="card">

                <div class="title">
                    🔒 CALENDÁRIO BLOQUEADO
                </div>

                <p>
                    Hoje é o dia do evento.
                    Você precisa realizar a luta
                    antes de continuar avançando
                    o calendário.
                </p>

                <button
                    class="main-button"
                    onclick="simulateFight()">

                    🥊 ENTRAR NO COMBATE

                </button>

            </div>
            `

            :

            `
            <div class="card">

                <div class="title">
                    🏋️ CAMP
                </div>

                <p>
                    Prepare-se para o evento.
                    Faltam
                    <strong>
                        ${calculateWeeksUntilFight()}
                    </strong>
                    semanas.
                </p>

                <p>
                    O calendário continuará
                    normalmente até o dia da luta.
                </p>

            </div>
            `
        }


        <div class="card">

            <button
                class="gray"
                onclick="tab('home')">

                ← VOLTAR

            </button>

        </div>

    `;

}


/* =========================================================
   SEMANAS ATÉ A LUTA
========================================================= */

function calculateWeeksUntilFight() {

    const player =
        ensureFightData();


    if (
        !player ||
        !player.nextFight
    ) {

        return 0;

    }


    const currentWeek =
        Number(
            player.week || 1
        );


    const currentYear =
        Number(
            player.year || 2026
        );


    const fightWeek =
        Number(
            player.nextFight.week
        );


    const fightYear =
        Number(
            player.nextFight.year
        );


    if (
        fightYear === currentYear
    ) {

        return Math.max(
            0,
            fightWeek - currentWeek
        );

    }


    return Math.max(

        0,

        (
            52 - currentWeek
        ) +

        fightWeek

    );

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


    /*
       Não permite lutar antes do dia.
    */

    if (
        !isFightDay()
    ) {

        alert(
            "A luta ainda não chegou. Continue o camp até a data do evento."
        );

        return;

    }


    const opponent =
        player.nextFight.opponent;


    const playerOVR =

        typeof window.getOverall ===
        "function"

        ?

        Number(
            window.getOverall()
        )

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
            player.confidence || 50
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


    const isProfessional =

        player.professional &&
        player.professional.active;


    let record;


    if (isProfessional) {

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
            Number(
                record.wins || 0
            ) + 1;


        resultText =
            "🏆 VITÓRIA!";


        player.fame =
            Number(
                player.fame || 0
            ) + (
                isProfessional
                ?
                5
                :
                3
            );


        player.money =
            Number(
                player.money || 0
            ) + (
                isProfessional
                ?
                Number(
                    player.currentContract &&
                    player.currentContract.purse
                    ||
                    500
                )
                :
                250
            );


        player.confidence =
            Math.min(

                100,

                Number(
                    player.confidence || 50
                ) + 8

            );


        player.log =
            player.log || [];


        player.log.unshift(

            `🏆 Vitória sobre ${opponent.displayName}.`

        );

    }
    else {

        record.losses =
            Number(
                record.losses || 0
            ) + 1;


        resultText =
            "❌ DERROTA";


        player.fame =
            Math.max(

                0,

                Number(
                    player.fame || 0
                ) - 1

            );


        player.money =
            Number(
                player.money || 0
            ) + (
                isProfessional
                ?
                250
                :
                100
            );


        player.confidence =
            Math.max(

                0,

                Number(
                    player.confidence || 50
                ) - 8

            );


        player.log =
            player.log || [];


        player.log.unshift(

            `❌ Derrota para ${opponent.displayName}.`

        );

    }


    /*
       Dano da luta.
    */

    const damage =
        Math.floor(
            Math.random() * 30
        ) + 15;


    player.health =
        Math.max(

            20,

            Number(
                player.health || 100
            ) - damage

        );


    player.fatigue =
        Math.min(

            100,

            Number(
                player.fatigue || 0
            ) + 50

        );


    /*
       Recuperação.
       4 semanas normalmente.
       Lutas muito duras podem gerar mais.
    */

    let recoveryWeeks = 4;


    if (
        damage >= 35
    ) {

        recoveryWeeks = 6;

    }


    if (
        damage >= 42
    ) {

        recoveryWeeks = 8;

    }


    if (
        damage >= 48 ||
        player.nextFight.titleFight
    ) {

        recoveryWeeks = 12;

    }


    player.recoveryWeeks =
        recoveryWeeks;


    player.log =
        player.log || [];


    player.log.unshift(

        `🏥 Recuperação estimada: ${recoveryWeeks} semanas.`

    );


    /*
       Contrato profissional.
    */

    if (
        isProfessional &&
        player.currentContract &&
        player.currentContract.active
    ) {

        player.currentContract.fightsCompleted =

            Number(
                player.currentContract.fightsCompleted || 0
            ) + 1;

    }


    /*
       Fim da luta.
    */

    player.nextFight =
        null;


    player.fightCamp =
        null;


    player.fightLocked =
        false;


    fightSave();


    showFightResult(

        resultText,

        opponent,

        playerWins,

        recoveryWeeks

    );

}


/* =========================================================
   RESULTADO
========================================================= */

function showFightResult(
    resultText,
    opponent,
    playerWins,
    recoveryWeeks
) {

    const player =
        fightGetPlayer();


    const content =
        document.getElementById(
            "content"
        );


    if (!content) {
        return;
    }


    const record =

        player.professional &&
        player.professional.active

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


        <div class="card">

            <div class="title">
                📊 NOVO RECORDE
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
                🏥 RECUPERAÇÃO
            </div>

            <p>
                Você precisa de aproximadamente
                <strong>
                    ${recoveryWeeks} semanas
                </strong>
                para se recuperar desta luta.
            </p>

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

            <div class="statline">

                <span>
                    Fadiga
                </span>

                <b>
                    ${Math.round(
                        player.fatigue || 0
                    )}%
                </b>

            </div>

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
            player.recoveryWeeks || 0
        ) > 0
    ) {

        player.recoveryWeeks =

            Math.max(

                0,

                Number(
                    player.recoveryWeeks || 0
                ) - 1

            );

    }


    player.fatigue =

        Math.max(

            0,

            Number(
                player.fatigue || 0
            ) - 12

        );


    player.health =

        Math.min(

            100,

            Number(
                player.health || 100
            ) + 8

        );

}


/* =========================================================
   PROCESSAR SEMANA
========================================================= */

function processFightWeek() {

    const player =
        ensureFightData();


    if (!player) {
        return;
    }


    processFightRecovery();


    processFightCampWeek();


    processManagerDiscovery();


    processProfessionalEligibility();


    /*
       Só procura luta profissional
       através do empresário.
    */

    processManagerFightOffer();


    processFightCalendarLock();

}


/* =========================================================
   VERIFICAR SE PODE AVANÇAR
========================================================= */

function canAdvanceFightWeek() {

    const player =
        ensureFightData();


    if (!player) {
        return true;
    }


    if (
        isFightDay()
    ) {

        player.fightLocked =
            true;

        return false;

    }


    return true;

}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.fightScreen =
    fightScreen;


window.searchFight =
    searchFight;


window.generateFightOpponent =
    generateFightOpponent;


window.generateFightEvent =
    generateFightEvent;


window.generateFightWeeks =
    generateFightWeeks;


window.simulateFight =
    simulateFight;


window.processFightRecovery =
    processFightRecovery;


window.processManagerFightOffer =
    processManagerFightOffer;


window.processFightWeek =
    processFightWeek;


window.processFightCampWeek =
    processFightCampWeek;


window.processManagerDiscovery =
    processManagerDiscovery;


window.acceptManagerOffer =
    acceptManagerOffer;


window.declineManagerOffer =
    declineManagerOffer;


window.acceptProfessionalOffer =
    acceptProfessionalOffer;


window.declineProfessionalOffer =
    declineProfessionalOffer;


window.canBecomeProfessional =
    canBecomeProfessional;


window.canAdvanceFightWeek =
    canAdvanceFightWeek;


window.isFightDay =
    isFightDay;


window.processFightCalendarLock =
    processFightCalendarLock;
