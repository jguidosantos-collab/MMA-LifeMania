/* =========================================================
   MMA LIFE DYNASTY
   FIGHT.JS
   SISTEMA COMPLETO DE LUTAS
   AMADOR + PROFISSIONAL + EVENTOS + CAMP
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
            typeof window.createDefaultPlayer === "function"
        ) {
            window.player =
                window.createDefaultPlayer();
        }
    }
    return window.player;
}
function fightSave() {
    if (
        typeof window.saveGame === "function"
    ) {
        window.saveGame();
    }
}
/* =========================================================
   GARANTIR ESTRUTURAS
========================================================= */
function ensureFightData() {
    const player =
        fightGetPlayer();
    if (!player) {
        return null;
    }
    if (!player.amateur) {
        player.amateur = {
            wins: 0,
            losses: 0,
            draws: 0,
            fights: 0
        };
    }
    if (!player.professional) {
        player.professional = {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0,
            fights: 0
        };
    }
    if (
        typeof player.camp === "undefined"
    ) {
        player.camp = null;
    }
    if (
        typeof player.nextFight === "undefined"
    ) {
        player.nextFight = null;
    }
    return player;
}
/* =========================================================
   STATUS PROFISSIONAL
========================================================= */
function isProfessional() {
    const player =
        ensureFightData();
    if (!player) {
        return false;
    }
    return !!(
        player.professional &&
        player.professional.active
    );
}
/* =========================================================
   REQUISITOS PARA PROFISSIONAL
========================================================= */
function getProfessionalRequirements() {
    const player =
        ensureFightData();
    if (!player) {
        return {
            age: 0,
            amateurFights: 0,
            ageOk: false,
            fightsOk: false,
            eligible: false
        };
    }
    const age =
        Number(player.age || 0);
    const amateur =
        player.amateur || {};
    const amateurFights =
        Number(
            amateur.fights ||
            (
                Number(amateur.wins || 0) +
                Number(amateur.losses || 0) +
                Number(amateur.draws || 0)
            )
        );
    return {
        age: age,
        amateurFights:
            amateurFights,
        ageOk:
            age >= 18,
        fightsOk:
            amateurFights >= 3,
        eligible:
            age >= 18 &&
            amateurFights >= 3
    };
}
/* =========================================================
   PROMOVER PARA PROFISSIONAL
========================================================= */
function checkProfessionalPromotion() {
    const player =
        ensureFightData();
    if (!player) {
        return false;
    }
    if (
        player.professional &&
        player.professional.active
    ) {
        return true;
    }
    const requirements =
        getProfessionalRequirements();
    if (!requirements.eligible) {
        return false;
    }
    player.professional.active =
        true;
    if (
        !player.careerStage ||
        player.careerStage === "amateur"
    ) {
        player.careerStage =
            "regional";
    }
    player.log =
        player.log || [];
    player.log.unshift(
        "🥊 Você se tornou um lutador PROFISSIONAL!"
    );
    fightSave();
    return true;
}
/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */
function generateFightOpponent(
    forcedOVR = null
) {
    const player =
        fightGetPlayer();
    const playerOVR =
        typeof window.getOverall === "function"
        ?
        Number(window.getOverall())
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
        "Eduardo Santos",
        "Caio Mendes",
        "Renan Costa",
        "Leonardo Alves",
        "Vinicius Rocha",
        "Gustavo Lima"
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
    let power;
    if (forcedOVR !== null) {
        power =
            Number(forcedOVR);
    }
    else {
        power =
            Math.max(
                35,
                Math.min(
                    95,
                    playerOVR + variation
                )
            );
    }
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
                Math.random() * 10
            ),
        losses:
            Math.floor(
                Math.random() * 6
            ),
        draws:
            0
    };
}
/* =========================================================
   GERAR EVENTO
========================================================= */
function generateFightEvent() {
    const professional =
        isProfessional();
    const amateurEvents = [
        "🥊 CIRCUITO AMADOR BRASIL",
        "🥊 MMA AMATEUR NIGHT",
        "🥊 RISING FIGHTERS",
        "🥊 BRAZIL AMATEUR FC",
        "🥊 NOVOS GUERREIROS",
        "🥊 FUTURE CHAMPIONS"
    ];
    const professionalEvents = [
        "🔥 MMA NIGHT",
        "🔥 FIGHT NIGHT",
        "🔥 WARRIOR FC",
        "🔥 BRAZIL FIGHT",
        "🔥 COMBAT NIGHT",
        "🔥 CHAMPIONS FC",
        "🔥 ELITE MMA"
    ];
    const events =
        professional
        ?
        professionalEvents
        :
        amateurEvents;
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
            "Brasil",
        type:
            professional
            ?
            "professional"
            :
            "amateur"
    };
}
/* =========================================================
   GERAR CARD COMPLETO DO EVENTO
========================================================= */
function generateEventCard() {
    const player =
        ensureFightData();
    if (!player) {
        return [];
    }
    const playerOVR =
        typeof window.getOverall === "function"
        ?
        Number(window.getOverall())
        :
        50;
    const card = [];
    /*
       Cria 5 lutas no evento.
       A luta do jogador entra no card
       em uma posição aleatória.
    */
    const playerFightPosition =
        Math.floor(
            Math.random() * 5
        );
    for (
        let i = 0;
        i < 5;
        i++
    ) {
        if (
            i === playerFightPosition
        ) {
            card.push({
                playerFight:
                    true,
                fighterA:
                    player.name || "Você",
                fighterAOVR:
                    playerOVR,
                fighterACountry:
                    player.country || "Brasil",
                fighterB:
                    "A definir",
                fighterBOVR:
                    0,
                fighterBCountry:
                    "Brasil"
            });
        }
        else {
            const opponentA =
                generateFightOpponent(
                    Math.max(
                        40,
                        playerOVR +
                        Math.floor(
                            Math.random() * 21
                        ) - 10
                    )
                );
            const opponentB =
                generateFightOpponent(
                    Math.max(
                        40,
                        playerOVR +
                        Math.floor(
                            Math.random() * 21
                        ) - 10
                    )
                );
            card.push({
                playerFight:
                    false,
                fighterA:
                    opponentA.displayName,
                fighterAOVR:
                    opponentA.power,
                fighterACountry:
                    opponentA.country,
                fighterB:
                    opponentB.displayName,
                fighterBOVR:
                    opponentB.power,
                fighterBCountry:
                    opponentB.country
            });
        }
    }
    return card;
}
/* =========================================================
   DATA DA LUTA
   SEMPRE 4 SEMANAS DE CAMP
========================================================= */
function getFightDate() {
    const player =
        ensureFightData();
    if (!player) {
        return null;
    }
    let week =
        Number(player.week || 1);
    let year =
        Number(player.year || 2026);
    week += 4;
    if (week > 52) {
        week -= 52;
        year++;
    }
    return {
        week:
            week,
        year:
            year
    };
}
/* =========================================================
   CRIAR CAMP
========================================================= */
function createFightCamp() {
    const player =
        ensureFightData();
    if (!player) {
        return;
    }
    if (!player.nextFight) {
        return;
    }
    player.camp = {
        active:
            true,
        startWeek:
            Number(
                player.week || 1
            ),
        fightWeek:
            Number(
                player.nextFight.week
            ),
        startYear:
            Number(
                player.year || 2026
            ),
        fightYear:
            Number(
                player.nextFight.year
            ),
        weeksCompleted:
            0,
        focus:
            "balanced"
    };
    fightSave();
}
/* =========================================================
   PROCURAR LUTA
========================================================= */
function searchFight() {
    const player =
        ensureFightData();
    if (!player) {
        return;
    }
    if (player.nextFight) {
        fightScreen();
        return;
    }
    const date =
        getFightDate();
    const opponent =
        generateFightOpponent();
    const event =
        generateFightEvent();
    const eventCard =
        generateEventCard();
    /*
       Coloca o adversário real
       na luta do jogador.
    */
    eventCard.forEach(
        function(match) {
            if (match.playerFight) {
                match.fighterB =
                    opponent.displayName;
                match.fighterBOVR =
                    opponent.power;
                match.fighterBCountry =
                    opponent.country;
            }
        }
    );
    player.nextFight = {
        event:
            event,
        opponent:
            opponent,
        card:
            eventCard,
        week:
            date.week,
        year:
            date.year,
        weeksUntil:
            4
    };
    createFightCamp();
    player.log =
        player.log || [];
    player.log.unshift(
        `📅 Luta marcada contra ${opponent.displayName}. Evento em 4 semanas.`
    );
    fightSave();
    fightScreen();
}
/* =========================================================
   TELA PRINCIPAL DA LUTA
========================================================= */
function fightScreen() {
    const player =
        ensureFightData();
    const content =
        document.getElementById("content");
    if (!content) {
        return;
    }
    if (!player) {
        return;
    }
    /*
       Sem luta marcada.
    */
    if (!player.nextFight) {
        const requirements =
            getProfessionalRequirements();
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    ⚔️ LUTAS
                </div>
                <p>
                    Você ainda não possui
                    uma luta marcada.
                </p>
                <button
                    class="main-button"
                    onclick="searchFight()">
                    🔎 PROCURAR LUTA
                </button>
                ${
                    !isProfessional()
                    ?
                    `
                    <div style="
                        margin-top:20px;
                        padding:15px;
                        border-radius:10px;
                        background:rgba(255,255,255,0.05);
                    ">
                        <strong>
                            🥋 CAMINHO PROFISSIONAL
                        </strong>
                        <p>
                            Idade:
                            ${requirements.age}/18
                        </p>
                        <p>
                            Lutas amadoras:
                            ${requirements.amateurFights}/3
                        </p>
                        ${
                            requirements.eligible
                            ?
                            `
                            <p>
                                🟢 Você já pode se tornar profissional.
                            </p>
                            `
                            :
                            `
                            <p>
                                🔒 Complete os requisitos para virar profissional.
                            </p>
                            `
                        }
                    </div>
                    `
                    :
                    ""
                }
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
        typeof window.getOverall === "function"
        ?
        Number(window.getOverall())
        :
        50;
    const currentWeek =
        Number(player.week || 1);
    const weeksRemaining =
        calculateWeeksRemaining(
            player
        );
    let campStatus =
        "🔥 CAMP ATIVO";
    if (weeksRemaining <= 0) {
        campStatus =
            "🥊 SEMANA DA LUTA";
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ${
                    isProfessional()
                    ?
                    "🔥 EVENTO PROFISSIONAL"
                    :
                    "🥋 EVENTO AMADOR"
                }
            </div>
            <div style="
                text-align:center;
                font-size:25px;
                font-weight:bold;
                margin:15px 0;
            ">
                ${event.name}
            </div>
            <div class="statline">
                <span>
                    Local
                </span>
                <b>
                    ${event.venue},
                    ${event.city}
                </b>
            </div>
            <div class="statline">
                <span>
                    Evento
                </span>
                <b>
                    Semana ${fight.week}
                    / ${fight.year}
                </b>
            </div>
            <div class="statline">
                <span>
                    Status
                </span>
                <b>
                    ${campStatus}
                </b>
            </div>
            <div class="statline">
                <span>
                    Camp
                </span>
                <b>
                    ${
                        weeksRemaining > 0
                        ?
                        weeksRemaining +
                        " semana(s)"
                        :
                        "FINALIZADO"
                    }
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📋 CARD COMPLETO
            </div>
            ${
                (fight.card || [])
                .map(
                    function(match, index) {
                        return `
                            <div style="
                                padding:15px;
                                margin-bottom:10px;
                                border-radius:10px;
                                background:
                                    ${
                                        match.playerFight
                                        ?
                                        "rgba(255,215,0,0.12)"
                                        :
                                        "rgba(255,255,255,0.04)"
                                    };
                                border:
                                    ${
                                        match.playerFight
                                        ?
                                        "1px solid rgba(255,215,0,0.35)"
                                        :
                                        "1px solid rgba(255,255,255,0.08)"
                                    };
                            ">
                                <div style="
                                    font-size:12px;
                                    opacity:0.7;
                                    margin-bottom:6px;
                                ">
                                    LUTA ${index + 1}
                                    ${
                                        match.playerFight
                                        ?
                                        " • SUA LUTA"
                                        :
                                        ""
                                    }
                                </div>
                                <strong>
                                    ${match.fighterA}
                                </strong>
                                <span>
                                    (${match.fighterAOVR})
                                </span>
                                <div style="
                                    text-align:center;
                                    margin:6px 0;
                                    font-weight:bold;
                                ">
                                    VS
                                </div>
                                <strong>
                                    ${match.fighterB}
                                </strong>
                                <span>
                                    (${match.fighterBOVR})
                                </span>
                            </div>
                        `;
                    }
                )
                .join("")
            }
        </div>
        <div class="card">
            <div class="title">
                🥊 SUA LUTA
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
                O evento só acontece quando
                chegar a semana marcada.
            </p>
            ${
                weeksRemaining > 0
                ?
                `
                    <p>
                        Continue avançando as semanas
                        para realizar seu camp.
                    </p>
                    <button
                        class="main-button"
                        onclick="tab('train')">
                        🏋️ IR PARA TREINAMENTO
                    </button>
                `
                :
                `
                    <p>
                        🔥 O camp terminou.
                        É hora de lutar!
                    </p>
                    <button
                        class="main-button"
                        onclick="simulateFight()">
                        🥊 ENTRAR NA LUTA
                    </button>
                `
            }
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
        <button
            class="gray"
            onclick="tab('home')">
            ← VOLTAR
        </button>
    `;
}
/* =========================================================
   CALCULAR SEMANAS RESTANTES
========================================================= */
function calculateWeeksRemaining(
    player
) {
    if (!player.nextFight) {
        return 0;
    }
    const currentYear =
        Number(player.year || 2026);
    const currentWeek =
        Number(player.week || 1);
    const fightYear =
        Number(
            player.nextFight.year
        );
    const fightWeek =
        Number(
            player.nextFight.week
        );
    const currentAbsolute =
        currentYear * 52 +
        currentWeek;
    const fightAbsolute =
        fightYear * 52 +
        fightWeek;
    return Math.max(
        0,
        fightAbsolute -
        currentAbsolute
    );
}
/* =========================================================
   PROCESSAR CAMP
========================================================= */
function processFightCamp() {
    const player =
        ensureFightData();
    if (
        !player ||
        !player.nextFight
    ) {
        return;
    }
    if (!player.camp) {
        return;
    }
    const remaining =
        calculateWeeksRemaining(
            player
        );
    if (remaining > 0) {
        player.camp.weeksCompleted =
            Number(
                player.camp.weeksCompleted || 0
            ) + 1;
    }
}
/* =========================================================
   SIMULAR LUTA
========================================================= */
function simulateFight() {
    const player =
        ensureFightData();
    if (
        !player ||
        !player.nextFight
    ) {
        fightScreen();
        return;
    }
    const weeksRemaining =
        calculateWeeksRemaining(
            player
        );
    /*
       NÃO deixa lutar antes da data.
    */
    if (weeksRemaining > 0) {
        alert(
            `A luta ainda não chegou. Faltam ${weeksRemaining} semana(s) para o evento.`
        );
        fightScreen();
        return;
    }
    const opponent =
        player.nextFight.opponent;
    const playerOVR =
        typeof window.getOverall === "function"
        ?
        Number(window.getOverall())
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
    const professional =
        isProfessional();
    const record =
        professional
        ?
        player.professional
        :
        player.amateur;
    let resultText;
    if (playerWins) {
        record.wins =
            Number(record.wins || 0) + 1;
        resultText =
            "🏆 VITÓRIA!";
        player.fame =
            Number(player.fame || 0) + 3;
        player.money =
            Number(player.money || 0) +
            (
                professional
                ?
                1000
                :
                250
            );
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
            Number(player.money || 0) +
            (
                professional
                ?
                500
                :
                100
            );
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
    record.fights =
        Number(record.fights || 0) + 1;
    /*
       Aumenta experiência de luta.
    */
    player.experience =
        Number(
            player.experience || 0
        ) + 2;
    /*
       Dano e fadiga.
    */
    player.health =
        Math.max(
            40,
            Number(player.health || 100) - 15
        );
    player.fatigue =
        Math.min(
            100,
            Number(player.fatigue || 0) + 35
        );
    /*
       Remove a luta.
    */
    player.nextFight =
        null;
    player.camp =
        null;
    /*
       Depois de uma luta amadora,
       verifica promoção.
    */
    let promoted =
        false;
    if (!professional) {
        promoted =
            checkProfessionalPromotion();
    }
    fightSave();
    showFightResult(
        resultText,
        opponent,
        playerWins,
        promoted
    );
}
/* =========================================================
   RESULTADO
========================================================= */
function showFightResult(
    resultText,
    opponent,
    playerWins,
    promoted
) {
    const player =
        ensureFightData();
    const content =
        document.getElementById("content");
    if (!content) {
        return;
    }
    const professional =
        player.professional || {};
    const amateur =
        player.amateur || {};
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 RESULTADO DO EVENTO
            </div>
            <div style="
                text-align:center;
                font-size:36px;
                font-weight:bold;
                margin:25px 0;
            ">
                ${resultText}
            </div>
            <p style="
                text-align:center;
                font-size:18px;
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
            promoted
            ?
            `
            <div class="card">
                <div class="title">
                    🎉 PROMOÇÃO
                </div>
                <p>
                    Você completou os requisitos
                    para se tornar um lutador profissional!
                </p>
                <div class="statline">
                    <span>
                        Idade
                    </span>
                    <b>
                        ${player.age} anos
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Lutas amadoras
                    </span>
                    <b>
                        ${amateur.fights}
                    </b>
                </div>
                <p>
                    A partir de agora suas próximas
                    lutas contarão para o recorde profissional.
                </p>
            </div>
            `
            :
            ""
        }
        <div class="card">
            <div class="title">
                📊 RECORDES
            </div>
            <div class="statline">
                <span>
                    Amador
                </span>
                <b>
                    ${amateur.wins || 0}-
                    ${amateur.losses || 0}-
                    ${amateur.draws || 0}
                </b>
            </div>
            <div class="statline">
                <span>
                    Profissional
                </span>
                <b>
                    ${professional.wins || 0}-
                    ${professional.losses || 0}-
                    ${professional.draws || 0}
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
            <button
                class="main-button"
                onclick="tab('home')">
                🏠 VOLTAR AO INÍCIO
            </button>
            <button
                class="gray"
                onclick="fightScreen()">
                ⚔️ TELA DE LUTAS
            </button>
        </div>
    `;
}
/* =========================================================
   RECUPERAÇÃO
========================================================= */
function processFightRecovery() {
    const player =
        fightGetPlayer();
    if (!player) {
        return;
    }
    if (
        Number(player.fatigue || 0) > 0
    ) {
        player.fatigue =
            Math.max(
                0,
                Number(player.fatigue || 0) - 8
            );
    }
    if (
        Number(player.health || 100) < 100
    ) {
        player.health =
            Math.min(
                100,
                Number(player.health || 100) + 5
            );
    }
}
/* =========================================================
   EMPRESÁRIO
========================================================= */
function processManagerFightOffer() {
    const player =
        ensureFightData();
    if (!player) {
        return;
    }
    /*
       Nunca cria automaticamente
       uma luta enquanto outra existe.
    */
    if (player.nextFight) {
        return;
    }
    /*
       Depois que o lutador vira profissional,
       o empresário passa a procurar lutas
       com menor frequência.
    */
    const chance =
        isProfessional()
        ?
        0.08
        :
        0.12;
    if (
        Math.random() > chance
    ) {
        return;
    }
    /*
       Não cria luta automática antes
       dos 3 requisitos? Pode lutar normalmente.
    */
    const date =
        getFightDate();
    const opponent =
        generateFightOpponent();
    const event =
        generateFightEvent();
    const eventCard =
        generateEventCard();
    eventCard.forEach(
        function(match) {
            if (match.playerFight) {
                match.fighterB =
                    opponent.displayName;
                match.fighterBOVR =
                    opponent.power;
            }
        }
    );
    player.nextFight = {
        event:
            event,
        opponent:
            opponent,
        card:
            eventCard,
        week:
            date.week,
        year:
            date.year,
        weeksUntil:
            4
    };
    createFightCamp();
    player.log =
        player.log || [];
    player.log.unshift(
        `📩 O empresário marcou uma luta contra ${opponent.displayName} para daqui 4 semanas.`
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
window.generateEventCard =
    generateEventCard;
window.simulateFight =
    simulateFight;
window.processFightRecovery =
    processFightRecovery;
window.processManagerFightOffer =
    processManagerFightOffer;
window.processFightCamp =
    processFightCamp;
window.getProfessionalRequirements =
    getProfessionalRequirements;
window.checkProfessionalPromotion =
    checkProfessionalPromotion;
window.isProfessional =
    isProfessional;
