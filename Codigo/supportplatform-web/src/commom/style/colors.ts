export const chartColors = [
    "#2188FF", // blue-400
    "#FFDF5D", // yellow-400
    "#34D058", // green-400
    "#EA4A5A", // red-400
    "#8A63D2", // purple-400
    "#FB8532", // orange-400
    "#EC6CB9", // pink-400
    "#032F62", // blue-800
    "#165C26", // green-800
    "#B08800", // yellow-800
    "#C24E00", // orange-800
    "#9E1C23", // red-800
    "#99306F", // pink-800
    "#3A1D6E", // purple-800
];

export function getChartColor(index: number) {
    return chartColors[index % chartColors.length];
}
