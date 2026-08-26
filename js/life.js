/* =========================================================
   MMA LIFE DYNASTY
   LIFE.JS
   VIDA + RELACIONAMENTO + CASAMENTO + FILHOS
========================================================= */


/* =========================================================
   UTILIDADES
========================================================= */

function lifePlayer() {

    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {
        return null;
    }

    return window.player;
}


function lifeSave() {

    if (typeof window.saveGame === "function") {
        window.saveGame();
    }
    else if (typeof window.save === "function") {
        window.save();
    }
}


function ensureLifeData() {

    const p = lifePlayer();

    if (!p) {
        return null;
    }


    /* RELACIONAMENTO */

    if (!p.relationship) {
        p.relationship = "Solteiro";
    }

    if (
        typeof p.relationshipLevel !== "number"
    ) {
        p.relationshipLevel = 0;
    }

    if (!p.partner) {
        p.partner = null;
    }

    if (typeof p.married !== "boolean") {
        p.married = false;
    }


    /* FAMÍLIA */

    if (!Array.isArray(p.children)) {
        p.children = [];
    }


    /* GESTAÇÃO */

    if (
        typeof p.pregnancy === "undefined"
    ) {
        p.pregnancy = null;
    }


    /* ÁRVORE */

    if (!Array.isArray(p.familyTree)) {
        p.familyTree = [];
    }


    /* DESPESAS */

    if (
        typeof p.familyExpenses !== "number"
    ) {
        p.familyExpenses = 0;
    }


    return p;
}


/* =========================================================
   MENSAGEM
========================================================= */

function lifeMessage(message) {

    alert(message);

    lifeScreen();
}


/* =========================================================
   VIDA PRINCIPAL
========================================================= */

