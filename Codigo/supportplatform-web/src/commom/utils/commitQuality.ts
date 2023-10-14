export const qualityLevels = [
    {
        level: 0,
        operator: "<",
        barrier: 10,
        color: "#D73A49",
        label: "Péssima",
    },
    {
        level: 1,
        operator: "<",
        barrier: 20,
        color: "#F66A0A",
        label: "Ruim",
    },
    {
        level: 2,
        operator: "<",
        barrier: 40,
        color: "#FFD33D",
        label: "Regular",
    },
    {
        level: 3,
        operator: "<=",
        barrier: 100,
        color: "#28A745",
        label: "Ideal",
    },
    {
        level: 4,
        operator: ">",
        barrier: 100,
        color: "#6F42C1",
        label: "Excessiva",
    },
];
