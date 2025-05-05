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
 * Converts decimal inches to a fraction string representation
 * @param {number} decimal - Decimal value in inches
 * @returns {string} Fraction representation ("1/2", "3/8", etc.)
 */
function decimalToFraction(decimal) {
    // Handle whole numbers or very close to whole numbers
    if (Math.abs(decimal - Math.round(decimal)) < 0.001) {
        return Math.round(decimal).toString();
    }

    // Extract the whole number part
    const wholeNumber = Math.floor(decimal);
    let fraction = decimal - wholeNumber;

    // Common fractions used on rulers (1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8)
    const denominators = [2, 4, 8, 16];
    let bestDenominator = 16;
    let bestNumerator = Math.round(fraction * bestDenominator);

    // Simplify the fraction
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const divisor = gcd(bestNumerator, bestDenominator);
    bestNumerator /= divisor;
    bestDenominator /= divisor;

    // Handle the case where rounding might result in bestNumerator == bestDenominator
    if (bestNumerator === bestDenominator) {
        return (wholeNumber + 1).toString();
    }

    // Handle the case where the fraction is very close to 0
    if (bestNumerator === 0) {
        return wholeNumber.toString();
    }

    // Format the result
    if (wholeNumber > 0) {
        return bestNumerator > 0 ? `${wholeNumber} ${bestNumerator}/${bestDenominator}` : `${wholeNumber}`;
    } else {
        return `${bestNumerator}/${bestDenominator}`;
    }
}

/**
 * Updates paper grid illustration to match current settings
 * @param {number} gridCount - Number of grid cells to display
 * @param {number} adjustedWidth - Width adjusted for aspect ratio
 * @param {number} adjustedHeight - Height adjusted for aspect ratio
 */
function updatePaperIllustration(gridCount, adjustedWidth, adjustedHeight) {
    const paperIllustration = document.getElementById('paperIllustration');
    const paperGrid = document.getElementById('paperGrid');

    if (!paperIllustration || !paperGrid || !gridCount) return;

    // Clear existing grid and any previous elements
    paperGrid.innerHTML = '';

    // Remove any existing image areas or outlines from previous updates
    const existingElements = paperIllustration.querySelectorAll('.image-area, .paper-outline');
    existingElements.forEach(element => element.remove());

    // Get paper dimensions
    const paperWidth = parseFloat(paperWidthInput.value);
    const paperHeight = parseFloat(paperHeightInput.value);

    // Set the paper illustration proportions
    const maxWidth = 200; // Maximum width of the paper illustration
    const scale = maxWidth / Math.max(paperWidth, paperHeight * (paperWidth / paperHeight));

    paperIllustration.style.width = `${paperWidth * scale}px`;
    paperIllustration.style.height = `${paperHeight * scale}px`;

    // Create the image area indicator with the correct grid
    if (adjustedWidth < paperWidth || adjustedHeight < paperHeight) {
        // Calculate proportions for the visual representation
        const horizontalMargin = (paperWidth - adjustedWidth) / 2;
        const verticalMargin = (paperHeight - adjustedHeight) / 2;

        // Create image area container
        const imageArea = document.createElement('div');
        imageArea.className = 'image-area';
        imageArea.style.width = `${(adjustedWidth / paperWidth) * 100}%`;
        imageArea.style.height = `${(adjustedHeight / paperHeight) * 100}%`;
        imageArea.style.position = 'absolute';
        imageArea.style.border = '2px dashed #4682B4';
        imageArea.style.top = '50%';
        imageArea.style.left = '50%';
        imageArea.style.transform = 'translate(-50%, -50%)';
        imageArea.style.boxSizing = 'border-box';

        // Create grid inside the image area
        const imageGrid = document.createElement('div');
        imageGrid.style.display = 'grid';
        imageGrid.style.width = '100%';
        imageGrid.style.height = '100%';
        imageGrid.style.gridTemplateColumns = `repeat(${gridCount}, 1fr)`;
        imageGrid.style.gridTemplateRows = `repeat(${gridCount}, 1fr)`;

        // Add grid cells to the image area
        for (let i = 0; i < gridCount * gridCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.border = '1px solid rgba(0, 0, 0, 0.2)';
            cell.style.boxSizing = 'border-box';
            imageGrid.appendChild(cell);
        }

        // Add the grid to the image area
        imageArea.appendChild(imageGrid);
        paperIllustration.appendChild(imageArea);

        // Add paper border outline
        const paperOutline = document.createElement('div');
        paperOutline.className = 'paper-outline';
        paperOutline.style.position = 'absolute';
        paperOutline.style.width = '100%';
        paperOutline.style.height = '100%';
        paperOutline.style.border = '1px solid #ccc';
        paperOutline.style.top = '0';
        paperOutline.style.left = '0';
        paperOutline.style.boxSizing = 'border-box';
        paperOutline.style.pointerEvents = 'none';
        paperIllustration.appendChild(paperOutline);
    } else {
        // Create grid with CSS grid for the whole paper
        paperGrid.style.display = 'grid';
        paperGrid.style.width = '100%';
        paperGrid.style.height = '100%';
        paperGrid.style.gridTemplateColumns = `repeat(${gridCount}, 1fr)`;
        paperGrid.style.gridTemplateRows = `repeat(${gridCount}, 1fr)`;
        paperGrid.style.position = 'absolute';
        paperGrid.style.top = '0';
        paperGrid.style.left = '0';

        // Add grid cells
        for (let i = 0; i < gridCount * gridCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.border = '1px solid rgba(0, 0, 0, 0.2)';
            cell.style.boxSizing = 'border-box';
            paperGrid.appendChild(cell);
        }

        // Add paper border outline
        const paperOutline = document.createElement('div');
        paperOutline.className = 'paper-outline';
        paperOutline.style.position = 'absolute';
        paperOutline.style.width = '100%';
        paperOutline.style.height = '100%';
        paperOutline.style.border = '1px solid #ccc';
        paperOutline.style.top = '0';
        paperOutline.style.left = '0';
        paperOutline.style.boxSizing = 'border-box';
        paperOutline.style.pointerEvents = 'none';
        paperIllustration.appendChild(paperOutline);
    }
}

