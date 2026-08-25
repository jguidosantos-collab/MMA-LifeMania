function tab(name) {

    alert("TAB: " + name);

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


    /*
     * Verifica se a proposta ainda é válida.
     */

    if (
        !canReceiveOffer(
            promotion
        )
    ) {

        alert(
            "Essa oportunidade não está mais disponível."
        );

        return;

    }


    /*
     * Calcula a proposta financeira.
     */

    const offer =
        calculateContractOffer(
            promotion
        );


    /*
     * Guarda a organização atual.
     */

    player.currentPromotion =
        promotion;


    /*
     * Cria o contrato.
     */

    player.currentContract = {

        promotionId:
            promotion.id,

        promotionName:
            promotion.name,

        fights:
            offer.fights,

        fightsCompleted:
            0,

        purse:
            offer.purse,

        winBonus:
            offer.winBonus,

        active:
            true,

        contractNumber:
            1

    };


    /*
     * =====================================================
     * ATUALIZA O ESTÁGIO DA CARREIRA
     * =====================================================
     *
     * A promoção só acontece quando o contrato
     * é realmente assinado.
     */

    if (
        promotion.careerStage ===
        "regional"
    ) {

        player.careerStage =
            "regional";

    }


    if (
        promotion.careerStage ===
        "national"
    ) {

        player.careerStage =
            "national";


        player.log.unshift(

            "🇧🇷 Você entrou no circuito nacional."

        );

    }


    if (
        promotion.careerStage ===
        "international"
    ) {

        player.careerStage =
            "international";


        player.log.unshift(

            "🌎 Você chegou ao circuito internacional!"

        );

    }


    if (
        promotion.careerStage ===
        "elite"
    ) {

        player.careerStage =
            "elite";


        player.log.unshift(

            "👑 VOCÊ CHEGOU À ELITE DO MMA!"

        );

    }


    /*
     * Fama pela assinatura.
     */

    player.fame +=
        Math.max(
            1,
            Math.floor(
                (
                    promotion.prestige ||
                    0
                ) / 20
            )
        );


    /*
     * Registra no histórico.
     */

    if (
        typeof getPromotionHistory ===
        "function"
    ) {

        const history =
            getPromotionHistory(
                promotion.id
            );


        if (
            history
        ) {

            history.contracts =
                (
                    history.contracts ||
                    0
                ) + 1;

        }

    }


    /*
     * Mensagem.
     */

    alert(

        "✍️ CONTRATO ASSINADO!\n\n" +

        promotion.name +

        "\n\n" +

        "Lutas: " +
        offer.fights +

        "\n" +

        "Bolsa: $" +
        offer.purse +

        "\n" +

        "Bônus de vitória: $" +
        offer.winBonus

    );


    player.log.unshift(

        "✍️ Contrato assinado com " +
        promotion.name +
        " por " +
        offer.fights +
        " lutas."

    );


    save();


    career();

}
/* =========================
   CARREIRA
========================= */

function career() {

    initializeChampionship();


    const a =
        player.attributes || {};


    const title =
        player.championship &&
        player.championship.title
        ?
        player.championship.title
        :
        "Nenhum";


    /*
     * Gera as oportunidades disponíveis.
     */

    let offers = [];


    if (
        typeof generateContractOffers ===
        "function"
    ) {

        offers =
            generateContractOffers();

    }


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
                    Estágio
                </span>

                <b>
                    ${
                        player.careerStage
                        ||
                        "regional"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Ranking
                </span>

                <b>
                    ${
                        typeof rankingText ===
                        "function"
                        ?
                        rankingText()
                        :
                        "Sem ranking"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Vitórias
                </span>

                <b>
                    ${
                        player.professional
                        ?
                        player.professional.wins
                        :
                        0
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Derrotas
                </span>

                <b>
                    ${
                        player.professional
                        ?
                        player.professional.losses
                        :
                        0
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Fama
                </span>

                <b>
                    ${Math.round(player.fame || 0)}
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
                    ${
                        player.championship
                        ?
                        player.championship.defenses
                        :
                        0
                    }
                </b>

            </div>

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

                            <div class="title">
                                ${offer.promotion.name}
                            </div>


                            <div class="statline">

                                <span>
                                    País
                                </span>

                                <b>
                                    ${
                                        offer.promotion.country
                                    }
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Nível
                                </span>

                                <b>
                                    ${
                                        offer.promotion.careerStage
                                        ||
                                        "Profissional"
                                    }
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Prestígio
                                </span>

                                <b>
                                    ${
                                        offer.promotion.prestige
                                    }
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Lutas
                                </span>

                                <b>
                                    ${
                                        offer.fights
                                    }
                                </b>

                            </div>


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


                            <div class="statline">

                                <span>
                                    Bônus de vitória
                                </span>

                                <b>
                                    $${Math.round(
                                        offer.winBonus
                                    )}
                                </b>

                            </div>


                            <button
                                class="green"
                                onclick="
                                    acceptPromotion(
                                        ${offer.promotion.id}
                                    )
                                ">

                                ✍️ ACEITAR CONTRATO

                            </button>

                        </div>

                        `

                    )
                    .join("")
            }

        </div>


        ${
            player.currentContract &&
            player.currentContract.active

            ?

            `

            <div class="card">

                <div class="title">
                    📑 CONTRATO ATUAL
                </div>


                <div class="statline">

                    <span>
                        Organização
                    </span>

                    <b>
                        ${
                            player.currentContract
                                .promotionName
                        }
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Lutas contratadas
                    </span>

                    <b>
                        ${
                            player.currentContract
                                .fights
                        }
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Lutas realizadas
                    </span>

                    <b>
                        ${
                            player.currentContract
                                .fightsCompleted
                        }
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Bolsa
                    </span>

                    <b>
                        $${Math.round(
                            player.currentContract.purse
                        )}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Bônus de vitória
                    </span>

                    <b>
                        $${Math.round(
                            player.currentContract.winBonus
                        )}
                    </b>

                </div>

            </div>

            `

            :

            ""

        }

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