function lifeScreen() {

    const p = ensureLifeData();

    if (!p) {
        return;
    }


    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }


    const children =
        Array.isArray(p.children)
            ? p.children
            : [];


    let pregnancyText =
        "Nenhuma gestação";


    if (p.pregnancy) {

        pregnancyText =
            `🤰 ${p.pregnancy.weeks}/40 semanas`;

    }


    content.innerHTML = `

        <div class="card">

            <div class="title">
                ❤️ VIDA
            </div>

            <p>
                Sua vida fora do octógono.
            </p>

        </div>


        <div class="card">

            <div class="title">
                👤 VIDA PESSOAL
            </div>

            <div class="statline">
                <span>Idade</span>
                <b>${p.age || 15} anos</b>
            </div>

            <div class="statline">
                <span>Dinheiro</span>
                <b>$${Math.round(p.money || 0)}</b>
            </div>

            <div class="statline">
                <span>Fama</span>
                <b>${Math.round(p.fame || 0)}</b>
            </div>

        </div>


        <div class="card">

            <div class="title">
                💕 RELACIONAMENTO
            </div>

            <div class="statline">

                <span>
                    Status
                </span>

                <b>
                    ${p.relationship}
                </b>

            </div>


            <div class="statline">

                <span>
                    Parceiro(a)
                </span>

                <b>
                    ${p.partner || "Nenhum"}
                </b>

            </div>


            <div class="statline">

                <span>
                    Relacionamento
                </span>

                <b>
                    ${Math.round(
                        p.relationshipLevel
                    )}/100 ❤️
                </b>

            </div>


            ${
                p.relationship === "Solteiro"

                ?

                `

                <button
                    class="main-button"
                    onclick="meetPartner()">

                    💕 CONHECER ALGUÉM

                </button>

                `

                :

                `

                <button
                    class="main-button"
                    onclick="relationshipDate()">

                    🍽️ SAIR EM UM ENCONTRO

                </button>


                <button
                    class="main-button"
                    onclick="relationshipGift()">

                    💐 DAR PRESENTE

                </button>

                `
            }


            ${
                p.relationship === "Namorando" &&
                p.relationshipLevel >= 70

                ?

                `

                <button
                    class="main-button"
                    onclick="proposeMarriage()">

                    💍 PEDIR EM CASAMENTO

                </button>

                `

                :

                ""
            }


            ${
                p.relationship === "Noivo(a)"

                ?

                `

                <button
                    class="main-button"
                    onclick="marryPartner()">

                    💒 REALIZAR CASAMENTO

                </button>

                `

                :

                ""
            }


            ${
                p.relationship !== "Solteiro"

                ?

                `

                <button
                    class="gray"
                    onclick="breakUp()">

                    💔 TERMINAR RELACIONAMENTO

                </button>

                `

                :

                ""
            }

        </div>


        <div class="card">

            <div class="title">
                💒 CASAMENTO
            </div>

            <div class="statline">

                <span>
                    Estado civil
                </span>

                <b>
                    ${
                        p.married
                            ? "Casado(a)"
                            : "Solteiro(a)"
                    }
                </b>

            </div>


            ${
                p.married

                ?

                `

                <div class="statline">

                    <span>
                        Cônjuge
                    </span>

                    <b>
                        ${p.partner || "Nenhum"}
                    </b>

                </div>

                `

                :

                `

                <p>
                    Construa um relacionamento
                    antes de formar sua família.
                </p>

                `
            }

        </div>


        <div class="card">

            <div class="title">
                👶 FAMÍLIA
            </div>

            <div class="statline">

                <span>
                    Filhos
                </span>

                <b>
                    ${children.length}
                </b>

            </div>


            <div class="statline">

                <span>
                    Gestação
                </span>

                <b>
                    ${pregnancyText}
                </b>

            </div>


            ${
                p.married && !p.pregnancy

                ?

                `

                <button
                    class="main-button"
                    onclick="startPregnancy()">

                    👶 TENTAR TER UM FILHO

                </button>

                `

                :

                ""
            }


            ${
                p.pregnancy

                ?

                `

                <p>
                    A gestação avança
                    automaticamente a cada semana.
                </p>

                `

                :

                ""
            }

        </div>


        <div class="card">

            <div class="title">
                💰 DESPESAS FAMILIARES
            </div>

            <div class="statline">

                <span>
                    Total gasto
                </span>

                <b>
                    $${Math.round(
                        p.familyExpenses || 0
                    )}
                </b>

            </div>

            <p>
                Relacionamentos, casamento
                e filhos geram despesas
                ao longo da sua vida.
            </p>

        </div>


        <div class="card">

            <div class="title">
                🌳 ÁRVORE GENEALÓGICA
            </div>

            <p>
                Acompanhe sua família
                e construa sua dinastia.
            </p>


            <button
                class="main-button"
                onclick="familyTreeScreen()">

                🌳 VER ÁRVORE GENEALÓGICA

            </button>

        </div>


        <div class="card">

            <div class="title">
                🧬 LEGADO
            </div>

            <p>
                Seus filhos poderão continuar
                sua história no futuro.
            </p>

        </div>

    `;
}


/* =========================================================
   CONHECER ALGUÉM
========================================================= */

function meetPartner() {

    const p = ensureLifeData();

    if (!p) return;


    const names = [

        "Maria",
        "Ana",
        "Julia",
        "Laura",
        "Beatriz",
        "Camila",
        "Sofia",
        "Mariana",
        "Isabela",
        "Gabriela"

    ];


    const name =
        names[
            Math.floor(
                Math.random() * names.length
            )
        ];


    p.partner = name;

    p.relationship =
        "Conhecendo";


    p.relationshipLevel = 20;


    lifeSave();

    lifeScreen();
}


/* =========================================================
   ENCONTRO
========================================================= */

function relationshipDate() {

    const p = ensureLifeData();

    if (!p) return;


    const cost = 150;


    if ((p.money || 0) < cost) {

        lifeMessage(
            "Você não tem dinheiro suficiente para o encontro."
        );

        return;
    }


    p.money -= cost;

    p.familyExpenses += cost;

    p.relationshipLevel =
        Math.min(
            100,
            p.relationshipLevel + 5
        );


    if (
        p.relationship === "Conhecendo" &&
        p.relationshipLevel >= 30
    ) {

        p.relationship =
            "Namorando";

    }


    lifeSave();

    lifeScreen();
}


/* =========================================================
   PRESENTE
========================================================= */

