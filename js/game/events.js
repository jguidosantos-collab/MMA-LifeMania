const EVENTS = [
{
title: "Semana tranquila",
message: "Treinamento e recuperação."
},
{
title: "Oportunidade regional",
message: "Um evento regional abriu vagas."
},
{
title: "Convite de academia",
message: "Uma equipe observou seu atleta."
}
];
export function rollWeeklyEvent(state) {
const event =
EVENTS[Math.floor(Math.random() * EVENTS.length)];
state.history.push({
year: state.calendar.year,
week: state.calendar.weekOfYear,
...event
});
return event;
}
