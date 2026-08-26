/* =========================================================
   MMA LIFE DYNASTY
   FIGHTS.JS
   FIGHT ENGINE — VERSÃO FULL
   =========================================================
   SISTEMA:
   - Tela completa de combate
   - Pré-luta
   - Aquecimento
   - Estratégia
   - Round a round
   - Stamina
   - Saúde
   - Dano
   - Golpes
   - Quedas
   - Controle no chão
   - Finalizações
   - TKO
   - KO
   - Decisão
   - Empate
   - Cartões dos juízes
   - Momentum
   - Confiança
   - Fight IQ
   - Cardio
   - Queixo
   - Defesa
   - Striking
   - Wrestling
   - Grappling
   - Técnica
   - Ofensiva
   - Bloqueio
   - Estilo
   - Fama
   - Bolsa
   - Bônus
   - Histórico
   - Ranking
   - Recuperação
   - Integração com empresário
   - Integração com campeonato
   - Compatibilidade com main.js
========================================================= */
/* =========================================================
   ESTADO GLOBAL
========================================================= */
window.mmaFight = null;
/* =========================================================
   UTILIDADES
========================================================= */
function fightPlayer() {
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
}
function fightContent() {
    return document.getElementById(
        "content"
    );
}
function fightClamp(
    value,
    min,
    max
) {
    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}
