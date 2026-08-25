function save() {

    localStorage.setItem(

        "mmaLifeDynastyV1",

        JSON.stringify(player)

    );

}


function load() {

    const data =
        localStorage.getItem(
            "mmaLifeDynastyV1"
        );


    if (!data) {

        return;

    }


    try {

        player =
            JSON.parse(data);


        document
            .getElementById("creation")
            .classList.add("hidden");


        document
            .getElementById("game")
            .classList.remove("hidden");


        document
            .getElementById("tabs")
            .classList.remove("hidden");


        home();

    }

    catch (error) {

        console.log(
            "Erro ao carregar save."
        );

    }

}


function resetGame() {

    const confirmReset =
        confirm(

            "⚠️ ATENÇÃO!\n\n" +
            "Isso vai apagar sua carreira atual.\n\n" +
            "Deseja realmente reiniciar?"

        );


    if (!confirmReset) {

        return;

    }


    localStorage.removeItem(
        "mmaLifeDynastyV1"
    );


    player = null;


    document
        .getElementById("game")
        .classList.add("hidden");


    document
        .getElementById("tabs")
        .classList.add("hidden");


    document
        .getElementById("creation")
        .classList.remove("hidden");


    initCreation();

}
