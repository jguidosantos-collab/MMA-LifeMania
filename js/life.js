function advanceWeek() {

    player.week++;

    // A cada 52 semanas, passa 1 ano
    if (player.week % 52 === 0) {

        player.age++;

        player.year++;

        // Os filhos também envelhecem
        player.children.forEach(child => {

            child.age++;

        });

    }

    // Recuperação natural
    player.fatigue =
        Math.max(
            0,
            player.fatigue - 5
        );

    player.health =
        Math.min(
            100,
            player.health + 2
        );


    // Custo semanal da equipe
    if (player.team) {

        player.money -=
            Math.floor(
                player.team.fee / 4
            );

    }


    player.log.unshift(

        "⏩ Uma semana passou."

    );


    save();

    home();
}


function turnProfessional() {

    if (player.age < 18) {

        alert(
            "Você precisa ter 18 anos para virar profissional."
        );

        return;
    }


    if (
        player.professional.active
    ) {

        return;

    }


    player.professional.active =
        true;

    player.professional.ranking =
        50;


    player.log.unshift(

        "🎉 Você entrou no MMA profissional."

    );


    save();

    home();
}
