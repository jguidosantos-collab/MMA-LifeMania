function random(min, max) {
return Math.random() * (max - min) + min;
}
export function createPlayer(data = {}) {
const attributes = {
strength: random(35, 55),
striking: random(35, 55),
wrestling: random(35, 55),
grappling: random(35, 55),
technique: random(35, 55),
cardio: random(35, 55),
defense: random(35, 55),
fightIQ: random(35, 55),
mental: random(35, 55),
discipline: random(35, 55),
confidence: random(35, 55),
health: 100,
fatigue: 0
};
return {
id: crypto.randomUUID?.() ?? String(Date.now()),
name: data.name ?? "Novo Lutador",
age: data.age ?? 15,
country: data.country ?? "br",
weightClass: data.weightClass ?? "lightweight",
style: data.style ?? "Striker",
appearance: data.appearance ?? {},
attributes: { ...attributes, ...(data.attributes ?? {}) },
teamId: null,
money: 0,
record: {
amateur: { w: 0, l: 0, d: 0 },
professional: { w: 0, l: 0, d: 0 }
},
career: {
ranking: 999,
peakStart: 26,
peakEnd: 32
},
status: "amateur"
};
}
export function createInitialState() {
return {
version: 1,
calendar: {
weekOfYear: 1,
year: 2010,
monthName: "Janeiro"
},
player: null,
family: {
generations: 1,
members: []
},
events: [],
history: []
};
}
export function advanceWeeks(state, weeks) {
for (let i = 0; i < weeks; i++) {
state.calendar.weekOfYear++;
if (state.calendar.weekOfYear > 52) {
state.calendar.weekOfYear = 1;
state.calendar.year++;
}
if (state.player) {
state.player.attributes.fatigue =
Math.min(100, state.player.attributes.fatigue + 2);
}
}
}
