import { COUNTRIES } from "./data/countries.js";
import { STYLES, WEIGHT_CLASSES } from "./data/fighters.js";
import { TEAMS } from "./data/teams.js";
import { createInitialState, createPlayer, advanceWeeks } from "./game/state.js";
import { saveGame, loadGame, deleteSave } from "./game/save.js";
import { showScreen } from "./game/navigation.js";
import { rollWeeklyEvent } from "./game/events.js";
import { train, rest, listTraining } from "./systems/training.js";
import { getOverall } from "./systems/player.js";
import { simulateFight } from "./systems/fights.js";
let state = loadGame() ?? createInitialState();
const $ = (selector) => document.querySelector(selector);
function toast(message) {
const el = $("#toast");
if (!el) return;
el.textContent = message;
el.classList.add("show");
setTimeout(() => el.classList.remove("show"), 2200);
}
function esc(value) {
return String(value).replace(/[&<>"']/g, (c) => ({
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': "&quot;",
"'": "&#39;"
}[c]));
}
function renderDate() {
if (!state.calendar) return;
const age = state.player ? ` • Idade ${state.player.age}` : "";
$("#gameDate").textContent =
`Semana ${state.calendar.weekOfYear} • ${state.calendar.monthName} • ${state.calendar.year}${age}`;
}
function renderHome() {
$("#homeScreen").innerHTML = `
<div class="card">
<p class="muted">Simulador de carreira, vida e dinastia nos esportes de combate.</p>
<h2>Construa uma carreira. Construa uma família. Construa uma dinastia.</h2>
<button class="primary" data-screen="${state.player ? "career" : "create"}">
${state.player ? "Continuar carreira" : "Criar lutador"}
</button>
</div>`;
const button = $("#homeScreen").querySelector("[data-screen]");
if (button) button.onclick = () => showScreen(button.dataset.screen);
}
function renderCreate() {
$("#createScreen").innerHTML = `
<div class="card">
<h2>Criar lutador</h2>
<p class="muted">A carreira começa aos 15 anos.</p>
<form id="createForm">
<div class="form-grid">
<label>Nome
<input id="pName" required maxlength="30" value="">
</label>
<label>País
<select id="pCountry">
${COUNTRIES.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}
</select>
</label>
<label>Categoria
<select id="pWeight">
${WEIGHT_CLASSES.map(w => `<option value="${w.id}">${esc(w.name)}</option>`).join("")}
</select>
</label>
<label>Estilo
<select id="pStyle">
${STYLES.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join("")}
</select>
</label>
</div>
<br>
<button class="primary" type="submit">Começar carreira</button>
</form>
</div>`;
$("#createForm").onsubmit = (event) => {
event.preventDefault();
const name = $("#pName").value.trim();
if (!name) return;
state.player = createPlayer({
name,
country: $("#pCountry").value,
weightClass: $("#pWeight").value,
style: $("#pStyle").value
});
state.family.members = [
{ ...state.player, generation: 1, role: "protagonist" }
];
saveGame(state);
toast("Carreira criada.");
renderAll();
showScreen("career");
};
}
function renderCareer() {
if (!state.player) {
$("#careerScreen").innerHTML = "";
return;
}
const p = state.player;
const a = p.attributes;
$("#careerScreen").innerHTML = `
<nav>
<button data-screen="career">Carreira</button>
<button data-screen="training">Treinamento</button>
<button data-screen="fight">Lutas</button>
<button data-screen="family">Família</button>
</nav>
<div class="grid">
<div class="card">
<h3>${esc(p.name)}</h3>
<div class="stat"><span>Idade</span><b>${p.age}</b></div>
<div class="stat"><span>Estilo</span><b>${esc(p.style)}</b></div>
<div class="stat"><span>Ranking</span><b>#${p.career.ranking}</b></div>
<div class="stat"><span>Dinheiro</span><b>US$ ${p.money.toFixed(2)}</b></div>
</div>
<div class="card">
<h3>Estado</h3>
<div class="stat"><span>Overall</span><b>${getOverall(p)}</b></div>
<div class="stat"><span>Saúde</span><b>${a.health.toFixed(0)}</b></div>
<div class="stat"><span>Fadiga</span><b>${a.fatigue.toFixed(0)}</b></div>
</div>
</div>
<button id="nextWeek" class="primary">Avançar 1 semana</button>
<button id="nextMonth">Avançar 4 semanas</button>`;
$("#careerScreen").querySelectorAll("[data-screen]").forEach(
b => b.onclick = () => showScreen(b.dataset.screen)
);
$("#nextWeek").onclick = () => advanceTime(1);
$("#nextMonth").onclick = () => advanceTime(4);
}
function renderTraining() {
if (!state.player) return;
const team = TEAMS.find(t => t.id === state.player.teamId);
$("#trainingScreen").innerHTML = `
<nav>
<button data-screen="career">Carreira</button>
<button data-screen="training">Treinamento</button>
<button data-screen="fight">Lutas</button>
<button data-screen="family">Família</button>
</nav>
<div class="card">
<h2>Treinamento</h2>
<p class="muted">
Equipe: ${team ? esc(team.name) : "Sem equipe"}
• Fadiga: ${state.player.attributes.fatigue.toFixed(0)}
• Saúde: ${state.player.attributes.health.toFixed(0)}
</p>
<div class="grid">
${listTraining().map(t =>
`<button data-train="${esc(t.key)}">${esc(t.label)}</button>`
).join("")}
</div>
<br>
</div>`;
<button id="restBtn" class="ok">Descansar</button>
$("#trainingScreen").querySelectorAll("[data-train]").forEach(b => {
b.onclick = () => {
const result = train(
state.player,
b.dataset.train,
team?.quality ?? 50,
1
);
toast(result.message);
saveGame(state);
renderAll();
};
});
$("#restBtn").onclick = () => {
toast(rest(state.player, 1).message);
saveGame(state);
renderAll();
};
$("#trainingScreen").querySelectorAll("[data-screen]").forEach(
b => b.onclick = () => showScreen(b.dataset.screen)
);
}
function renderFight() {
if (!state.player) return;
$("#fightScreen").innerHTML = `
<nav>
<button data-screen="career">Carreira</button>
<button data-screen="training">Treinamento</button>
<button data-screen="fight">Lutas</button>
<button data-screen="family">Família</button>
</nav>
<div class="card">
<h2>Central de lutas</h2>
<p>Na V1, o jogador pode simular uma luta amadora.</p>
<button id="fightNow" class="primary">Simular luta amadora</button>
<div id="fightResult"></div>
</div>`;
$("#fightScreen").querySelectorAll("[data-screen]").forEach(
b => b.onclick = () => showScreen(b.dataset.screen)
);
$("#fightNow").onclick = () => {
const opponent = createPlayer({
name: "Adversário Regional",
age: state.player.age,
style: STYLES[Math.floor(Math.random() * STYLES.length)]
});
const result = simulateFight(state.player, opponent, 3);
if (result.winner === "player") {
state.player.record.amateur.w++;
} else if (result.winner === "opponent") {
state.player.record.amateur.l++;
} else {
state.player.record.amateur.d++;
}
$("#fightResult").innerHTML = `
<div class="card">
<h3>
${result.winner === "player"
? "VITÓRIA"
: result.winner === "opponent"
? "DERROTA"
: "EMPATE"}
</h3>
</div>`;
<p>Método: ${esc(result.method)}</p>
saveGame(state);
renderAll();
toast("Luta concluída.");
};
}
function renderFamily() {
const members = state.family?.members ?? [];
$("#familyScreen").innerHTML = `
<nav>
<button data-screen="career">Carreira</button>
<button data-screen="family">Família</button>
</nav>
<div class="card">
<h2>Dinastia</h2>
<p>Gerações registradas: ${state.family?.generations ?? 1}</p>
${members.map(m => `
<div class="stat">
<span>${esc(m.name)}</span>
<span>Geração ${m.generation ?? 1}</span>
</div>
`).join("")}
</div>`;
$("#familyScreen").querySelectorAll("[data-screen]").forEach(
b => b.onclick = () => showScreen(b.dataset.screen)
);
}
function advanceTime(weeks) {
if (!state.player) return;
advanceWeeks(state, weeks);
for (let i = 0; i < weeks; i++) {
rollWeeklyEvent(state);
}
state.player.attributes.fatigue =
Math.max(0, state.player.attributes.fatigue - weeks * 8);
state.player.attributes.health =
Math.min(100, state.player.attributes.health + weeks * 2);
saveGame(state);
renderAll();
toast(`${weeks} semana(s) avançada(s).`);
}
function renderAll() {
renderDate();
renderHome();
renderCreate();
renderCareer();
renderTraining();
renderFight();
renderFamily();
}
$("#saveBtn").onclick = () => {
saveGame(state);
toast("Jogo salvo.");
};
$("#loadBtn").onclick = () => {
const loaded = loadGame();
if (!loaded) {
toast("Nenhum jogo salvo.");
return;
}
state = loaded;
renderAll();
showScreen(state.player ? "career" : "home");
toast("Jogo carregado.");
};
$("#newBtn").onclick = () => {
if (!confirm("Apagar a carreira atual e começar outra?")) return;
deleteSave();
state = createInitialState();
renderAll();
showScreen("home");
toast("Novo jogo iniciado.");
};
renderAll();
showScreen(state.player ? "career" : "home");
