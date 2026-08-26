/* =========================================================
   MMA LIFE DYNASTY
   FAMILY.JS
   VIDA + FAMÍLIA + GESTAÇÃO + HERANÇA
========================================================= */

const MARRIAGE_AGE = 18;

const MARRIAGE_COST = 500;

const CHILD_COST = 1000;

const FAMILY_WEEKLY_COST = 50;

const PREGNANCY_WEEKS = 40;


/* =========================================================
   GARANTIR ESTRUTURA DA FAMÍLIA
========================================================= */

function ensureFamilyData() {

    if (!window.player) {
        return;
    }

    const p = window.player;

    if (!Array.isArray(p.children)) {
        p.children = [];
    }

    if (!Array.isArray(p.familyHistory)) {
        p.familyHistory = [];
    }

    if (typeof p.pregnancy === "undefined") {
        p.pregnancy = null;
    }

    if (typeof p.heir === "undefined") {
        p.heir = null;
    }

    if (typeof p.familyExpenses === "undefined") {
        p.familyExpenses = FAMILY_WEEKLY_COST;
    }
}


/* =========================================================
   NAMORAR / CASAR
========================================================= */

function dating() {

    ensureFamilyData();

    const p = window.player;

    if (p.age < MARRIAGE_AGE) {

        alert(
            "❤️ Você ainda é jovem demais para iniciar a vida familiar."
        );

        return;
    }


    if (p.relationship === "Solteiro") {

        p.relationship = "Namorando";

        p.partner = "Companheiro(a)";

        p.log.unshift(
            "❤️ Você começou um relacionamento."
        );

    }

    else if (
        p.relationship === "Namorando"
    ) {

        if (p.money < MARRIAGE_COST) {

            alert(
                "💰 Você precisa de $" +
                MARRIAGE_COST +
                " para se casar."
            );

            return;
        }


        p.money -= MARRIAGE_COST;

        p.relationship = "Casado";

        p.married = true;

        p.log.unshift(
            "💍 Você se casou e começou uma nova fase da vida."
        );

        p.familyHistory.unshift({
            type: "marriage",
            year: p.year,
            week: p.week
        });

    }


    save();

    familyScreen();
}


/* =========================================================
   INICIAR GESTAÇÃO
========================================================= */

function haveChild() {

    ensureFamilyData();

    const p = window.player;


    if (p.age < MARRIAGE_AGE) {

        alert(
            "Você precisa ter pelo menos 18 anos."
        );

        return;
    }


    if (!p.married) {

        alert(
            "💍 Você precisa estar casado."
        );

        return;
    }


    if (p.pregnancy) {

        alert(
            "🤰 Sua esposa já está grávida."
        );

        return;
    }


    if (p.children.length >= 5) {

        alert(
            "Sua família já possui cinco filhos."
        );

        return;
    }


    if (p.money < CHILD_COST) {

        alert(
            "💰 Você precisa de $" +
            CHILD_COST +
            " para iniciar uma gestação."
        );

        return;
    }


    p.money -= CHILD_COST;


    p.pregnancy = {

        weeks: 0,

        totalWeeks: PREGNANCY_WEEKS,

        startedYear: p.year,

        startedWeek: p.week

    };


    p.log.unshift(
        "🤰 Sua esposa ficou grávida. A gestação começou."
    );


    save();

    familyScreen();
}


/* =========================================================
   AVANÇAR UMA SEMANA DA FAMÍLIA
========================================================= */

function processFamilyWeek() {

    ensureFamilyData();

    const p = window.player;


    /* =========================
       DESPESAS FAMILIARES
    ========================= */

    if (p.married) {

        p.money =
            Math.max(
                0,
                Number(p.money || 0) -
                FAMILY_WEEKLY_COST
            );

    }


    /* =========================
       GESTAÇÃO
    ========================= */

    if (p.pregnancy) {

        p.pregnancy.weeks += 1;


        if (
            p.pregnancy.weeks >=
            PREGNANCY_WEEKS
        ) {

            completePregnancy();

        }

    }


    /* =========================
       IDADE DOS FILHOS
       52 SEMANAS = 1 ANO
    ========================= */

    if (
        !p._familyWeekCounter
    ) {

        p._familyWeekCounter = 0;

    }


    p._familyWeekCounter += 1;


    if (
        p._familyWeekCounter >= 52
    ) {

        p._familyWeekCounter = 0;

        ageChildren();

    }

}


/* =========================================================
   FINALIZAR GESTAÇÃO
========================================================= */

