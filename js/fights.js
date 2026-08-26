/* =========================================================
   🥊 MMA LIFE DYNASTY
   FIGHT.JS
   SISTEMA COMPLETO DE LUTAS
   AMADOR
   PROFISSIONAL
   EVENTOS
   CARD COMPLETO
   CAMP DE 4 SEMANAS
   PROFISSIONALIZAÇÃO
   EMPRESÁRIO
   RECUPERAÇÃO
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
    else if (
        typeof window.save ===
        "function"
    ) {
        window.save();
    }
}
function fightRandomInt(min, max) {
    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}
function fightClamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}
/* =========================================================
   GARANTIR ESTRUTURAS
========================================================= */
function ensureFightStructures() {
    const player =
        fightGetPlayer();
    if (!player) {
        return;
    }
    if (!player.amateur) {
        player.amateur = {
            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0
        };
    }
    if (!player.professional) {
        player.professional = {
            active: false,
            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0
        };
    }
    if (
        typeof player.amateur.fights !==
        "number"
    ) {
        player.amateur.fights =
            Number(
                player.amateur.wins || 0
            ) +
            Number(
                player.amateur.losses || 0
            ) +
            Number(
                player.amateur.draws || 0
            );
    }
    if (
        typeof player.professional.fights !==
        "number"
    ) {
        player.professional.fights =
            Number(
                player.professional.wins || 0
            ) +
            Number(
                player.professional.losses || 0
            ) +
            Number(
                player.professional.draws || 0
            );
    }
    if (
        typeof player.professional.active !==
        "boolean"
    ) {
        player.professional.active =
            false;
    }
    if (!player.log) {
        player.log = [];
    }
}
/* =========================================================
   TIPO DE CARREIRA
========================================================= */
function isProfessionalFighter() {
    const player =
        fightGetPlayer();
    ensureFightStructures();
    return !!(
        player &&
        player.professional &&
        player.professional.active === true
    );
}
function getFightCareerType() {
    return isProfessionalFighter()
        ?
        "Profissional"
        :
        "Amador";
}
/* =========================================================
   REQUISITOS PARA PROFISSIONAL
========================================================= */
function getAmateurFightCount() {
    const player =
        fightGetPlayer();
    ensureFightStructures();
    return Number(
        player.amateur.fights || 0
    );
}
function getPlayerAge() {
    const player =
        fightGetPlayer();
    if (!player) {
        return 0;
    }
    return Number(
        player.age || 0
    );
}
function canBecomeProfessional() {
    return (
        getPlayerAge() >= 18 &&
        getAmateurFightCount() >= 3
    );
}
function getProfessionalRequirementsMessage() {
    const age =
        getPlayerAge();
    const fights =
        getAmateurFightCount();
    let message = "";
    if (age < 18) {
        message +=
            "🔞 Você precisa ter pelo menos 18 anos.\n";
    }
    if (fights < 3) {
        message +=
            "🥊 Você precisa realizar pelo menos 3 lutas amadoras.\n";
    }
    return message;
}
/* =========================================================
   VIRAR PROFISSIONAL
========================================================= */
function becomeProfessional() {
    const player =
        fightGetPlayer();
    ensureFightStructures();
    if (!player) {
        return;
    }
    if (
        player.professional.active
    ) {
        alert(
            "Você já é um lutador profissional."
        );
        return;
    }
    if (!canBecomeProfessional()) {
        alert(
            "❌ VOCÊ AINDA NÃO PODE VIRAR PROFISSIONAL\n\n" +
            getProfessionalRequirementsMessage()
        );
        return;
    }
    const confirmed =
        confirm(
            "🏆 PROFISSIONALIZAÇÃO\n\n" +
            "Você cumpriu todos os requisitos.\n\n" +
            "Idade: " +
            getPlayerAge() +
            " anos\n" +
            "Lutas amadoras: " +
            getAmateurFightCount() +
            "\n\n" +
            "Deseja iniciar sua carreira profissional?"
        );
    if (!confirmed) {
        return;
    }
    player.professional.active =
        true;
    player.professional.fights =
        Number(
            player.professional.fights || 0
        );
    player.professional.wins =
        Number(
            player.professional.wins || 0
        );
    player.professional.losses =
        Number(
            player.professional.losses || 0
        );
    player.professional.draws =
        Number(
            player.professional.draws || 0
        );
    player.log.unshift(
        "🏆 Você se tornou oficialmente um lutador profissional."
    );
    fightSave();
    alert(
        "🏆 VOCÊ AGORA É PROFISSIONAL!\n\n" +
        "Sua carreira profissional começou."
    );
    fightScreen();
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
        Number(
            window.getOverall()
        )
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
        "Ricardo Souza",
        "Fernando Lima",
        "Paulo Costa",
        "Daniel Martins",
        "Gustavo Almeida"
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
                Math.random() *
                names.length
            )
        ];
    const randomStyle =
        styles[
            Math.floor(
                Math.random() *
                styles.length
            )
        ];
    const variation =
        fightRandomInt(-7, 7);
    const power =
        fightClamp(
            playerOVR + variation,
            35,
            95
        );
    const professional =
        isProfessionalFighter();
    let wins;
    let losses;
    if (professional) {
        wins =
            fightRandomInt(0, 18);
        losses =
            fightRandomInt(0, 8);
    }
    else {
        wins =
            fightRandomInt(0, 7);
        losses =
            fightRandomInt(0, 4);
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
            wins,
        losses:
            losses,
        draws:
            0
    };
}
/* =========================================================
   GERAR LUTADORES DO CARD
========================================================= */
function generateCardFighter(
    baseOVR,
    index
) {
    const names = [
        "João Pereira",
        "Rafael Costa",
        "Lucas Almeida",
        "Bruno Santos",
        "Marcos Oliveira",
        "Diego Silva",
        "Felipe Mendes",
        "Gabriel Rocha",
        "André Martins",
        "Thiago Souza",
        "Pedro Lima",
        "Carlos Ferreira"
    ];
    const name =
        names[
            (
                index +
                fightRandomInt(
                    0,
                    names.length - 1
                )
            ) %
            names.length
        ];
    const opponentNames = [
        "Mateus Costa",
        "Victor Silva",
        "Eduardo Lima",
        "Fernando Santos",
        "Ricardo Oliveira",
        "Gustavo Rocha",
        "Daniel Almeida",
        "Paulo Martins",
        "Bruno Ferreira",
        "Alexandre Souza",
        "Rodrigo Mendes",
        "Caio Ribeiro"
    ];
    const opponent =
        opponentNames[
            (
                index +
                fightRandomInt(
                    0,
                    opponentNames.length - 1
                )
            ) %
            opponentNames.length
        ];
    return {
        fighter1:
            name,
        fighter2:
            opponent,
        ovr1:
            fightClamp(
                baseOVR +
                fightRandomInt(-12, 12),
                35,
                95
            ),
        ovr2:
            fightClamp(
                baseOVR +
                fightRandomInt(-12, 12),
                35,
                95
            )
    };
}
/* =========================================================
   GERAR EVENTO
========================================================= */
function generateFightEvent() {
    const professional =
        isProfessionalFighter();
    const amateurEvents = [
        "MMA AMATEUR NIGHT",
        "BRAZIL AMATEUR FIGHT",
        "RISING FIGHTERS",
        "MMA CHALLENGE",
        "AMATEUR COMBAT NIGHT",
        "FUTURE CHAMPIONS"
    ];
    const professionalEvents = [
        "MMA NIGHT",
        "FIGHT NIGHT",
        "WARRIOR FC",
        "BRAZIL FIGHT",
        "COMBAT NIGHT",
        "CHAMPIONS FIGHT",
        "MMA ELITE"
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
                Math.random() *
                events.length
            )
        ];
    const player =
        fightGetPlayer();
    const playerOVR =
        typeof window.getOverall ===
        "function"
        ?
        Number(
            window.getOverall()
        )
        :
        50;
    const card = [];
    /*
       5 lutas no card.
       A luta do jogador será adicionada
       separadamente em uma posição aleatória.
    */
    for (
        let i = 0;
        i < 4;
        i++
    ) {
        card.push(
            generateCardFighter(
                playerOVR,
                i
            )
        );
    }
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
            "Profissional"
            :
            "Amador",
        card:
            card
    };
}
/* =========================================================
   CRIAR EVENTO + LUTA
========================================================= */
function createScheduledFight() {
    const player =
        fightGetPlayer();
    ensureFightStructures();
    const opponent =
        generateFightOpponent();
    const event =
        generateFightEvent();
    const currentWeek =
        Number(
            player.week || 1
        );
    const currentYear =
        Number(
            player.year || 2026
        );
    let fightWeek =
        currentWeek + 4;
    let fightYear =
        currentYear;
    if (
        fightWeek > 52
    ) {
        fightWeek -= 52;
        fightYear++;
    }
    player.nextFight = {
        event:
            event,
        opponent:
            opponent,
        week:
            fightWeek,
        year:
            fightYear,
        scheduledFromWeek:
            currentWeek,
        scheduledFromYear:
            currentYear,
        campWeeks:
            4,
        campCompleted:
            0,
        campBonus:
            0,
        careerType:
            getFightCareerType(),
        status:
            "scheduled"
    };
    player.log.unshift(
        `📅 ${getFightCareerType()} — luta marcada contra ${opponent.displayName} para a semana ${fightWeek}/${fightYear}.`
    );
    fightSave();
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
    ensureFightStructures();
    if (player.nextFight) {
        fightScreen();
        return;
    }
    createScheduledFight();
    fightScreen();
}
/* =========================================================
   SEMANAS ATÉ A LUTA
========================================================= */
function getWeeksUntilFight() {
    const player =
        fightGetPlayer();
    if (
        !player ||
        !player.nextFight
    ) {
        return 0;
    }
    const fight =
        player.nextFight;
    const currentYear =
        Number(
            player.year || 2026
        );
    const currentWeek =
        Number(
            player.week || 1
        );
    const fightYear =
        Number(
            fight.year || currentYear
        );
    const fightWeek =
        Number(
            fight.week || currentWeek
        );
    return Math.max(
        0,
        (
            fightYear -
            currentYear
        ) * 52
        +
        (
            fightWeek -
            currentWeek
        )
    );
}
/* =========================================================
   CAMP SEMANAL
========================================================= */
function performFightCamp() {
    const player =
        fightGetPlayer();
    if (
        !player ||
        !player.nextFight
    ) {
        return;
    }
    const fight =
        player.nextFight;
    const weeks =
        getWeeksUntilFight();
    if (
        weeks <= 0
    ) {
        return;
    }
    if (
        fight.campCompleted >= 4
    ) {
        return;
    }
    let bonus = 1;
    /*
       Equipe melhora preparação.
    */
    if (player.team) {
        bonus += 1;
    }
    /*
       Treinador melhora preparação.
    */
    if (player.coach) {
        bonus +=
            Number(
                player.coach.level || 0
            ) / 100;
    }
    /*
       Treinador particular aumenta ainda mais.
    */
    if (player.privateCoach) {
        bonus +=
            Number(
                player.privateCoach.level || 0
            ) / 120;
    }
    /*
       Empresário pode ajudar
       na preparação profissional.
    */
    if (
        player.manager &&
        isProfessionalFighter()
    ) {
        bonus +=
            Number(
                player.manager.negotiation || 0
            ) / 500;
    }
    fight.campWeeks =
        Number(
            fight.campWeeks || 4
        );
    fight.campCompleted =
        Math.min(
            4,
            Number(
                fight.campCompleted || 0
            ) + 1
        );
    fight.campBonus =
        Number(
            fight.campBonus || 0
        ) +
        bonus;
    /*
       Treino gera pequena fadiga.
    */
    player.fatigue =
        fightClamp(
            Number(
                player.fatigue || 0
            ) + 4,
            0,
            100
        );
    player.log.unshift(
        `🏋️ Camp semana ${fight.campCompleted}/4 concluído para a luta contra ${fight.opponent.displayName}.`
    );
    fightSave();
}
/* =========================================================
   PROCESSAR CAMP AUTOMATICAMENTE
   CHAMADO PELO AVANÇO DA SEMANA
========================================================= */
function processFightCampWeek() {
    const player =
        fightGetPlayer();
    if (
        !player ||
        !player.nextFight
    ) {
        return;
    }
    const fight =
        player.nextFight;
    const weeks =
        getWeeksUntilFight();
    /*
       Enquanto faltarem semanas,
       fazemos uma preparação semanal.
    */
    if (
        weeks > 0 &&
        fight.campCompleted < 4
    ) {
        performFightCamp();
    }
}
/* =========================================================
   CARD COMPLETO
========================================================= */
function renderEventCard(
    fight
) {
    const event =
        fight.event;
    let html = "";
    if (
        event &&
        Array.isArray(event.card)
    ) {
        event.card.forEach(
            (cardFight, index) => {
                html += `
                    <div class="statline">
                        <span>
                            Luta ${index + 1}
                        </span>
                        <b>
                            ${cardFight.fighter1}
                            vs
                            ${cardFight.fighter2}
                        </b>
                    </div>
                `;
            }
        );
    }
    /*
       A luta do jogador sempre fica
       destacada no card.
    */
    html += `
        <div
            class="card"
            style="
                border:2px solid currentColor;
                margin-top:12px;
            "
        >
            <div class="title">
                ⭐ SUA LUTA
            </div>
            <div class="statline">
                <span>
                    ${fight.careerType}
                </span>
                <b>
                    ${fight.playerName ||
                    "Você"}
                    vs
                    ${fight.opponent.displayName}
                </b>
            </div>
            <div class="statline">
                <span>
                    OVR
                </span>
                <b>
                    ${
                        typeof window.getOverall ===
                        "function"
                        ?
                        window.getOverall()
                        :
                        50
                    }
                    vs
                    ${fight.opponent.power}
                </b>
            </div>
        </div>
    `;
    return html;
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
        console.error(
            "Elemento #content não encontrado."
        );
        return;
    }
    ensureFightStructures();
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
    /*
       Se não existe luta.
    */
    if (!player.nextFight) {
        let professionalHTML = "";
        if (
            !player.professional.active &&
            canBecomeProfessional()
        ) {
            professionalHTML = `
                <div class="card">
                    <div class="title">
                        🏆 CARREIRA PROFISSIONAL
                    </div>
                    <p>
                        Você já cumpriu os requisitos
                        para se tornar profissional.
                    </p>
                    <div class="statline">
                        <span>
                            Idade
                        </span>
                        <b>
                            ${getPlayerAge()} anos
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Lutas amadoras
                        </span>
                        <b>
                            ${getAmateurFightCount()}
                        </b>
                    </div>
                    <button
                        class="green"
                        onclick="becomeProfessional()">
                        🏆 VIRAR PROFISSIONAL
                    </button>
                </div>
            `;
        }
        else if (
            !player.professional.active
        ) {
            professionalHTML = `
                <div class="card">
                    <div class="title">
                        🥊 CAMINHO PARA O PROFISSIONAL
                    </div>
                    <div class="statline">
                        <span>
                            Idade
                        </span>
                        <b>
                            ${getPlayerAge()}
                            / 18
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Lutas amadoras
                        </span>
                        <b>
                            ${getAmateurFightCount()}
                            / 3
                        </b>
                    </div>
                    <p>
                        Você precisa ter 18 anos
                        e realizar pelo menos
                        3 lutas amadoras.
                    </p>
                </div>
            `;
        }
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    ⚔️ LUTA
                </div>
                <div class="statline">
                    <span>
                        Categoria
                    </span>
                    <b>
                        ${getFightCareerType()}
                    </b>
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
            </div>
            ${professionalHTML}
            <div class="card">
                <div class="title">
                    📊 SEU CARTEL
                </div>
                <div class="statline">
                    <span>
                        Amador
                    </span>
                    <b>
                        ${player.amateur.wins}
                        -
                        ${player.amateur.losses}
                        -
                        ${player.amateur.draws}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Profissional
                    </span>
                    <b>
                        ${
                            player.professional.wins
                        }
                        -
                        ${
                            player.professional.losses
                        }
                        -
                        ${
                            player.professional.draws
                        }
                    </b>
                </div>
            </div>
            <button
                class="gray"
                onclick="tab('home')">
                ← VOLTAR
            </button>
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
    const weeks =
        getWeeksUntilFight();
    const campCompleted =
        Number(
            fight.campCompleted || 0
        );
    const campPercent =
        Math.min(
            100,
            campCompleted * 25
        );
    /*
       Salvar nome do jogador para o card.
    */
    fight.playerName =
        player.name ||
        "Você";
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ${
                    fight.careerType ===
                    "Profissional"
                    ?
                    "🏆"
                    :
                    "🥊"
                }
                ${event.name}
            </div>
            <div class="statline">
                <span>
                    Categoria
                </span>
                <b>
                    ${fight.careerType}
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
                    Arena
                </span>
                <b>
                    ${event.venue}
                </b>
            </div>
            <div class="statline">
                <span>
                    Data
                </span>
                <b>
                    Semana ${fight.week}
                    / ${fight.year}
                </b>
            </div>
            <div class="statline">
                <span>
                    Faltam
                </span>
                <b>
                    ${
                        weeks > 0
                        ?
                        weeks +
                        " semanas"
                        :
                        "HOJE"
                    }
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📋 CARD COMPLETO
            </div>
            ${renderEventCard(fight)}
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
                    <p>
                        Cartel amador:
                        ${player.amateur.wins}-
                        ${player.amateur.losses}-
                        ${player.amateur.draws}
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
                    <p>
                        Cartel:
                        ${opponent.wins}-
                        ${opponent.losses}-
                        ${opponent.draws}
                    </p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🏋️ CAMP DE PREPARAÇÃO
            </div>
            <div class="statline">
                <span>
                    Preparação
                </span>
                <b>
                    ${campCompleted}/4 semanas
                </b>
            </div>
            <div style="
                width:100%;
                height:14px;
                background:#ddd;
                border-radius:8px;
                overflow:hidden;
                margin:12px 0;
            ">
                <div style="
                    width:${campPercent}%;
                    height:100%;
                    background:currentColor;
                "></div>
            </div>
            <p>
                ${
                    weeks > 0
                    ?
                    "O camp será realizado durante as quatro semanas que antecedem o evento."
                    :
                    "O evento chegou."
                }
            </p>
            ${
                weeks > 0
                ?
                `
                    <div class="statline">
                        <span>
                            Bônus de camp
                        </span>
                        <b>
                            +
                            ${Number(
                                fight.campBonus || 0
                            ).toFixed(1)}
                        </b>
                    </div>
                `
                :
                ""
            }
        </div>
        <div class="card">
            <div class="title">
                ❤️ SUA CONDIÇÃO
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
            ${
                weeks <= 0
                ?
                `
                    <div class="title">
                        🥊 DIA DA LUTA
                    </div>
                    <p>
                        O evento chegou.
                        Está na hora de entrar no cage.
                    </p>
                    <button
                        class="main-button"
                        onclick="simulateFight()">
                        🥊 LUTAR
                    </button>
                `
                :
                `
                    <div class="title">
                        ⏳ CAMP EM ANDAMENTO
                    </div>
                    <p>
                        Avance as semanas para
                        continuar sua preparação.
                    </p>
                `
            }
        </div>
        <button
            class="gray"
            onclick="tab('home')">
            ← VOLTAR
        </button>
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
    ensureFightStructures();
    const fight =
        player.nextFight;
    const weeks =
        getWeeksUntilFight();
    /*
       Não permite lutar antes da data.
    */
    if (weeks > 0) {
        alert(
            "⏳ A LUTA AINDA NÃO CHEGOU!\n\n" +
            "Faltam " +
            weeks +
            " semanas.\n\n" +
            "Continue seu camp."
        );
        return;
    }
    const opponent =
        fight.opponent;
    const playerOVR =
        typeof window.getOverall ===
        "function"
        ?
        Number(
            window.getOverall()
        )
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
    const campBonus =
        Number(
            fight.campBonus || 0
        );
    const teamBonus =
        player.team
        ?
        Number(
            player.team.prestige || 0
        ) / 100
        :
        0;
    const coachBonus =
        player.coach
        ?
        Number(
            player.coach.level || 0
        ) / 100
        :
        0;
    const privateBonus =
        player.privateCoach
        ?
        Number(
            player.privateCoach.level || 0
        ) / 100
        :
        0;
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
        campBonus
        +
        teamBonus
        +
        coachBonus
        +
        privateBonus
        +
        (
            Math.random() * 20 -
            10
        );
    const opponentScore =
        opponentOVR
        +
        (
            Math.random() * 20 -
            10
        );
    const playerWins =
        playerScore >= opponentScore;
    let record;
    if (
        fight.careerType ===
        "Profissional"
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
            Number(
                record.wins || 0
            ) + 1;
        resultText =
            "🏆 VITÓRIA!";
        player.fame =
            Number(
                player.fame || 0
            ) + (
                fight.careerType ===
                "Profissional"
                ?
                5
                :
                3
            );
        player.money =
            Number(
                player.money || 0
            ) + (
                fight.careerType ===
                "Profissional"
                ?
                750
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
        player.log.unshift(
            `🏆 Vitória sobre ${opponent.displayName} (${fight.careerType}).`
        );
    }
    else {
        record.losses =
            Number(
                record.losses || 0
            ) + 1;
        resultText =
            "❌ DERROTA";
        player.fame =
            Math.max(
                0,
                Number(
                    player.fame || 0
                ) - 1
            );
        player.money =
            Number(
                player.money || 0
            ) + (
                fight.careerType ===
                "Profissional"
                ?
                300
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
        player.log.unshift(
            `❌ Derrota para ${opponent.displayName} (${fight.careerType}).`
        );
    }
    /*
       Toda luta realizada conta como
       uma luta.
    */
    record.fights =
        Number(
            record.fights || 0
        ) + 1;
    /*
       Dano da luta.
    */
    player.health =
        Math.max(
            40,
            Number(
                player.health || 100
            ) - 15
        );
    player.fatigue =
        Math.min(
            100,
            Number(
                player.fatigue || 0
            ) + 35
        );
    /*
       Guardar resultado.
    */
    player.lastFightResult = {
        careerType:
            fight.careerType,
        event:
            fight.event.name,
        opponent:
            opponent.displayName,
        won:
            playerWins,
        week:
            fight.week,
        year:
            fight.year
    };
    /*
       A luta terminou.
    */
    player.nextFight =
        null;
    fightSave();
    showFightResult(
        resultText,
        opponent,
        playerWins,
        fight.careerType
    );
}
/* =========================================================
   RESULTADO
========================================================= */
function showFightResult(
    resultText,
    opponent,
    playerWins,
    careerType
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
    ensureFightStructures();
    const record =
        careerType ===
        "Profissional"
        ?
        player.professional
        :
        player.amateur;
    let professionalButton = "";
    if (
        !player.professional.active &&
        canBecomeProfessional()
    ) {
        professionalButton = `
            <button
                class="green"
                onclick="becomeProfessional()">
                🏆 VIRAR PROFISSIONAL
            </button>
        `;
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
                ${player.name || "Você"}
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
            <p style="
                text-align:center;
            ">
                Categoria:
                <strong>
                    ${careerType}
                </strong>
            </p>
        </div>
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
                    Total de lutas
                </span>
                <b>
                    ${record.fights || 0}
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
        ${
            careerType ===
            "Amador"
            ?
            `
                <div class="card">
                    <div class="title">
                        🥊 CAMINHO PROFISSIONAL
                    </div>
                    <div class="statline">
                        <span>
                            Idade
                        </span>
                        <b>
                            ${getPlayerAge()}
                            / 18
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Lutas amadoras
                        </span>
                        <b>
                            ${player.amateur.fights}
                            / 3
                        </b>
                    </div>
                    ${
                        canBecomeProfessional()
                        ?
                        `
                            <p>
                                🎉 Você já cumpriu
                                todos os requisitos!
                            </p>
                            ${professionalButton}
                        `
                        :
                        `
                            <p>
                                Continue sua carreira
                                amadora até cumprir
                                os requisitos.
                            </p>
                        `
                    }
                </div>
            `
            :
            ""
        }
        <div class="card">
            <button
                class="main-button"
                onclick="tab('home')">
                🏠 VOLTAR AO INÍCIO
            </button>
            <button
                class="gray"
                onclick="fightScreen()">
                ⚔️ TELA DE LUTA
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
    ensureFightStructures();
    if (
        Number(
            player.fatigue || 0
        ) > 0
    ) {
        player.fatigue =
            Math.max(
                0,
                Number(
                    player.fatigue || 0
                ) - 8
            );
    }
    if (
        Number(
            player.health || 100
        ) < 100
    ) {
        player.health =
            Math.min(
                100,
                Number(
                    player.health || 100
                ) + 5
            );
    }
}
/* =========================================================
   PROCESSAR SEMANA DA LUTA
========================================================= */
function processFightWeek() {
    const player =
        fightGetPlayer();
    if (!player) {
        return;
    }
    ensureFightStructures();
    /*
       Recuperação normal.
    */
    processFightRecovery();
    /*
       Camp.
    */
    processFightCampWeek();
    fightSave();
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
    ensureFightStructures();
    /*
       Sem empresário, não há oferta
       automática.
    */
    if (!player.manager) {
        return;
    }
    /*
       Se já tem luta marcada,
       não procura outra.
    */
    if (player.nextFight) {
        return;
    }
    const isProfessional =
        isProfessionalFighter();
    /*
       Profissional recebe ofertas
       um pouco mais frequentemente.
    */
    const chance =
        isProfessional
        ?
        0.15
        :
        0.10;
    if (
        Math.random() >
        chance
    ) {
        return;
    }
    createScheduledFight();
    player.log.unshift(
        `📩 Seu empresário conseguiu uma nova luta ${getFightCareerType()} para você.`
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
window.processFightWeek =
    processFightWeek;
window.processFightCampWeek =
    processFightCampWeek;
window.performFightCamp =
    performFightCamp;
window.processManagerFightOffer =
    processManagerFightOffer;
window.becomeProfessional =
    becomeProfessional;
window.canBecomeProfessional =
    canBecomeProfessional;
window.getAmateurFightCount =
    getAmateurFightCount;
window.getPlayerAge =
    getPlayerAge;
window.getFightCareerType =
    getFightCareerType;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
if (
    typeof window.player !==
    "undefined" &&
    window.player
) {
    ensureFightStructures();
}
