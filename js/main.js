function tab(name) {

    if (name === "home") {

        home();

    }

    if (name === "career") {

        career();

    }

    if (name === "train") {

        training();

    }

    if (name === "fight") {

        fightScreen();

    }

    if (name === "team") {

        teamScreen();

    }

    if (name === "life") {

        familyScreen();

    }

}


/* =========================
   COMEÇAR JOGO
========================= */

function startGame() {

    const name =
        document
            .getElementById("playerName")
            .value
            .trim();


    if (!name) {

        alert(
            "Digite o nome do lutador."
        );

        return;

    }


    createPlayer();


    player.name =
        name;


    player.country =
        document
            .getElementById("country")
            .value;


    player.weight =
        document
            .getElementById("weight")
            .value;


    player.style =
        document
            .getElementById("style")
            .value;


    generateTeamOffers();

    generateManagerOffers();


    save();


    document
        .getElementById("creation")
        .classList
        .add("hidden");


    document
        .getElementById("game")
        .classList
        .remove("hidden");


    document
        .getElementById("tabs")
        .classList
        .remove("hidden");


    home();

}

/* =========================
   VIRAR PROFISSIONAL
========================= */

function turnProfessional() {

    if (player.age < 18) {

        alert(
            "Você precisa ter 18 anos para se tornar profissional."
        );

        return;

    }


    if (player.professional.active) {

        alert(
            "Você já é profissional."
        );

        return;

    }


    /*
     * Ativa a carreira profissional
     */

    player.professional.active = true;


    /*
     * Todo lutador começa
     * obrigatoriamente no Regional.
     */

    player.careerStage = "regional";


    /*
     * Garante que não exista
     * uma promoção grande selecionada
     * antes da hora.
     */

    player.currentPromotion = null;


    /*
     * Mensagem no histórico
     */

    player.log.unshift(
        "🥊 Você se tornou profissional e começou no circuito regional."
    );


    save();


    alert(
        "🥊 Parabéns!\n\n" +
        "Você agora é um lutador profissional.\n\n" +
        "Sua carreira começa no circuito REGIONAL."
    );


    home();

}

/* =========================
   TELA INICIAL
========================= */

