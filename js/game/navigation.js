const screens = [
"home",
"create",
"career",
"training",
"fight",
"family",
"calendar"
];
export function showScreen(name) {
for (const screen of screens) {
const el = document.querySelector(`#${screen}Screen`);
if (el) {
el.style.display = screen === name ? "block" : "none";
}
}
}
