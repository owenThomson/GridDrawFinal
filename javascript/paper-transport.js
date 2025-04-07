import { canvas, img, loadAndScaleImage } from './image-handler.js';
import { drawGrid } from './grid-handler.js';

// Default paper sizes in inches (standard paper size)
const DEFAULT_PAPER_WIDTH = 8.5;
const DEFAULT_PAPER_HEIGHT = 11;

// Elements that I access
let paperWidthInput, paperHeightInput, paperInstructionsDiv;
let gridSizeInput;

/**
 * Initializes paper transport feature
 * Sets up event listeners and references to required DOM elements
 */
function initPaperTransport() {
    // references to the inputs in HTML
    paperWidthInput = document.getElementById('paperWidth');
    paperHeightInput = document.getElementById('paperHeight');
    paperInstructionsDiv = document.getElementById('paperInstructions');
    gridSizeInput = document.getElementById('gridSize');

    // event listeners
    paperWidthInput.addEventListener('input', updatePaperInstructions);
    paperHeightInput.addEventListener('input', updatePaperInstructions);

    // Listen for changes to grid size input
    if (gridSizeInput) {
        gridSizeInput.addEventListener('input', updatePaperInstructions);
    }

    // update
    updatePaperInstructions();
}

/**
 * Updates paper grid illustration to match current settings
 * @param {number} gridCount - Number of grid cells to display
 */
function updatePaperIllustration(gridCount) {
    const paperIllustration = document.getElementById('paperIllustration');
    const paperGrid = document.getElementById('paperGrid');

    if (!paperIllustration || !paperGrid || !gridCount) return;

    // Clear existing grid
    paperGrid.innerHTML = '';

    // Create a visual rep of grid
    const paperWidth = parseFloat(paperWidthInput.value);
    const paperHeight = parseFloat(paperHeightInput.value);

    // Set the paper illustration proportions
    const maxWidth = 200; // Maximum width of the paper illustration
    const scale = maxWidth / Math.max(paperWidth, paperHeight * (paperWidth / paperHeight));

    paperIllustration.style.width = `${paperWidth * scale}px`;
    paperIllustration.style.height = `${paperHeight * scale}px`;

    // Create grid lines
    const cellWidth = 100 / gridCount;

    // Create grid with CSS grid
    paperGrid.style.display = 'grid';
    paperGrid.style.gridTemplateColumns = `repeat(${gridCount}, 1fr)`;
    paperGrid.style.gridTemplateRows = `repeat(${gridCount}, 1fr)`;

    // Add grid cells
    for (let i = 0; i < gridCount * gridCount; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        paperGrid.appendChild(cell);
    }
}

/**
 * Calculates grid measurements and updates instructions for drawing on paper
 * Calculates the exact measurements needed to recreate the grid manually
 */
function updatePaperInstructions() {
    // Get values from inputs
    const paperWidth = parseFloat(paperWidthInput.value) || DEFAULT_PAPER_WIDTH;
    const paperHeight = parseFloat(paperHeightInput.value) || DEFAULT_PAPER_HEIGHT;
    const gridCount = parseInt(gridSizeInput?.value, 10) || 5;

    // Calculate cell dimensions for the paper
    const paperCellWidth = paperWidth / gridCount;
    const paperCellHeight = paperHeight / gridCount;

    // Check if we have a valid image and canvas
    if (img.complete && img.src && canvas.width > 0 && canvas.height > 0) {
        // Get the image dimensions
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;

        // Format measurements to 1 decimal place
        const formattedCellWidth = paperCellWidth.toFixed(1);
        const formattedCellHeight = paperCellHeight.toFixed(1);

        // Update instructions
        paperInstructionsDiv.innerHTML = `
            <h4>How to Draw Your Grid:</h4>
            <ol>
                <li>Take your paper (${paperWidth}" × ${paperHeight}")</li>
                <li>Use a ruler to make small marks every <span class="highlight">${formattedCellWidth}"</span> across the top and bottom of your paper</li>
                <li>Make small marks every <span class="highlight">${formattedCellHeight}"</span> down the left and right sides of your paper</li>
                <li>Connect the marks with straight lines to create a grid with ${gridCount} × ${gridCount} squares</li>
                <li>Each square on your paper matches a square on the screen!</li>
            </ol>
            <p class="tip">Tip: Use a light pencil so you can erase the grid when you're done drawing!</p>
        `;

        // Update illustration
        updatePaperIllustration(gridCount);
    } else {
        // No image loaded yet
        paperInstructionsDiv.innerHTML = `
            <p>Upload an image and add a grid to see spacing instructions!</p>
            <p class="tip">When you add a grid, I'll help you draw the same grid on your paper!</p>
        `;
    }
}

// Initialize paper transport when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    initPaperTransport();

    // Listen for grid application
    const applyGridBtn = document.getElementById("applyGridBtn");
    if (applyGridBtn) {
        applyGridBtn.addEventListener("click", function () {
            // Update instructions after grid is applied
            setTimeout(updatePaperInstructions, 100);
        });
    }

    // Listen for image load
    if (img) {
        img.addEventListener('load', updatePaperInstructions);
    }
});

export { updatePaperInstructions };