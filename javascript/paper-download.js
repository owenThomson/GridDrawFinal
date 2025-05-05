/**
 * Initializes the paper download functionality
 */
function initPaperDownload() {
    const downloadPaperBtn = document.getElementById('downloadPaperBtn');
    const paperIllustration = document.getElementById('paperIllustration');

    if (!downloadPaperBtn || !paperIllustration) return;

    // Event listener for the download button
    downloadPaperBtn.addEventListener('click', generatePaperTemplate);

    // Enable download button only when there's content to download
    function checkEnableDownload() {
        const hasContent = paperIllustration.querySelector('.image-area') ||
            paperIllustration.querySelector('#paperGrid .grid-cell');

        downloadPaperBtn.disabled = !hasContent;
    }

    // Initial check when the page loads
    checkEnableDownload();

    // Create observer to watch for changes in the paper illustration
    const observer = new MutationObserver(checkEnableDownload);
    observer.observe(paperIllustration, {
        childList: true,
        subtree: true
    });
}

/**
 * Generates a paper template with grid
 */
function generatePaperTemplate() {
    const paperIllustration = document.getElementById('paperIllustration');
    const paperWidth = parseFloat(document.getElementById('paperWidth').value);
    const paperHeight = parseFloat(document.getElementById('paperHeight').value);
    const gridCount = parseInt(document.getElementById('gridSize').value, 10);

    // Create a canvas with reasonable print quality
    const scale = 2; // Reduced scale for better performance
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = paperWidth * 96 * scale;
    canvas.height = paperHeight * 96 * scale;

    // Fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get existing grid layout information
    const imageArea = paperIllustration.querySelector('.image-area');

    // Set drawing dimensions and margins
    let drawingWidth, drawingHeight, horizontalMargin, verticalMargin;

    if (imageArea) {
        drawingWidth = parseFloat(imageArea.style.width) / 100 * paperWidth;
        drawingHeight = parseFloat(imageArea.style.height) / 100 * paperHeight;
        horizontalMargin = (paperWidth - drawingWidth) / 2;
        verticalMargin = (paperHeight - drawingHeight) / 2;
    } else {
        // Use the full paper
        drawingWidth = paperWidth;
        drawingHeight = paperHeight;
        horizontalMargin = 0;
        verticalMargin = 0;
    }

    // Convert dimensions to pixels
    const pixelHMargin = horizontalMargin * 96 * scale;
    const pixelVMargin = verticalMargin * 96 * scale;
    const pixelDrawingWidth = drawingWidth * 96 * scale;
    const pixelDrawingHeight = drawingHeight * 96 * scale;

    // Draw the grid
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1 * scale;
    ctx.globalAlpha = 0.3;

    // Calculate cell dimensions
    const cellWidth = pixelDrawingWidth / gridCount;
    const cellHeight = pixelDrawingHeight / gridCount;

    // Draw vertical grid lines
    for (let i = 0; i <= gridCount; i++) {
        const x = pixelHMargin + i * cellWidth;
        ctx.beginPath();
        ctx.moveTo(x, pixelVMargin);
        ctx.lineTo(x, pixelVMargin + pixelDrawingHeight);
        ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let i = 0; i <= gridCount; i++) {
        const y = pixelVMargin + i * cellHeight;
        ctx.beginPath();
        ctx.moveTo(pixelHMargin, y);
        ctx.lineTo(pixelHMargin + pixelDrawingWidth, y);
        ctx.stroke();
    }

    // Create and trigger download
    const link = document.createElement('a');
    link.download = `grid-paper-${gridCount}x${gridCount}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initPaperDownload);

export { initPaperDownload };