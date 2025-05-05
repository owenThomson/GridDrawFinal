function getGridSpacing(paperWidth, paperHeight, gridCount) {
    if (gridCount <= 0) throw new Error("Grid count must be greater than zero");
    return {
        spacingX: paperWidth / gridCount,
        spacingY: paperHeight / gridCount
    };
}


function getCellSize(adjustedWidth, adjustedHeight, gridCount) {
    return {
        width: adjustedWidth / gridCount,
        height: adjustedHeight / gridCount
    };
}

module.exports = { getGridSpacing, getCellSize };

