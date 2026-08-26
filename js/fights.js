/* =========================================================
   MMA LIFE DYNASTY
   FIGHT.JS
   SISTEMA DE LUTAS
   CAMP + DIA DA LUTA + RECUPERAÇÃO
========================================================= */
/* =========================================================
   UTILIDADES
========================================================= */
function fightGetPlayer() {
    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {
        if (
            typeof window.createDefaultPlayer ===
            "function"
        ) {
            window.player =
                window.createDefaultPlayer();
        }
    }
    return window.player;
}
function fightSave() {
    if (
        typeof window.saveGame ===
        "function"
    ) {
        window.saveGame();
    }
}
/* =========================================================
   VERIFICAR STATUS PROFISSIONAL
========================================================= */
function isProfessionalFighter() {
    const player =
        fightGetPlayer();
    return !!(
        player &&
        player.professional &&
        player.professional.active
    );
}
/* =========================================================
   VERIFICAR SE PODE VIRAR PROFISSIONAL
========================================================= */
function canBecomeProfessional() {
    const player =
        fightGetPlayer();
    if (!player) {
        return false;
    }
    const amateur =
        player.amateur || {};
    const amateurFights =
        Number(amateur.wins || 0) +
        Number(amateur.losses || 0) +
        Number(amateur.draws || 0);
    const age =
        Number(player.age || 0);
    return (
        age >= 18 &&
        amateurFights >= 3
    );
}
/* =========================================================
   PROMOVER PARA PROFISSIONAL
========================================================= */
function promoteToProfessional() {
    const player =
        fightGetPlayer();
    if (!player) {
        return false;
    }
    if (
        isProfessionalFighter()
    ) {
        return false;
    }
    if (
        !canBecomeProfessional()
    ) {
        return false;
    }
    if (!player.professional) {
        player.professional = {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0
        };
    }
    player.professional.active =
        true;
    player.careerStage =
        "regional";
    player.log =
        player.log || [];
    player.log.unshift(
        "🚀 Você se tornou um lutador profissional!"
    );
    fightSave();
    return true;
}
/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */
function generateFightOpponent() {
    const player =
        fightGetPlayer();
    const playerOVR =
        typeof window.getOverall ===
        "function"
        ?
        window.getOverall()
        :
        50;
    const names = [
        "Carlos Silva",
        "Lucas Ferreira",
        "Matheus Santos",
        "Rafael Oliveira",
        "Bruno Costa",
        "Diego Almeida",
        "Gabriel Souza",
        "Anderson Lima",
        "Felipe Rocha",
        "Victor Martins",
        "João Ribeiro",
        "Pedro Mendes",
        "Marcos Carvalho",
        "Thiago Alves",
        "Eduardo Santos"
    ];
    const styles = [
        "Striker",
        "Wrestler",
        "Grappler",
        "Completo"
    ];
    const randomName =
        names[
            Math.floor(
                Math.random() * names.length
            )
        ];
    const randomStyle =
        styles[
            Math.floor(
                Math.random() * styles.length
            )
        ];
    const variation =
        Math.floor(
            Math.random() * 15
        ) - 7;
    const power =
        Math.max(
            35,
            Math.min(
                95,
                playerOVR + variation
            )
        );
    return {
        displayName:
            randomName,
        name:
            randomName,
        power:
            power,
        ovr:
            power,
        style:
            randomStyle,
        country:
            "Brasil",
        wins:
            Math.floor(
                Math.random() * 8
            ),
        losses:
            Math.floor(
                Math.random() * 5
            ),
        draws:
            0
    };
}
/* =========================================================
   GERAR EVENTO
========================================================= */
function generateFightEvent() {
    const events = [
        "MMA NIGHT",
        "FIGHT NIGHT",
        "WARRIOR FC",
        "BRAZIL FIGHT",
        "MMA CHALLENGE",
        "COMBAT NIGHT",
        "RISING FIGHTERS"
    ];
    const eventName =
        events[
            Math.floor(
                Math.random() * events.length
            )
        ];
    return {
        name:
            eventName,
        venue:
            "Arena MMA",
        city:
            "São Paulo",
        country:
            "Brasil"
    };
}
/* =========================================================
   CALCULAR DATA DA LUTA
   SEMPRE 4 SEMANAS À FRENTE
========================================================= */
function calculateFightDate() {
    const player =
        fightGetPlayer();
    let week =
        Number(player.week || 1) + 4;
    let year =
        Number(player.year || 2026);
    if (week > 52) {
        week -= 52;
        year += 1;
    }
    return {
        week:
            week,
        year:
            year
    };
}
/* =========================================================
   PROCURAR LUTA
========================================================= */
function searchFight() {
    const player =
        fightGetPlayer();
    if (!player) {
        return;
    }
    /* Não pode procurar outra luta durante recuperação */
    if (
        Number(
            player.recoveryWeeks || 0
        ) > 0
    ) {
        alert(
            "🩹 Você ainda está em recuperação pós-luta."
        );
        fightScreen();
        return;
    }
    /* Se já existe luta */
    if (player.nextFight) {
        fightScreen();
        return;
    }
    const opponent =
        generateFightOpponent();
    const event =
        generateFightEvent();
    const date =
        calculateFightDate();
    player.nextFight = {
        event:
            event,
        opponent:
            opponent,
        week:
            date.week,
        year:
            date.year,
        status:
            "camp",
        campWeeks:
            4,
        titleFight:
            false
    };
    player.log =
        player.log || [];
    player.log.unshift(
        `📅 Luta marcada contra ${opponent.displayName}. Evento em 4 semanas.`
    );
    fightSave();
    fightScreen();
}
/* =========================================================
   CALCULAR SEMANAS ATÉ A LUTA
========================================================= */
function getFightWeeksRemaining() {
    const player =
        fightGetPlayer();
    if (
        !player ||
        !player.nextFight
    ) {
        return 0;
    }
    const currentYear =
        Number(player.year || 2026);
    const currentWeek =
        Number(player.week || 1);
    const fightYear =
        Number(
            player.nextFight.year ||
            currentYear
        );
    const fightWeek =
        Number(
            player.nextFight.week ||
            currentWeek
        );
    if (
        fightYear === currentYear
    ) {
        return Math.max(
            0,
            fightWeek - currentWeek
        );
    }
    if (
        fightYear > currentYear
    ) {
        return Math.max(
            0,
            (52 - currentWeek) +
            fightWeek
        );
    }
    return 0;
}
/* =========================================================
   ESCOLHER RECUPERAÇÃO
=========================================================
   Probabilidades:
   4 semanas = 55%
   6 semanas = 25%
   8 semanas = 15%
   12 semanas = 5%
   12 semanas também pode ser forçada
   por luta de cinturão ou dano muito alto.
========================================================= */
function calculateRecoveryWeeks(
    titleFight,
    damageLevel
) {
    const random =
        Math.random();
    /* Luta de cinturão */
    if (
        titleFight
    ) {
        /*
           Cinturão possui chance maior
           de recuperação longa.
        */
        if (
            random < 0.30
        ) {
            return 12;
        }
        if (
            random < 0.55
        ) {
            return 8;
        }
        if (
            random < 0.80
        ) {
            return 6;
        }
        return 4;
    }
    /* Dano muito alto */
    if (
        damageLevel >= 3
    ) {
        if (
            random < 0.35
        ) {
            return 12;
        }
        if (
            random < 0.65
        ) {
            return 8;
        }
        if (
            random < 0.90
        ) {
            return 6;
        }
        return 4;
    }
    /* Recuperação normal */
    if (
        random < 0.55
    ) {
        return 4;
    }
    if (
        random < 0.80
    ) {
        return 6;
    }
    if (
        random < 0.95
    ) {
        return 8;
    }
    return 12;
}
/* =========================================================
   DETERMINAR DANO DA LUTA
========================================================= */
function calculateFightDamage(
    player,
    playerWins
) {
    const health =
        Number(
            player.health || 100
        );
    const fatigue =
        Number(
            player.fatigue || 0
        );
    let damage =
        Math.floor(
            Math.random() * 3
        );
    if (
        health < 65
    ) {
        damage += 1;
    }
    if (
        fatigue > 70
    ) {
        damage += 1;
    }
    if (
        !playerWins &&
        Math.random() < 0.35
    ) {
        damage += 1;
    }
    return Math.min(
        3,
        damage
    );
}
/* =========================================================
   TELA DE LUTA
========================================================= */
function fightScreen() {
    const player =
        fightGetPlayer();
    const content =
        document.getElementById(
            "content"
        );
    if (!content) {
        return;
    }
    if (!player) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    ⚔️ LUTA
                </div>
                <p>
                    Nenhum lutador carregado.
                </p>
            </div>
        `;
        return;
    }
    /* =====================================================
       RECUPERAÇÃO
    ===================================================== */
    if (
        Number(
            player.recoveryWeeks || 0
        ) > 0
    ) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    🩹 RECUPERAÇÃO PÓS-LUTA
                </div>
                <p>
                    Você está se recuperando
                    do último combate.
                </p>
                <div class="statline">
                    <span>
                        Semanas restantes
                    </span>
                    <b>
                        ${player.recoveryWeeks}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Saúde
                    </span>
                    <b>
                        ${Math.round(
                            player.health || 100
                        )}%
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Fadiga
                    </span>
                    <b>
                        ${Math.round(
                            player.fatigue || 0
                        )}%
                    </b>
                </div>
                <p>
                    Seu empresário não poderá
                    marcar uma nova luta até
                    o fim da recuperação.
                </p>
            </div>
            <div class="card">
                <button
                    class="main-button"
                    onclick="tab('home')">
                    🏠 VOLTAR AO INÍCIO
                </button>
            </div>
        `;
        return;
    }
    /* =====================================================
       SEM LUTA MARCADA
    ===================================================== */
    if (!player.nextFight) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    ⚔️ LUTA
                </div>
                <p>
                    Você ainda não possui
                    uma luta marcada.
                </p>
                <p>
                    A luta será marcada com
                    4 semanas de antecedência
                    para permitir o camp.
                </p>
                <button
                    class="main-button"
                    onclick="searchFight()">
                    🔎 PROCURAR LUTA
                </button>
                <button
                    class="gray"
                    onclick="tab('home')">
                    ← VOLTAR
                </button>
            </div>
        `;
        return;
    }
    const fight =
        player.nextFight;
    const opponent =
        fight.opponent;
    const event =
        fight.event;
    const playerOVR =
        typeof window.getOverall ===
        "function"
        ?
        window.getOverall()
        :
        50;
    const weeksRemaining =
        getFightWeeksRemaining();
    const isFightDay =
        weeksRemaining <= 0;
    /* =====================================================
       CAMP
    ===================================================== */
    if (!isFightDay) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    🥊 PRÓXIMA LUTA
                </div>
                <div class="statline">
                    <span>
                        Evento
                    </span>
                    <b>
                        ${event.name}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Local
                    </span>
                    <b>
                        ${event.city}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Luta
                    </span>
                    <b>
                        Semana ${fight.week}
                        / ${fight.year}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Camp
                    </span>
                    <b>
                        ${weeksRemaining}
                        semana(s)
                    </b>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    🥊 CONFRONTO
                </div>
                <div class="fighter-card">
                    <div class="fighter-avatar">
                        🥊
                    </div>
                    <div class="fighter-info">
                        <h2>
                            ${player.name || "Você"}
                        </h2>
                        <p>
                            ${player.country || "Brasil"}
                        </p>
                        <p>
                            OVR:
                            <strong>
                                ${playerOVR}
                            </strong>
                        </p>
                    </div>
                </div>
                <div style="
                    text-align:center;
                    font-size:28px;
                    margin:15px 0;
                ">
                    VS
                </div>
                <div class="fighter-card">
                    <div class="fighter-avatar">
                        👊
                    </div>
                    <div class="fighter-info">
                        <h2>
                            ${opponent.displayName}
                        </h2>
                        <p>
                            ${opponent.country}
                        </p>
                        <p>
                            OVR:
                            <strong>
                                ${opponent.power}
                            </strong>
                        </p>
                        <p>
                            Estilo:
                            ${opponent.style}
                        </p>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    🏋️ CAMP
                </div>
                <p>
                    Prepare-se para o combate.
                    Você ainda possui
                    <strong>
                        ${weeksRemaining}
                    </strong>
                    semana(s) de preparação.
                </p>
                <div class="statline">
                    <span>
                        Saúde
                    </span>
                    <b>
                        ${Math.round(
                            player.health || 100
                        )}%
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Fadiga
                    </span>
                    <b>
                        ${Math.round(
                            player.fatigue || 0
                        )}%
                    </b>
                </div>
            </div>
            <div class="card">
                <button
                    class="gray"
                    onclick="tab('home')">
                    ← VOLTAR
                </button>
            </div>
        `;
        return;
    }
    /* =====================================================
       DIA DA LUTA
    ===================================================== */
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🔴 DIA DE LUTA
            </div>
            <p style="
                text-align:center;
                font-weight:bold;
                font-size:20px;
            ">
                ${event.name}
            </p>
            <p style="
                text-align:center;
            ">
                ${event.venue}
                —
                ${event.city}
            </p>
            <div class="statline">
                <span>
                    Data
                </span>
                <b>
                    Semana ${fight.week}
                    / ${fight.year}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🥊 CARD PRINCIPAL
            </div>
            <div class="fighter-card">
                <div class="fighter-avatar">
                    🥊
                </div>
                <div class="fighter-info">
                    <h2>
                        ${player.name || "Você"}
                    </h2>
                    <p>
                        ${player.country || "Brasil"}
                    </p>
                    <p>
                        OVR:
                        <strong>
                            ${playerOVR}
                        </strong>
                    </p>
                </div>
            </div>
            <div style="
                text-align:center;
                font-size:28px;
                margin:15px 0;
            ">
                VS
            </div>
            <div class="fighter-card">
                <div class="fighter-avatar">
                    👊
                </div>
                <div class="fighter-info">
                    <h2>
                        ${opponent.displayName}
                    </h2>
                    <p>
                        ${opponent.country}
                    </p>
                    <p>
                        OVR:
                        <strong>
                            ${opponent.power}
                        </strong>
                    </p>
                    <p>
                        Estilo:
                        ${opponent.style}
                    </p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="title">
                ❤️ CONDIÇÃO
            </div>
            <div class="statline">
                <span>
                    Saúde
                </span>
                <b>
                    ${Math.round(
                        player.health || 100
                    )}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Fadiga
                </span>
                <b>
                    ${Math.round(
                        player.fatigue || 0
                    )}%
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🔴 COMBATE
            </div>
            <p>
                É o dia da luta.
                Você precisa realizar
                o combate antes de continuar
                avançando o calendário.
            </p>
            <button
                class="main-button"
                onclick="simulateFight()">
                🥊 LUTAR AGORA
            </button>
        </div>
    `;
}
/* =========================================================
   SIMULAR LUTA
========================================================= */
function simulateFight() {
    const player =
        fightGetPlayer();
    if (
        !player ||
        !player.nextFight
    ) {
        fightScreen();
        return;
    }
    const weeksRemaining =
        getFightWeeksRemaining();
    if (
        weeksRemaining > 0
    ) {
        alert(
            `⏳ Ainda faltam ${weeksRemaining} semana(s) para a luta.`
        );
        return;
    }
    const opponent =
        player.nextFight.opponent;
    const playerOVR =
        typeof window.getOverall ===
        "function"
        ?
        window.getOverall()
        :
        50;
    const opponentOVR =
        Number(
            opponent.power || 50
        );
    const health =
        Number(
            player.health || 100
        );
    const fatigue =
        Number(
            player.fatigue || 0
        );
    const confidence =
        Number(
            player.confidence || 50
        );
    const playerScore =
        playerOVR
        +
        (
            health - 50
        ) * 0.10
        -
        fatigue * 0.10
        +
        (
            confidence - 50
        ) * 0.05
        +
        (
            Math.random() * 20 - 10
        );
    const opponentScore =
        opponentOVR
        +
        (
            Math.random() * 20 - 10
        );
    const playerWins =
        playerScore >= opponentScore;
    /* =====================================================
       GARANTIR RECORDES
    ===================================================== */
    if (!player.professional) {
        player.professional = {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0
        };
    }
    if (!player.amateur) {
        player.amateur = {
            wins: 0,
            losses: 0,
            draws: 0
        };
    }
    let record;
    if (
        player.professional.active
    ) {
        record =
            player.professional;
    }
    else {
        record =
            player.amateur;
    }
    let resultText;
    if (playerWins) {
        record.wins =
            Number(record.wins || 0) + 1;
        resultText =
            "🏆 VITÓRIA!";
        player.fame =
            Number(player.fame || 0) + 3;
        player.money =
            Number(player.money || 0) + 250;
        player.confidence =
            Math.min(
                100,
                Number(
                    player.confidence || 50
                ) + 8
            );
        player.log =
            player.log || [];
        player.log.unshift(
            `🏆 Vitória sobre ${opponent.displayName}.`
        );
    }
    else {
        record.losses =
            Number(record.losses || 0) + 1;
        resultText =
            "❌ DERROTA";
        player.fame =
            Math.max(
                0,
                Number(player.fame || 0) - 1
            );
        player.money =
            Number(player.money || 0) + 100;
        player.confidence =
            Math.max(
                0,
                Number(
                    player.confidence || 50
                ) - 8
            );
        player.log =
            player.log || [];
        player.log.unshift(
            `❌ Derrota para ${opponent.displayName}.`
        );
    }
    /* =====================================================
       DANO DA LUTA
    ===================================================== */
    const damageLevel =
        calculateFightDamage(
            player,
            playerWins
        );
    let healthLoss;
    if (
        damageLevel === 0
    ) {
        healthLoss = 8;
    }
    else if (
        damageLevel === 1
    ) {
        healthLoss = 15;
    }
    else if (
        damageLevel === 2
    ) {
        healthLoss = 25;
    }
    else {
        healthLoss = 35;
    }
    player.health =
        Math.max(
            25,
            Number(player.health || 100) -
            healthLoss
        );
    player.fatigue =
        Math.min(
            100,
            Number(player.fatigue || 0) + 45
        );
    /* =====================================================
       RECUPERAÇÃO PÓS-LUTA
    ===================================================== */
    const recoveryWeeks =
        calculateRecoveryWeeks(
            !!player.nextFight.titleFight,
            damageLevel
        );
    player.recoveryWeeks =
        recoveryWeeks;
    player.recoveryTotal =
        recoveryWeeks;
    player.lastFightDamage =
        damageLevel;
    player.lastFightWasTitle =
        !!player.nextFight.titleFight;
    player.nextFight =
        null;
    /* =====================================================
       PROMOÇÃO
    ===================================================== */
    const becameProfessional =
        promoteToProfessional();
    fightSave();
    showFightResult(
        resultText,
        opponent,
        playerWins,
        recoveryWeeks,
        damageLevel,
        becameProfessional
    );
}
/* =========================================================
   RESULTADO
========================================================= */
function showFightResult(
    resultText,
    opponent,
    playerWins,
    recoveryWeeks,
    damageLevel,
    becameProfessional
) {
    const player =
        fightGetPlayer();
    const content =
        document.getElementById(
            "content"
        );
    if (!content) {
        return;
    }
    const record =
        player.professional &&
        player.professional.active
        ?
        player.professional
        :
        player.amateur;
    let damageText;
    if (
        damageLevel === 0
    ) {
        damageText =
            "🟢 Pouco dano";
    }
    else if (
        damageLevel === 1
    ) {
        damageText =
            "🟡 Dano moderado";
    }
    else if (
        damageLevel === 2
    ) {
        damageText =
            "🟠 Dano significativo";
    }
    else {
        damageText =
            "🔴 Muito machucado";
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 RESULTADO
            </div>
            <div style="
                text-align:center;
                font-size:32px;
                font-weight:bold;
                margin:25px 0;
            ">
                ${resultText}
            </div>
            <p style="
                text-align:center;
            ">
                ${player.name}
                <strong>
                    ${
                        playerWins
                        ?
                        " venceu "
                        :
                        " perdeu para "
                    }
                </strong>
                ${opponent.displayName}
            </p>
        </div>
        ${
            becameProfessional
            ?
            `
            <div class="card">
                <div class="title">
                    🚀 PROMOÇÃO
                </div>
                <p>
                    Você completou os requisitos
                    para se tornar profissional!
                </p>
                <p>
                    🎂 Idade mínima: 18 anos
                </p>
                <p>
                    🥊 3 lutas amadoras concluídas
                </p>
                <p>
                    <strong>
                        Agora sua carreira profissional começa.
                    </strong>
                </p>
            </div>
            `
            :
            ""
        }
        <div class="card">
            <div class="title">
                📊 NOVO RECORDE
            </div>
            <div class="statline">
                <span>
                    Vitórias
                </span>
                <b>
                    ${record.wins || 0}
                </b>
            </div>
            <div class="statline">
                <span>
                    Derrotas
                </span>
                <b>
                    ${record.losses || 0}
                </b>
            </div>
            <div class="statline">
                <span>
                    Empates
                </span>
                <b>
                    ${record.draws || 0}
                </b>
            </div>
            <div class="statline">
                <span>
                    Fama
                </span>
                <b>
                    ${Math.round(
                        player.fame || 0
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Dinheiro
                </span>
                <b>
                    $${Math.round(
                        player.money || 0
                    )}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🩹 RECUPERAÇÃO
            </div>
            <p>
                O combate terminou.
                Seu corpo precisa de tempo
                para se recuperar.
            </p>
            <div class="statline">
                <span>
                    Recuperação
                </span>
                <b>
                    ${recoveryWeeks} semanas
                </b>
            </div>
            <div class="statline">
                <span>
                    Condição
                </span>
                <b>
                    ${damageText}
                </b>
            </div>
            <p>
                Você poderá avançar o calendário
                durante a recuperação, mas não
                poderá marcar uma nova luta até
                estar recuperado.
            </p>
        </div>
        <div class="card">
            <button
                class="main-button"
                onclick="tab('home')">
                🏠 VOLTAR AO INÍCIO
            </button>
        </div>
    `;
}
/* =========================================================
   RECUPERAÇÃO POR SEMANA
========================================================= */
function processFightRecovery() {
    const player =
        fightGetPlayer();
    if (!player) {
        return;
    }
    /* =====================================================
       RECUPERAÇÃO PÓS-LUTA
    ===================================================== */
    if (
        Number(
            player.recoveryWeeks || 0
        ) > 0
    ) {
        player.recoveryWeeks =
            Math.max(
                0,
                Number(
                    player.recoveryWeeks || 0
                ) - 1
            );
        /*
           Saúde recupera mais durante
           o período pós-luta.
        */
        player.health =
            Math.min(
                100,
                Number(
                    player.health || 100
                ) + 8
            );
        /*
           Fadiga também cai.
        */
        player.fatigue =
            Math.max(
                0,
                Number(
                    player.fatigue || 0
                ) - 12
            );
        if (
            player.recoveryWeeks === 0
        ) {
            player.log =
                player.log || [];
            player.log.unshift(
                "✅ Recuperação concluída. Você está apto para lutar novamente."
            );
            fightSave();
        }
    }
}
/* =========================================================
   EMPRESÁRIO PROCURA LUTA
========================================================= */
function processManagerFightOffer() {
    const player =
        fightGetPlayer();
    if (!player) {
        return;
    }
    /* Recuperação impede nova luta */
    if (
        Number(
            player.recoveryWeeks || 0
        ) > 0
    ) {
        return;
    }
    /* Já existe luta */
    if (player.nextFight) {
        return;
    }
    const isProfessional =
        isProfessionalFighter();
    const chance =
        isProfessional
        ?
        0.08
        :
        0.12;
    if (
        Math.random() > chance
    ) {
        return;
    }
    const opponent =
        generateFightOpponent();
    const event =
        generateFightEvent();
    const date =
        calculateFightDate();
    player.nextFight = {
        event:
            event,
        opponent:
            opponent,
        week:
            date.week,
        year:
            date.year,
        status:
            "camp",
        campWeeks:
            4,
        titleFight:
            false
    };
    player.log =
        player.log || [];
    player.log.unshift(
        `📩 Nova luta disponível contra ${opponent.displayName}. Evento em 4 semanas.`
    );
    fightSave();
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.fightScreen =
    fightScreen;
window.searchFight =
    searchFight;
window.generateFightOpponent =
    generateFightOpponent;
window.generateFightEvent =
    generateFightEvent;
window.simulateFight =
    simulateFight;
window.processFightRecovery =
    processFightRecovery;
window.processManagerFightOffer =
    processManagerFightOffer;
window.canBecomeProfessional =
    canBecomeProfessional;
window.promoteToProfessional =
    promoteToProfessional;
window.getFightWeeksRemaining =
    getFightWeeksRemaining;
window.calculateRecoveryWeeks =
    calculateRecoveryWeeks;