function completePregnancy() {

    const p = window.player;

    const names = [

        "Alex",
        "Lucas",
        "Rafael",
        "Miguel",
        "Arthur",
        "Gabriel",
        "Sofia",
        "Helena",
        "Julia",
        "Laura",
        "Mateus",
        "Davi",
        "Enzo",
        "Theo",
        "Valentina",
        "Benjamin",
        "Samuel",
        "Isabela",
        "Manuela",
        "Nicolas"

    ];


    const name =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];


    const child = {

        id:
            Date.now() +
            Math.floor(
                Math.random() * 10000
            ),

        name: name,

        age: 0,

        bornYear: p.year,

        bornWeek: p.week,

        potential:
            Math.floor(
                Math.random() * 41
            ) + 50,

        fightingInterest:
            Math.random() < 0.35,

        becameFighter: false,

        inheritance: 0,

        chosenHeir: false

    };


    p.children.push(child);

    p.pregnancy = null;


    p.familyHistory.unshift({

        type: "birth",

        child: name,

        year: p.year,

        week: p.week

    });


    p.log.unshift(

        "👶 Nasceu " +
        name +
        ". A próxima geração começou."

    );


    save();

}


/* =========================================================
   ENVELHECER FILHOS
========================================================= */

function ageChildren() {

    const p = window.player;


    if (!Array.isArray(p.children)) {
        return;
    }


    p.children.forEach(
        function(child) {

            child.age =
                Number(child.age || 0) + 1;


            if (child.age === 18) {

                p.log.unshift(

                    "🎂 " +
                    child.name +
                    " completou 18 anos."

                );

            }

        }
    );


    save();

}


/* =========================================================
   ESCOLHER HERDEIRO
========================================================= */

function chooseHeir(childId) {

    ensureFamilyData();

    const p = window.player;


    const child =
        p.children.find(
            function(c) {

                return String(c.id) ===
                    String(childId);

            }
        );


    if (!child) {

        alert(
            "Filho não encontrado."
        );

        return;
    }


    if (child.age < 18) {

        alert(
            "👶 Seu filho precisa ter pelo menos 18 anos para ser escolhido como herdeiro."
        );

        return;
    }


    p.children.forEach(
        function(c) {

            c.chosenHeir = false;

        }
    );


    child.chosenHeir = true;

    p.heir = child.id;


    p.log.unshift(

        "👑 Você escolheu " +
        child.name +
        " para continuar o legado."

    );


    save();

    familyScreen();
}


/* =========================================================
   CALCULAR HERANÇA
========================================================= */

function calculateInheritance() {

    ensureFamilyData();

    const p = window.player;


    if (!p.heir) {
        return 0;
    }


    const child =
        p.children.find(
            function(c) {

                return String(c.id) ===
                    String(p.heir);

            }
        );


    if (!child) {
        return 0;
    }


    return Math.max(
        0,
        Math.round(
            Number(p.money || 0)
        )
    );
}


/* =========================================================
   TRANSFERIR HERANÇA
========================================================= */

function transferInheritance() {

    ensureFamilyData();

    const p = window.player;


    if (!p.heir) {

        alert(
            "👑 Primeiro escolha quem continuará seu legado."
        );

        return;
    }


    const child =
        p.children.find(
            function(c) {

                return String(c.id) ===
                    String(p.heir);

            }
        );


    if (!child) {
        return;
    }


    const inheritance =
        calculateInheritance();


    child.inheritance =
        inheritance;


    p.money = 0;


    p.log.unshift(

        "💰 A herança de $" +
        inheritance +
        " foi destinada a " +
        child.name +
        "."

    );


    save();

    familyScreen();
}


/* =========================================================
   INFORMAÇÕES DA DINASTIA
========================================================= */

function dynastyInfo() {

    ensureFamilyData();

    const p = window.player;


    return {

        generation:
            p.children.length > 0
                ? 2
                : 1,

        children:
            p.children.length,

        pregnant:
            !!p.pregnancy,

        pregnancyWeeks:
            p.pregnancy
                ? p.pregnancy.weeks
                : 0,

        heir:
            p.heir

    };

}


/* =========================================================
   ÁRVORE GENEALÓGICA
========================================================= */

function familyTree() {

    ensureFamilyData();

    const p = window.player;


    let html = `

        <div class="card">

            <div class="title">
                🌳 ÁRVORE GENEALÓGICA
            </div>

            <div class="family-tree">

                <div class="tree-person">

                    🥊 <strong>
                        ${p.name || "Você"}
                    </strong>

                    <small>
                        Geração 1
                    </small>

                </div>

    `;


    if (p.children.length === 0) {

        html += `

            <p>
                Sua árvore ainda não possui
                descendentes.
            </p>

        `;

    }


    p.children.forEach(
        function(child) {

            html += `

                <div class="tree-person">

                    👶 <strong>
                        ${child.name}
                    </strong>

                    <small>
                        ${child.age} anos
                    </small>

                    <small>
                        Potencial: ${child.potential}
                    </small>

                    ${
                        child.chosenHeir
                        ? "<small>👑 HERDEIRO</small>"
                        : ""
                    }

                </div>

            `;

        }
    );


    html += `

            </div>

        </div>

    `;


    return html;
}


