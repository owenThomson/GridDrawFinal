function sliderValueToZoom(sliderValue, min = 1, max = 3) {
    return min + (sliderValue / 100) * (max - min);
}

function computeZoomScale(sliderValue, gridSize = 3) {
    return 1.0 + ((sliderValue / 100) * (gridSize - 1));
}


module.exports = { sliderValueToZoom, computeZoomScale };
