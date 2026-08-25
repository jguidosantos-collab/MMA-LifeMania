export function simulateFight(
player,
opponent,
rounds = 3
) {
const p = player.attributes;
const o = opponent.attributes;
const playerScore =
p.striking * 0.25 +
p.wrestling * 0.20 +
p.grappling * 0.20 +
p.cardio * 0.10 +
p.defense * 0.10 +
p.fightIQ * 0.10 +
p.mental * 0.05;
const opponentScore =
o.striking * 0.25 +
o.wrestling * 0.20 +
o.grappling * 0.20 +
o.cardio * 0.10 +
o.defense * 0.10 +
o.fightIQ * 0.10 +
o.mental * 0.05;
const chance =
playerScore / (playerScore + opponentScore);
const roll = Math.random();
let winner = "draw";
if (roll < chance - 0.08) {
winner = "player";
} else if (roll > chance + 0.08) {
winner = "opponent";
}
return {
winner,
method:
winner === "draw"
? "Decisão dividida"
: Math.random() < 0.35
? "Nocaute"
: "Decisão",
rounds: Array.from(
{ length: rounds },
(_, i) =>
`Round ${i + 1}: desempenho simulado`
)
};
}