function home() {

    const p =
        player.professional;


    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">

                🥊 ${player.name}

            </div>


            <div class="statline">

                <span>Idade</span>

                <b>${player.age}</b>

            </div>


            <div class="statline">

                <span>País</span>

                <b>${player.country}</b>

            </div>


            <div class="statline">

                <span>Categoria</span>

                <b>${player.weight}</b>

            </div>


            <div class="statline">

                <span>Estilo</span>

                <b>${player.style}</b>

            </div>


            <div class="statline">

                <span>Dinheiro</span>

                <b>
                    $${Math.round(player.money)}
                </b>

            </div>


            <div class="statline">

                <span>Fama</span>

                <b>
                    ${Math.round(player.fame)}
                </b>

            </div>


            <div class="statline">

                <span>Amador</span>

                <b>

                    ${player.amateur.wins}
                    -
                    ${player.amateur.losses}
                    -
                    ${player.amateur.draws}

                </b>

            </div>


            <div class="statline">

                <span>Profissional</span>

                <b>

                    ${p.wins}
                    -
                    ${p.losses}
                    -
                    ${p.draws}

                </b>

            </div>


            <div class="statline">

                <span>Saúde</span>

                <b>
                    ${Math.round(player.health)}%
                </b>

            </div>


            <div class="statline">

                <span>Fadiga</span>

                <b>
                    ${Math.round(player.fatigue)}%
                </b>

            </div>


            <button
                onclick="advanceWeek()">

                ⏩ AVANÇAR 1 SEMANA

<button
    class="gray"
    onclick="resetGame()">

    🔄 REINICIAR JOGO

</button>

            </button>


            ${
                player.age >= 18 &&
                !p.active

                ?

                `
                <button
                    class="green"
                    onclick="turnProfessional()">

                    🏆 VIRAR PROFISSIONAL

                </button>
                `

                :

                ""

            }

        </div>

        `;

}


/* =========================
   CARREIRA
========================= */

function acceptPromotion(id) {

    const promotion =
        promotions.find(
            p => p.id === id
        );


    if (!promotion) {

        return;

    }


    player.currentPromotion =
        promotion;


    player.log.unshift(

        "✍️ Contrato assinado com " +
        promotion.name

    );


    player.fame += 2;


    save();

    career();

}

function career() {
    
    initializeChampionship();


    const a =
        player.attributes;


    const title =
        player.championship.title
        ||
        "Nenhum";


    const offers = [];


    document
        .getElementById("content")
        .innerHTML = `

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
                        player.professional.active
                        ? "Profissional"
                        : "Amador"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Ranking
                </span>

                <b>
                    ${rankingText()}
                </b>

            </div>


            <div class="statline">

                <span>
                    Vitórias
                </span>

                <b>
                    ${player.professional.wins}
                </b>

            </div>


            <div class="statline">

                <span>
                    Derrotas
                </span>

                <b>
                    ${player.professional.losses}
                </b>

            </div>


            <div class="statline">

                <span>
                    Fama
                </span>

                <b>
                    ${Math.round(player.fame)}
                </b>

            </div>


            <div class="statline">

                <span>
                    Cinturão
                </span>

                <b>
                    ${title}
                </b>

            </div>


            <div class="statline">

                <span>
                    Defesas
                </span>

                <b>
                    ${player.championship.defenses}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                📈 ATRIBUTOS
            </div>


            ${
                Object
                    .entries(a)
                    .map(

                        ([key, value]) => `

                        <div class="statline">

                            <span>
                                ${key}
                            </span>

                            <b>
                                ${value.toFixed(1)}
                            </b>

                        </div>

                        `

                    )
                    .join("")
            }

        </div>


        <div class="card">

            <div class="title">
                📄 OPORTUNIDADES
            </div>


            ${
                offers.length === 0

                ?

                `
                <p>
                    Nenhuma organização está
                    oferecendo contrato no momento.
                </p>
                `

                :

                offers
                    .map(

                        offer => `

                        <div class="card">

                            <b>
                                ${offer.promotion.name}
                            </b>

                            <div class="statline">

                                <span>
                                    Prestígio
                                </span>

                                <b>
                                    ${offer.promotion.prestige}
                                </b>

                            </div>

                            <div class="statline">

                                <span>
                                    Bolsa
                                </span>

                                <b>
                                    $${offer.purse}
                                </b>

                            </div>

                            <button
                                onclick="
                                    acceptPromotion(
                                        ${offer.promotion.id}
                                    )
                                ">

                                ✍️ ACEITAR

                            </button>

                        </div>

                        `

                    )
                    .join("")
            }

        </div>

        `;

}


/* =========================
   TREINAMENTO
========================= */

function training() {

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">

                🏋️ TREINAMENTO

            </div>


            <div class="statline">

                <span>
                    Fadiga
                </span>

                <b>
                    ${Math.round(player.fatigue)}%
                </b>

            </div>


            <div class="statline">

                <span>
                    Saúde
                </span>

                <b>
                    ${Math.round(player.health)}%
                </b>

            </div>


            <button
                onclick="train('strength')">

                💪 Força

            </button>


            <button
                onclick="train('striking')">

                👊 Striking

            </button>


            <button
                onclick="train('wrestling')">

                🤼 Wrestling

            </button>


            <button
                onclick="train('grappling')">

                🥋 Grappling

            </button>


            <button
                onclick="train('cardio')">

                🏃 Cardio

            </button>


            <button
                onclick="train('technique')">

                🎯 Técnica

            </button>


            <button
                class="gray"
                onclick="rest()">

                😴 Descansar

            </button>

        </div>

        `;

}


/* =========================
   LUTAS
========================= */

function fightScreen() {

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                ⚔️ PRÓXIMA LUTA
            </div>

            ${
                player.nextFight

                ?

                `

                <div class="statline">

                    <span>Evento</span>

                    <b>
                        ${player.nextFight.event.name}
                    </b>

                </div>

                <div class="statline">

                    <span>Adversário</span>

                    <b>
                        ${player.nextFight.opponent.displayName}
                    </b>

                </div>

                <div class="statline">

                    <span>Nacionalidade</span>

                    <b>
                        ${player.nextFight.opponent.country}
                    </b>

                </div>

                <div class="statline">

                    <span>Força estimada</span>

                    <b>
                        ${Math.round(
                            player.nextFight.opponent.power
                        )}
                    </b>

                </div>

                <div class="statline">

                    <span>Bolsa</span>

                    <b>
                        $${player.nextFight.purse}
                    </b>

                </div>

                <button
                    class="green"
                    onclick="fight()">

                    🔥 LUTAR AGORA

                </button>

                `

                :

                `

                <p>
                    Nenhuma luta marcada.
                </p>

                <button
                    onclick="findFight()">

                    🔎 PROCURAR ADVERSÁRIO

                </button>

                `

            }

        </div>

        <div class="card">

            <div class="title">
                🏆 RANKING
            </div>

            <div class="statline">

                <span>
                    Posição
                </span>

                <b>
                    ${rankingText()}
                </b>

            </div>

        </div>

        `;

}


/* =========================
   EQUIPE
========================= */

function teamScreen() {

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">

                🏢 EQUIPE E EMPRESÁRIO

            </div>


            <div class="statline">

                <span>
                    Equipe
                </span>

                <b>

                    ${
                        player.team
                        ?
                        player.team.name
                        :
                        "Nenhuma"
                    }

                </b>

            </div>


            <div class="statline">

                <span>
                    Empresário
                </span>

                <b>

                    ${
                        player.manager
                        ?
                        player.manager.name
                        :
                        "Nenhum"
                    }

                </b>

            </div>


            <button
                onclick="
                    generateTeamOffers();
                    teamScreen();
                ">

                🏢 NOVAS ACADEMIAS

            </button>


            <button
                class="gray"
                onclick="
                    generateManagerOffers();
                    teamScreen();
                ">

                👔 NOVOS EMPRESÁRIOS

            </button>


            ${
                (player.teamOffers || [])
                    .map(

                        (team, index) => `

                        <button
                            class="blue"
                            onclick="
                                joinTeam(${index})
                            ">

                            ${team.name}

                            — Qualidade:
                            ${team.quality}

                        </button>

                        `

                    )
                    .join("")

            }


            ${
                (player.managerOffers || [])
                    .map(

                        (manager, index) => `

                        <button
                            class="gray"
                            onclick="
                                hireManager(${index})
                            ">

                            ${manager.name}

                            —
                            ${manager.level}

                        </button>

                        `

                    )
                    .join("")

            }

        </div>

        `;

}


