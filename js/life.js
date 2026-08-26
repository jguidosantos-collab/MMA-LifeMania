/* =========================================================
   MMA LIFE DYNASTY
   LIFE.JS
   VIDA + TINDER + RELACIONAMENTO + CASAMENTO
   + GRAVIDEZ + FILHOS + ÁRVORE + HERANÇA
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
    if (
        typeof p.partner === "undefined"
    ) {
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
    /* CANDIDATAS */
    if (!Array.isArray(p.partnerCandidates)) {
        p.partnerCandidates = [];
    }
    /* HERDEIRO */
    if (
        typeof p.heirId === "undefined"
    ) {
        p.heirId = null;
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
   GERADOR DE CANDIDATAS
========================================================= */
function generatePartnerCandidates() {
    const names = [
        "Maria","Ana","Julia","Laura","Beatriz",
        "Camila","Sofia","Mariana","Isabela","Gabriela",
        "Amanda","Larissa","Carolina","Manuela","Helena",
        "Valentina","Luiza","Clara","Alice","Bianca",
        "Nicole","Rafaela","Leticia","Yasmin","Eduarda",
        "Fernanda","Bruna","Giovanna","Melissa","Heloisa",
        "Livia","Marina","Cecilia","Rebeca","Sarah",
        "Isadora","Lorena","Vitória","Emilly","Emanuelly",
        "Maitê","Alana","Elisa","Lara","Mirella",
        "Stella","Agatha","Antonella","Olivia","Esther",
        "Ayla","Aurora","Valeria","Malu","Bárbara",
        "Luana","Natália","Patricia","Renata","Priscila",
        "Raquel","Vanessa","Viviane","Aline","Carla",
        "Daniela","Débora","Elaine","Fabiana","Flávia",
        "Gisele","Ingrid","Jéssica","Karina","Kelly",
        "Luciana","Marcela","Monique","Nathalia","Paula",
        "Roberta","Samara","Tainá","Tatiane","Verônica",
        "Adriana","Alessandra","Brenda","Cristina","Denise",
        "Evelyn","Irene","Janaína","Katarina","Mônica",
        "Natasha","Regina","Simone","Talita","Úrsula",
        "Vivian","Yara","Zoe","Abigail","Ariana",
        "Bella","Catarina","Diana","Elena","Francesca",
        "Giulia","Isabel","Jasmine","Kiara","Luna",
        "Maya","Nina","Olga","Paola","Rita",
        "Sabrina","Tereza","Wendy","Yasmin","Zara",
        "Amelia","Chloe","Emma","Grace","Hannah",
        "Ivy","Jade","Kate","Leah","Mia",
        "Nora","Ruby","Sophia","Taylor","Victoria",
        "Zoey","Ava","Ella","Emily","Lily",
        "Madison","Natalie","Scarlett","Aria","Layla",
        "Samantha","Penelope","Riley","Eleanor","Hazel",
        "Violet","Lucy","Paisley","Everly","Naomi",
        "Eliana","Caroline","Nova","Genesis","Emilia",
        "Kennedy","Willow","Kinsley","Delilah","Claire",
        "Vivian","Raelynn","Liliana","Mariah","Athena",
        "Sierra","Jocelyn","Adeline","Brianna","Melanie",
        "Valerie","Mackenzie","Allison","Morgan","Kayla",
        "Faith","Aubrey","Peyton","Brooklyn","Skylar",
        "Arianna","Serenity","Annabelle","Gabriella","Hailey",
        "Autumn","Nevaeh","Carla","Daphne","Elisa",
        "Freya","Georgia","Hope","Iris","Josephine",
        "Kylie","Lola","Margot","Noelle","Phoebe",
        "Rose","Summer","Thea","Vera","Willa"
    ];
    const professions = [
        "Estudante",
        "Professora",
        "Médica",
        "Advogada",
        "Empresária",
        "Nutricionista",
        "Fisioterapeuta",
        "Fotógrafa",
        "Jornalista",
        "Designer",
        "Engenheira",
        "Psicóloga",
        "Veterinária",
        "Influenciadora",
        "Personal Trainer",
        "Farmacêutica",
        "Arquiteta",
        "Chef",
        "Programadora",
        "Bióloga"
    ];
    const countries = [
        "Brasil",
        "Estados Unidos",
        "Argentina",
        "México",
        "Canadá",
        "Japão",
        "Espanha",
        "França",
        "Itália",
        "Reino Unido"
    ];
    const candidates = [];
    for (
        let i = 0;
        i < 200;
        i++
    ) {
        const athlete =
            Math.random() < 0.35;
        const age =
            18 +
            Math.floor(
                Math.random() * 13
            );
        const physical =
            Math.floor(
                Math.random() * 31
            ) + 50;
        const mental =
            Math.floor(
                Math.random() * 31
            ) + 50;
        const discipline =
            Math.floor(
                Math.random() * 31
            ) + 50;
        const genetics =
            Math.floor(
                Math.random() * 31
            ) + 60;
        const potential =
            Math.min(
                95,
                Math.round(
                    (
                        physical +
                        mental +
                        discipline +
                        genetics
                    ) / 4
                )
            );
        candidates.push({
            id: i + 1,
            name:
                names[i % names.length],
            age:
                age,
            country:
                countries[
                    Math.floor(
                        Math.random() *
                        countries.length
                    )
                ],
            profession:
                professions[
                    Math.floor(
                        Math.random() *
                        professions.length
                    )
                ],
            athlete:
                athlete,
            physical:
                physical,
            mental:
                mental,
            discipline:
                discipline,
            genetics:
                genetics,
            potential:
                potential,
            liked:
                false,
            passed:
                false
        });
    }
    return candidates;
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
    let partnerName = "Nenhum";
    if (p.partner) {
        if (typeof p.partner === "object") {
            partnerName =
                p.partner.name || "Nenhum";
        }
        else {
            partnerName =
                p.partner;
        }
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
                <span>
                    Idade
                </span>
                <b>
                    ${p.age || 15} anos
                </b>
            </div>
            <div class="statline">
                <span>
                    Dinheiro
                </span>
                <b>
                    $${Math.round(p.money || 0)}
                </b>
            </div>
            <div class="statline">
                <span>
                    Fama
                </span>
                <b>
                    ${Math.round(p.fame || 0)}
                </b>
            </div>
        </div>
        <!-- =================================================
             TINDER
        ================================================= -->
        <div class="card">
            <div class="title">
                💕 TINDER
            </div>
            ${
                p.relationship === "Solteiro"
                ?
                `
                <p>
                    Conheça pessoas, encontre uma parceira
                    e construa sua família.
                </p>
                <button
                    type="button"
                    class="main-button"
                    onclick="datingScreen()">
                    💕 ABRIR TINDER
                </button>
                `
                :
                `
                <p>
                    Você já está em um relacionamento
                    com ${partnerName}.
                </p>
                `
            }
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
                    ${partnerName}
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
                p.relationship !== "Solteiro"
                ?
                `
                <button
                    type="button"
                    class="main-button"
                    onclick="relationshipDate()">
                    🍽️ SAIR EM UM ENCONTRO
                </button>
                <button
                    type="button"
                    class="main-button"
                    onclick="relationshipGift()">
                    💐 DAR PRESENTE
                </button>
                `
                :
                ""
            }
            ${
                p.relationship === "Namorando" &&
                p.relationshipLevel >= 70
                ?
                `
                <button
                    type="button"
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
                    type="button"
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
                    type="button"
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
                        ${partnerName}
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
                    type="button"
                    class="main-button"
                    onclick="startPregnancy()">
                    👶 TENTAR TER UM FILHO
                </button>
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
                type="button"
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
   TINDER / DATING
========================================================= */
function datingScreen() {
    const p = ensureLifeData();
    if (!p) {
        return;
    }
    if (p.age < 18) {
        lifeMessage(
            "❤️ Você precisa ter 18 anos para começar sua vida amorosa."
        );
        return;
    }
    if (p.relationship !== "Solteiro") {
        lifeMessage(
            "Você já está em um relacionamento."
        );
        return;
    }
    if (
        !Array.isArray(p.partnerCandidates) ||
        p.partnerCandidates.length === 0
    ) {
        p.partnerCandidates =
            generatePartnerCandidates();
        lifeSave();
    }
    let candidate =
        p.partnerCandidates.find(
            function(person) {
                return (
                    !person.passed &&
                    !person.liked
                );
            }
        );
    if (!candidate) {
        p.partnerCandidates =
            generatePartnerCandidates();
        lifeSave();
        candidate =
            p.partnerCandidates[0];
    }
    const content =
        document.getElementById("content");
    if (!content) {
        return;
    }
    const athleteText =
        candidate.athlete
            ? "🥊 SIM — atleta"
            : "❌ Não é atleta";
    content.innerHTML = `
        <div class="card">
            <div class="title">
                💕 TINDER
            </div>
            <p>
                Deslize pela sua próxima possível
                parceira.
            </p>
        </div>
        <div class="card">
            <div
                style="
                    text-align:center;
                    font-size:70px;
                    margin-bottom:10px;
                "
            >
                👩
            </div>
            <div
                class="title"
                style="text-align:center;"
            >
                ${candidate.name}
            </div>
            <div
                style="
                    text-align:center;
                    margin-bottom:15px;
                "
            >
                ${candidate.age} anos ·
                ${candidate.country}
            </div>
            <div class="statline">
                <span>
                    Profissão
                </span>
                <b>
                    ${candidate.profession}
                </b>
            </div>
            <div class="statline">
                <span>
                    Atleta
                </span>
                <b>
                    ${athleteText}
                </b>
            </div>
            <div class="statline">
                <span>
                    Físico
                </span>
                <b>
                    ${candidate.physical}
                </b>
            </div>
            <div class="statline">
                <span>
                    Mental
                </span>
                <b>
                    ${candidate.mental}
                </b>
            </div>
            <div class="statline">
                <span>
                    Disciplina
                </span>
                <b>
                    ${candidate.discipline}
                </b>
            </div>
            <div class="statline">
                <span>
                    Genética
                </span>
                <b>
                    ${candidate.genetics}
                </b>
            </div>
            <div class="statline">
                <span>
                    Potencial familiar
                </span>
                <b>
                    ${candidate.potential}
                </b>
            </div>
            <br>
            <button
                type="button"
                class="main-button"
                onclick="likePartner(${candidate.id})">
                ❤️ CURTIR
            </button>
            <button
                type="button"
                class="gray"
                onclick="passPartner(${candidate.id})">
                ❌ PASSAR
            </button>
            <button
                type="button"
                class="gray"
                onclick="lifeScreen()">
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   CURTIR
========================================================= */
function likePartner(id) {
    const p = ensureLifeData();
    if (!p) return;
    const candidate =
        p.partnerCandidates.find(
            function(person) {
                return person.id === id;
            }
        );
    if (!candidate) {
        return;
    }
    candidate.liked = true;
    p.partner = {
        name:
            candidate.name,
        age:
            candidate.age,
        country:
            candidate.country,
        profession:
            candidate.profession,
        athlete:
            candidate.athlete,
        physical:
            candidate.physical,
        mental:
            candidate.mental,
        discipline:
            candidate.discipline,
        genetics:
            candidate.genetics,
        potential:
            candidate.potential
    };
    p.relationship =
        "Conhecendo";
    p.relationshipLevel =
        20;
    lifeSave();
    alert(
        `❤️ MATCH!\n\nVocê começou a conhecer ${candidate.name}.`
    );
    lifeScreen();
}
/* =========================================================
   PASSAR
========================================================= */
function passPartner(id) {
    const p = ensureLifeData();
    if (!p) return;
    const candidate =
        p.partnerCandidates.find(
            function(person) {
                return person.id === id;
            }
        );
    if (!candidate) {
        return;
    }
    candidate.passed = true;
    lifeSave();
    datingScreen();
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
            "💰 Você não tem dinheiro suficiente para o encontro."
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
        (
            p.relationship === "Conhecendo" ||
            p.relationship === "Namorando"
        ) &&
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
            "💰 Você não tem dinheiro suficiente para comprar o presente."
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
            "💰 Você precisa de $5.000 para realizar o casamento."
        );
        return;
    }
    p.money -= cost;
    p.familyExpenses += cost;
    p.relationship =
        "Casado(a)";
    p.married =
        true;
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
            "💍 Você precisa estar casado(a) para ter um filho."
        );
        return;
    }
    if (p.pregnancy) {
        lifeMessage(
            "🤰 Já existe uma gestação em andamento."
        );
        return;
    }
    p.pregnancy = {
        weeks:
            0,
        mother:
            p.partner &&
            p.partner.name
                ? p.partner.name
                : "Parceira",
        startedYear:
            p.year,
        startedWeek:
            p.week
    };
    lifeSave();
    lifeScreen();
}
/* =========================================================
   CRIAR FILHO
========================================================= */
function createChild() {
    const p = ensureLifeData();
    if (!p) return;
    let mother = null;
    if (
        p.partner &&
        typeof p.partner === "object"
    ) {
        mother =
            p.partner;
    }
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
        "Theo",
        "Samuel",
        "Benjamin",
        "Nicolas",
        "Alice",
        "Helena",
        "Laura",
        "Sophia",
        "Valentina",
        "Manuela",
        "Isabela",
        "Cecília",
        "Aurora",
        "Lívia",
        "Clara"
    ];
    const name =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];
    const fatherPotential =
        Number(
            p.potential || 78
        );
    const motherPotential =
        mother
            ? Number(
                mother.potential || 70
            )
            : 70;
    const geneticBase =
        (
            fatherPotential +
            motherPotential
        ) / 2;
    const geneticVariation =
        Math.floor(
            Math.random() * 17
        ) - 8;
    const childPotential =
        Math.max(
            40,
            Math.min(
                98,
                Math.round(
                    geneticBase +
                    geneticVariation
                )
            )
        );
    const childOverall =
        Math.max(
            35,
            Math.min(
                60,
                Math.round(
                    childPotential -
                    35 +
                    (
                        Math.random() * 8
                    )
                )
            )
        );
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
            mother
                ? mother.name
                : "Mãe",
        relationship:
            50,
        potential:
            childPotential,
        overall:
            childOverall,
        inheritedFromFather:
            fatherPotential,
        inheritedFromMother:
            motherPotential,
        fightingInterest:
            false,
        becameFighter:
            false
    };
    p.children.push(child);
    p.pregnancy =
        null;
    p.familyTree.push({
        type:
            "child",
        id:
            child.id,
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
   IDADE DOS FILHOS
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
            if (
                child.weeks >= 52
            ) {
                child.weeks = 0;
                child.age++;
            }
        }
    );
}
/* =========================================================
   GESTAÇÃO
========================================================= */
function updatePregnancy() {
    const p = ensureLifeData();
    if (
        !p ||
        !p.pregnancy
    ) {
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
   PROCESSAR SEMANA
========================================================= */
function processLifeWeek() {
    const p = ensureLifeData();
    if (!p) {
        return;
    }
    updatePregnancy();
    updateChildrenAge();
    if (p.married) {
        const expense = 50;
        if (
            (p.money || 0) >= expense
        ) {
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
                    const heir =
                        p.heirId === child.id
                            ? " 👑 HERDEIRO"
                            : "";
                    return `
                        <div class="card">
                            <div class="title">
                                👶 ${child.name}
                                ${heir}
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
                                    Pai
                                </span>
                                <b>
                                    ${child.father}
                                </b>
                            </div>
                            <div class="statline">
                                <span>
                                    Mãe
                                </span>
                                <b>
                                    ${child.mother}
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
                            ${
                                child.age >= 18
                                ?
                                `
                                <button
                                    type="button"
                                    class="main-button"
                                    onclick="chooseHeir(${child.id})">
                                    👑 ESCOLHER COMO HERDEIRO
                                </button>
                                `
                                :
                                `
                                <p>
                                    🔒 Poderá continuar a dinastia
                                    quando atingir 18 anos.
                                </p>
                                `
                            }
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
            ${
                p.heirId
                ?
                `
                <p>
                    👑 Seu herdeiro atual foi escolhido.
                </p>
                `
                :
                `
                <p>
                    Escolha um filho adulto para
                    continuar sua dinastia no futuro.
                </p>
                `
            }
        </div>
        <button
            type="button"
            class="gray"
            onclick="lifeScreen()">
            ← VOLTAR PARA VIDA
        </button>
    `;
}
/* =========================================================
   ESCOLHER HERDEIRO
========================================================= */
function chooseHeir(childId) {
    const p = ensureLifeData();
    if (!p) return;
    const child =
        p.children.find(
            function(c) {
                return c.id === childId;
            }
        );
    if (!child) {
        return;
    }
    if (
        child.age < 18
    ) {
        lifeMessage(
            "👑 O filho precisa ter pelo menos 18 anos para ser escolhido como herdeiro."
        );
        return;
    }
    p.heirId =
        child.id;
    lifeSave();
    alert(
        `👑 ${child.name} foi escolhido para continuar sua dinastia.`
    );
    familyTreeScreen();
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.lifeScreen =
    lifeScreen;
window.datingScreen =
    datingScreen;
window.generatePartnerCandidates =
    generatePartnerCandidates;
window.likePartner =
    likePartner;
window.passPartner =
    passPartner;
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
window.chooseHeir =
    chooseHeir;
window.processLifeWeek =
    processLifeWeek;
