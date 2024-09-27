const tasks = [
    {
        id: 1,
        title: "Les leksjon",
        done: false,
        listId: 1  // Referanse til Liste 1
    },
    {
        id: 2,
        title: "Møt opp på forelesning",
        done: false,
        listId: 1  
    },
    {
        id: 3,
        title: "Gjør øving",
        done: false,
        listId: 1  
    },
    {
        id: 4,
        title: "Arranger party party",
        done: false,
        listId: 2  // Referanse til Liste 2
    }
];
// Oppretter (legger til) list, hvor tasks legges inn basert på listId: 
const lists = [
    {
        id: 1,
        title: "Skole",
    },
    {
        id: 2,
        title: "Moro",
    }
];

export { tasks, lists };  // Eksporterer flere verdier som named exports
