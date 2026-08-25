const KEY = "mma-dinastia-save-v1";
export function saveGame(state) {
localStorage.setItem(KEY, JSON.stringify(state));
}
export function loadGame() {
try {
const raw = localStorage.getItem(KEY);
return raw ? JSON.parse(raw) : null;
} catch {
return null;
}
export function deleteSave() {
localStorage.removeItem(KEY);
}
}
