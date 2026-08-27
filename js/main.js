/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   CONTROLE PRINCIPAL DO JOGO
   VERSÃO CONSOLIDADA
   INCLUI:
   - Criação do jogador
   - Carregamento
   - Salvamento
   - Navegação
   - Avanço de semanas
   - Dia da luta
   - Pós-luta
   - Recuperação
   - Período entre lutas
   - Matchmaking realista
   - Ritmo de 2–4 lutas por ano
   - Empresário
   - Ranking
   - Calendário mundial
========================================================= */
/* =========================================================
   UTILIDADES
========================================================= */
function getElement(id) {
    return document.getElementById(id);
}
function getContent() {
    return getElement("content");
}
/* =========================================================
   CONTROLE DAS PÁGINAS
========================================================= */
function showCreation() {
    const creation =
        getElement("creation");
    const game =
        getElement("game");
    const tabs =
        getElement("tabs");
    if (creation) {
        creation.classList.remove("hidden");
        creation.style.display =
            "block";
    }
    if (game) {
        game.classList.add("hidden");
        game.style.display =
            "none";
    }
    if (tabs) {
        tabs.classList.add("hidden");
        tabs.style.display =
            "none";
    }
}
function showGame() {
    const creation =
        getElement("creation");
    const game =
        getElement("game");
    const tabs =
        getElement("tabs");
    if (creation) {
        creation.classList.add("hidden");
        creation.style.display =
            "none";
    }
    if (game) {
        game.classList.remove("hidden");
        game.style.display =
            "block";
        game.style.visibility =
            "visible";
        game.style.opacity =
            "1";
    }
    if (tabs) {
        tabs.classList.remove("hidden");
        tabs.style.display =
            "flex";
        tabs.style.visibility =
            "visible";
        tabs.style.opacity =
            "1";
    }
}
/* =========================================================
   GARANTIR PLAYER
========================================================= */
function ensurePlayer() {
    if (
        typeof window.player ===
        "undefined" ||
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
}
/* =========================================================
   SALVAR
========================================================= */
function saveGame() {
    ensurePlayer();
    if (!window.player) {
        return;
    }
    localStorage.setItem(
        "mmaLifePlayer",
        JSON.stringify(
            window.player
        )
    );
}
/* =========================================================
   CARREGAR
========================================================= */
function loadGame() {
    const saved =
        localStorage.getItem(
            "mmaLifePlayer"
        );
    if (!saved) {
        return false;
    }
    try {
        const data =
            JSON.parse(saved);
        const base =
            createDefaultPlayer();
        window.player = {
            ...base,
            ...data,
            attributes: {
                ...base.attributes,
                ...(data.attributes || {})
            },
            professional: {
                ...base.professional,
                ...(data.professional || {})
            },
            amateur: {
                ...base.amateur,
                ...(data.amateur || {})
            },
            trainingPlan: {
                ...base.trainingPlan,
                ...(data.trainingPlan || {})
            },
            championship: {
                ...base.championship,
                ...(data.championship || {})
            },
            sponsors: {
                ...base.sponsors,
                ...(data.sponsors || {})
            },
            socialMedia: {
                ...base.socialMedia,
                ...(data.socialMedia || {})
            },
            media: {
                ...base.media,
                ...(data.media || {})
            },
            finances: {
                ...base.finances,
                ...(data.finances || {})
            },
            assets: {
                ...base.assets,
                ...(data.assets || {})
            },
            investments: {
                ...base.investments,
                ...(data.investments || {})
            },
            taxes: {
                ...base.taxes,
                ...(data.taxes || {})
            },
            legal: {
                ...base.legal,
                ...(data.legal || {})
            },
            legacy: {
                ...base.legacy,
                ...(data.legacy || {})
            },
            currentContract: {
                ...(base.currentContract || {}),
                ...(data.currentContract || {})
            },
            promotionHistory: {
                ...(base.promotionHistory || {}),
                ...(data.promotionHistory || {})
            }
        };
        /*
           Garantir propriedades novas
           para saves antigos.
        */
        if (
            typeof window.player.postFightRecoveryWeeks !==
            "number"
        ) {
            window.player.postFightRecoveryWeeks =
                0;
        }
        if (
            typeof window.player.matchmakingCooldownWeeks !==
            "number"
        ) {
            window.player.matchmakingCooldownWeeks =
                0;
        }
        if (
            typeof window.player.nextFightSearchWeek !==
            "number"
        ) {
            window.player.nextFightSearchWeek =
                null;
        }
        if (
            !window.player.careerStatus
        ) {
            window.player.careerStatus =
                "available";
        }
        return true;
    }
    catch (error) {
        console.error(
            "Erro ao carregar jogador:",
            error
        );
        return false;
    }
}
/* =========================================================
   TELA INICIAL
========================================================= */
function startGame() {
    const creation =
        getElement("creation");
    const creator =
        getElement("creator");
    const game =
        getElement("game");
    if (
        !creation ||
        !creator ||
        !game
    ) {
        console.error(
            "Estrutura do index.html não encontrada."
        );
        return;
    }
    showCreation();
    creator.innerHTML = `
        <div class="start-screen">
            <div class="start-logo">
                🥊
            </div>
            <h1>
                MMA LIFE
            </h1>
            <p class="start-subtitle">
                CONSTRUA SUA CARREIRA.<br>
                ESCREVA SEU LEGADO.
            </p>
            <div class="start-preview">
                <div class="start-fighter">
                    🥊
                </div>
                <div class="start-preview-text">
                    <strong>
                        SUA HISTÓRIA COMEÇA AQUI
                    </strong>
                    <span>
                        Comece como amador,
                        evolua seu lutador,
                        consiga contratos,
                        conquiste títulos
                        e construa seu legado.
                    </span>
                </div>
            </div>
            <button
                class="start-button"
                onclick="openCharacterCreation()">
                🆕 CRIAR NOVO LUTADOR
            </button>
        </div>
    `;
}
/* =========================================================
   CRIAÇÃO DO LUTADOR
========================================================= */
function openCharacterCreation() {
    showCreation();
    const creator =
        getElement("creator");
    if (!creator) {
        return;
    }
    creator.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 NOVO LUTADOR
            </div>
            <p>
                Crie seu personagem
                e comece a carreira.
            </p>
            <input
                id="newPlayerName"
                type="text"
                placeholder="Nome do lutador"
            >
            <select id="newPlayerCountry">
                <option value="Brasil">
                    🇧🇷 Brasil
                </option>
                <option value="Estados Unidos">
                    🇺🇸 Estados Unidos
                </option>
                <option value="Japão">
                    🇯🇵 Japão
                </option>
                <option value="México">
                    🇲🇽 México
                </option>
                <option value="Argentina">
                    🇦🇷 Argentina
                </option>
                <option value="Canadá">
                    🇨🇦 Canadá
                </option>
                <option value="Rússia">
                    🇷🇺 Rússia
                </option>
                <option value="Reino Unido">
                    🇬🇧 Reino Unido
                </option>
            </select>
            <select id="newPlayerWeight">
                <option value="Peso Leve">
                    Peso Leve
                </option>
                <option value="Peso Meio-Médio">
                    Peso Meio-Médio
                </option>
                <option value="Peso Médio">
                    Peso Médio
                </option>
                <option value="Peso Meio-Pesado">
                    Peso Meio-Pesado
                </option>
                <option value="Peso Pesado">
                    Peso Pesado
                </option>
            </select>
            <select id="newPlayerStyle">
                <option value="Completo">
                    🥊 Completo
                </option>
                <option value="Striker">
                    👊 Striker
                </option>
                <option value="Wrestler">
                    🤼 Wrestler
                </option>
                <option value="Grappler">
                    🥋 Grappler
                </option>
            </select>
            <button
                class="green"
                onclick="createNewPlayer()">
                🥊 CRIAR LUTADOR
            </button>
            <button
                class="gray"
                onclick="startGame()">
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   CRIAR LUTADOR
========================================================= */
function createNewPlayer() {
    const nameInput =
        getElement("newPlayerName");
    if (!nameInput) {
        return;
    }
    const name =
        nameInput.value.trim();
    if (!name) {
        alert(
            "Digite o nome do lutador."
        );
        return;
    }
    const newPlayer =
        createDefaultPlayer();
    newPlayer.name =
        name;
    const country =
        getElement("newPlayerCountry");
    const weight =
        getElement("newPlayerWeight");
    const style =
        getElement("newPlayerStyle");
    if (country) {
        newPlayer.country =
            country.value;
    }
    if (weight) {
        newPlayer.weight =
            weight.value;
    }
    if (style) {
        newPlayer.style =
            style.value;
    }
    newPlayer.age =
        15;
    newPlayer.week =
        1;
    newPlayer.year =
        2026;
    newPlayer.money =
        0;
    newPlayer.fame =
        0;
    newPlayer.health =
        100;
    newPlayer.fatigue =
        0;
    newPlayer.postFightRecoveryWeeks =
        0;
    newPlayer.matchmakingCooldownWeeks =
        0;
    newPlayer.nextFightSearchWeek =
        1;
    newPlayer.careerStatus =
        "available";
    if (
        typeof newPlayer.potential !==
        "number"
    ) {
        newPlayer.potential =
            90;
    }
    newPlayer.log = [
        `🥊 ${name} iniciou sua carreira no MMA.`
    ];
    window.player =
        newPlayer;
    if (
        typeof window.mmaWorld !==
        "undefined"
    ) {
        window.mmaWorld.initialized =
            false;
        window.mmaWorld.week =
            0;
        window.mmaWorld.fighters =
            [];
        window.mmaWorld.eventsThisWeek =
            [];
        window.mmaWorld.news =
            [];
        window.mmaWorld.championships =
            [];
    }
    saveGame();
    showGame();
    home();
}
/* =========================================================
   OVERALL
========================================================= */
function getOverall() {
    ensurePlayer();
    const player =
        window.player;
    if (
        typeof player.overall ===
        "number" &&
        !player._overallStarted
    ) {
        return player.overall;
    }
    const attributes =
        player.attributes || {};
    const values = [
        Number(
            attributes.strength || 40
        ),
        Number(
            attributes.striking || 40
        ),
        Number(
            attributes.wrestling || 40
        ),
        Number(
            attributes.grappling || 40
        ),
        Number(
            attributes.cardio || 40
        ),
        Number(
            attributes.technique || 40
        ),
        Number(
            attributes.defense || 40
        ),
        Number(
            attributes.fightIQ || 40
        ),
        Number(
            attributes.chin || 40
        ),
        Number(
            attributes.offense || 40
        ),
        Number(
            attributes.blocking || 40
        )
    ];
    const average =
        values.reduce(
            function(total, value) {
                return total + value;
            },
            0
        ) / values.length;
    return Math.min(
        Number(
            player.potential || 90
        ),
        Math.round(
            average
        )
    );
}
/* =========================================================
   VERIFICAR DIA DA LUTA
========================================================= */
function isFightDay() {
    ensurePlayer();
    const fight =
        window.player.nextFight;
    if (!fight) {
        return false;
    }
    if (
        fight.status ===
        "fight_day"
    ) {
        return true;
    }
    if (
        typeof fight.weeksRemaining ===
        "number"
    ) {
        return (
            Number(
                fight.weeksRemaining
            ) <= 0
        );
    }
    if (
        typeof fight.fightWeek ===
        "number"
    ) {
        return (
            Number(
                window.player.week
            ) >=
            Number(
                fight.fightWeek
            )
        );
    }
    return false;
}
/* =========================================================
   LUTA AGENDADA
========================================================= */
function hasScheduledFight() {
    ensurePlayer();
    const fight =
        window.player.nextFight;
    if (!fight) {
        return false;
    }
    if (
        fight.status ===
        "completed"
    ) {
        return false;
    }
    return true;
}
/* =========================================================
   IDENTIFICAR LUTA CONCLUÍDA
========================================================= */
function isCompletedFight(fight) {
    if (!fight) {
        return false;
    }
    if (
        fight.status ===
        "completed"
    ) {
        return true;
    }
    if (
        fight.completed ===
        true
    ) {
        return true;
    }
    if (
        fight.result &&
        (
            fight.result === "win" ||
            fight.result === "loss" ||
            fight.result === "draw"
        ) &&
        fight.status !==
        "fight_day"
    ) {
        return true;
    }
    return false;
}
/* =========================================================
   LIBERAR LUTA ANTIGA
========================================================= */
function clearCompletedFight() {
    ensurePlayer();
    const player =
        window.player;
    if (!player.nextFight) {
        return false;
    }
    if (
        !isCompletedFight(
            player.nextFight
        )
    ) {
        return false;
    }
    player.lastFight =
        player.nextFight;
    player.nextFight =
        null;
    saveGame();
    console.log(
        "MMA LIFE: luta concluída liberada."
    );
    return true;
}
/* =========================================================
   PÓS-LUTA
========================================================= */
function startPostFightRecovery() {
    ensurePlayer();
    const player =
        window.player;
    if (
        Number(
            player.postFightRecoveryWeeks || 0
        ) > 0
    ) {
        return;
    }
    /*
       2–4 semanas.
       3 semanas é o resultado
       mais comum.
    */
    const roll =
        Math.random();
    let recoveryWeeks;
    if (roll < 0.25) {
        recoveryWeeks =
            2;
    }
    else if (roll < 0.75) {
        recoveryWeeks =
            3;
    }
    else {
        recoveryWeeks =
            4;
    }
    player.postFightRecoveryWeeks =
        recoveryWeeks;
    /*
       Depois da recuperação,
       existe uma pequena janela
       de matchmaking.
       Não significa que a luta
       aparecerá imediatamente.
    */
    player.matchmakingCooldownWeeks =
        2;
    player.nextFightSearchWeek =
        Number(
            player.week || 1
        ) +
        recoveryWeeks +
        2;
    player.careerStatus =
        "post_fight_recovery";
    player.log =
        player.log || [];
    player.log.unshift(
        `🛌 Pós-luta: ${recoveryWeeks} semanas de recuperação.`
    );
    saveGame();
    console.log(
        "MMA LIFE: recuperação iniciada.",
        recoveryWeeks
    );
}
/* =========================================================
   PROCESSAR RECUPERAÇÃO
========================================================= */
function processPostFightRecovery() {
    ensurePlayer();
    const player =
        window.player;
    let recovery =
        Number(
            player.postFightRecoveryWeeks || 0
        );
    let matchmaking =
        Number(
            player.matchmakingCooldownWeeks || 0
        );
    /* =====================================================
       RECUPERAÇÃO
    ===================================================== */
    if (recovery > 0) {
        recovery--;
        player.postFightRecoveryWeeks =
            recovery;
        player.careerStatus =
            "post_fight_recovery";
        player.health =
            Math.min(
                100,
                Number(
                    player.health || 100
                ) + 8
            );
        player.fatigue =
            Math.max(
                0,
                Number(
                    player.fatigue || 0
                ) - 20
            );
        return {
            recovery: true,
            matchmaking: false
        };
    }
    /* =====================================================
       PERÍODO ENTRE LUTAS
    ===================================================== */
    if (matchmaking > 0) {
        matchmaking--;
        player.matchmakingCooldownWeeks =
            matchmaking;
        player.careerStatus =
            "between_fights";
        player.health =
            Math.min(
                100,
                Number(
                    player.health || 100
                ) + 5
            );
        player.fatigue =
            Math.max(
                0,
                Number(
                    player.fatigue || 0
                ) - 12
            );
        return {
            recovery: false,
            matchmaking: true
        };
    }
    player.careerStatus =
        "available";
    return {
        recovery: false,
        matchmaking: false
    };
}
/* =========================================================
   PODE PROCURAR NOVA LUTA?
========================================================= */
function canSearchForNextFight() {
    ensurePlayer();
    const player =
        window.player;
    if (
        player.nextFight &&
        !isCompletedFight(
            player.nextFight
        )
    ) {
        return false;
    }
    if (
        Number(
            player.postFightRecoveryWeeks || 0
        ) > 0
    ) {
        return false;
    }
    if (
        Number(
            player.matchmakingCooldownWeeks || 0
        ) > 0
    ) {
        return false;
    }
    if (
        typeof player.nextFightSearchWeek ===
        "number" &&
        Number(player.week) <
        Number(player.nextFightSearchWeek)
    ) {
        return false;
    }
    return true;
}
/* =========================================================
   ESPAÇAMENTO REALISTA
========================================================= */
function getFightFrequencyLimit() {
    const roll =
        Math.random();
    /*
       12 semanas = ano movimentado
       14 semanas = comum
       16 semanas = comum
       18 semanas = mais espaçado
    */
    if (roll < 0.15) {
        return 12;
    }
    if (roll < 0.60) {
        return 14;
    }
    if (roll < 0.90) {
        return 16;
    }
    return 18;
}
/* =========================================================
   PREPARAR PRÓXIMA JANELA
========================================================= */
function prepareNextFightSearch() {
    ensurePlayer();
    const player =
        window.player;
    const spacing =
        getFightFrequencyLimit();
    player.nextFightSearchWeek =
        Number(
            player.week || 1
        ) +
        spacing;
    player.careerStatus =
        "between_fights";
    console.log(
        "MMA LIFE: próxima janela de busca:",
        player.nextFightSearchWeek
    );
}
/* =========================================================
   OFERTA DO EMPRESÁRIO
========================================================= */
function renderManagerOffer() {
    const player =
        window.player;
    if (
        !player.managerFightOffer
    ) {
        return "";
    }
    const offer =
        player.managerFightOffer;
    return `
        <div class="card manager-offer">
            <div class="title">
                📩 PROPOSTA DO EMPRESÁRIO
            </div>
            <p>
                Seu empresário encontrou
                uma oportunidade para você.
            </p>
            ${
                offer.eventName
                ?
                `
                    <div class="statline">
                        <span>
                            Evento
                        </span>
                        <b>
                            ${offer.eventName}
                        </b>
                    </div>
                `
                :
                ""
            }
            ${
                offer.opponentName
                ?
                `
                    <div class="statline">
                        <span>
                            Adversário
                        </span>
                        <b>
                            ${offer.opponentName}
                        </b>
                    </div>
                `
                :
                ""
            }
            ${
                typeof offer.purse ===
                "number"
                ?
                `
                    <div class="statline">
                        <span>
                            Bolsa
                        </span>
                        <b>
                            $${Math.round(
                                offer.purse
                            )}
                        </b>
                    </div>
                `
                :
                ""
            }
            ${
                typeof offer.winBonus ===
                "number"
                ?
                `
                    <div class="statline">
                        <span>
                            Bônus por vitória
                        </span>
                        <b>
                            $${Math.round(
                                offer.winBonus
                            )}
                        </b>
                    </div>
                `
                :
                ""
            }
            ${
                offer.campWeeks
                ?
                `
                    <div class="statline">
                        <span>
                            Camp
                        </span>
                        <b>
                            ${offer.campWeeks}
                            semanas
                        </b>
                    </div>
                `
                :
                ""
            }
            <button
                class="green"
                onclick="acceptManagerFightOffer()">
                ✅ ACEITAR LUTA
            </button>
            <button
                class="gray"
                onclick="declineManagerFightOffer()">
                ❌ RECUSAR
            </button>
        </div>
    `;
}
/* =========================================================
   CALENDÁRIO — UTILIDADES
========================================================= */
function getCalendarEvents() {
    const events = [];
    /*
       Mundo MMA
    */
    if (
        typeof window.mmaWorld !==
        "undefined"
    ) {
        const world =
            window.mmaWorld;
        /*
           Eventos disponíveis nesta semana.
        */
        if (
            Array.isArray(
                world.eventsThisWeek
            )
        ) {
            world.eventsThisWeek.forEach(
                function(event) {
                    if (!event) {
                        return;
                    }
                    events.push({
                        week:
                            event.week ||
                            world.week ||
                            window.player.week,
                        year:
                            event.year ||
                            window.player.year,
                        name:
                            event.name ||
                            event.eventName ||
                            "Evento MMA",
                        location:
                            event.location ||
                            event.city ||
                            event.country ||
                            "Local não definido",
                        type:
                            "world"
                    });
                }
            );
        }
        /*
           Alguns sistemas podem usar
           world.events ou world.calendar.
        */
        const possibleArrays = [
            world.events,
            world.calendar,
            world.upcomingEvents
        ];
        possibleArrays.forEach(
            function(list) {
                if (
                    !Array.isArray(list)
                ) {
                    return;
                }
                list.forEach(
                    function(event) {
                        if (!event) {
                            return;
                        }
                        events.push({
                            week:
                                event.week ||
                                event.eventWeek,
                            year:
                                event.year ||
                                event.eventYear ||
                                window.player.year,
                            name:
                                event.name ||
                                event.eventName ||
                                "Evento MMA",
                            location:
                                event.location ||
                                event.city ||
                                event.country ||
                                "Local não definido",
                            type:
                                "world"
                        });
                    }
                );
            }
        );
    }
    /*
       Remover duplicados.
    */
    const unique = [];
    events.forEach(
        function(event) {
            const key =
                `${event.year || ""}-` +
                `${event.week || ""}-` +
                `${event.name}`;
            if (
                !unique.some(
                    function(existing) {
                        return existing.key ===
                            key;
                    }
                )
            ) {
                unique.push({
                    ...event,
                    key: key
                });
            }
        }
    );
    return unique;
}
/* =========================================================
   CALENDÁRIO
========================================================= */
function calendarScreen() {
    ensurePlayer();
    const content =
        getContent();
    if (!content) {
        return;
    }
    const player =
        window.player;
    const fight =
        player.nextFight;
    const worldEvents =
        getCalendarEvents();
    const currentWeek =
        Number(
            player.week || 1
        );
    const currentYear =
        Number(
            player.year || 2026
        );
    let html = `
        <div class="card">
            <div class="title">
                📅 CALENDÁRIO DO MMA
            </div>
            <p>
                Acompanhe sua carreira,
                seus combates e os eventos
                que acontecem no mundo.
            </p>
        </div>
        <div class="card">
            <div class="title">
                🗓️ SUA SITUAÇÃO
            </div>
            <div class="statline">
                <span>
                    Ano
                </span>
                <b>
                    ${currentYear}
                </b>
            </div>
            <div class="statline">
                <span>
                    Semana
                </span>
                <b>
                    ${currentWeek} / 52
                </b>
            </div>
            <div class="statline">
                <span>
                    Status
                </span>
                <b>
                    ${
                        player.careerStatus ===
                        "post_fight_recovery"
                        ?
                        "🛌 Recuperação"
                        :
                        player.careerStatus ===
                        "between_fights"
                        ?
                        "⏳ Entre lutas"
                        :
                        player.careerStatus ===
                        "fight_scheduled"
                        ?
                        "🥊 Luta marcada"
                        :
                        "🟢 Disponível"
                    }
                </b>
            </div>
        </div>
    `;
    /*
       PRÓXIMA LUTA
    */
    if (fight) {
        const fightWeek =
            Number(
                fight.fightWeek ||
                (
                    currentWeek +
                    Number(
                        fight.weeksRemaining ||
                        0
                    )
                )
            );
        const opponent =
            fight.opponent
            ?
            (
                fight.opponent.displayName ||
                fight.opponent.name ||
                fight.opponentName ||
                "Adversário"
            )
            :
            (
                fight.opponentName ||
                "Adversário"
            );
        const eventName =
            fight.event
            ?
            (
                fight.event.name ||
                fight.event.eventName ||
                "Evento MMA"
            )
            :
            (
                fight.eventName ||
                "Evento MMA"
            );
        const location =
            fight.event
            ?
            (
                fight.event.location ||
                fight.event.city ||
                fight.location ||
                "Local não definido"
            )
            :
            (
                fight.location ||
                "Local não definido"
            );
        html += `
            <div class="card">
                <div class="title">
                    🥊 SUA PRÓXIMA LUTA
                </div>
                <div class="statline">
                    <span>
                        Evento
                    </span>
                    <b>
                        ${eventName}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Adversário
                    </span>
                    <b>
                        ${opponent}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Semana
                    </span>
                    <b>
                        ${fightWeek}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Local
                    </span>
                    <b>
                        ${location}
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="tab('fight')">
                    ⚔️ VER LUTA
                </button>
            </div>
        `;
    }
    /*
       RECUPERAÇÃO
    */
    if (
        Number(
            player.postFightRecoveryWeeks || 0
        ) > 0
    ) {
        html += `
            <div class="card">
                <div class="title">
                    🛌 PÓS-LUTA
                </div>
                <p>
                    Você está em período
                    de recuperação.
                </p>
                <div class="statline">
                    <span>
                        Recuperação restante
                    </span>
                    <b>
                        ${
                            player.postFightRecoveryWeeks
                        }
                        semana(s)
                    </b>
                </div>
            </div>
        `;
    }
    /*
       ENTRE LUTAS
    */
    else if (
        Number(
            player.matchmakingCooldownWeeks || 0
        ) > 0
    ) {
        html += `
            <div class="card">
                <div class="title">
                    ⏳ ENTRE LUTAS
                </div>
                <p>
                    Você está descansando
                    enquanto seu empresário
                    procura uma oportunidade.
                </p>
                <div class="statline">
                    <span>
                        Período restante
                    </span>
                    <b>
                        ${
                            player.matchmakingCooldownWeeks
                        }
                        semana(s)
                    </b>
                </div>
            </div>
        `;
    }
    /*
       EVENTOS DO MUNDO
    */
    html += `
        <div class="card">
            <div class="title">
                🌎 EVENTOS DO MUNDO
            </div>
    `;
    const futureEvents =
        worldEvents.filter(
            function(event) {
                const week =
                    Number(
                        event.week || 0
                    );
                const year =
                    Number(
                        event.year ||
                        currentYear
                    );
                if (
                    !week
                ) {
                    return true;
                }
                if (
                    year >
                    currentYear
                ) {
                    return true;
                }
                if (
                    year ===
                    currentYear &&
                    week >=
                    currentWeek
                ) {
                    return true;
                }
                return false;
            }
        );
    if (
        futureEvents.length === 0
    ) {
        html += `
            <p>
                Nenhum evento futuro
                disponível no calendário
                neste momento.
            </p>
        `;
    }
    else {
        /*
           Ordenar por ano e semana.
        */
        futureEvents.sort(
            function(a, b) {
                const yearA =
                    Number(
                        a.year ||
                        currentYear
                    );
                const yearB =
                    Number(
                        b.year ||
                        currentYear
                    );
                if (
                    yearA !==
                    yearB
                ) {
                    return yearA -
                        yearB;
                }
                return Number(
                    a.week || 0
                ) -
                Number(
                    b.week || 0
                );
            }
        );
        futureEvents
            .slice(0, 30)
            .forEach(
                function(event) {
                    html += `
                        <div class="statline">
                            <span>
                                ${event.name}
                            </span>
                            <b>
                                ${
                                    event.year ||
                                    currentYear
                                }
                                -
                                Semana
                                ${
                                    event.week ||
                                    "?"
                                }
                                ${
                                    event.location
                                    ?
                                    ` · ${event.location}`
                                    :
                                    ""
                                }
                            </b>
                        </div>
                    `;
                }
            );
    }
    html += `
        </div>
        <button
            class="gray"
            onclick="home()">
            ← VOLTAR PARA INÍCIO
        </button>
    `;
    content.innerHTML =
        html;
}
/* =========================================================
   HOME
========================================================= */
function home() {
    ensurePlayer();
    const content =
        getContent();
    if (!content) {
        return;
    }
    const player =
        window.player;
    const pro =
        player.professional ||
        {};
    const amateur =
        player.amateur ||
        {};
    const proRecord =
        `${pro.wins || 0}-` +
        `${pro.losses || 0}-` +
        `${pro.draws || 0}`;
    const amateurRecord =
        `${amateur.wins || 0}-` +
        `${amateur.losses || 0}-` +
        `${amateur.draws || 0}`;
    const fight =
        player.nextFight;
    const fightDay =
        isFightDay();
    const potential =
        Math.round(
            Number(
                player.potential || 90
            )
        );
    content.innerHTML = `
        ${renderManagerOffer()}
        <div class="card fighter-card">
            <div class="fighter-avatar">
                🥊
            </div>
            <div class="fighter-info">
                <h2>
                    ${player.name || "Lutador"}
                </h2>
                <p>
                    ${player.country || "Brasil"}
                </p>
                <p>
                    ${player.weight || "Peso Leve"}
                </p>
            </div>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <span>
                    IDADE
                </span>
                <strong>
                    ${player.age || 15}
                </strong>
            </div>
            <div class="stat-card">
                <span>
                    POTENCIAL
                </span>
                <strong>
                    ${potential}
                </strong>
            </div>
            <div class="stat-card">
                <span>
                    OVR
                </span>
                <strong>
                    ${getOverall()}
                </strong>
            </div>
            <div class="stat-card">
                <span>
                    FAMA
                </span>
                <strong>
                    ${Math.round(
                        player.fame || 0
                    )}
                </strong>
            </div>
            <div class="stat-card">
                <span>
                    DINHEIRO
                </span>
                <strong>
                    $${Math.round(
                        player.money || 0
                    )}
                </strong>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📅 CALENDÁRIO
            </div>
            <div class="statline">
                <span>
                    Ano
                </span>
                <b>
                    ${player.year || 2026}
                </b>
            </div>
            <div class="statline">
                <span>
                    Semana
                </span>
                <b>
                    ${player.week || 1} / 52
                </b>
            </div>
            ${
                Number(
                    player.postFightRecoveryWeeks || 0
                ) > 0
                ?
                `
                    <div class="statline">
                        <span>
                            Pós-luta
                        </span>
                        <b>
                            🛌 ${
                                player.postFightRecoveryWeeks
                            } semana(s)
                        </b>
                    </div>
                `
                :
                ""
            }
            ${
                Number(
                    player.matchmakingCooldownWeeks || 0
                ) > 0
                ?
                `
                    <div class="statline">
                        <span>
                            Entre lutas
                        </span>
                        <b>
                            ⏳ ${
                                player.matchmakingCooldownWeeks
                            } semana(s)
                        </b>
                    </div>
                `
                :
                ""
            }
            <button
                class="main-button"
                onclick="calendarScreen()">
                📅 ABRIR CALENDÁRIO
            </button>
        </div>
        ${
            fightDay
            ?
            `
                <div class="card fight-day-alert">
                    <div class="title">
                        🚨 DIA DA LUTA
                    </div>
                    <p>
                        Sua luta é hoje.
                        A semana está bloqueada.
                    </p>
                    <button
                        class="main-button"
                        onclick="fightScreen()">
                        👊 LUTAR AGORA
                    </button>
                </div>
            `
            :
            fight
            ?
            `
                <div class="card">
                    <div class="title">
                        🏋️ CAMP DE PREPARAÇÃO
                    </div>
                    <p>
                        Sua próxima luta está marcada.
                        Continue sua preparação.
                    </p>
                    ${
                        typeof fight.weeksRemaining ===
                        "number"
                        ?
                        `
                            <div class="statline">
                                <span>
                                    Faltam
                                </span>
                                <b>
                                    ${
                                        Math.max(
                                            0,
                                            fight.weeksRemaining
                                        )
                                    }
                                    semanas
                                </b>
                            </div>
                        `
                        :
                        ""
                    }
                    <button
                        class="main-button"
                        onclick="nextWeek()">
                        ⏭️ AVANÇAR SEMANA
                    </button>
                </div>
            `
            :
            `
                <div class="card">
                    <div class="title">
                        ⏭️ PRÓXIMA SEMANA
                    </div>
                    <button
                        class="main-button"
                        onclick="nextWeek()">
                        AVANÇAR SEMANA
                    </button>
                </div>
            `
        }
        <div class="card">
            <div class="title">
                ⚔️ PRÓXIMO COMBATE
            </div>
            ${
                fight
                ?
                `
                    <div class="statline">
                        <span>
                            Evento
                        </span>
                        <b>
                            ${
                                fight.event
                                ?
                                (
                                    fight.event.name ||
                                    fight.event.eventName ||
                                    "Evento MMA"
                                )
                                :
                                (
                                    fight.eventName ||
                                    "Evento MMA"
                                )
                            }
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Adversário
                        </span>
                        <b>
                            ${
                                fight.opponent
                                ?
                                (
                                    fight.opponent.displayName ||
                                    fight.opponent.name ||
                                    fight.opponentName ||
                                    "Adversário"
                                )
                                :
                                (
                                    fight.opponentName ||
                                    "Adversário"
                                )
                            }
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            OVR
                        </span>
                        <b>
                            ${
                                fight.opponent
                                ?
                                Number(
                                    fight.opponent.power ||
                                    fight.opponent.overall ||
                                    0
                                )
                                :
                                Number(
                                    fight.opponentOverall ||
                                    0
                                )
                            }
                        </b>
                    </div>
                    ${
                        typeof fight.weeksRemaining ===
                        "number"
                        ?
                        `
                            <div class="statline">
                                <span>
                                    Tempo
                                </span>
                                <b>
                                    ${
                                        fight.weeksRemaining <= 0
                                        ?
                                        "HOJE"
                                        :
                                        `${fight.weeksRemaining} semanas`
                                    }
                                </b>
                            </div>
                        `
                        :
                        ""
                    }
                    ${
                        fightDay
                        ?
                        `
                            <button
                                class="main-button"
                                onclick="fightScreen()">
                                👊 LUTAR AGORA
                            </button>
                        `
                        :
                        ""
                    }
                `
                :
                `
                    <p>
                        ${
                            Number(
                                player.postFightRecoveryWeeks || 0
                            ) > 0
                            ?
                            "🛌 Você está em recuperação pós-luta."
                            :
                            Number(
                                player.matchmakingCooldownWeeks || 0
                            ) > 0
                            ?
                            "⏳ Você está no período entre lutas. Seu empresário ainda está aguardando uma oportunidade."
                            :
                            player.professional &&
                            player.professional.active
                            ?
                            "📞 Seu empresário está procurando uma nova oportunidade."
                            :
                            "🥋 Aguardando sua próxima luta amadora."
                        }
                    </p>
                `
            }
        </div>
        <div class="card">
            <div class="title">
                🥊 CARREIRA
            </div>
            <div class="statline">
                <span>
                    Status
                </span>
                <b>
                    ${
                        player.professional &&
                        player.professional.active
                        ?
                        "Profissional"
                        :
                        "Amador"
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Amador
                </span>
                <b>
                    ${amateurRecord}
                </b>
            </div>
            <div class="statline">
                <span>
                    Profissional
                </span>
                <b>
                    ${proRecord}
                </b>
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
        <div class="card ranking-home-card">
            <div class="title">
                🏆 RANKING MUNDIAL
            </div>
            <p>
                Veja o Top 15 de cada categoria,
                campeões e os melhores lutadores
                do mundo.
            </p>
            <button
                class="main-button"
                onclick="openWorldRanking()">
                🌎 VER RANKING MUNDIAL
            </button>
        </div>
        <div class="card">
            <div class="title">
                🌎 MUNDO MMA
            </div>
            <p>
                Eventos e lutadores continuam
                evoluindo enquanto sua carreira
                avança.
            </p>
        </div>
        <div class="card">
            <div class="title">
                ⚙️ JOGO
            </div>
            <button
                type="button"
                class="main-button"
                onclick="window.resetGame()">
                🔄 REINICIAR CARREIRA
            </button>
        </div>
    `;
}
/* =========================================================
   RANKING
========================================================= */
function openWorldRanking() {
    showGame();
    if (
        typeof window.rankingScreen ===
        "function"
    ) {
        window.rankingScreen();
        return;
    }
    const content =
        getContent();
    if (content) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    🏆 RANKING MUNDIAL
                </div>
                <p>
                    O sistema de ranking não foi
                    carregado.
                </p>
                <button
                    class="main-button"
                    onclick="home()">
                    🏠 VOLTAR
                </button>
            </div>
        `;
    }
}
/* =========================================================
   NAVEGAÇÃO
========================================================= */
function tab(name) {
    showGame();
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    if (name === "home") {
        home();
        return;
    }
    if (name === "career") {
        career();
        return;
    }
    if (name === "train") {
        if (
            typeof window.training ===
            "function"
        ) {
            window.training();
        }
        return;
    }
    if (name === "fight") {
        if (
            typeof window.fightScreen ===
            "function"
        ) {
            window.fightScreen();
        }
        return;
    }
    if (name === "team") {
        if (
            typeof window.teamScreen ===
            "function"
        ) {
            window.teamScreen();
        }
        return;
    }
    if (name === "life") {
        if (
            typeof window.lifeScreen ===
            "function"
        ) {
            window.lifeScreen();
        }
        return;
    }
    if (name === "ranking") {
        openWorldRanking();
        return;
    }
    if (name === "calendar") {
        calendarScreen();
        return;
    }
}
/* =========================================================
   PRÓXIMA SEMANA
========================================================= */
function nextWeek() {
    ensurePlayer();
    const player =
        window.player;
    /* =====================================================
       DIA DA LUTA
    ===================================================== */
    if (
        isFightDay()
    ) {
        alert(
            "🚨 DIA DA LUTA! Você precisa realizar o combate antes de avançar a semana."
        );
        if (
            typeof window.fightScreen ===
            "function"
        ) {
            window.fightScreen();
        }
        return;
    }
    /* =====================================================
       PROTEÇÃO EXTRA
    ===================================================== */
    if (
        player.nextFight &&
        typeof player.nextFight.fightWeek ===
        "number" &&
        Number(player.week) >=
        Number(player.nextFight.fightWeek)
    ) {
        player.nextFight.status =
            "fight_day";
        player.nextFight.weeksRemaining =
            0;
        saveGame();
        alert(
            "🚨 Você chegou ao dia da luta! O avanço da semana está bloqueado."
        );
        if (
            typeof window.fightScreen ===
            "function"
        ) {
            window.fightScreen();
        }
        return;
    }
    /* =====================================================
       SE LUTA TERMINOU
    ===================================================== */
    if (
        player.nextFight &&
        isCompletedFight(
            player.nextFight
        )
    ) {
        player.lastFight =
            player.nextFight;
        player.nextFight =
            null;
        startPostFightRecovery();
    }
    /* =====================================================
       VIDA
    ===================================================== */
    if (
        typeof window.processLifeWeek ===
        "function"
    ) {
        try {
            window.processLifeWeek();
        }
        catch (error) {
            console.error(
                "Erro ao processar vida:",
                error
            );
        }
    }
    /* =====================================================
       MUNDO MMA
    ===================================================== */
    if (
        typeof window.simulateMMWorldWeek ===
        "function"
    ) {
        try {
            window.simulateMMWorldWeek();
        }
        catch (error) {
            console.error(
                "Erro ao simular Mundo MMA:",
                error
            );
        }
    }
    /* =====================================================
       TREINAMENTO
    ===================================================== */
    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
        ?
        player.trainingPlan.weeks[
            player.week
        ]
        :
        [];
    if (
        Array.isArray(plan)
    ) {
        plan.forEach(
            function(training) {
                const attribute =
                    training.attribute;
                if (!attribute) {
                    return;
                }
                const current =
                    Number(
                        player.attributes[
                            attribute
                        ] || 40
                    );
                const potential =
                    Number(
                        player.potential ||
                        90
                    );
                if (
                    current >=
                    potential
                ) {
                    return;
                }
                const gain =
                    Math.min(
                        Number(
                            training.gain ||
                            0.5
                        ),
                        potential -
                        current
                    );
                player.attributes[
                    attribute
                ] =
                    Number(
                        (
                            current +
                            gain
                        ).toFixed(2)
                    );
            }
        );
    }
    /* =====================================================
       RECUPERAÇÃO / DESCANSO
    ===================================================== */
    const recoveryState =
        processPostFightRecovery();
    /* =====================================================
       RECUPERAÇÃO NORMAL
    ===================================================== */
    if (
        !recoveryState.recovery
    ) {
        player.fatigue =
            Math.max(
                0,
                Number(
                    player.fatigue ||
                    0
                ) - 10
            );
        player.health =
            Math.min(
                100,
                Number(
                    player.health ||
                    100
                ) + 3
            );
    }
    /* =====================================================
       AVANÇAR SEMANA
    ===================================================== */
    player.week =
        Number(
            player.week ||
            1
        ) + 1;
    /* =====================================================
       CAMP
    ===================================================== */
    if (
        typeof window.processManagerCampWeek ===
        "function"
    ) {
        try {
            window.processManagerCampWeek();
        }
        catch (error) {
            console.error(
                "Erro ao processar camp:",
                error
            );
        }
    }
    /* =====================================================
       RECUPERAÇÃO DO SISTEMA DE LUTAS
    ===================================================== */
    if (
        typeof window.processFightRecovery ===
        "function"
    ) {
        try {
            window.processFightRecovery();
        }
        catch (error) {
            console.error(
                "Erro ao processar recuperação:",
                error
            );
        }
    }
    /* =====================================================
       EMPRESÁRIO
    ===================================================== */
    if (
        canSearchForNextFight()
    ) {
        if (
            typeof window.processManagerWeek ===
            "function"
        ) {
            try {
                window.processManagerWeek();
            }
            catch (error) {
                console.error(
                    "Erro ao processar empresário:",
                    error
                );
            }
        }
        if (
            !player.nextFight &&
            typeof window.processManagerFightOffer ===
            "function"
        ) {
            try {
                window.processManagerFightOffer();
            }
            catch (error) {
                console.error(
                    "Erro ao procurar luta:",
                    error
                );
            }
        }
        if (
            player.nextFight
        ) {
            player.careerStatus =
                "fight_scheduled";
            player.nextFightSearchWeek =
                null;
            player.matchmakingCooldownWeeks =
                0;
            console.log(
                "MMA LIFE: nova luta encontrada.",
                player.nextFight
            );
        }
    }
    /* =====================================================
       RANKING
    ===================================================== */
    if (
        typeof window.processRankingWeek ===
        "function"
    ) {
        try {
            window.processRankingWeek();
        }
        catch (error) {
            console.error(
                "Erro ao atualizar ranking:",
                error
            );
        }
    }
    /* =====================================================
       NOVO ANO
    ===================================================== */
    if (
        player.week > 52
    ) {
        player.week =
            1;
        player.year =
            Number(
                player.year ||
                2026
            ) + 1;
        player.age =
            Number(
                player.age ||
                15
            ) + 1;
        player.log =
            player.log || [];
        player.log.unshift(
            `🎆 Começou o Ano ${player.year}.`
        );
        if (
            typeof window.processManagerContractYear ===
            "function"
        ) {
            try {
                window.processManagerContractYear();
            }
            catch (error) {
                console.error(
                    "Erro ao processar contrato:",
                    error
                );
            }
        }
    }
    /* =====================================================
       SALVAR
    ===================================================== */
    saveGame();
    /* =====================================================
       HOME
    ===================================================== */
    home();
}
/* =========================================================
   DESCANSAR
========================================================= */
function rest() {
    ensurePlayer();
    const player =
        window.player;
    player.fatigue =
        Math.max(
            0,
            Number(
                player.fatigue ||
                0
            ) - 15
        );
    player.health =
        Math.min(
            100,
            Number(
                player.health ||
                100
            ) + 5
        );
    nextWeek();
}
/* =========================================================
   REINICIAR
========================================================= */
function resetGame() {
    const confirmed =
        confirm(
            "Apagar esta carreira e criar um novo lutador?"
        );
    if (!confirmed) {
        return;
    }
    localStorage.removeItem(
        "mmaLifePlayer"
    );
    window.player =
        createDefaultPlayer();
    if (
        typeof window.mmaWorld !==
        "undefined"
    ) {
        window.mmaWorld.initialized =
            false;
        window.mmaWorld.week =
            0;
        window.mmaWorld.fighters =
            [];
        window.mmaWorld.eventsThisWeek =
            [];
        window.mmaWorld.news =
            [];
        window.mmaWorld.championships =
            [];
    }
    const game =
        getElement("game");
    const tabs =
        getElement("tabs");
    if (game) {
        game.classList.add(
            "hidden"
        );
        game.style.display =
            "none";
    }
    if (tabs) {
        tabs.classList.add(
            "hidden"
        );
        tabs.style.display =
            "none";
    }
    const creation =
        getElement("creation");
    if (creation) {
        creation.classList.remove(
            "hidden"
        );
        creation.style.display =
            "block";
    }
    startGame();
}
/* =========================================================
   CARREIRA
========================================================= */
function career() {
    ensurePlayer();
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    const p =
        window.player;
    const amateur =
        p.amateur || {};
    const professional =
        p.professional || {};
    const careerStage =
        p.careerStage ||
        "amateur";
    const stageLabels = {
        amateur:
            "🥋 Amador",
        regional:
            "🏟️ Regional",
        national:
            "🇧🇷 Nacional",
        international:
            "🌎 Internacional",
        elite:
            "👑 Elite"
    };
    const stageLabel =
        stageLabels[
            careerStage
        ] ||
        "🥋 Amador";
    const contract =
        p.currentContract;
    const potential =
        Math.round(
            Number(
                p.potential ||
                90
            )
        );
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 CARREIRA
            </div>
            <p>
                Acompanhe sua trajetória
                no MMA.
            </p>
        </div>
        <div class="card">
            <div class="title">
                📈 STATUS
            </div>
            <div class="statline">
                <span>
                    Estágio
                </span>
                <b>
                    ${stageLabel}
                </b>
            </div>
            <div class="statline">
                <span>
                    Idade
                </span>
                <b>
                    ${p.age || 15} anos
                </b>
            </div>
            <div class="statline">
                <span>
                    Potencial
                </span>
                <b>
                    ${potential}
                </b>
            </div>
            <div class="statline">
                <span>
                    OVR
                </span>
                <b>
                    ${getOverall()}
                </b>
            </div>
            <div class="statline">
                <span>
                    Fama
                </span>
                <b>
                    ${Math.round(
                        p.fame || 0
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Dinheiro
                </span>
                <b>
                    $${Math.round(
                        p.money || 0
                    )}
                </b>
            </div>
        </div>
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
        </div>
        <div class="card">
            <div class="title">
                📄 CONTRATO ATUAL
            </div>
            ${
                contract &&
                contract.active
                ?
                `
                    <div class="statline">
                        <span>
                            Organização
                        </span>
                        <b>
                            ${contract.promotionName}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Lutas
                        </span>
                        <b>
                            ${
                                contract.fightsCompleted ||
                                0
                            }
                            /
                            ${
                                contract.fights ||
                                0
                            }
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Bolsa
                        </span>
                        <b>
                            $${Math.round(
                                contract.purse ||
                                0
                            )}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Bônus por vitória
                        </span>
                        <b>
                            $${Math.round(
                                contract.winBonus ||
                                0
                            )}
                        </b>
                    </div>
                `
                :
                `
                    <p>
                        Nenhum contrato
                        profissional ativo.
                    </p>
                `
            }
        </div>
        <div class="card">
            <div class="title">
                📅 CALENDÁRIO
            </div>
            <p>
                Consulte suas lutas,
                períodos de recuperação
                e eventos do mundo.
            </p>
            <button
                class="main-button"
                onclick="calendarScreen()">
                📅 ABRIR CALENDÁRIO
            </button>
        </div>
        <div class="card">
            <div class="title">
                🏆 OBJETIVO
            </div>
            <p>
                Comece no circuito amador,
                conquiste vitórias,
                torne-se profissional
                após cumprir os requisitos
                e busque os grandes títulos.
            </p>
        </div>
    `;
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.startGame =
    startGame;
window.openCharacterCreation =
    openCharacterCreation;
window.createNewPlayer =
    createNewPlayer;
window.home =
    home;
window.tab =
    tab;
window.nextWeek =
    nextWeek;
window.advanceWeek =
    nextWeek;
window.rest =
    rest;
window.resetGame =
    resetGame;
window.getOverall =
    getOverall;
window.saveGame =
    saveGame;
window.save =
    saveGame;
window.createPlayer =
    createNewPlayer;
window.createPlayerFromScreen =
    createNewPlayer;
window.career =
    career;
window.openWorldRanking =
    openWorldRanking;
window.isFightDay =
    isFightDay;
window.hasScheduledFight =
    hasScheduledFight;
window.isCompletedFight =
    isCompletedFight;
window.clearCompletedFight =
    clearCompletedFight;
window.startPostFightRecovery =
    startPostFightRecovery;
window.processPostFightRecovery =
    processPostFightRecovery;
window.canSearchForNextFight =
    canSearchForNextFight;
window.prepareNextFightSearch =
    prepareNextFightSearch;
window.getFightFrequencyLimit =
    getFightFrequencyLimit;
window.calendarScreen =
    calendarScreen;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
function initializeMmaLife() {
    const saved =
        localStorage.getItem(
            "mmaLifePlayer"
        );
    if (saved) {
        if (
            loadGame() &&
            window.player &&
            window.player.name
        ) {
            showGame();
            home();
            return;
        }
    }
    window.player =
        null;
    showCreation();
    startGame();
}
/* =========================================================
   DOM READY
========================================================= */
if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeMmaLife
    );
}
else {
    initializeMmaLife();
}
