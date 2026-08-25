function dating() {

    if (
        player.relationship ===
        "Solteiro"
    ) {

        player.relationship =
            "Namorando";

        player.partner =
            "Parceira(o)";

        player.log.unshift(
            "❤️ Você começou um relacionamento."
        );

    } else {

        player.relationship =
            "Casado";

        player.married = true;

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


    const names = [

        "Alex",
        "Lucas",
        "Rafael",
        "Sofia",
        "Miguel",
        "Julia",
        "Arthur",
        "Helena"

    ];


    const name =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];


    player.children.push({

        name: name,

        age: 0

    });


    player.log.unshift(

        "👶 Um novo filho nasceu."

    );


    save();

    familyScreen();
}
