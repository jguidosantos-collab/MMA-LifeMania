function train(attribute) {

    if (player.fatigue >= 85) {

        alert("Você está muito cansado. Descanse antes de treinar.");

        return;
    }

    const gain = 0.2 + Math.random() * 0.5;

    player.attributes[attribute] =
        Math.min(
            100,
            player.attributes[attribute] + gain
        );

    player.fatigue =
        Math.min(
            100,
            player.fatigue + 8
        );

    player.health =
        Math.max(
            20,
            player.health - 1
        );

    player.log.unshift(
        "🏋️ Treino realizado: " + attribute
    );

    save();

    training();
}


function rest() {

    player.fatigue =
        Math.max(
            0,
            player.fatigue - 25
        );

    player.health =
        Math.min(
            100,
            player.health + 10
        );

    player.log.unshift(
        "😴 Você descansou."
    );

    save();

    home();
}
