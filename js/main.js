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

function career() {

    const a =
        player.attributes;


    document
        .getElementById("content")
        .innerHTML = `

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

                ⚔️ LUTAS

            </div>


            ${
                player.nextFight

                ?

                `

                <div class="statline">

                    <span>
                        Adversário
                    </span>

                    <b>
                        ${player.nextFight.name}
                    </b>

                </div>


                <button
                    onclick="fight()">

                    🔥 LUTAR

                </button>

                `

                :

                `

                <button
                    onclick="findFight()">

                    🔎 PROCURAR ADVERSÁRIO

                </button>

                `

            }

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

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">

                ❤️ VIDA

            </div>


            <div class="statline">

                <span>
                    Status
                </span>

                <b>
                    ${player.relationship}
                </b>

            </div>


            ${
                player.relationship ===
                "Solteiro"

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
                player.relationship ===
                "Namorando"

                ?

                `

                <button
                    onclick="dating()">

                    💍 CASAR

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

                    👶 TER FILHO

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

                                ${child.age}
                                anos

                            </b>

                        </div>

                        `

                    )
                    .join("")

                :

                "Nenhum filho ainda."

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
