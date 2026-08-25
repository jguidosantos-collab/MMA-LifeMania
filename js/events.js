const events = [

    {
        name: "MMA Regional",
        level: 1,
        international: false,
        purse: 500
    },

    {
        name: "MMA Brasil",
        level: 2,
        international: false,
        purse: 1500
    },

    {
        name: "MMA National",
        level: 3,
        international: false,
        purse: 3000
    },

    {
        name: "MMA International",
        level: 4,
        international: true,
        purse: 7500
    },

    {
        name: "World Combat Night",
        level: 5,
        international: true,
        purse: 15000
    },

    {
        name: "Global MMA Championship",
        level: 6,
        international: true,
        purse: 30000
    }

];


function generateEvent() {

    let maxLevel = 2;

    if (player.fame >= 20) {
        maxLevel = 3;
    }

    if (player.fame >= 50) {
        maxLevel = 4;
    }

    if (player.fame >= 100) {
        maxLevel = 5;
    }

    if (player.fame >= 200) {
        maxLevel = 6;
    }


    const available =
        events.filter(
            event =>
                event.level <= maxLevel
        );


    return available[
        Math.floor(
            Math.random() *
            available.length
        )
    ];

}
