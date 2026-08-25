export function getOverall(player) {
const a = player.attributes;
const keys = [
"strength",
"striking",
"wrestling",
"grappling",
"technique",
"cardio",
"defense",
"fightIQ",
"mental",
"discipline",
"confidence"
];
const total = keys.reduce(
(sum, key) => sum + Number(a[key] ?? 0),
0
);
return Math.round(total / keys.length);
}