/* =========================================================
   TELA DA FAMÍLIA
========================================================= */

function familyScreen() {

    ensureFamilyData();

    const p = window.player;

    const content =
        document.getElementById("content");


    if (!content) {
        return;
    }


    let pregnancyHTML = "";


    if (p.pregnancy) {

        pregnancyHTML = `

            <div class="card">

                <div class="title">
                    🤰 GESTAÇÃO
                </div>

                <div class="statline">

                    <span>
                        Progresso
                    </span>

                    <b>
                        ${p.pregnancy.weeks}
                        /
                        ${p.pregnancy.totalWeeks}
                        semanas
                    </b>

                </div>

                <p>
                    Faltam
                    ${
                        p.pregnancy.totalWeeks -
                        p.pregnancy.weeks
                    }
                    semanas para o nascimento.
                </p>

            </div>

        `;

    }


    let childrenHTML = "";


    if (p.children.length === 0) {

        childrenHTML = `

            <p>
                Você ainda não tem filhos.
            </p>

        `;

    }


    p.children.forEach(
        function(child) {

            childrenHTML += `

                <div class="card">

                    <div class="title">
                        👶 ${child.name}
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
                            Potencial
                        </span>

                        <b>
                            ${child.potential}
                        </b>

                    </div>

                    <div class="statline">

                        <span>
                            Interesse em MMA
                        </span>

                        <b>
                            ${
                                child.fightingInterest
                                ? "Sim"
                                : "Não"
                            }
                        </b>

                    </div>

                    ${
                        child.age >= 18
                        ?

                        `

                            <button
                                class="main-button"
                                onclick="chooseHeir('${child.id}')">

                                👑 ESCOLHER COMO HERDEIRO

                            </button>

                        `

                        :

                        ""

                    }

                </div>

            `;

        }
    );


    content.innerHTML = `

        <div class="card">

            <div class="title">
                👨‍👩‍👧 FAMÍLIA
            </div>

            <div class="statline">

                <span>
                    Relacionamento
                </span>

                <b>
                    ${p.relationship || "Solteiro"}
                </b>

            </div>

            <div class="statline">

                <span>
                    Parceiro
                </span>

                <b>
                    ${p.partner || "Nenhum"}
                </b>

            </div>

            <div class="statline">

                <span>
                    Filhos
                </span>

                <b>
                    ${p.children.length}
                </b>

            </div>

            <div class="statline">

                <span>
                    Gastos familiares
                </span>

                <b>
                    $${FAMILY_WEEKLY_COST}/semana
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                💕 RELACIONAMENTO
            </div>

            ${
                p.relationship === "Solteiro"

                ?

                `

                    <button
                        class="main-button"
                        onclick="dating()">

                        ❤️ COMEÇAR RELACIONAMENTO

                    </button>

                `

                :

                p.relationship === "Namorando"

                ?

                `

                    <button
                        class="main-button"
                        onclick="dating()">

                        💍 CASAR — $${MARRIAGE_COST}

                    </button>

                `

                :

                `

                    <p>
                        💍 Você está casado.
                    </p>

                `
            }

        </div>


        ${pregnancyHTML}


        <div class="card">

            <div class="title">
                👶 FILHOS
            </div>

            <button
                class="main-button"
                onclick="haveChild()">

                👶 TER UM FILHO — $${CHILD_COST}

            </button>

        </div>


        ${childrenHTML}


        ${familyTree()}


        <div class="card">

            <div class="title">
                👑 LEGADO
            </div>

            <p>
                ${
                    p.heir
                    ? "Você já escolheu quem continuará sua dinastia."
                    : "Escolha um filho adulto para continuar sua história."
                }
            </p>

            ${
                p.heir
                ?

                `

                    <button
                        class="main-button"
                        onclick="transferInheritance()">

                        💰 DESTINAR HERANÇA

                    </button>

                `

                :

                ""

            }

        </div>

    `;

}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.dating = dating;

window.haveChild = haveChild;

window.processFamilyWeek =
    processFamilyWeek;

window.chooseHeir =
    chooseHeir;

window.calculateInheritance =
    calculateInheritance;

window.transferInheritance =
    transferInheritance;

window.dynastyInfo =
    dynastyInfo;

window.familyScreen =
    familyScreen;
