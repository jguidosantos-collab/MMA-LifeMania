const teams = [

    {
        name: "Academia Regional",
        quality: 35,
        fee: 50,
        commission: 5
    },

    {
        name: "Elite Fight Team",
        quality: 60,
        fee: 120,
        commission: 7
    },

    {
        name: "National Combat Academy",
        quality: 75,
        fee: 250,
        commission: 10
    },

    {
        name: "International Fight Camp",
        quality: 88,
        fee: 450,
        commission: 12
    }

];


function generateTeamOffers() {

    player.teamOffers = [];

    for (let i = 0; i < 3; i++) {

        const team =
            teams[
                Math.floor(
                    Math.random() *
                    teams.length
                )
            ];

        player.teamOffers.push(team);
    }

}


function joinTeam(index) {

    player.team =
        player.teamOffers[index];

    player.log.unshift(

        "🏢 Você entrou para " +
        player.team.name

    );

    save();

    teamScreen();
}
