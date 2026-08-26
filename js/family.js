/* =========================================================
   MMA LIFE DYNASTY
   FAMILY.JS
   VIDA + RELACIONAMENTO + FAMÍLIA
========================================================= */
/* =========================================================
   CONFIGURAÇÕES
========================================================= */
const MARRIAGE_AGE = 18;
const MARRIAGE_COST = 500;
const CHILD_COST = 1000;
const MAX_CHILDREN = 5;
/* =========================================================
   NOMES
   200 CANDIDATAS SERÃO GERADAS AUTOMATICAMENTE
========================================================= */
const femaleNames = [
    "Camila",
    "Ana",
    "Julia",
    "Marina",
    "Sofia",
    "Beatriz",
    "Laura",
    "Isabela",
    "Gabriela",
    "Manuela",
    "Valentina",
    "Alice",
    "Helena",
    "Luiza",
    "Livia",
    "Clara",
    "Maria",
    "Carolina",
    "Larissa",
    "Amanda",
    "Bianca",
    "Rafaela",
    "Leticia",
    "Mariana",
    "Eduarda",
    "Fernanda",
    "Bruna",
    "Natalia",
    "Yasmin",
    "Giovanna",
    "Melissa",
    "Nicole",
    "Maitê",
    "Cecilia",
    "Isadora",
    "Lorena",
    "Sarah",
    "Eloá",
    "Rebeca",
    "Vitória",
    "Clara",
    "Esther",
    "Elisa",
    "Ayla",
    "Mirella",
    "Alana",
    "Isis",
    "Olivia",
    "Emma",
    "Emily",
    "Chloe",
    "Grace",
    "Ella",
    "Ava",
    "Mia",
    "Lily",
    "Charlotte",
    "Amelia",
    "Harper",
    "Evelyn",
    "Abigail",
    "Scarlett",
    "Victoria",
    "Riley",
    "Aria",
    "Layla",
    "Nora",
    "Zoey",
    "Hannah",
    "Luna",
    "Zoe",
    "Stella",
    "Aurora",
    "Lucy",
    "Ellie",
    "Maya",
    "Leah",
    "Naomi",
    "Samantha",
    "Natalie",
    "Claire",
    "Madison",
    "Brooklyn",
    "Savannah",
    "Paisley",
    "Skylar",
    "Yuki",
    "Hana",
    "Sakura",
    "Aiko",
    "Akari",
    "Mio",
    "Rin",
    "Mei",
    "Yuna",
    "Emi",
    "Nana",
    "Ayaka",
    "Reina",
    "Kira",
    "Valeria",
    "Camila",
    "Sofia",
    "Lucia",
    "Elena",
    "Isabella",
    "Martina",
    "Carla",
    "Paula",
    "Alba",
    "Claudia",
    "Daniela",
    "Sara",
    "Irene",
    "Aitana",
    "Marta",
    "Adriana",
    "Patricia",
    "Natalia",
    "Alejandra",
    "Gabriela",
    "Renata",
    "Ximena",
    "Marisol",
    "Catalina",
    "Antonella",
    "Florencia",
    "Julieta",
    "Agustina",
    "Luciana",
    "Pilar",
    "Josefina",
    "Emilia",
    "Martina",
    "Alma",
    "Violeta",
    "Rocio",
    "Carolina",
    "Daniela",
    "Sabrina",
    "Mariana",
    "Veronica",
    "Andrea",
    "Sofia",
    "Anna",
    "Anastasia",
    "Alina",
    "Irina",
    "Ekaterina",
    "Natalia",
    "Daria",
    "Katerina",
    "Elena",
    "Vera",
    "Polina",
    "Maria",
    "Tatiana",
    "Olga",
    "Yulia",
    "Nadia",
    "Karina",
    "Milana",
    "Arina",
    "Eva",
    "Mila",
    "Amira",
    "Lina",
    "Leila",
    "Nina",
    "Sara",
    "Layla",
    "Mariam",
    "Amina",
    "Fatima",
    "Hiba",
    "Yasmin",
    "Nour",
    "Laila",
    "Zahra",
    "Samira",
    "Dina",
    "Maya",
    "Rania",
    "Salma",
    "Aisha",
    "Hana",
    "Leila",
    "Mariam",
    "Nora",
    "Ines",
    "Sana",
    "Aya",
    "Mina",
    "Noor",
    "Jade",
    "Ruby",
    "Ivy",
    "Hazel",
    "Violet",
    "Daisy",
    "Rose",
    "Iris",
    "Willow",
    "Poppy",
    "Eleanor",
    "Alice",
    "Matilda",
    "Florence",
    "Elsie",
    "Maisie",
    "Freya",
    "Isla",
    "Phoebe",
    "Sienna",
    "Eliza",
    "Georgia",
    "Millie",
    "Rosie"
];
/* =========================================================
   PAÍSES
========================================================= */
const datingCountries = [
    "Brasil",
    "Brasil",
    "Brasil",
    "Brasil",
    "Argentina",
    "México",
    "Estados Unidos",
    "Canadá",
    "Reino Unido",
    "Espanha",
    "Portugal",
    "França",
    "Itália",
    "Alemanha",
    "Polônia",
    "Rússia",
    "Japão",
    "Japão",
    "Coreia do Sul",
    "Tailândia"
];
/* =========================================================
   PROFISSÕES
========================================================= */
const datingProfessions = [
    "Estudante",
    "Professora",
    "Médica",
    "Advogada",
    "Empresária",
    "Influenciadora",
    "Nutricionista",
    "Fisioterapeuta",
    "Designer",
    "Jornalista",
    "Fotógrafa",
    "Atleta",
    "Personal Trainer",
    "Engenheira",
    "Veterinária"
];
/* =========================================================
   GERADOR DE ATRIBUTOS
========================================================= */
function randomStat(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}
/* =========================================================
   GERAR CANDIDATAS
========================================================= */
function generateDatingCandidates() {
    const candidates = [];
    for (
        let i = 0;
        i < 200;
        i++
    ) {
        const name =
            femaleNames[
                i % femaleNames.length
            ];
        const country =
            datingCountries[
                i % datingCountries.length
            ];
        const athlete =
            Math.random() < 0.35;
        const profession =
            athlete
                ? "Atleta"
                : datingProfessions[
                    Math.floor(
                        Math.random() *
                        datingProfessions.length
                    )
                ];
        candidates.push({
            id: i + 1,
            name:
                name,
            age:
                randomStat(18, 29),
            country:
                country,
            profession:
                profession,
            athlete:
                athlete,
            intelligence:
                randomStat(65, 97),
            physical:
                randomStat(60, 97),
            genetics:
                randomStat(65, 97),
            mental:
                randomStat(60, 97),
            personality:
                randomStat(65, 97),
            fertility:
                randomStat(65, 95)
        });
    }
    return candidates;
}
/* =========================================================
   BANCO DAS 200 CANDIDATAS
========================================================= */
const datingCandidates =
    generateDatingCandidates();
