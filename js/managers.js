const managers = [

    {
        name: "Carlos Mendes",
        level: "Iniciante",
        commission: 3,
        contacts: 25
    },

    {
        name: "Rafael Costa",
        level: "Bom",
        commission: 8,
        contacts: 45
    },

    {
        name: "André Silva",
        level: "Muito bom",
        commission: 12,
        contacts: 65
    },

    {
        name: "Marcos Oliveira",
        level: "Top",
        commission: 18,
        contacts: 85
    },

    {
        name: "Eduardo Martins",
        level: "Elite",
        commission: 25,
        contacts: 98
    }

];


function generateManagerOffers() {

    player.managerOffers = [];

    for (let i = 0; i < 3; i++) {

        const manager =
            managers[
                Math.floor(
                    Math.random() *
                    managers.length
                )
            ];

        player.managerOffers.push(manager);
    }

}


function hireManager(index) {

    player.manager =
        player.managerOffers[index];

    player.log.unshift(

        "👔 " +
        player.manager.name +
        " virou seu empresário"

    );

    save();

    teamScreen();
}