/**
 * Calculates grid measurements and updates instructions for drawing on paper
 * Preserves aspect ratio of the original image
 */
function updatePaperInstructions() {
    // Get values from inputs
    const paperWidth = parseFloat(paperWidthInput.value) || DEFAULT_PAPER_WIDTH;
    const paperHeight = parseFloat(paperHeightInput.value) || DEFAULT_PAPER_HEIGHT;
    const gridCount = parseInt(gridSizeInput?.value, 10) || 5;

    // Check if we have a valid image and canvas
    if (img.complete && img.src && canvas.width > 0 && canvas.height > 0) {
        // Get the image dimensions
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;

        // Calculate aspect ratios
        const imageAspectRatio = imageWidth / imageHeight;
        const paperAspectRatio = paperWidth / paperHeight;

        // Calculate adjusted dimensions to maintain aspect ratio
        let adjustedWidth, adjustedHeight;

        if (imageAspectRatio > paperAspectRatio) {
            // Image is wider than paper height
            adjustedWidth = paperWidth;
            adjustedHeight = paperWidth / imageAspectRatio;
        } else {
            // Image is taller than paper width
            adjustedHeight = paperHeight;
            adjustedWidth = paperHeight * imageAspectRatio;
        }

        // Make sure adjusted dimensions don't exceed paper size
        adjustedWidth = Math.min(adjustedWidth, paperWidth);
        adjustedHeight = Math.min(adjustedHeight, paperHeight);

        // Calculate margins to center the image
        const horizontalMargin = (paperWidth - adjustedWidth) / 2;
        const verticalMargin = (paperHeight - adjustedHeight) / 2;

        // Calculate cell dimensions for the adjusted area
        const cellWidth = adjustedWidth / gridCount;
        const cellHeight = adjustedHeight / gridCount;

        // Format measurements as fractions for easier ruler use
        const formattedCellWidth = decimalToFraction(cellWidth);
        const formattedCellHeight = decimalToFraction(cellHeight);
        const formattedHMargin = decimalToFraction(horizontalMargin);
        const formattedVMargin = decimalToFraction(verticalMargin);
        const formattedAdjWidth = decimalToFraction(adjustedWidth);
        const formattedAdjHeight = decimalToFraction(adjustedHeight);

        // Update instructions
        let instructionsHTML = `
            <h4>How to Draw Your Grid:</h4>
        `;

        if (Math.abs(imageAspectRatio - paperAspectRatio) < 0.05) {
            // Aspect ratios are close enough, use the whole paper
            instructionsHTML += `
                <ol>
                    <li>Take your paper (${paperWidth}" × ${paperHeight}")</li>
                    <li>Use a ruler to make small marks every <span class="highlight">${formattedCellWidth}"</span> across the top and bottom of your paper</li>
                    <li>Make small marks every <span class="highlight">${formattedCellHeight}"</span> down the left and right sides of your paper</li>
                    <li>Connect the marks with straight lines to create a grid with ${gridCount} × ${gridCount} squares</li>
                    <li>Each square on your paper matches a square on the screen!</li>
                </ol>
            `;
        } else {
            // Different aspect ratios, need to adjust
            instructionsHTML += `
                <ol>
                    <li>Take your paper (${paperWidth}" × ${paperHeight}")</li>
                    <li>To preserve the image's proportions, measure in <span class="highlight">${formattedHMargin}"</span> from the left and right edges</li>
                    <li>Also measure in <span class="highlight">${formattedVMargin}"</span> from the top and bottom edges</li>
                    <li>This creates a drawing area of <span class="highlight">${formattedAdjWidth}" × ${formattedAdjHeight}"</span></li>
                    <li>Within this area, make marks every <span class="highlight">${formattedCellWidth}"</span> horizontally</li>
                    <li>And make marks every <span class="highlight">${formattedCellHeight}"</span> vertically</li>
                    <li>Connect the marks to create a grid with ${gridCount} × ${gridCount} squares</li>
                </ol>
                <p class="tip">This method preserves the image's proportions and prevents distortion!</p>
            `;
        }

        instructionsHTML += `
            <p class="tip">Tip: Use a light pencil so you can erase the grid when you're done drawing!</p>
            <p class="tip">Tip: Or click the 'DOWNLOAD' button below, print the image, and then draw directly over the lines</p>

        `;

        paperInstructionsDiv.innerHTML = instructionsHTML;

        // Update illustration with adjusted dimensions
        updatePaperIllustration(gridCount, adjustedWidth, adjustedHeight);
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

export {
    updatePaperInstructions,
    decimalToFraction
};