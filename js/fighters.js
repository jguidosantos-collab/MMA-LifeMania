const fighterDatabase = [

    // 🇧🇷 BRASIL
    ["João", "Silva", "O Trovão", "Brasil"],
    ["Lucas", "Ribeiro", "The Wolf", "Brasil"],
    ["Rafael", "Costa", "Furacão", "Brasil"],
    ["Bruno", "Mendes", "Pitbull", "Brasil"],
    ["Caio", "Oliveira", "The Hammer", "Brasil"],
    ["Mateus", "Santos", "Máquina", "Brasil"],
    ["Gabriel", "Souza", "Relâmpago", "Brasil"],
    ["Victor", "Almeida", "O Predador", "Brasil"],
    ["Henrique", "Lima", "Brutal", "Brasil"],
    ["Pedro", "Martins", "Caveira", "Brasil"],
    ["Gustavo", "Ferreira", "Guerreiro", "Brasil"],
    ["Renan", "Barbosa", "Falcão", "Brasil"],
    ["André", "Carvalho", "Tempestade", "Brasil"],
    ["Diego", "Moura", "Dragão", "Brasil"],
    ["Felipe", "Rocha", "Fênix", "Brasil"],

    // 🇺🇸 ESTADOS UNIDOS
    ["Michael", "Johnson", "The Beast", "Estados Unidos"],
    ["James", "Carter", "The King", "Estados Unidos"],
    ["Ryan", "Walker", "War Machine", "Estados Unidos"],
    ["Jason", "Miller", "The Hammer", "Estados Unidos"],
    ["Logan", "Taylor", "The Wolf", "Estados Unidos"],
    ["Derek", "Anderson", "Iron", "Estados Unidos"],
    ["Tyler", "Brown", "The Sniper", "Estados Unidos"],
    ["Ethan", "Wilson", "Storm", "Estados Unidos"],
    ["Marcus", "Davis", "The Tank", "Estados Unidos"],
    ["Chris", "Thompson", "The Reaper", "Estados Unidos"],
    ["Kevin", "Moore", "Crusher", "Estados Unidos"],
    ["Justin", "Harris", "The Ghost", "Estados Unidos"],
    ["Anthony", "Clark", "Razor", "Estados Unidos"],
    ["Brandon", "Lewis", "The Bull", "Estados Unidos"],
    ["Cameron", "Young", "Lightning", "Estados Unidos"],

    // 🇲🇽 MÉXICO
    ["Diego", "Hernández", "El Toro", "México"],
    ["Carlos", "Ramírez", "El León", "México"],
    ["Miguel", "Torres", "La Máquina", "México"],
    ["Alejandro", "Castillo", "El Guerrero", "México"],
    ["Javier", "Morales", "El Fuego", "México"],
    ["Luis", "Navarro", "El Fantasma", "México"],
    ["Ricardo", "Vega", "El Huracán", "México"],
    ["Fernando", "Soto", "El Martillo", "México"],
    ["Andrés", "Mendoza", "El Depredador", "México"],
    ["Santiago", "Flores", "El Cazador", "México"],

    // 🇯🇵 JAPÃO
    ["Haruto", "Tanaka", "The Samurai", "Japão"],
    ["Kenji", "Yamamoto", "Dragon", "Japão"],
    ["Daiki", "Sato", "The Storm", "Japão"],
    ["Ren", "Nakamura", "The Ghost", "Japão"],
    ["Takumi", "Watanabe", "Iron Fist", "Japão"],
    ["Yuki", "Kobayashi", "The Blade", "Japão"],
    ["Kaito", "Suzuki", "Thunder", "Japão"],
    ["Riku", "Ito", "The Wolf", "Japão"],

    // 🇷🇺 RÚSSIA
    ["Ivan", "Petrov", "The Bear", "Rússia"],
    ["Dmitri", "Volkov", "The Wolf", "Rússia"],
    ["Alexei", "Ivanov", "Iron", "Rússia"],
    ["Nikolai", "Sokolov", "The Hammer", "Rússia"],
    ["Viktor", "Morozov", "The Machine", "Rússia"],
    ["Sergei", "Kuznetsov", "The Tank", "Rússia"],
    ["Andrei", "Orlov", "The Eagle", "Rússia"],
    ["Mikhail", "Popov", "The Storm", "Rússia"],

    // 🇬🇧 REINO UNIDO
    ["Jack", "Wilson", "The Lion", "Reino Unido"],
    ["Oliver", "Smith", "The Bulldog", "Reino Unido"],
    ["Harry", "Taylor", "The Hammer", "Reino Unido"],
    ["George", "Brown", "The Ghost", "Reino Unido"],
    ["Charlie", "Jones", "The Warrior", "Reino Unido"],
    ["Liam", "Davies", "The Beast", "Reino Unido"],
    ["Noah", "Evans", "The Wolf", "Reino Unido"],
    ["Thomas", "Roberts", "The Reaper", "Reino Unido"],

    // 🇨🇦 CANADÁ
    ["Evan", "Martin", "The North", "Canadá"],
    ["Ryan", "Wilson", "The Bear", "Canadá"],
    ["Connor", "Thompson", "The Beast", "Canadá"],
    ["Nathan", "White", "Ice", "Canadá"],
    ["Landon", "Clark", "The Hammer", "Canadá"],
    ["Dylan", "Bennett", "The Wolf", "Canadá"],

    // 🇦🇷 ARGENTINA
    ["Mateo", "Gómez", "El Gaucho", "Argentina"],
    ["Nicolás", "Fernández", "El Toro", "Argentina"],
    ["Santiago", "López", "El León", "Argentina"],
    ["Tomás", "Martínez", "El Fuego", "Argentina"],
    ["Facundo", "Díaz", "El Martillo", "Argentina"],
    ["Agustín", "Romero", "El Cazador", "Argentina"],

    // 🇫🇷 FRANÇA
    ["Lucas", "Dubois", "Le Guerrier", "França"],
    ["Hugo", "Martin", "Le Lion", "França"],
    ["Louis", "Bernard", "Le Fantôme", "França"],
    ["Gabriel", "Robert", "La Tempête", "França"],
    ["Antoine", "Richard", "Le Marteau", "França"],

    // 🇩🇪 ALEMANHA
    ["Lukas", "Müller", "Der Wolf", "Alemanha"],
    ["Felix", "Schmidt", "Der Hammer", "Alemanha"],
    ["Max", "Schneider", "Der Bär", "Alemanha"],
    ["Leon", "Fischer", "Der Sturm", "Alemanha"],
    ["Jonas", "Weber", "Der Krieger", "Alemanha"],

    // 🇰🇷 COREIA DO SUL
    ["Min-Jun", "Kim", "The Tiger", "Coreia do Sul"],
    ["Ji-Hoon", "Park", "The Ghost", "Coreia do Sul"],
    ["Seo-Jun", "Lee", "The Blade", "Coreia do Sul"],
    ["Hyun-Woo", "Choi", "The Storm", "Coreia do Sul"],

    // 🇿🇦 ÁFRICA DO SUL
    ["Liam", "Mokoena", "The Lion", "África do Sul"],
    ["Thabo", "Nkosi", "The Warrior", "África do Sul"],
    ["Sipho", "Dlamini", "The Bull", "África do Sul"],
    ["Kabelo", "Molefe", "The Hammer", "África do Sul"]

];


function generateFighter() {

    const data =
        fighterDatabase[
            Math.floor(
                Math.random() *
                fighterDatabase.length
            )
        ];

    const firstName = data[0];
    const lastName = data[1];
    const nickname = data[2];
    const country = data[3];

    return {

        firstName,
        lastName,
        nickname,
        country,

        name:
            `${firstName} ${lastName}`,

        displayName:
            `${firstName} "${nickname}" ${lastName}`,

        power:
            35 +
            Math.random() * 55,

        experience:
            1 +
            Math.floor(
                Math.random() * 15
            ),

        wins: 0,

        losses: 0

    };

}
