/* =========================================================
   🏢 SISTEMA DE ACADEMIAS / EQUIPES
   ========================================================= */


/* =========================================================
   BANCO DE ACADEMIAS
========================================================= */

const teams = [

    /* =====================================================
       🇧🇷 BRASIL
       ===================================================== */

    {
        name: "Nova União",
        country: "Brasil",
        city: "Rio de Janeiro",
        level: 5,
        reputation: 92,
        quality: 94,
        monthlyCost: 1200,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 35,
        requiredWins: 6,
        specialty: "Grappling"
    },

    {
        name: "Chute Boxe",
        country: "Brasil",
        city: "Curitiba",
        level: 5,
        reputation: 90,
        quality: 93,
        monthlyCost: 1100,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 30,
        requiredWins: 5,
        specialty: "Striking"
    },

    {
        name: "Team Nogueira",
        country: "Brasil",
        city: "Rio de Janeiro",
        level: 4,
        reputation: 86,
        quality: 89,
        monthlyCost: 900,
        fightFeeMin: 10,
        fightFeeMax: 14,
        requiredFame: 25,
        requiredWins: 4,
        specialty: "MMA"
    },

    {
        name: "X-Gym",
        country: "Brasil",
        city: "Rio de Janeiro",
        level: 4,
        reputation: 84,
        quality: 88,
        monthlyCost: 850,
        fightFeeMin: 10,
        fightFeeMax: 14,
        requiredFame: 20,
        requiredWins: 4,
        specialty: "MMA"
    },


    /* =====================================================
       🇺🇸 ESTADOS UNIDOS
       ===================================================== */

    {
        name: "American Top Team",
        country: "Estados Unidos",
        city: "Coconut Creek",
        level: 5,
        reputation: 98,
        quality: 99,
        monthlyCost: 1800,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 50,
        requiredWins: 8,
        specialty: "MMA"
    },

    {
        name: "American Kickboxing Academy",
        country: "Estados Unidos",
        city: "San Jose",
        level: 5,
        reputation: 96,
        quality: 98,
        monthlyCost: 1700,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 50,
        requiredWins: 8,
        specialty: "Wrestling"
    },

    {
        name: "Xtreme Couture",
        country: "Estados Unidos",
        city: "Las Vegas",
        level: 5,
        reputation: 94,
        quality: 96,
        monthlyCost: 1500,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 45,
        requiredWins: 7,
        specialty: "MMA"
    },

    {
        name: "Jackson Wink MMA",
        country: "Estados Unidos",
        city: "Albuquerque",
        level: 5,
        reputation: 95,
        quality: 97,
        monthlyCost: 1500,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 45,
        requiredWins: 7,
        specialty: "MMA"
    },


    /* =====================================================
       🇳🇿 NOVA ZELÂNDIA
       ===================================================== */

    {
        name: "City Kickboxing",
        country: "Nova Zelândia",
        city: "Auckland",
        level: 5,
        reputation: 97,
        quality: 98,
        monthlyCost: 1400,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 45,
        requiredWins: 7,
        specialty: "Striking"
    },


    /* =====================================================
       🇹🇭 TAILÂNDIA
       ===================================================== */

    {
        name: "Tiger Muay Thai",
        country: "Tailândia",
        city: "Phuket",
        level: 5,
        reputation: 94,
        quality: 96,
        monthlyCost: 1000,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 35,
        requiredWins: 5,
        specialty: "Striking"
    },


    /* =====================================================
       🇫🇷 FRANÇA
       ===================================================== */

    {
        name: "MMA Factory",
        country: "França",
        city: "Paris",
        level: 5,
        reputation: 93,
        quality: 95,
        monthlyCost: 1300,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 40,
        requiredWins: 6,
        specialty: "MMA"
    },


    /* =====================================================
       🇯🇵 JAPÃO
       ===================================================== */

    {
        name: "Tristar Japan",
        country: "Japão",
        city: "Tokyo",
        level: 4,
        reputation: 87,
        quality: 91,
        monthlyCost: 1100,
        fightFeeMin: 10,
        fightFeeMax: 14,
        requiredFame: 30,
        requiredWins: 5,
        specialty: "MMA"
    },


    /* =====================================================
       🇬🇧 REINO UNIDO
       ===================================================== */

    {
        name: "Team Kaobon",
        country: "Reino Unido",
        city: "Liverpool",
        level: 4,
        reputation: 86,
        quality: 90,
        monthlyCost: 1000,
        fightFeeMin: 10,
        fightFeeMax: 14,
        requiredFame: 30,
        requiredWins: 5,
        specialty: "MMA"
    },


    /* =====================================================
       🇨🇦 CANADÁ
       ===================================================== */

    {
        name: "Tristar Gym",
        country: "Canadá",
        city: "Montreal",
        level: 5,
        reputation: 95,
        quality: 97,
        monthlyCost: 1500,
        fightFeeMin: 10,
        fightFeeMax: 15,
        requiredFame: 45,
        requiredWins: 7,
        specialty: "MMA"
    },


    /* =====================================================
       🇷🇺 RÚSSIA
       ===================================================== */

    {
        name: "American Kickboxing Academy Russia",
        country: "Rússia",
        city: "Moscou",
        level: 4,
        reputation: 88,
        quality: 93,
        monthlyCost: 900,
        fightFeeMin: 10,
        fightFeeMax: 14,
        requiredFame: 30,
        requiredWins: 5,
        specialty: "Wrestling"
    },


    /* =====================================================
       🇲🇽 MÉXICO
       ===================================================== */

    {
        name: "Bonebreakers Team",
        country: "México",
        city: "Cidade do México",
        level: 4,
        reputation: 82,
        quality: 87,
        monthlyCost: 750,
        fightFeeMin: 10,
        fightFeeMax: 14,
        requiredFame: 20,
        requiredWins: 4,
        specialty: "Striking"
    }

];