/* =========================
   VIDA / FAMÍLIA
========================= */

function familyScreen() {

    const adult =
        player.age >= 18;


    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                ❤️ VIDA
            </div>


            <div class="statline">

                <span>Idade</span>

                <b>
                    ${player.age}
                </b>

            </div>


            <div class="statline">

                <span>Status</span>

                <b>
                    ${player.relationship}
                </b>

            </div>


            <div class="statline">

                <span>Dinheiro</span>

                <b>
                    $${Math.round(player.money)}
                </b>

            </div>


            ${
                !adult

                ?

                `

                <div class="card">

                    🔒 Vida familiar liberada
                    aos 18 anos.

                </div>

                `

                :

                ""

            }


            ${
                adult &&
                player.relationship === "Solteiro"

                ?

                `

                <button
                    onclick="dating()">

                    ❤️ COMEÇAR RELACIONAMENTO

                </button>

                `

                :

                ""

            }


            ${
                adult &&
                player.relationship === "Namorando"

                ?

                `

                <button
                    onclick="dating()">

                    💍 CASAR — $500

                </button>

                `

                :

                ""

            }


            ${
                player.married

                ?

                `

                <button
                    class="green"
                    onclick="haveChild()">

                    👶 TER FILHO — $1.000

                </button>

                `

                :

                ""

            }

        </div>


        <div class="card">

            <div class="title">

                👑 DINASTIA

            </div>


            <div class="statline">

                <span>
                    Geração
                </span>

                <b>
                    ${
                        player.children.length > 0
                        ? "2ª geração"
                        : "1ª geração"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Filhos
                </span>

                <b>
                    ${player.children.length}/5
                </b>

            </div>


            ${
                player.children.length > 0

                ?

                player.children
                    .map(

                        child => `

                        <div class="statline">

                            <span>
                                👶 ${child.name}
                            </span>

                            <b>
                                ${child.age} anos
                            </b>

                        </div>

                        `

                    )
                    .join("")

                :

                `
                <p>
                    Sua dinastia ainda não começou.
                </p>
                `

            }

        </div>

        `;

}

/* =========================
   CRIAÇÃO DO LUTADOR
========================= */

function initCreation() {

    document
        .getElementById("creator")
        .innerHTML = `

        <div class="card">

            <div class="title">

                🥊 CRIAR LUTADOR

            </div>


            <input
                id="playerName"
                placeholder="Nome do lutador"
            >


            <select id="country">

                <option>
                    Brasil
                </option>

                <option>
                    Estados Unidos
                </option>

                <option>
                    Japão
                </option>

                <option>
                    México
                </option>

                <option>
                    Argentina
                </option>

                <option>
                    Canadá
                </option>

                <option>
                    Rússia
                </option>

                <option>
                    Reino Unido
                </option>

            </select>


            <select id="weight">

                <option>
                    Peso Leve
                </option>

                <option>
                    Peso Meio-Médio
                </option>

                <option>
                    Peso Médio
                </option>

                <option>
                    Peso Meio-Pesado
                </option>

                <option>
                    Peso Pesado
                </option>

            </select>


            <select id="style">

                <option>
                    Completo
                </option>

                <option>
                    Striker
                </option>

                <option>
                    Wrestler
                </option>

                <option>
                    Grappler
                </option>

            </select>


            <button
                class="green"
                onclick="startGame()">

                ✅ COMEÇAR CARREIRA

            </button>

        </div>

        `;

}


/* =========================
   INICIALIZAÇÃO
========================= */

initCreation();

load();