/* =========================================================
   CONTROLE DO TINDER
========================================================= */
let datingIndex = 0;
/* =========================================================
   NAMORO ANTIGO / COMPATIBILIDADE
========================================================= */
function dating() {
    ensurePlayer();
    if (player.age < MARRIAGE_AGE) {
        alert(
            "❤️ Você ainda é jovem demais para iniciar a vida familiar."
        );
        return;
    }
    if (
        player.relationship ===
        "Solteiro"
    ) {
        datingScreen();
        return;
    }
    if (
        player.relationship ===
        "Namorando"
    ) {
        if (
            player.money <
            MARRIAGE_COST
        ) {
            alert(
                "💰 Você precisa de $" +
                MARRIAGE_COST +
                " para se casar."
            );
            return;
        }
        player.money -=
            MARRIAGE_COST;
        player.relationship =
            "Casado";
        player.married =
            true;
        player.log =
            player.log || [];
        player.log.unshift(
            "💍 Você se casou."
        );
        save();
        familyScreen();
    }
}
/* =========================================================
   TELA TINDER
========================================================= */
function datingScreen() {
    ensurePlayer();
    const content =
        document.getElementById(
            "content"
        );
    if (!content) return;
    if (player.age < 18) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    ❤️ RELACIONAMENTOS
                </div>
                <p>
                    Você poderá começar a namorar
                    quando completar 18 anos.
                </p>
            </div>
        `;
        return;
    }
    if (
        player.relationship !==
        "Solteiro"
    ) {
        showRelationship();
        return;
    }
    if (
        datingIndex >=
        datingCandidates.length
    ) {
        datingIndex = 0;
    }
    const candidate =
        datingCandidates[
            datingIndex
        ];
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ❤️ ENCONTRE ALGUÉM
            </div>
            <p>
                Deslize pelas candidatas
                e escolha quem pode fazer
                parte da sua história.
            </p>
        </div>
        <div class="card">
            <div class="dating-avatar">
                👩
            </div>
            <h2>
                ${candidate.name},
                ${candidate.age}
            </h2>
            <p>
                🌎 ${candidate.country}
            </p>
            <p>
                💼 ${candidate.profession}
            </p>
            <div class="statline">
                <span>
                    🥊 Atleta
                </span>
                <b>
                    ${
                        candidate.athlete
                            ? "Sim"
                            : "Não"
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    🧬 Genética
                </span>
                <b>
                    ${candidate.genetics}
                </b>
            </div>
            <div class="statline">
                <span>
                    🧠 Inteligência
                </span>
                <b>
                    ${candidate.intelligence}
                </b>
            </div>
            <div class="statline">
                <span>
                    💪 Condição física
                </span>
                <b>
                    ${candidate.physical}
                </b>
            </div>
            <div class="statline">
                <span>
                    🧘 Mental
                </span>
                <b>
                    ${candidate.mental}
                </b>
            </div>
            <div class="statline">
                <span>
                    ❤️ Personalidade
                </span>
                <b>
                    ${candidate.personality}
                </b>
            </div>
            <div class="statline">
                <span>
                    👶 Fertilidade
                </span>
                <b>
                    ${candidate.fertility}
                </b>
            </div>
            <div class="dating-buttons">
                <button
                    class="gray"
                    onclick="passCandidate()">
                    ❌ PASSAR
                </button>
                <button
                    class="green"
                    onclick="likeCandidate()">
                    ❤️ CURTIR
                </button>
            </div>
        </div>
    `;
}
/* =========================================================
   PASSAR CANDIDATA
========================================================= */
function passCandidate() {
    datingIndex++;
    if (
        datingIndex >=
        datingCandidates.length
    ) {
        datingIndex = 0;
    }
    datingScreen();
}
/* =========================================================
   CURTIR CANDIDATA
========================================================= */
function likeCandidate() {
    ensurePlayer();
    const candidate =
        datingCandidates[
            datingIndex
        ];
    if (!candidate) return;
    player.relationship =
        "Namorando";
    player.partner =
        candidate.name;
    player.partnerData = {
        ...candidate
    };
    player.log =
        player.log || [];
    player.log.unshift(
        `❤️ Você começou a namorar ${candidate.name}.`
    );
    save();
    alert(
        "❤️ Você começou a namorar " +
        candidate.name +
        "!"
    );
    lifeScreen();
}
/* =========================================================
   RELACIONAMENTO ATUAL
========================================================= */
function showRelationship() {
    ensurePlayer();
    const content =
        document.getElementById(
            "content"
        );
    if (!content) return;
    const partner =
        player.partnerData || {};
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ❤️ SEU RELACIONAMENTO
            </div>
            <h2>
                ${player.partner || "Companheiro(a)"}
            </h2>
            <p>
                ${partner.profession || "Profissão desconhecida"}
            </p>
        </div>
        <div class="card">
            <div class="title">
                🧬 PERFIL
            </div>
            <div class="statline">
                <span>Atleta</span>
                <b>
                    ${
                        partner.athlete
                            ? "Sim"
                            : "Não"
                    }
                </b>
            </div>
            <div class="statline">
                <span>Genética</span>
                <b>
                    ${partner.genetics || "-"}
                </b>
            </div>
            <div class="statline">
                <span>Físico</span>
                <b>
                    ${partner.physical || "-"}
                </b>
            </div>
            <div class="statline">
                <span>Mental</span>
                <b>
                    ${partner.mental || "-"}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                💍 PRÓXIMO PASSO
            </div>
            <p>
                O casamento custa
                $${MARRIAGE_COST}.
            </p>
            <button
                class="green"
                onclick="dating()">
                💍 CASAR
            </button>
        </div>
    `;
}
/* =========================================================
   CASAMENTO
========================================================= */
function marry() {
    ensurePlayer();
    if (
        player.relationship !==
        "Namorando"
    ) {
        alert(
            "❤️ Você precisa estar namorando."
        );
        return;
    }
    if (
        player.money <
        MARRIAGE_COST
    ) {
        alert(
            "💰 Você precisa de $" +
            MARRIAGE_COST +
            " para se casar."
        );
        return;
    }
    player.money -=
        MARRIAGE_COST;
    player.relationship =
        "Casado";
    player.married =
        true;
    player.log =
        player.log || [];
    player.log.unshift(
        "💍 Você se casou com " +
        player.partner +
        "."
    );
    save();
    lifeScreen();
}
/* =========================================================
   TER FILHO
========================================================= */
function haveChild() {
    ensurePlayer();
    if (
        player.age <
        MARRIAGE_AGE
    ) {
        alert(
            "Você precisa ter 18 anos."
        );
        return;
    }
    if (
        !player.married
    ) {
        alert(
            "💍 Você precisa estar casado."
        );
        return;
    }
    if (
        player.money <
        CHILD_COST
    ) {
        alert(
            "💰 Você precisa de $" +
            CHILD_COST +
            " para ter um filho."
        );
        return;
    }
    if (
        !Array.isArray(
            player.children
        )
    ) {
        player.children = [];
    }
    if (
        player.children.length >=
        MAX_CHILDREN
    ) {
        alert(
            "Sua família já possui cinco filhos."
        );
        return;
    }
    player.money -=
        CHILD_COST;
    const names = [
        "Alex",
        "Lucas",
        "Rafael",
        "Miguel",
        "Arthur",
        "Gabriel",
        "Davi",
        "Theo",
        "Samuel",
        "Nicolas",
        "Benjamin",
        "Mateus",
        "Enzo",
        "Heitor",
        "Guilherme",
        "Sofia",
        "Helena",
        "Julia",
        "Laura",
        "Valentina",
        "Alice",
        "Isabela",
        "Manuela",
        "Clara",
        "Beatriz"
    ];
    const name =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];
    const partner =
        player.partnerData || {};
    const fatherPotential =
        Number(
            player.potential || 80
        );
    const motherGenetics =
        Number(
            partner.genetics || 75
        );
    const geneticAverage =
        (
            fatherPotential +
            motherGenetics
        ) / 2;
    const variation =
        randomStat(
            -10,
            10
        );
    const childPotential =
        Math.max(
            50,
            Math.min(
                99,
                Math.round(
                    geneticAverage +
                    variation
                )
            )
        );
    const child = {
        name:
            name,
        age:
            0,
        bornYear:
            player.year,
        bornWeek:
            player.week,
        potential:
            childPotential,
        fightingInterest:
            Math.random() < 0.5,
        becameFighter:
            false,
        mother:
            player.partner || null,
        father:
            player.name || null
    };
    player.children.push(
        child
    );
    player.log =
        player.log || [];
    player.log.unshift(
        "👶 Nasceu " +
        name +
        ". A próxima geração começou."
    );
    save();
    lifeScreen();
}
/* =========================================================
   INFORMAÇÕES DA DINASTIA
========================================================= */
function dynastyInfo() {
    ensurePlayer();
    return {
        generation:
            player.children &&
            player.children.length > 0
                ? 2
                : 1,
        children:
            Array.isArray(
                player.children
            )
                ? player.children.length
                : 0
    };
}
/* =========================================================
   FAMÍLIA
========================================================= */
function familyScreen() {
    ensurePlayer();
    const content =
        document.getElementById(
            "content"
        );
    if (!content) return;
    const children =
        Array.isArray(
            player.children
        )
            ? player.children
            : [];
    content.innerHTML = `
        <div class="card">
            <div class="title">
                👨‍👩‍👧 FAMÍLIA
            </div>
            <p>
                Construa sua família
                e seu legado.
            </p>
        </div>
        <div class="card">
            <div class="title">
                ❤️ RELACIONAMENTO
            </div>
            <div class="statline">
                <span>
                    Status
                </span>
                <b>
                    ${
                        player.relationship ||
                        "Solteiro"
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Parceiro
                </span>
                <b>
                    ${
                        player.partner ||
                        "Nenhum"
                    }
                </b>
            </div>
            ${
                player.relationship ===
                "Solteiro"
                    ?
                `
                    <button
                        class="green"
                        onclick="datingScreen()">
                        ❤️ CONHECER ALGUÉM
                    </button>
                `
                    :
                ""
            }
        </div>
        <div class="card">
            <div class="title">
                👶 FILHOS
            </div>
            <div class="statline">
                <span>
                    Filhos
                </span>
                <b>
                    ${children.length}
                </b>
            </div>
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
            ${
                children.length > 0
                    ?
                children.map(
                    function(child) {
                        return `
                            <div class="statline">
                                <span>
                                    👶 ${child.name}
                                </span>
                                <b>
                                    ${child.age} anos
                                </b>
                            </div>
                        `;
                    }
                ).join("")
                    :
                `<p>
                    Você ainda não tem filhos.
                </p>`
            }
        </div>
        <div class="card">
            <div class="title">
                🧬 LEGADO
            </div>
            <p>
                Seus filhos poderão continuar
                sua história e, no futuro,
                assumir sua carreira.
            </p>
        </div>
    `;
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.dating =
    dating;
window.datingScreen =
    datingScreen;
window.passCandidate =
    passCandidate;
window.likeCandidate =
    likeCandidate;
window.showRelationship =
    showRelationship;
window.marry =
    marry;
window.haveChild =
    haveChild;
window.dynastyInfo =
    dynastyInfo;
window.familyScreen =
    familyScreen;
