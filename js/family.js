const MARRIAGE_AGE = 18;

const MARRIAGE_COST = 500;

const CHILD_COST = 1000;


function dating() {

    if (player.age < MARRIAGE_AGE) {

        alert(
            "❤️ Você ainda é jovem demais para iniciar a vida familiar."
        );

        return;
    }


    if (player.relationship === "Solteiro") {

        player.relationship =
            "Namorando";

        player.partner =
            "Companheiro(a)";


        player.log.unshift(
            "❤️ Você começou um relacionamento."
        );

    }

    else if (
        player.relationship === "Namorando"
    ) {

        if (player.money < MARRIAGE_COST) {

            alert(
                "💰 Você precisa de $" +
                MARRIAGE_COST +
                " para se casar."
            );

            return;
        }


        player.money -=
            MARRIAGE_COST;


        player.relationship =
            "Casado";


        player.married =
            true;


        player.log.unshift(
            "💍 Você se casou."
        );

    }


    save();

    familyScreen();

}


function haveChild() {

    if (player.age < MARRIAGE_AGE) {

        alert(
            "Você precisa ter 18 anos."
        );

        return;
    }


    if (!player.married) {

        alert(
            "💍 Você precisa estar casado."
        );

        return;
    }


    if (player.money < CHILD_COST) {

        alert(
            "💰 Você precisa de $" +
            CHILD_COST +
            " para ter um filho."
        );

        return;
    }


    if (player.children.length >= 5) {

        alert(
            "Sua família já possui cinco filhos."
        );

        return;
    }


    player.money -=
        CHILD_COST;


    const names = [

        "Alex",
        "Lucas",
        "Rafael",
        "Miguel",
        "Arthur",
        "Gabriel",
        "Sofia",
        "Helena",
        "Julia",
        "Laura",
        "Mateus",
        "Davi",
        "Enzo",
        "Theo",
        "Valentina",
        "Benjamin",
        "Samuel",
        "Isabela",
        "Manuela",
        "Nicolas"

    ];


    const name =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];


    const child = {

        name: name,

        age: 0,

        bornYear:
            player.year,

        potential:
            Math.round(
                50 +
                Math.random() * 40
            ),

        fightingInterest: false,

        becameFighter: false

    };


    player.children.push(child);


    player.log.unshift(

        "👶 Nasceu " +
        name +
        ". A próxima geração começou."

    );


    save();

    familyScreen();

}


function dynastyInfo() {

    return {

        generation:
            player.children.length > 0
                ? 2
                : 1,

        children:
            player.children.length

    };

}
