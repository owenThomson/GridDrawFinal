import { canvas, ctx, img, loadAndScaleImage, displayError } from './image-handler.js';

/**
 * Draws a grid on the canvas based on user input
 * @returns {boolean} True if grid was successfully drawn, false otherwise
 */
function drawGrid() {
    const gridSizeInput = document.getElementById('gridSize');
    const lineThicknessInput = document.getElementById('lineThickness');
    const gridColorInput = document.getElementById('gridColor');

    // Check if image is loaded
    if (!img.src) {
        displayError("Please upload an image first");
        return false;
    }

    // Get and validate grid count
    let gridCount = parseInt(gridSizeInput.value, 10);
    if (isNaN(gridCount) || gridCount < 1 || gridCount > 20) {
        displayError("Grid count must be between 1 and 20");
        gridCount = Math.min(Math.max(gridCount, 1), 20);
        gridSizeInput.value = gridCount;
        return false;
    }

    // Get and validate line thickness
    let lineThickness = parseInt(lineThicknessInput.value, 10);
    if (isNaN(lineThickness) || lineThickness < 1 || lineThickness > 10) {
        displayError("Line thickness must be between 1 and 10");
        lineThickness = Math.min(Math.max(lineThickness, 1), 10);
        lineThicknessInput.value = lineThickness;
        return false;
    }

    // Get grid color
    let gridColor = gridColorInput.value;

    // Get scaled dimensions
    const scaledDimensions = loadAndScaleImage();
    if (!scaledDimensions) return false;

    const { width: scaledWidth, height: scaledHeight } = scaledDimensions;

    // Clear the canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //redraw the image.
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    // Calculate grid spacing
    const gridSizeX = scaledWidth / gridCount;
    const gridSizeY = scaledHeight / gridCount;

    // Set line properties
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = lineThickness;

    // Draw vertical grid lines
    for (let x = gridSizeX; x < scaledWidth; x += gridSizeX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, scaledHeight);
        ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = gridSizeY; y < scaledHeight; y += gridSizeY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(scaledWidth, y);
        ctx.stroke();
    }

    return true;
}

/**
 * Removes the grid overlay by redrawing image
 * Uses the loadAndScaleImage function to refresh the canvas
 */function removeGrid() {
    // just redraws the image without grid
    loadAndScaleImage();
}

document.getElementById('gridSize').addEventListener('input', drawGrid);

document.getElementById('lineThickness').addEventListener('input', drawGrid);

document.getElementById('gridColor').addEventListener('input', drawGrid);

export { drawGrid, removeGrid };