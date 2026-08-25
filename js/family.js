function dating() {

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

    if (!player.married) {

        alert(
            "Você precisa estar casado."
        );

        return;

    }


    if (player.children.length >= 5) {

        alert(
            "Sua família já tem muitos filhos."
        );

        return;

    }


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
        "Valentina"

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
            50 +
            Math.random() * 40,

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

    const generation =
        player.children.length > 0
            ? 2
            : 1;


    return {

        generation:

            generation,

        children:

            player.children.length

    };

}