function relationshipGift() {

    const p = ensureLifeData();

    if (!p) return;


    const cost = 200;


    if ((p.money || 0) < cost) {

        lifeMessage(
            "Você não tem dinheiro suficiente para comprar o presente."
        );

        return;
    }


    p.money -= cost;

    p.familyExpenses += cost;


    p.relationshipLevel =
        Math.min(
            100,
            p.relationshipLevel + 7
        );


    lifeSave();

    lifeScreen();
}


/* =========================================================
   PEDIDO DE CASAMENTO
========================================================= */

function proposeMarriage() {

    const p = ensureLifeData();

    if (!p) return;


    if (
        p.relationship !== "Namorando" ||
        p.relationshipLevel < 70
    ) {

        lifeMessage(
            "O relacionamento ainda não está pronto para um pedido de casamento."
        );

        return;
    }


    p.relationship =
        "Noivo(a)";


    p.relationshipLevel =
        Math.min(
            100,
            p.relationshipLevel + 5
        );


    lifeSave();

    lifeScreen();
}


/* =========================================================
   CASAMENTO
========================================================= */

function marryPartner() {

    const p = ensureLifeData();

    if (!p) return;


    const cost = 5000;


    if ((p.money || 0) < cost) {

        lifeMessage(
            "Você precisa de $5.000 para realizar o casamento."
        );

        return;
    }


    p.money -= cost;

    p.familyExpenses += cost;


    p.relationship =
        "Casado(a)";


    p.married = true;


    p.relationshipLevel =
        Math.min(
            100,
            p.relationshipLevel + 10
        );


    lifeSave();

    lifeScreen();
}


/* =========================================================
   TERMINAR
========================================================= */

function breakUp() {

    const p = ensureLifeData();

    if (!p) return;


    if (p.married) {

        lifeMessage(
            "Você é casado(a). O divórcio será implementado em uma atualização futura."
        );

        return;
    }


    p.relationship =
        "Solteiro";


    p.partner =
        null;


    p.relationshipLevel =
        0;


    lifeSave();

    lifeScreen();
}


/* =========================================================
   INICIAR GESTAÇÃO
========================================================= */

function startPregnancy() {

    const p = ensureLifeData();

    if (!p) return;


    if (!p.married) {

        lifeMessage(
            "Você precisa estar casado(a) para ter um filho."
        );

        return;
    }


    if (p.pregnancy) {

        lifeMessage(
            "Já existe uma gestação em andamento."
        );

        return;
    }


    p.pregnancy = {

        weeks: 0,

        mother: p.partner || "Parceira",

        startedYear: p.year,

        startedWeek: p.week

    };


    lifeSave();

    lifeScreen();
}


/* =========================================================
   NASCIMENTO
========================================================= */

function createChild() {

    const p = ensureLifeData();

    if (!p) return;


    const names = [

        "Lucas",
        "Miguel",
        "Arthur",
        "Gabriel",
        "Rafael",
        "João",
        "Pedro",
        "Davi",
        "Enzo",
        "Matheus",
        "Alice",
        "Helena",
        "Laura",
        "Sophia",
        "Valentina"

    ];


    const name =
        names[
            Math.floor(
                Math.random() * names.length
            )
        ];


    const child = {

        id:
            Date.now(),

        name:
            name,

        age:
            0,

        weeks:
            0,

        generation:
            2,

        father:
            p.name || "Pai",

        mother:
            p.partner || "Mãe",

        relationship:
            50,

        potential:
            Math.floor(
                Math.random() * 13
            ) + 78,

        overall:
            Math.floor(
                Math.random() * 11
            ) + 40

    };


    p.children.push(child);


    p.pregnancy =
        null;


    p.familyTree.push({

        type:
            "child",

        name:
            child.name,

        age:
            0,

        generation:
            2

    });


    lifeSave();

    alert(
        `👶 NASCEU!\n\n${child.name} nasceu e entrou para sua família.`
    );

    lifeScreen();
}


/* =========================================================
   AVANÇAR IDADE DOS FILHOS
========================================================= */