function fightRandom(
    min,
    max
) {
    return (
        Math.random() *
        (
            max - min
        )
    ) + min;
}
function fightRandomInt(
    min,
    max
) {
    return Math.floor(
        fightRandom(
            min,
            max + 1
        )
    );
}
function fightRound(
    value
) {
    return Math.round(
        Number(value || 0)
    );
}
function fightPick(
    array
) {
    if (
        !Array.isArray(array) ||
        !array.length
    ) {
        return null;
    }
    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];
}
function fightEscape(
    value
) {
    return String(
        value === undefined ||
        value === null
            ? ""
            : value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}
/* =========================================================
   ATRIBUTOS
========================================================= */
function fightAttributes(
    fighter
) {
    fighter =
        fighter || {};
    const a =
        fighter.attributes || {};
    return {
        strength:
            Number(
                a.strength ||
                fighter.strength ||
                50
            ),
        striking:
            Number(
                a.striking ||
                fighter.striking ||
                50
            ),
        wrestling:
            Number(
                a.wrestling ||
                fighter.wrestling ||
                50
            ),
        grappling:
            Number(
                a.grappling ||
                fighter.grappling ||
                50
            ),
        cardio:
            Number(
                a.cardio ||
                fighter.cardio ||
                50
            ),
        technique:
            Number(
                a.technique ||
                fighter.technique ||
                50
            ),
        defense:
            Number(
                a.defense ||
                fighter.defense ||
                50
            ),
        fightIQ:
            Number(
                a.fightIQ ||
                fighter.fightIQ ||
                50
            ),
        chin:
            Number(
                a.chin ||
                fighter.chin ||
                50
            ),
        offense:
            Number(
                a.offense ||
                fighter.offense ||
                50
            ),
        blocking:
            Number(
                a.blocking ||
                fighter.blocking ||
                50
            )
    };
}
function fightOverall(
    fighter
) {
    if (!fighter) {
        return 50;
    }
    if (
        typeof fighter.power ===
        "number"
    ) {
        return fightClamp(
            fighter.power,
            1,
            100
        );
    }
    const a =
        fightAttributes(
            fighter
        );
    const values = [
        a.strength,
        a.striking,
        a.wrestling,
        a.grappling,
        a.cardio,
        a.technique,
        a.defense,
        a.fightIQ,
        a.chin,
        a.offense,
        a.blocking
    ];
    return fightClamp(
        Math.round(
            values.reduce(
                (
                    total,
                    value
                ) =>
                    total + value,
                0
            ) /
            values.length
        ),
        1,
        100
    );
}
/* =========================================================
   ESTILO
========================================================= */
function fightStyle(
    fighter
) {
    const style =
        String(
            fighter &&
            fighter.style
                ? fighter.style
                : "Completo"
        )
        .toLowerCase();
    if (
        style.includes(
            "striker"
        )
    ) {
        return "Striker";
    }
    if (
        style.includes(
            "wrestler"
        )
    ) {
        return "Wrestler";
    }
    if (
        style.includes(
            "grappler"
        )
    ) {
        return "Grappler";
    }
    return "Completo";
}
/* =========================================================
   NOME
========================================================= */
function fightName(
    fighter,
    fallback
) {
    if (!fighter) {
        return fallback;
    }
    return (
        fighter.displayName ||
        fighter.name ||
        fighter.fullName ||
        fallback
    );
}
/* =========================================================
   CRIAR ADVERSÁRIO
========================================================= */
function createFightOpponent() {
    const player =
        fightPlayer();
    const existing =
        player &&
        player.nextFight &&
        player.nextFight.opponent;
    if (existing) {
        return {
            ...existing,
            attributes: {
                ...(
                    existing.attributes ||
                    {}
                )
            }
        };
    }
    const playerOVR =
        typeof window.getOverall ===
        "function"
            ? Number(
                window.getOverall()
            )
            : 50;
    const opponentOVR =
        fightClamp(
            Math.round(
                playerOVR +
                fightRandom(
                    -8,
                    8
                )
            ),
            35,
            95
        );
    const names = [
        "Carlos Silva",
        "Lucas Andrade",
        "Mateus Rocha",
        "Rafael Santos",
        "Diego Costa",
        "Bruno Almeida",
        "Gabriel Souza",
        "Victor Oliveira",
        "André Ferreira",
        "Felipe Martins",
        "João Pereira",
        "Marcos Lima",
        "Pedro Carvalho",
        "Renan Duarte",
        "Thiago Ramos",
        "Eduardo Moreira",
        "Caio Mendes",
        "Leonardo Alves"
    ];
    const styles = [
        "Completo",
        "Striker",
        "Wrestler",
        "Grappler"
    ];
    const name =
        fightPick(
            names
        );
    const style =
        fightPick(
            styles
        );
    const difference =
        opponentOVR -
        playerOVR;
    const base =
        opponentOVR;
    return {
        name:
            name,
        displayName:
            name,
        country:
            "Brasil",
        weight:
            player.weight ||
            "Peso Leve",
        style:
            style,
        power:
            opponentOVR,
        overall:
            opponentOVR,
        attributes: {
            strength:
                fightClamp(
                    base +
                    fightRandom(
                        -12,
                        8
                    ),
                    20,
                    100
                ),
            striking:
                fightClamp(
                    base +
                    fightRandom(
                        -10,
                        10
                    ),
                    20,
                    100
                ),
            wrestling:
                fightClamp(
                    base +
                    fightRandom(
                        -12,
                        10
                    ),
                    20,
                    100
                ),
            grappling:
                fightClamp(
                    base +
                    fightRandom(
                        -12,
                        10
                    ),
                    20,
                    100
                ),
            cardio:
                fightClamp(
                    base +
                    fightRandom(
                        -12,
                        10
                    ),
                    20,
                    100
                ),
            technique:
                fightClamp(
                    base +
                    fightRandom(
                        -10,
                        10
                    ),
                    20,
                    100
                ),
            defense:
                fightClamp(
                    base +
                    fightRandom(
                        -12,
                        10
                    ),
                    20,
                    100
                ),
            fightIQ:
                fightClamp(
                    base +
                    fightRandom(
                        -10,
                        10
                    ),
                    20,
                    100
                ),
            chin:
                fightClamp(
                    base +
                    fightRandom(
                        -10,
                        10
                    ),
                    20,
                    100
                ),
            offense:
                fightClamp(
                    base +
                    fightRandom(
                        -10,
                        10
                    ),
                    20,
                    100
                ),
            blocking:
                fightClamp(
                    base +
                    fightRandom(
                        -10,
                        10
                    ),
                    20,
                    100
                )
        },
        confidence:
            60,
        momentum:
            50
    };
}
/* =========================================================
   CRIAR ESTADO DO LUTADOR
========================================================= */
function createFightFighter(
    fighter,
    isPlayer
) {
    const attributes =
        fightAttributes(
            fighter
        );
    const overall =
        fightOverall(
            fighter
        );
    return {
        original:
            fighter,
        name:
            fightName(
                fighter,
                isPlayer
                    ? "Você"
                    : "Adversário"
            ),
        isPlayer:
            isPlayer,
        style:
            fightStyle(
                fighter
            ),
        overall:
            overall,
        attributes:
            attributes,
        health:
            100,
        stamina:
            100,
        confidence:
            Number(
                fighter &&
                fighter.confidence !==
                undefined
                    ? fighter.confidence
                    : 60
            ),
        momentum:
            50,
        knockdowns:
            0,
        significantStrikes:
            0,
        totalStrikes:
            0,
        takedowns:
            0,
        submissionAttempts:
            0,
        controlSeconds:
            0,
        damage:
            0,
        headDamage:
            0,
        bodyDamage:
            0,
        legDamage:
            0,
        landed:
            0,
        blocked:
            0,
        missed:
            0,
        criticalHits:
            0,
        counters:
            0,
        roundScores:
            [],
        currentRound:
            {
                damage:
                    0,
                strikes:
                    0,
                takedowns:
                    0,
                control:
                    0,
                knockdowns:
                    0,
                submission:
                    0
            }
    };
}
/* =========================================================
   ESTRATÉGIAS
========================================================= */
const FIGHT_STRATEGIES = {
    balanced: {
        name:
            "Equilibrada",
        striking:
            1,
        wrestling:
            1,
        grappling:
            1,
        defense:
            1,
        stamina:
            1
    },
    aggressive: {
        name:
            "Agressiva",
        striking:
            1.25,
        wrestling:
            1.10,
        grappling:
            1.05,
        defense:
            0.75,
        stamina:
            0.78
    },
    striker: {
        name:
            "Striker",
        striking:
            1.35,
        wrestling:
            0.65,
        grappling:
            0.70,
        defense:
            0.95,
        stamina:
            0.90
    },
    wrestler: {
        name:
            "Wrestling",
        striking:
            0.75,
        wrestling:
            1.40,
        grappling:
            1.05,
        defense:
            1.00,
        stamina:
            0.88
    },
    grappler: {
        name:
            "Grappling",
        striking:
            0.75,
        wrestling:
            1.05,
        grappling:
            1.40,
        defense:
            1.00,
        stamina:
            0.90
    },
    defensive: {
        name:
            "Defensiva",
        striking:
            0.80,
        wrestling:
            0.80,
        grappling:
            0.90,
        defense:
            1.35,
        stamina:
            1.15
    }
};
/* =========================================================
   ESTRATÉGIA ATUAL
========================================================= */
function fightGetStrategy(
    fighter
) {
    if (
        fighter &&
        fighter.isPlayer &&
        window.mmaFight &&
        window.mmaFight.playerStrategy
    ) {
        return (
            FIGHT_STRATEGIES[
                window.mmaFight.playerStrategy
            ] ||
            FIGHT_STRATEGIES.balanced
        );
    }
    const style =
        fightStyle(
            fighter.original
        );
    if (
        style === "Striker"
    ) {
        return FIGHT_STRATEGIES.striker;
    }
    if (
        style === "Wrestler"
    ) {
        return FIGHT_STRATEGIES.wrestler;
    }
    if (
        style === "Grappler"
    ) {
        return FIGHT_STRATEGIES.grappler;
    }
    return FIGHT_STRATEGIES.balanced;
}
/* =========================================================
   LOG
========================================================= */
function fightLog(
    message,
    type
) {
    if (
        !window.mmaFight
    ) {
        return;
    }
    window.mmaFight.log =
        window.mmaFight.log || [];
    window.mmaFight.log.push({
        text:
            message,
        type:
            type ||
            "normal",
        time:
            Date.now()
    });
    if (
        window.mmaFight.log.length >
        250
    ) {
        window.mmaFight.log.shift();
    }
}
/* =========================================================
   EVENTO DE GOLPE
========================================================= */
function fightStrike(
    attacker,
    defender
) {
    const strategy =
        fightGetStrategy(
            attacker
        );
    const a =
        attacker.attributes;
    const d =
        defender.attributes;
    const strikingPower =
        (
            a.striking *
            0.30
        ) +
        (
            a.technique *
            0.20
        ) +
        (
            a.offense *
            0.15
        ) +
        (
            a.strength *
            0.15
        ) +
        (
            a.fightIQ *
            0.10
        ) +
        (
            attacker.confidence *
            0.10
        );
    const defensePower =
        (
            d.defense *
            0.35
        ) +
        (
            d.blocking *
            0.25
        ) +
        (
            d.fightIQ *
            0.20
        ) +
        (
            d.technique *
            0.10
        ) +
        (
            defender.confidence *
            0.10
        );
    const accuracy =
        fightClamp(
            (
                strikingPower /
                (
                    strikingPower +
                    defensePower
                )
            ) *
            strategy.striking *
            100 +
            fightRandom(
                -8,
                8
            ),
            8,
            92
        );
    const roll =
        Math.random() *
        100;
    attacker.totalStrikes++;
    if (
        roll >
        accuracy
    ) {
        attacker.missed++;
        if (
            Math.random() <
            0.12
        ) {
            defender.momentum =
                fightClamp(
                    defender.momentum +
                    2,
                    0,
                    100
                );
            attacker.momentum =
                fightClamp(
                    attacker.momentum -
                    1,
                    0,
                    100
                );
        }
        return {
            landed:
                false,
            blocked:
                false,
            damage:
                0,
            critical:
                false,
            target:
                "miss"
        };
    }
    const blockChance =
        fightClamp(
            d.blocking -
            (
                a.offense *
                0.18
            ) +
            fightRandom(
                -10,
                10
            ),
            5,
            75
        );
    if (
        Math.random() *
        100 <
        blockChance
    ) {
        attacker.blocked++;
        defender.blocked++;
        return {
            landed:
                false,
            blocked:
                true,
            damage:
                0.5,
            critical:
                false,
            target:
                "block"
        };
    }
    const criticalChance =
        fightClamp(
            (
                a.technique +
                a.offense +
                a.striking
            ) /
            12 -
            (
                d.defense /
                30
            ),
            2,
            18
        );
    const critical =
        Math.random() *
        100 <
        criticalChance;
    let baseDamage =
        (
            a.striking *
            0.30
        ) +
        (
            a.technique *
            0.20
        ) +
        (
            a.strength *
            0.20
        ) +
        (
            a.offense *
            0.15
        ) +
        fightRandom(
            1,
            8
        );
    baseDamage -=
        (
            d.chin *
            0.12
        );
    baseDamage *=
        strategy.striking;
    if (critical) {
        baseDamage *=
            fightRandom(
                1.65,
                2.10
            );
        attacker.criticalHits++;
    }
    const targetRoll =
        Math.random();
    let target =
        "head";
    if (
        targetRoll <
        0.55
    ) {
        target =
            "head";
    }
    else if (
        targetRoll <
        0.82
    ) {
        target =
            "body";
    }
    else {
        target =
            "legs";
    }
    let damage =
        fightClamp(
            baseDamage,
            1,
            18
        );
    if (
        target ===
        "head"
    ) {
        damage *=
            fightRandom(
                1.05,
                1.30
            );
    }
    if (
        target ===
        "body"
    ) {
        damage *=
            fightRandom(
                0.90,
                1.15
            );
    }
    if (
        target ===
        "legs"
    ) {
        damage *=
            fightRandom(
                0.75,
                1.05
            );
    }
    damage =
        fightClamp(
            damage,
            1,
            22
        );
    defender.health =
        fightClamp(
            defender.health -
            damage,
            0,
            100
        );
    defender.damage +=
        damage;
    attacker.landed++;
    attacker.significantStrikes++;
    attacker.currentRound.strikes++;
    attacker.currentRound.damage +=
        damage;
    if (
        target ===
        "head"
    ) {
        defender.headDamage +=
            damage;
    }
    if (
        target ===
        "body"
    ) {
        defender.bodyDamage +=
            damage;
    }
    if (
        target ===
        "legs"
    ) {
        defender.legDamage +=
            damage;
    }
    attacker.momentum =
        fightClamp(
            attacker.momentum +
            (
                critical
                    ? 9
                    : 4
            ),
            0,
            100
        );
    defender.momentum =
        fightClamp(
            defender.momentum -
            (
                critical
                    ? 11
                    : 4
            ),
            0,
            100
        );
    defender.confidence =
        fightClamp(
            defender.confidence -
            (
                critical
                    ? 5
                    : 1.5
            ),
            0,
            100
        );
    return {
        landed:
            true,
        blocked:
            false,
        damage:
            damage,
        critical:
            critical,
        target:
            target
    };
}
/* =========================================================
   QUEDA
========================================================= */
function fightTakedown(
    attacker,
    defender
) {
    const a =
        attacker.attributes;
    const d =
        defender.attributes;
    const strategy =
        fightGetStrategy(
            attacker
        );
    const attack =
        (
            a.wrestling *
            0.40
        ) +
        (
            a.strength *
            0.15
        ) +
        (
            a.technique *
            0.15
        ) +
        (
            a.fightIQ *
            0.15
        ) +
        (
            a.offense *
            0.15
        );
    const defense =
        (
            d.wrestling *
            0.35
        ) +
        (
            d.defense *
            0.30
        ) +
        (
            d.strength *
            0.10
        ) +
        (
            d.fightIQ *
            0.15
        ) +
        (
            d.cardio *
            0.10
        );
    const chance =
        fightClamp(
            (
                attack /
                (
                    attack +
                    defense
                )
            ) *
            100 *
            strategy.wrestling +
            fightRandom(
                -7,
                7
            ),
            5,
            90
        );
    attacker.stamina =
        fightClamp(
            attacker.stamina -
            fightRandom(
                4,
                9
            ),
            0,
            100
        );
    if (
        Math.random() *
        100 >
        chance
    ) {
        return false;
    }
    attacker.takedowns++;
    attacker.currentRound.takedowns++;
    attacker.momentum =
        fightClamp(
            attacker.momentum +
            6,
            0,
            100
        );
    defender.momentum =
        fightClamp(
            defender.momentum -
            5,
            0,
            100
        );
    fightLog(
        `🤼 ${attacker.name} conseguiu a queda sobre ${defender.name}.`,
        "takedown"
    );
    return true;
}
/* =========================================================
   CHÃO
========================================================= */
function fightGroundExchange(
    attacker,
    defender
) {
    const a =
        attacker.attributes;
    const d =
        defender.attributes;
    const strategy =
        fightGetStrategy(
            attacker
        );
    const control =
        (
            a.grappling *
            0.40
        ) +
        (
            a.wrestling *
            0.25
        ) +
        (
            a.technique *
            0.20
        ) +
        (
            a.fightIQ *
            0.15
        );
    const escape =
        (
            d.grappling *
            0.35
        ) +
        (
            d.wrestling *
            0.20
        ) +
        (
            d.defense *
            0.20
        ) +
        (
            d.cardio *
            0.15
        ) +
        (
            d.fightIQ *
            0.10
        );
    const advantage =
        fightClamp(
            (
                control /
                (
                    control +
                    escape
                )
            ) *
            100 *
            strategy.grappling +
            fightRandom(
                -8,
                8
            ),
            5,
            95
        );
    const roll =
        Math.random() *
        100;
    if (
        roll <
        advantage
    ) {
        const damage =
            fightClamp(
                (
                    a.grappling *
                    0.12
                ) +
                (
                    a.strength *
                    0.06
                ) +
                fightRandom(
                    1,
                    5
                ),
                1,
                9
            );
        defender.health =
            fightClamp(
                defender.health -
                damage,
                0,
                100
            );
        defender.damage +=
            damage;
        attacker.currentRound.damage +=
            damage;
        attacker.controlSeconds +=
            fightRandomInt(
                8,
                25
            );
        attacker.currentRound.control +=
            fightRandomInt(
                8,
                25
            );
        attacker.momentum =
            fightClamp(
                attacker.momentum +
                3,
                0,
                100
            );
        defender.stamina =
            fightClamp(
                defender.stamina -
                fightRandom(
                    3,
                    7
                ),
                0,
                100
            );
        return {
            success:
                true,
            damage:
                damage
        };
    }
    defender.stamina =
        fightClamp(
            defender.stamina -
            fightRandom(
                2,
                5
            ),
            0,
            100
        );
    attacker.stamina =
        fightClamp(
            attacker.stamina -
            fightRandom(
                2,
                5
            ),
            0,
            100
        );
    return {
        success:
            false,
        damage:
            0
    };
}
/* =========================================================
   FINALIZAÇÃO
========================================================= */
function fightSubmission(
    attacker,
    defender
) {
    const a =
        attacker.attributes;
    const d =
        defender.attributes;
    const attack =
        (
            a.grappling *
            0.40
        ) +
        (
            a.technique *
            0.25
        ) +
        (
            a.fightIQ *
            0.20
        ) +
        (
            a.offense *
            0.15
        );
    const defense =
        (
            d.grappling *
            0.35
        ) +
        (
            d.defense *
            0.25
        ) +
        (
            d.fightIQ *
            0.20
        ) +
        (
            d.cardio *
            0.10
        ) +
        (
            d.technique *
            0.10
        );
    const fatigueBonus =
        (
            100 -
            defender.stamina
        ) *
        0.20;
    const healthBonus =
        (
            100 -
            defender.health
        ) *
        0.12;
    const chance =
        fightClamp(
            (
                (
                    attack -
                    defense
                ) *
                0.65
            ) +
            fatigueBonus +
            healthBonus -
            12,
            0,
            45
        );
    if (
        Math.random() *
        100 <
        chance
    ) {
        attacker.submissionAttempts++;
        attacker.currentRound.submission++;
        return true;
    }
    return false;
}
/* =========================================================
   KNOCKDOWN
========================================================= */
function fightCheckKnockdown(
    attacker,
    defender,
    result
) {
    if (
        !result ||
        !result.landed
    ) {
        return false;
    }
    if (
        defender.health >
        25
    ) {
        return false;
    }
    const a =
        attacker.attributes;
    const d =
        defender.attributes;
    let chance =
        2;
    chance +=
        (
            a.striking -
            d.chin
        ) *
        0.22;
    chance +=
        (
            100 -
            defender.health
        ) *
        0.15;
    if (
        result.critical
    ) {
        chance +=
            9;
    }
    chance =
        fightClamp(
            chance,
            0,
            30
        );
    if (
        Math.random() *
        100 <
        chance
    ) {
        attacker.knockdowns++;
        attacker.currentRound.knockdowns++;
        defender.health =
            fightClamp(
                defender.health -
                fightRandom(
                    4,
                    10
                ),
                0,
                100
            );
        attacker.momentum =
            fightClamp(
                attacker.momentum +
                12,
                0,
                100
            );
        defender.momentum =
            fightClamp(
                defender.momentum -
                15,
                0,
                100
            );
        defender.confidence =
            fightClamp(
                defender.confidence -
                12,
                0,
                100
            );
        fightLog(
            `💥 ${attacker.name} derrubou ${defender.name}!`,
            "knockdown"
        );
        return true;
    }
    return false;
}
/* =========================================================
   TKO
========================================================= */
function fightCheckTKO(
    attacker,
    defender
) {
    if (
        defender.health <=
        0
    ) {
        return {
            finished:
                true,
            method:
                "KO",
            winner:
                attacker,
            loser:
                defender
        };
    }
    if (
        defender.health <=
        8
    ) {
        const defense =
            defender.attributes.defense;
        const chin =
            defender.attributes.chin;
        const chance =
            fightClamp(
                (
                    16 -
                    defense *
                    0.08 -
                    chin *
                    0.05
                ) +
                (
                    100 -
                    defender.health
                ) *
                0.12,
                2,
                45
            );
        if (
            Math.random() *
            100 <
            chance
        ) {
            return {
                finished:
                    true,
                method:
                    "TKO",
                winner:
                    attacker,
                loser:
                    defender
            };
        }
    }
    return {
        finished:
            false
    };
}
/* =========================================================
   SIMULAÇÃO DE UM ROUND
========================================================= */
function simulateFightRound() {
    const fight =
        window.mmaFight;
    if (
        !fight ||
        fight.finished
    ) {
        return;
    }
    const player =
        fight.player;
    const opponent =
        fight.opponent;
    player.currentRound = {
        damage:
            0,
        strikes:
            0,
        takedowns:
            0,
        control:
            0,
        knockdowns:
            0,
        submission:
            0
    };
    opponent.currentRound = {
        damage:
            0,
        strikes:
            0,
        takedowns:
            0,
        control:
            0,
        knockdowns:
            0,
        submission:
            0
    };
    fightLog(
        `🥊 ROUND ${fight.currentRound} — COMEÇOU!`,
        "round"
    );
    const exchanges =
        fight.currentRound ===
        1
            ? fightRandomInt(
                13,
                19
            )
            : fightRandomInt(
                15,
                23
            );
    let ground =
        false;
    for (
        let i = 0;
        i < exchanges;
        i++
    ) {
        if (
            fight.finished
        ) {
            break;
        }
        const playerStrategy =
            fightGetStrategy(
                player
            );
        const opponentStrategy =
            fightGetStrategy(
                opponent
            );
        /* =========================================
           STAMINA
        ========================================= */
        player.stamina =
            fightClamp(
                player.stamina -
                fightRandom(
                    1.0,
                    2.8
                ) /
                playerStrategy.stamina,
                0,
                100
            );
        opponent.stamina =
            fightClamp(
                opponent.stamina -
                fightRandom(
                    1.0,
                    2.8
                ) /
                opponentStrategy.stamina,
                0,
                100
            );
        /* =========================================
           MOMENTUM
        ========================================= */
        player.momentum =
            fightClamp(
                player.momentum +
                (
                    player.confidence -
                    50
                ) *
                0.008,
                0,
                100
            );
        opponent.momentum =
            fightClamp(
                opponent.momentum +
                (
                    opponent.confidence -
                    50
                ) *
                0.008,
                0,
                100
            );
        /* =========================================
           DECISÃO DO TIPO DE TROCA
        ========================================= */
        const playerStyle =
            fightStyle(
                player.original
            );
        const opponentStyle =
            fightStyle(
                opponent.original
            );
        let takedownProbability =
            0.15;
        let grapplingProbability =
            0.12;
        if (
            playerStrategy ===
            FIGHT_STRATEGIES.wrestler
        ) {
            takedownProbability +=
                0.18;
        }
        if (
            playerStrategy ===
            FIGHT_STRATEGIES.grappler
        ) {
            grapplingProbability +=
                0.20;
        }
        if (
            playerStyle ===
            "Wrestler"
        ) {
            takedownProbability +=
                0.10;
        }
        if (
            playerStyle ===
            "Grappler"
        ) {
            grapplingProbability +=
                0.12;
        }
        if (
            opponentStyle ===
            "Wrestler"
        ) {
            takedownProbability +=
                0.05;
        }
        if (
            Math.random() <
            takedownProbability
        ) {
            const attacker =
                Math.random() <
                0.50
                    ? player
                    : opponent;
            const defender =
                attacker === player
                    ? opponent
                    : player;
            if (
                fightTakedown(
                    attacker,
                    defender
                )
            ) {
                ground =
                    true;
                fightLog(
                    `🤼 ${attacker.name} levou a luta para o chão.`,
                    "ground"
                );
            }
        }
        /* =========================================
           TROCA EM PÉ
        ========================================= */
        if (
            !ground
        ) {
            const attacker =
                Math.random() <
                0.50
                    ? player
                    : opponent;
            const defender =
                attacker === player
                    ? opponent
                    : player;
            const result =
                fightStrike(
                    attacker,
                    defender
                );
            if (
                result.landed
            ) {
                const targetText = {
                    head:
                        "cabeça",
                    body:
                        "corpo",
                    legs:
                        "pernas"
                }[
                    result.target
                ] ||
                "oponente";
                if (
                    result.critical
                ) {
                    fightLog(
                        `💥 ${attacker.name} acertou um GOLPE CRÍTICO na ${targetText}! (-${fightRound(result.damage)}%)`,
                        "critical"
                    );
                }
                else {
                    fightLog(
                        `👊 ${attacker.name} acertou ${targetText} causando ${fightRound(result.damage)}% de dano.`,
                        "strike"
                    );
                }
                fightCheckKnockdown(
                    attacker,
                    defender,
                    result
                );
            }
            else if (
                result.blocked
            ) {
                fightLog(
                    `🛡️ ${defender.name} bloqueou o ataque de ${attacker.name}.`,
                    "block"
                );
            }
        }
        else {
            /* =====================================
               GROUND EXCHANGE
            ===================================== */
            const attacker =
                Math.random() <
                0.50
                    ? player
                    : opponent;
            const defender =
                attacker === player
                    ? opponent
                    : player;
            const result =
                fightGroundExchange(
                    attacker,
                    defender
                );
            if (
                result.success
            ) {
                fightLog(
                    `🥋 ${attacker.name} trabalhou no chão e causou ${fightRound(result.damage)}% de dano.`,
                    "ground"
                );
            }
            if (
                Math.random() <
                grapplingProbability
            ) {
                if (
                    fightSubmission(
                        attacker,
                        defender
                    )
                ) {
                    fight.finished =
                        true;
                    fight.method =
                        "SUBMISSION";
                    fight.winner =
                        attacker;
                    fight.loser =
                        defender;
                    fightLog(
                        `🔒 ${attacker.name} encaixou uma FINALIZAÇÃO!`,
                        "submission"
                    );
                    break;
                }
            }
            if (
                Math.random() <
                0.18
            ) {
                ground =
                    false;
                fightLog(
                    `🥊 ${defender.name} conseguiu voltar para a luta em pé.`,
                    "ground"
                );
            }
        }
        /* =========================================
           CHECAR FINALIZAÇÃO
        ========================================= */
        if (
            fight.finished
        ) {
            break;
        }
        let result =
            fightCheckTKO(
                player,
                opponent
            );
        if (
            result.finished
        ) {
            fight.finished =
                true;
            fight.method =
                result.method;
            fight.winner =
                result.winner;
            fight.loser =
                result.loser;
            fightLog(
                result.method ===
                "KO"
                    ? `💥 ${result.winner.name} conseguiu o KO!`
                    : `🛑 O árbitro interrompeu a luta. ${result.winner.name} venceu por TKO!`,
                "finish"
            );
            break;
        }
        result =
            fightCheckTKO(
                opponent,
                player
            );
        if (
            result.finished
        ) {
            fight.finished =
                true;
            fight.method =
                result.method;
            fight.winner =
                result.winner;
            fight.loser =
                result.loser;
            fightLog(
                result.method ===
                "KO"
                    ? `💥 ${result.winner.name} conseguiu o KO!`
                    : `🛑 O árbitro interrompeu a luta. ${result.winner.name} venceu por TKO!`,
                "finish"
            );
            break;
        }
    }
    /* =====================================================
       CARDIO / RECUPERAÇÃO ENTRE ROUNDS
    ===================================================== */
    player.stamina =
        fightClamp(
            player.stamina +
            (
                player.attributes.cardio *
                0.055
            ),
            0,
            100
        );
    opponent.stamina =
        fightClamp(
            opponent.stamina +
            (
                opponent.attributes.cardio *
                0.055
            ),
            0,
            100
        );
    /* =====================================================
       PONTUAÇÃO DO ROUND
    ===================================================== */
    const playerScore =
        calculateRoundScore(
            player,
            opponent
        );
    const opponentScore =
        calculateRoundScore(
            opponent,
            player
        );
    player.roundScores.push(
        playerScore
    );
    opponent.roundScores.push(
        opponentScore
    );
    fightLog(
        `📊 Round ${fight.currentRound}: ${player.name} ${playerScore} x ${opponentScore} ${opponent.name}.`,
        "score"
    );
    if (
        !fight.finished
    ) {
        if (
            playerScore >
            opponentScore
        ) {
            player.momentum =
                fightClamp(
                    player.momentum +
                    6,
                    0,
                    100
                );
            opponent.momentum =
                fightClamp(
                    opponent.momentum -
                    5,
                    0,
                    100
                );
        }
        else if (
            opponentScore >
            playerScore
        ) {
            opponent.momentum =
                fightClamp(
                    opponent.momentum +
                    6,
                    0,
                    100
                );
            player.momentum =
                fightClamp(
                    player.momentum -
                    5,
                    0,
                    100
                );
        }
    }
    /* =====================================================
       PRÓXIMO ROUND
    ===================================================== */
    if (
        !fight.finished
    ) {
        if (
            fight.currentRound >=
            fight.totalRounds
        ) {
            finishFightByDecision();
        }
        else {
            fight.currentRound++;
        }
    }
}
/* =========================================================
   PONTUAÇÃO DE ROUND
========================================================= */
function calculateRoundScore(
    fighter,
    opponent
) {
    const round =
        fighter.currentRound;
    const opponentRound =
        opponent.currentRound;
    let score =
        10;
    score +=
        round.strikes *
        0.35;
    score +=
        round.takedowns *
        1.45;
    score +=
        round.control /
        18;
    score +=
        round.knockdowns *
        3.0;
    score +=
        round.submission *
        2.0;
    score +=
        round.damage *
        0.18;
    score +=
        fighter.momentum *
        0.015;
    score +=
        fighter.confidence *
        0.01;
    score -=
        opponentRound.strikes *
        0.04;
    score -=
        fighter.stamina <
        20
            ? 1.5
            : 0;
    return fightClamp(
        Math.round(
            score
        ),
        7,
        10
    );
}
/* =========================================================
   DECISÃO
========================================================= */
function finishFightByDecision() {
    const fight =
        window.mmaFight;
    if (
        !fight
    ) {
        return;
    }
    let playerRounds =
        0;
    let opponentRounds =
        0;
    for (
        let i = 0;
        i <
        fight.player.roundScores.length;
        i++
    ) {
        const p =
            fight.player.roundScores[i];
        const o =
            fight.opponent.roundScores[i];
        if (
            p >
            o
        ) {
            playerRounds++;
        }
        else if (
            o >
            p
        ) {
            opponentRounds++;
        }
    }
    let method =
        "DECISION";
    let winner =
        null;
    let loser =
        null;
    if (
        playerRounds >
        opponentRounds
    ) {
        winner =
            fight.player;
        loser =
            fight.opponent;
    }
    else if (
        opponentRounds >
        playerRounds
    ) {
        winner =
            fight.opponent;
        loser =
            fight.player;
    }
    else {
        method =
            "DRAW";
    }
    /* =====================================================
       JUÍZES
    ===================================================== */
    const judges = [];
    for (
        let i = 0;
        i < 3;
        i++
    ) {
        let playerScore =
            0;
        let opponentScore =
            0;
        for (
            let r = 0;
            r <
            fight.player.roundScores.length;
            r++
        ) {
            const p =
                fight.player.roundScores[r];
            const o =
                fight.opponent.roundScores[r];
            if (
                p >
                o
            ) {
                playerScore +=
                    10;
                opponentScore +=
                    9;
            }
            else if (
                o >
                p
            ) {
                playerScore +=
                    9;
                opponentScore +=
                    10;
            }
            else {
                playerScore +=
                    10;
                opponentScore +=
                    10;
            }
        }
        /* Pequena variação realista dos juízes */
        const variance =
            fightRandomInt(
                -1,
                1
            );
        playerScore +=
            variance;
        opponentScore -=
            variance;
        judges.push({
            player:
                playerScore,
            opponent:
                opponentScore
        });
    }
    let playerJudgeWins =
        0;
    let opponentJudgeWins =
        0;
    judges.forEach(
        function(
            judge
        ) {
            if (
                judge.player >
                judge.opponent
            ) {
                playerJudgeWins++;
            }
            else if (
                judge.opponent >
                judge.player
            ) {
                opponentJudgeWins++;
            }
        }
    );
    if (
        playerJudgeWins >
        opponentJudgeWins
    ) {
        winner =
            fight.player;
        loser =
            fight.opponent;
        method =
            "DECISION";
    }
    else if (
        opponentJudgeWins >
        playerJudgeWins
    ) {
        winner =
            fight.opponent;
        loser =
            fight.player;
        method =
            "DECISION";
    }
    else {
        winner =
            null;
        loser =
            null;
        method =
            "DRAW";
    }
    fight.finished =
        true;
    fight.method =
        method;
    fight.winner =
        winner;
    fight.loser =
        loser;
    fight.judges =
        judges;
    if (
        method ===
        "DRAW"
    ) {
        fightLog(
            `⚖️ DECISÃO DIVIDIDA: a luta terminou empatada.`,
            "finish"
        );
    }
    else {
        fightLog(
            `📣 ${winner.name} venceu por DECISÃO.`,
            "finish"
        );
    }
}
/* =========================================================
   EFEITOS PRÉ-LUTA
========================================================= */
function fightWarmup() {
    const fight =
        window.mmaFight;
    if (
        !fight
    ) {
        return;
    }
    fight.player.stamina =
        fightClamp(
            fight.player.stamina +
            4,
            0,
            100
        );
    fight.opponent.stamina =
        fightClamp(
            fight.opponent.stamina +
            4,
            0,
            100
        );
    fight.player.confidence =
        fightClamp(
            fight.player.confidence +
            fightRandom(
                1,
                4
            ),
            0,
            100
        );
    fightLog(
        `🔥 ${fight.player.name} terminou o aquecimento.`,
        "warmup"
    );
}
/* =========================================================
   CRIAR LUTA
========================================================= */
function createFight() {
    const player =
        fightPlayer();
    const opponent =
        createFightOpponent();
    const playerFighter =
        createFightFighter(
            player,
            true
        );
    const opponentFighter =
        createFightFighter(
            opponent,
            false
        );
    let rounds =
        3;
    if (
        player.nextFight &&
        player.nextFight.titleFight
    ) {
        rounds =
            5;
    }
    if (
        player.nextFight &&
        player.nextFight.championship
    ) {
        rounds =
            5;
    }
    window.mmaFight = {
        player:
            playerFighter,
        opponent:
            opponentFighter,
        playerStrategy:
            "balanced",
        currentRound:
            1,
        totalRounds:
            rounds,
        finished:
            false,
        method:
            null,
        winner:
            null,
        loser:
            null,
        judges:
            [],
        log:
            [],
        startedAt:
            Date.now(),
        event:
            player.nextFight &&
            player.nextFight.event
                ? player.nextFight.event
                : null,
        fightData:
            player.nextFight ||
            null
    };
    fightWarmup();
    fightLog(
        `🏟️ A luta entre ${playerFighter.name} e ${opponentFighter.name} vai começar!`,
        "intro"
    );
}
/* =========================================================
   TELA DE ESTRATÉGIA
========================================================= */
function fightScreen() {
    const player =
        fightPlayer();
    const content =
        fightContent();
    if (
        !player ||
        !content
    ) {
        return;
    }
    if (
        !window.mmaFight ||
        window.mmaFight.finished
    ) {
        createFight();
    }
    renderFightPreFight();
}
/* =========================================================
   PRÉ-LUTA
========================================================= */
function renderFightPreFight() {
    const fight =
        window.mmaFight;
    const content =
        fightContent();
    if (
        !fight ||
        !content
    ) {
        return;
    }
    const p =
        fight.player;
    const o =
        fight.opponent;
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 NOITE DE LUTA
            </div>
            <p>
                ${fightEscape(
                    fight.event &&
                    fight.event.name
                        ? fight.event.name
                        : "Evento MMA"
                )}
            </p>
        </div>
        <div class="card">
            <div class="title">
                ⚔️ ENCARADA
            </div>
            <div class="fight-versus">
                <div class="fight-corner">
                    <div class="fight-avatar">
                        🥊
                    </div>
                    <h2>
                        ${fightEscape(
                            p.name
                        )}
                    </h2>
                    <strong>
                        OVR ${fightRound(
                            p.overall
                        )}
                    </strong>
                    <p>
                        ${fightEscape(
                            p.style
                        )}
                    </p>
                </div>
                <div class="fight-vs">
                    VS
                </div>
                <div class="fight-corner">
                    <div class="fight-avatar">
                        🥊
                    </div>
                    <h2>
                        ${fightEscape(
                            o.name
                        )}
                    </h2>
                    <strong>
                        OVR ${fightRound(
                            o.overall
                        )}
                    </strong>
                    <p>
                        ${fightEscape(
                            o.style
                        )}
                    </p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🧠 ESTRATÉGIA
            </div>
            <button
                class="main-button"
                onclick="setFightStrategy('balanced')">
                ⚖️ EQUILIBRADA
            </button>
            <button
                class="main-button"
                onclick="setFightStrategy('aggressive')">
                🔥 AGRESSIVA
            </button>
            <button
                class="main-button"
                onclick="setFightStrategy('striker')">
                👊 STRIKER
            </button>
            <button
                class="main-button"
                onclick="setFightStrategy('wrestler')">
                🤼 WRESTLING
            </button>
            <button
                class="main-button"
                onclick="setFightStrategy('grappler')">
                🥋 GRAPPLING
            </button>
            <button
                class="main-button"
                onclick="setFightStrategy('defensive')">
                🛡️ DEFENSIVA
            </button>
        </div>
        <div class="card">
            <div class="title">
                📊 ATRIBUTOS
            </div>
            <div class="statline">
                <span>
                    Striking
                </span>
                <b>
                    ${fightRound(
                        p.attributes.striking
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Wrestling
                </span>
                <b>
                    ${fightRound(
                        p.attributes.wrestling
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Grappling
                </span>
                <b>
                    ${fightRound(
                        p.attributes.grappling
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Defesa
                </span>
                <b>
                    ${fightRound(
                        p.attributes.defense
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Cardio
                </span>
                <b>
                    ${fightRound(
                        p.attributes.cardio
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Fight IQ
                </span>
                <b>
                    ${fightRound(
                        p.attributes.fightIQ
                    )}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🥊 PRONTO?
            </div>
            <button
                class="green"
                onclick="startFight()">
                🔔 TOCAR O SINO
            </button>
        </div>
    `;
}
/* =========================================================
   DEFINIR ESTRATÉGIA
========================================================= */
function setFightStrategy(
    strategy
) {
    if (
        !window.mmaFight
    ) {
        return;
    }
    if (
        !FIGHT_STRATEGIES[
            strategy
        ]
    ) {
        strategy =
            "balanced";
    }
    window.mmaFight.playerStrategy =
        strategy;
    fightLog(
        `🧠 Estratégia escolhida: ${FIGHT_STRATEGIES[strategy].name}.`,
        "strategy"
    );
    renderFightPreFight();
}
/* =========================================================
   COMEÇAR LUTA
========================================================= */
function startFight() {
    const fight =
        window.mmaFight;
    if (
        !fight
    ) {
        return;
    }
    fight.started =
        true;
    renderFight();
}
/* =========================================================
   RENDERIZAR COMBATE
========================================================= */
function renderFight() {
    const fight =
        window.mmaFight;
    const content =
        fightContent();
    if (
        !fight ||
        !content
    ) {
        return;
    }
    const p =
        fight.player;
    const o =
        fight.opponent;
    const log =
        fight.log || [];
    const visibleLog =
        log
            .slice(
                -35
            )
            .reverse();
    content.innerHTML = `
        <div class="card fight-header">
            <div class="title">
                🥊 ROUND ${fight.currentRound}
                / ${fight.totalRounds}
            </div>
            <p>
                ${fightEscape(
                    fight.event &&
                    fight.event.name
                        ? fight.event.name
                        : "COMBATE"
                )}
            </p>
        </div>
        <div class="card fight-scoreboard">
            <div class="fighter-score">
                <div class="fight-avatar">
                    🥊
                </div>
                <h2>
                    ${fightEscape(
                        p.name
                    )}
                </h2>
                <div class="fight-stat">
                    ❤️ ${fightRound(
                        p.health
                    )}%
                </div>
                <div class="fight-stat">
                    ⚡ ${fightRound(
                        p.stamina
                    )}%
                </div>
                <div class="fight-stat">
                    🔥 ${fightRound(
                        p.momentum
                    )}%
                </div>
            </div>
            <div class="fight-vs">
                VS
            </div>
            <div class="fighter-score">
                <div class="fight-avatar">
                    🥊
                </div>
                <h2>
                    ${fightEscape(
                        o.name
                    )}
                </h2>
                <div class="fight-stat">
                    ❤️ ${fightRound(
                        o.health
                    )}%
                </div>
                <div class="fight-stat">
                    ⚡ ${fightRound(
                        o.stamina
                    )}%
                </div>
                <div class="fight-stat">
                    🔥 ${fightRound(
                        o.momentum
                    )}%
                </div>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🧠 SUA ESTRATÉGIA
            </div>
            <strong>
                ${
                    FIGHT_STRATEGIES[
                        fight.playerStrategy
                    ].name
                }
            </strong>
        </div>
        <div class="card">
            <div class="title">
                📋 AÇÃO DA LUTA
            </div>
            <div class="fight-log">
                ${
                    visibleLog.length
                        ?
                        visibleLog
                            .map(
                                function(
                                    item
                                ) {
                                    return `
                                        <div class="fight-log-item ${fightEscape(item.type)}">
                                            ${fightEscape(item.text)}
                                        </div>
                                    `;
                                }
                            )
                            .join("")
                        :
                        `
                            <p>
                                O combate está começando...
                            </p>
                        `
                }
            </div>
        </div>
        <div class="card">
            <div class="title">
                📊 ESTATÍSTICAS
            </div>
            <div class="statline">
                <span>
                    Seus golpes
                </span>
                <b>
                    ${p.landed}
                </b>
            </div>
            <div class="statline">
                <span>
                    Golpes adversário
                </span>
                <b>
                    ${o.landed}
                </b>
            </div>
            <div class="statline">
                <span>
                    Seus knockdowns
                </span>
                <b>
                    ${p.knockdowns}
                </b>
            </div>
            <div class="statline">
                <span>
                    Knockdowns adversário
                </span>
                <b>
                    ${o.knockdowns}
                </b>
            </div>
            <div class="statline">
                <span>
                    Suas quedas
                </span>
                <b>
                    ${p.takedowns}
                </b>
            </div>
            <div class="statline">
                <span>
                    Quedas adversário
                </span>
                <b>
                    ${o.takedowns}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🥊 PRÓXIMA AÇÃO
            </div>
            ${
                fight.finished
                    ?
                    `
                        <button
                            class="green"
                            onclick="showFightResult()">
                            🏆 VER RESULTADO
                        </button>
                    `
                    :
                    `
                        <button
                            class="main-button"
                            onclick="runFightRound()">
                            🔔 LUTAR ROUND ${fight.currentRound}
                        </button>
                    `
            }
        </div>
    `;
}
/* =========================================================
   EXECUTAR ROUND
========================================================= */
function runFightRound() {
    const fight =
        window.mmaFight;
    if (
        !fight ||
        fight.finished
    ) {
        return;
    }
    simulateFightRound();
    renderFight();
    if (
        fight.finished
    ) {
        setTimeout(
            function() {
                showFightResult();
            },
            350
        );
    }
}
/* =========================================================
   RESULTADO
========================================================= */
function showFightResult() {
    const fight =
        window.mmaFight;
    const content =
        fightContent();
    if (
        !fight ||
        !content
    ) {
        return;
    }
    const p =
        fight.player;
    const o =
        fight.opponent;
    let resultTitle =
        "⚖️ EMPATE";
    let resultClass =
        "draw";
    if (
        fight.winner ===
        p
    ) {
        resultTitle =
            "🏆 VITÓRIA!";
        resultClass =
            "win";
    }
    else if (
        fight.winner ===
        o
    ) {
        resultTitle =
            "❌ DERROTA";
        resultClass =
            "loss";
    }
    content.innerHTML = `
        <div class="card fight-result ${resultClass}">
            <div class="title">
                ${resultTitle}
            </div>
            <div class="fight-result-versus">
                <div>
                    <div class="fight-avatar">
                        🥊
                    </div>
                    <h2>
                        ${fightEscape(
                            p.name
                        )}
                    </h2>
                    <strong>
                        ${p.roundScores.join(
                            " • "
                        )}
                    </strong>
                </div>
                <div class="fight-vs">
                    VS
                </div>
                <div>
                    <div class="fight-avatar">
                        🥊
                    </div>
                    <h2>
                        ${fightEscape(
                            o.name
                        )}
                    </h2>
                    <strong>
                        ${o.roundScores.join(
                            " • "
                        )}
                    </strong>
                </div>
            </div>
            <h2>
                ${
                    fight.method ===
                    "DRAW"
                        ? "EMPATE"
                        : fight.method
                }
            </h2>
        </div>
        <div class="card">
            <div class="title">
                🧾 CARTÕES DOS JUÍZES
            </div>
            ${
                fight.judges &&
                fight.judges.length
                    ?
                    fight.judges
                        .map(
                            function(
                                judge,
                                index
                            ) {
                                return `
                                    <div class="statline">
                                        <span>
                                            Juiz ${index + 1}
                                        </span>
                                        <b>
                                            ${judge.player}
                                            -
                                            ${judge.opponent}
                                        </b>
                                    </div>
                                `;
                            }
                        )
                        .join("")
                    :
                    `
                        <p>
                            Resultado definido antes dos juízes.
                        </p>
                    `
            }
        </div>
        <div class="card">
            <div class="title">
                📊 ESTATÍSTICAS FINAIS
            </div>
            <div class="statline">
                <span>
                    ${fightEscape(
                        p.name
                    )}
                </span>
                <b>
                    ${p.landed} golpes
                </b>
            </div>
            <div class="statline">
                <span>
                    ${fightEscape(
                        o.name
                    )}
                </span>
                <b>
                    ${o.landed} golpes
                </b>
            </div>
            <div class="statline">
                <span>
                    Seus knockdowns
                </span>
                <b>
                    ${p.knockdowns}
                </b>
            </div>
            <div class="statline">
                <span>
                    Quedas
                </span>
                <b>
                    ${p.takedowns}
                </b>
            </div>
            <div class="statline">
                <span>
                    Finalizações tentadas
                </span>
                <b>
                    ${p.submissionAttempts}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                💰 PAGAMENTO
            </div>
            <div class="statline">
                <span>
                    Bolsa
                </span>
                <b>
                    $${fightRound(
                        calculateFightPurse()
                    )}
                </b>
            </div>
            ${
                fight.winner ===
                p
                    ?
                    `
                        <div class="statline">
                            <span>
                                Bônus de vitória
                            </span>
                            <b>
                                $${fightRound(
                                    calculateFightWinBonus()
                                )}
                            </b>
                        </div>
                    `
                    :
                    ""
            }
        </div>
        <div class="card">
            <div class="title">
                📈 CONSEQUÊNCIAS
            </div>
            <p>
                ${
                    fight.winner === p
                        ?
                        "Sua vitória aumenta sua fama e fortalece sua posição na carreira."
                        :
                    fight.winner === o
                        ?
                        "A derrota afetará sua fama e sua posição. É hora de voltar ao treino."
                        :
                        "O empate mantém sua carreira em equilíbrio."
                }
            </p>
        </div>
        <div class="card">
            <button
                class="green"
                onclick="completeFight()">
                ✅ ENCERRAR COMBATE
            </button>
        </div>
    `;
}
/* =========================================================
   BOLSA
========================================================= */
function calculateFightPurse() {
    const player =
        fightPlayer();
    const fight =
        window.mmaFight;
    let purse =
        500;
    if (
        player.currentContract &&
        player.currentContract.active
    ) {
        purse =
            Number(
                player.currentContract.purse ||
                500
            );
    }
    if (
        fight &&
        fight.fightData &&
        fight.fightData.purse
    ) {
        purse =
            Number(
                fight.fightData.purse
            );
    }
    return Math.max(
        0,
        purse
    );
}
function calculateFightWinBonus() {
    const player =
        fightPlayer();
    const fight =
        window.mmaFight;
    let bonus =
        250;
    if (
        player.currentContract &&
        player.currentContract.active
    ) {
        bonus =
            Number(
                player.currentContract.winBonus ||
                250
            );
    }
    if (
        fight &&
        fight.fightData &&
        fight.fightData.winBonus
    ) {
        bonus =
            Number(
                fight.fightData.winBonus
            );
    }
    return Math.max(
        0,
        bonus
    );
}
/* =========================================================
   APLICAR RESULTADO AO JOGADOR
========================================================= */
function completeFight() {
    const player =
        fightPlayer();
    const fight =
        window.mmaFight;
    if (
        !player ||
        !fight ||
        !fight.finished
    ) {
        return;
    }
    /* =====================================================
       IMPEDIR DUPLICAÇÃO
    ===================================================== */
    if (
        fight.applied
    ) {
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
        return;
    }
    fight.applied =
        true;
    const isPlayerWinner =
        fight.winner ===
        fight.player;
    const isDraw =
        fight.method ===
        "DRAW";
    const purse =
        calculateFightPurse();
    const bonus =
        isPlayerWinner
            ? calculateFightWinBonus()
            : 0;
    player.money =
        Number(
            player.money || 0
        ) +
        purse +
        bonus;
    player.fame =
        Number(
            player.fame || 0
        );
    if (
        isPlayerWinner
    ) {
        player.fame +=
            fight.method ===
            "KO"
                ? 8
                :
            fight.method ===
            "TKO"
                ? 7
                :
            fight.method ===
            "SUBMISSION"
                ? 7
                :
            5;
    }
    else if (
        isDraw
    ) {
        player.fame +=
            1;
    }
    else {
        player.fame =
            Math.max(
                0,
                player.fame -
                2
            );
    }
    /* =====================================================
       RECORD
    ===================================================== */
    if (
        player.professional &&
        player.professional.active
    ) {
        player.professional.wins =
            Number(
                player.professional.wins ||
                0
            );
        player.professional.losses =
            Number(
                player.professional.losses ||
                0
            );
        player.professional.draws =
            Number(
                player.professional.draws ||
                0
            );
        if (
            isPlayerWinner
        ) {
            player.professional.wins++;
        }
        else if (
            isDraw
        ) {
            player.professional.draws++;
        }
        else {
            player.professional.losses++;
        }
        if (
            player.currentContract &&
            player.currentContract.active
        ) {
            player.currentContract.fightsCompleted =
                Number(
                    player.currentContract.fightsCompleted ||
                    0
                ) + 1;
        }
    }
    else {
        player.amateur =
            player.amateur || {};
        player.amateur.wins =
            Number(
                player.amateur.wins ||
                0
            );
        player.amateur.losses =
            Number(
                player.amateur.losses ||
                0
            );
        player.amateur.draws =
            Number(
                player.amateur.draws ||
                0
            );
        if (
            isPlayerWinner
        ) {
            player.amateur.wins++;
        }
        else if (
            isDraw
        ) {
            player.amateur.draws++;
        }
        else {
            player.amateur.losses++;
        }
    }
    /* =====================================================
       SAÚDE
    ===================================================== */
    const damageTaken =
        fight.player.damage;
    player.health =
        fightClamp(
            100 -
            damageTaken *
            0.70,
            25,
            100
        );
    if (
        fight.player.health <
        45
    ) {
        player.health =
            Math.min(
                player.health,
                55
            );
    }
    /* =====================================================
       FADIGA
    ===================================================== */
    player.fatigue =
        fightClamp(
            Number(
                player.fatigue || 0
            ) +
            25 +
            (
                100 -
                fight.player.stamina
            ) *
            0.25,
            0,
            100
        );
    /* =====================================================
       LESÃO
    ===================================================== */
    player.fightInjury =
        null;
    if (
        damageTaken >
        35
    ) {
        const injuryChance =
            fightClamp(
                (
                    damageTaken -
                    30
                ) *
                1.5,
                5,
                70
            );
        if (
            Math.random() *
            100 <
            injuryChance
        ) {
            const injuries = [
                "Corte no rosto",
                "Contusão facial",
                "Lesão muscular",
                "Problema no ombro",
                "Lesão na mão",
                "Costela dolorida",
                "Joelho machucado"
            ];
            player.fightInjury = {
                name:
                    fightPick(
                        injuries
                    ),
                weeks:
                    fightRandomInt(
                        1,
                        5
                    )
            };
        }
    }
    /* =====================================================
       HISTÓRICO
    ===================================================== */
    player.fightHistory =
        player.fightHistory ||
        [];
    player.fightHistory.unshift({
        year:
            Number(
                player.year || 2026
            ),
        week:
            Number(
                player.week || 1
            ),
        opponent:
            fight.opponent.name,
        result:
            isPlayerWinner
                ? "Vitória"
                :
            isDraw
                ? "Empate"
                : "Derrota",
        method:
            fight.method,
        event:
            fight.event &&
            fight.event.name
                ? fight.event.name
                : "Evento MMA",
        purse:
            purse,
        bonus:
            bonus,
        playerScore:
            fight.player.roundScores,
        opponentScore:
            fight.opponent.roundScores
    });
    /* =====================================================
       LOG
    ===================================================== */
    player.log =
        player.log || [];
    if (
        isPlayerWinner
    ) {
        player.log.unshift(
            `🏆 ${player.name} venceu ${fight.opponent.name} por ${fight.method}.`
        );
    }
    else if (
        isDraw
    ) {
        player.log.unshift(
            `⚖️ ${player.name} empatou com ${fight.opponent.name}.`
        );
    }
    else {
        player.log.unshift(
            `❌ ${player.name} perdeu para ${fight.opponent.name} por ${fight.method}.`
        );
    }
    if (
        player.fightInjury
    ) {
        player.log.unshift(
            `🩹 Lesão: ${player.fightInjury.name}. Recuperação estimada: ${player.fightInjury.weeks} semanas.`
        );
    }
    /* =====================================================
       LIMPAR PRÓXIMA LUTA
    ===================================================== */
    player.nextFight =
        null;
    player.managerFightOffer =
        null;
    /* =====================================================
       PROCESSADORES EXTERNOS
    ===================================================== */
    if (
        isPlayerWinner &&
        typeof window.processFightVictory ===
        "function"
    ) {
        try {
            window.processFightVictory(
                fight
            );
        }
        catch (
            error
        ) {
            console.error(
                "Erro em processFightVictory:",
                error
            );
        }
    }
    if (
        typeof window.processFightResult ===
        "function"
    ) {
        try {
            window.processFightResult(
                fight
            );
        }
        catch (
            error
        ) {
            console.error(
                "Erro em processFightResult:",
                error
            );
        }
    }
    if (
        typeof window.processRankingFight ===
        "function"
    ) {
        try {
            window.processRankingFight(
                fight
            );
        }
        catch (
            error
        ) {
            console.error(
                "Erro em processRankingFight:",
                error
            );
        }
    }
    fightSave();
    window.mmaFight =
        null;
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
}
/* =========================================================
   SIMULAÇÃO AUTOMÁTICA
========================================================= */
function simulateCompleteFight() {
    const player =
        fightPlayer();
    if (
        !player
    ) {
        return;
    }
    createFight();
    window.mmaFight.started =
        true;
    while (
        window.mmaFight &&
        !window.mmaFight.finished
    ) {
        simulateFightRound();
    }
    return window.mmaFight;
}
/* =========================================================
   PRÉ-VISUALIZAÇÃO DO ADVERSÁRIO
========================================================= */
function getFightOpponent() {
    if (
        window.mmaFight &&
        window.mmaFight.opponent
    ) {
        return window.mmaFight.opponent;
    }
    return createFightOpponent();
}
/* =========================================================
   CANCELAR / SAIR
========================================================= */
function exitFight() {
    if (
        window.mmaFight &&
        window.mmaFight.started &&
        !window.mmaFight.finished
    ) {
        const confirmed =
            confirm(
                "A luta ainda não terminou. Sair agora?"
            );
        if (
            !confirmed
        ) {
            return;
        }
    }
    window.mmaFight =
        null;
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.fightScreen =
    fightScreen;
window.startFight =
    startFight;
window.runFightRound =
    runFightRound;
window.setFightStrategy =
    setFightStrategy;
window.showFightResult =
    showFightResult;
window.completeFight =
    completeFight;
window.simulateCompleteFight =
    simulateCompleteFight;
window.getFightOpponent =
    getFightOpponent;
window.exitFight =
    exitFight;
window.createFight =
    createFight;
/* =========================================================
   COMPATIBILIDADE
========================================================= */
window.fight =
    fightScreen;
window.startFightEngine =
    startFight;
window.playFightRound =
    runFightRound;
/* =========================================================
   FIM DO FIGHT ENGINE
========================================================= */
