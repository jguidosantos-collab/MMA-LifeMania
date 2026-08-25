const TRAINING = [
{ key: "grappling", label: "Jiu-jitsu ofensivo" },
{ key: "defense", label: "Jiu-jitsu defensivo" },
{ key: "wrestling", label: "Wrestling" },
{ key: "striking", label: "Striking" },
{ key: "fightIQ", label: "QI de luta" },
{ key: "discipline", label: "Disciplina" },
{ key: "confidence", label: "Confiança" },
{ key: "strength", label: "Força" },
{ key: "cardio", label: "Cardio" },
{ key: "technique", label: "Técnica" }
export function listTraining() {
return TRAINING;
];
}
export function train(
player,
key,
teamQuality = 50,
weeks = 1
) {
const attr = player.attributes;
if (attr.fatigue >= 90) {
return {
message: "Atleta cansado demais. Descanse."
};
}
const gain =
(0.15 + teamQuality / 500) * weeks;
attr[key] = Math.min(
100,
(attr[key] ?? 0) + gain
);
attr.fatigue =
Math.min(100, attr.fatigue + 8 * weeks);
attr.health =
Math.max(0, attr.health - 1 * weeks);
return {
message: `${key} melhorou ${gain.toFixed(2)}.`
};
}
export function rest(player, weeks = 1) {
player.attributes.fatigue =
Math.max(
0,
player.attributes.fatigue - 18 * weeks
);
player.attributes.health =
Math.min(
100,
player.attributes.health + 4 * weeks
);
return {
message: "Atleta descansou e se recuperou."
};
}