function updateChildrenAge() {

    const p = ensureLifeData();

    if (!p) return;


    if (!Array.isArray(p.children)) {
        return;
    }


    p.children.forEach(
        function(child) {

            if (
                typeof child.weeks !== "number"
            ) {
                child.weeks = 0;
            }

            if (
                typeof child.age !== "number"
            ) {
                child.age = 0;
            }


            child.weeks++;


            if (child.weeks >= 52) {

                child.weeks = 0;

                child.age++;

            }

        }
    );

}


/* =========================================================
   AVANÇAR GESTAÇÃO
========================================================= */

function updatePregnancy() {

    const p = ensureLifeData();

    if (!p || !p.pregnancy) {
        return;
    }


    p.pregnancy.weeks++;


    if (
        p.pregnancy.weeks >= 40
    ) {

        createChild();

        return;

    }

}


/* =========================================================
   FUNÇÃO PARA O MAIN.JS
   CHAMAR A CADA SEMANA
========================================================= */

function processLifeWeek() {

    const p = ensureLifeData();

    if (!p) {
        return;
    }


    updatePregnancy();


    /*
     * Se houve nascimento durante a semana,
     * createChild() já salvou os dados.
     */

    updateChildrenAge();


    /*
     * Pequena despesa semanal quando casado.
     */

    if (p.married) {

        const expense = 50;


        if ((p.money || 0) >= expense) {

            p.money -= expense;

            p.familyExpenses += expense;

        }

    }


    lifeSave();

}


/* =========================================================
   ÁRVORE GENEALÓGICA
========================================================= */

function familyTreeScreen() {

    const p = ensureLifeData();

    if (!p) return;


    const content =
        document.getElementById("content");

    if (!content) return;


    let childrenHTML = "";


    if (!p.children.length) {

        childrenHTML = `

            <p>
                Ainda não existem filhos
                registrados na sua árvore.
            </p>

        `;

    }
    else {

        childrenHTML =
            p.children.map(
                function(child) {

                    return `

                        <div class="card">

                            <div class="title">
                                👶 ${child.name}
                            </div>

                            <div class="statline">

                                <span>
                                    Geração
                                </span>

                                <b>
                                    ${child.generation}
                                </b>

                            </div>

                            <div class="statline">

                                <span>
                                    Idade
                                </span>

                                <b>
                                    ${child.age} anos
                                </b>

                            </div>

                            <div class="statline">

                                <span>
                                    Vida
                                </span>

                                <b>
                                    ${child.weeks}/52 semanas
                                </b>

                            </div>

                            <div class="statline">

                                <span>
                                    Potencial
                                </span>

                                <b>
                                    ${child.potential}
                                </b>

                            </div>

                            <div class="statline">

                                <span>
                                    OVR
                                </span>

                                <b>
                                    ${child.overall}
                                </b>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    }


    content.innerHTML = `

        <div class="card">

            <div class="title">
                🌳 ÁRVORE GENEALÓGICA
            </div>

            <p>
                Sua dinastia familiar.
            </p>

        </div>


        <div class="card">

            <div class="title">
                🥊 GERAÇÃO 1
            </div>

            <div class="statline">

                <span>
                    Fundador
                </span>

                <b>
                    ${p.name || "Lutador"}
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

        </div>


        ${childrenHTML}


        <div class="card">

            <div class="title">
                🧬 HERANÇA E SUCESSÃO
            </div>

            <p>
                No futuro, um dos seus filhos
                poderá ser escolhido para
                continuar sua história.
            </p>

            <p>
                👑 Sistema de herdeiro e
                continuidade de geração será
                desbloqueado quando os filhos
                atingirem idade suficiente.
            </p>

        </div>


        <button
            class="gray"
            onclick="lifeScreen()">

            ← VOLTAR PARA VIDA

        </button>

    `;
}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.lifeScreen =
    lifeScreen;

window.meetPartner =
    meetPartner;

window.relationshipDate =
    relationshipDate;

window.relationshipGift =
    relationshipGift;

window.proposeMarriage =
    proposeMarriage;

window.marryPartner =
    marryPartner;

window.breakUp =
    breakUp;

window.startPregnancy =
    startPregnancy;

window.createChild =
    createChild;

window.familyTreeScreen =
    familyTreeScreen;

window.processLifeWeek =
    processLifeWeek;