/* =========================================================
   COMISSÃO DA ACADEMIA
========================================================= */

function generateTeamFee(team) {

    return Math.floor(

        team.fightFeeMin +

        Math.random() *
        (
            team.fightFeeMax -
            team.fightFeeMin +
            1
        )

    );

}


/* =========================================================
   VERIFICAR SE PODE ENTRAR
========================================================= */

function canJoinTeam(team) {

    const fame =
        player.fame || 0;

    const wins =
        player.professional
        ? (
            player.professional.wins ||
            0
        )
        : 0;


    if (
        fame <
        team.requiredFame
    ) {

        return false;

    }


    if (
        wins <
        team.requiredWins
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   GERAR OFERTAS
========================================================= */

function generateTeamOffers() {

    player.teamOffers = [];


    const possible =
        teams.filter(
            team =>
                canJoinTeam(team)
        );


    const shuffled =
        [...possible].sort(
            () =>
                Math.random() -
                0.5
        );


    const selected =
        shuffled.slice(
            0,
            3
        );


    player.teamOffers =
        selected.map(
            team => ({

                ...team,

                fightFee:
                    generateTeamFee(team),

                offerType:
                    "standard"

            })
        );

}


/* =========================================================
   ACEITAR ACADEMIA
========================================================= */

function joinTeam(index) {

    const offer =
        player.teamOffers[
            index
        ];


    if (!offer) {

        return;

    }


    if (
        !canJoinTeam(offer)
    ) {

        alert(

            "❌ A academia não aceitou seu nível atual."

        );

        return;

    }


    player.team = {

        name:
            offer.name,

        country:
            offer.country,

        city:
            offer.city,

        level:
            offer.level,

        reputation:
            offer.reputation,

        quality:
            offer.quality,

        monthlyCost:
            offer.monthlyCost,

        fightFee:
            offer.fightFee,

        specialty:
            offer.specialty

    };


    /*
     * Se a academia estiver em outro país,
     * a mudança será processada.
     */

    if (
        player.country !==
        offer.country
    ) {

        moveToTeamCountry(
            offer
        );

        return;

    }


    player.log.unshift(

        "🏢 Você entrou na academia " +
        offer.name +
        "."

    );


    save();


    alert(

        "🏢 ACADEMIA CONTRATADA!\n\n" +

        offer.name +
        "\n" +

        offer.city +
        ", " +
        offer.country +
        "\n\n" +

        "Mensalidade: $" +
        offer.monthlyCost +
        "\n" +

        "Participação por luta: " +
        offer.fightFee +
        "%"

    );


    teamScreen();

}


/* =========================================================
   TESTE NA ACADEMIA
========================================================= */

function tryoutTeam(index) {

    const offer =
        player.teamOffers[
            index
        ];


    if (!offer) {

        return;

    }


    let chance =
        20;


    chance +=
        (
            player.fame || 0
        ) / 3;


    chance +=
        (
            player.professional
            ? player.professional.wins * 2
            : 0
        );


    chance +=
        (
            player.attributes
            ? player.attributes.technique / 5
            : 0
        );


    chance -=
        (
            offer.requiredFame -
            (player.fame || 0)
        ) *
        0.5;


    /*
     * Empresário ajuda.
     */

    if (
        player.manager
    ) {

        chance +=
            (
                player.manager.contacts ||
                0
            ) / 10;

    }


    chance =
        Math.max(
            5,
            Math.min(
                95,
                chance
            )
        );


    const success =
        Math.random() * 100 <
        chance;


    if (success) {

        offer.offerType =
            "tryout";

        offer.fightFee =
            generateTeamFee(
                offer
            );


        player.log.unshift(

            "🥊 Você foi aprovado no teste da " +
            offer.name +
            "."

        );


        save();


        alert(

            "🥊 TESTE APROVADO!\n\n" +

            offer.name +
            "\n\n" +

            "A academia quer você na equipe."

        );


        joinTeam(index);


    } else {

        player.log.unshift(

            "❌ Você não foi aprovado no teste da " +
            offer.name +
            "."

        );


        save();


        alert(

            "❌ TESTE REPROVADO\n\n" +

            offer.name +
            "\n\n" +

            "Seu nível ainda não é suficiente para essa equipe."

        );

    }

}


/* =========================================================
   MUDANÇA DE PAÍS
========================================================= */

function moveToTeamCountry(
    team
) {

    const travelCost =
        team.country ===
        "Estados Unidos"
        ? 2500
        : 1500;


    const totalCost =
        travelCost +
        500;


    if (
        player.money <
        totalCost
    ) {

        alert(

            "❌ Você não tem dinheiro suficiente para se mudar.\n\n" +

            "Custo da mudança: $" +
            totalCost

        );

        return;

    }


    player.money -=
        totalCost;


    player.country =
        team.country;


    player.currentCountry =
        team.country;


    player.currentCity =
        team.city;


    player.log.unshift(

        "✈️ Você se mudou para " +
        team.city +
        ", " +
        team.country +
        " para treinar na " +
        team.name +
        "."

    );


    save();


    alert(

        "✈️ MUDANÇA REALIZADA!\n\n" +

        "Novo país: " +
        team.country +
        "\n" +

        "Cidade: " +
        team.city +
        "\n\n" +

        "Custo da viagem e mudança: $" +
        totalCost

    );


    teamScreen();

}


/* =========================================================
   CUSTO MENSAL DA ACADEMIA
========================================================= */

function payTeamMonthlyCost() {

    if (
        !player.team
    ) {

        return;

    }


    const cost =
        player.team.monthlyCost ||
        0;


    if (
        player.money >= cost
    ) {

        player.money -=
            cost;


        player.log.unshift(

            "🏢 Mensalidade paga para " +
            player.team.name +
            ": $" +
            cost

        );

    } else {

        player.log.unshift(

            "⚠️ Você não conseguiu pagar a mensalidade da academia."

        );

    }


    save();

}


/* =========================================================
   BÔNUS DA ACADEMIA
========================================================= */

function getTeamTrainingBonus(
    attribute
) {

    if (
        !player.team
    ) {

        return 0;

    }


    if (
        player.team.specialty ===
        "MMA"
    ) {

        return 2;

    }


    if (
        player.team.specialty ===
        attribute
    ) {

        return 5;

    }


    if (
        attribute ===
        "striking" &&
        player.team.specialty ===
        "Striking"
    ) {

        return 5;

    }


    if (
        (
            attribute ===
            "wrestling" ||
            attribute ===
            "grappling"
        ) &&
        player.team.specialty ===
        "Wrestling"
    ) {

        return 5;

    }


    if (
        attribute ===
        "grappling" &&
        player.team.specialty ===
        "Grappling"
    ) {

        return 5;

    }


    return 0;

}


/* =========================================================
   PAGAMENTO DA ACADEMIA APÓS A LUTA
========================================================= */

function getTeamFightCommission(
    amount
) {

    if (
        !player.team
    ) {

        return 0;

    }


    const fee =
        player.team.fightFee ||
        0;


    return (
        amount *
        fee /
        100
    );

}


/* =========================================================
   VERIFICAR ACADEMIAS DISPONÍVEIS
========================================================= */

function getAvailableTeams() {

    return teams.filter(
        team =>
            canJoinTeam(
                team
            )
    );

}


/* =========================================================
   LISTAR ACADEMIAS POR PAÍS
========================================================= */

function getTeamsByCountry(
    country
) {

    return teams.filter(
        team =>
            team.country ===
            country
    );

}
/* =========================================================
   💰 CUSTOS DA ACADEMIA NA LUTA
========================================================= */
function calculateTeamFightCut(amount) {
    if (
        !player.team
    ) {
        return 0;
    }
    const fee =
        Number(
            player.team.fightFee || 0
        );
    return (
        amount *
        fee /
        100
    );
}
/* =========================================================
   💰 RESUMO FINANCEIRO DA LUTA
========================================================= */
function calculateFightPayout(
    purse,
    winBonus
) {
    const gross =
        Number(purse || 0) +
        Number(winBonus || 0);
    let managerCut = 0;
    let teamCut = 0;
    /* =====================================================
       👔 EMPRESÁRIO
    ===================================================== */
    if (
        player.manager
    ) {
        const commission =
            Number(
                player.manager.commission || 0
            );
        managerCut =
            gross *
            commission /
            100;
    }
    /* =====================================================
       🏢 ACADEMIA
    ===================================================== */
    if (
        player.team
    ) {
        const teamFee =
            Number(
                player.team.fightFee || 0
            );
        teamCut =
            gross *
            teamFee /
            100;
    }
    const net =
        gross -
        managerCut -
        teamCut;
    return {
        gross:
            gross,
        managerCut:
            managerCut,
        teamCut:
            teamCut,
        net:
            Math.max(
                0,
                net
            )
    };
}
