import { canvas, ctx, img, loadAndScaleImage } from './image-handler.js';

/**
 * Sets up zoom and pan functionality for canvas
 * @returns {Object} Object containing control functions for zoom feature
 */
function setupZoomAndPan() {
    let zoomScale = 1; // This is the additional zoom factor on top of the initial scaling
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX;
    let startY;
    let zoomEnabled = false;
    let maxZoom = 3; // Maximum zoom level

    // base scaled   dimensions
    let baseScaledWidth = 0;
    let baseScaledHeight = 0;

    /**
     * Redraws the image with current zoom and pan settings
     * Also redraws the grid if it's currently visible
     */
    function redraw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (img.src && img.complete) {
            // Get current dimensions based on zoom scale
            const currentWidth = baseScaledWidth * zoomScale;
            const currentHeight = baseScaledHeight * zoomScale;

            // Boundary limits for panning
            offsetX = Math.max(offsetX, canvas.width - currentWidth);
            offsetX = Math.min(offsetX, 0);
            offsetY = Math.max(offsetY, canvas.height - currentHeight);
            offsetY = Math.min(offsetY, 0);

            // Draw the image with current zoom and offset
            ctx.drawImage(img, offsetX, offsetY, currentWidth, currentHeight);

            // Redraw grid if it's visible
            if (document.getElementById("removeGridBtn").style.display === "block") {
                redrawGrid(currentWidth, currentHeight);
            }
        }
    }

    /**
     * Redraws the grid overlay with current zoom settings
     * @param {number} width - Current zoomed width
     * @param {number} height - Current zoomed height
     */
    function redrawGrid(width, height) {
        const gridSizeInput = document.getElementById('gridSize');
        const lineThicknessInput = document.getElementById('lineThickness');
        const gridColorInput = document.getElementById('gridColor');

        let gridCount = parseInt(gridSizeInput.value, 10);
        let lineThickness = parseInt(lineThicknessInput.value, 10);
        let gridColor = gridColorInput.value;

        const gridSizeX = width / gridCount;
        const gridSizeY = height / gridCount;

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = lineThickness;

        // Draw vertical grid lines
        for (let x = gridSizeX; x < width; x += gridSizeX) {
            ctx.beginPath();
            ctx.moveTo(x + offsetX, offsetY);
            ctx.lineTo(x + offsetX, height + offsetY);
            ctx.stroke();
        }

        // Draw horizontal grid lines
        for (let y = gridSizeY; y < height; y += gridSizeY) {
            ctx.beginPath();
            ctx.moveTo(offsetX, y + offsetY);
            ctx.lineTo(width + offsetX, y + offsetY);
            ctx.stroke();
        }
    }

    /**
    * Updates base dimensions from the original image scaling
    * Called when zoom is enabled or when image is loaded
    */
    function updateBaseDimensions() {
        if (img.complete && img.src) {
            // Were getting scaled dimensions but not redrawing yet
            const scaledDimensions = {
                width: canvas.width,
                height: canvas.height
            };

            // If loadAndScaleImage returns valid dimensions, use them
            const freshDimensions = loadAndScaleImage();
            if (freshDimensions) {
                scaledDimensions.width = freshDimensions.width;
                scaledDimensions.height = freshDimensions.height;
            }

            // Store base dimensions
            baseScaledWidth = scaledDimensions.width;
            baseScaledHeight = scaledDimensions.height;
        }
    }

    // Zoom slider functionality
    const zoomSlider = document.getElementById('zoomSlider');

    // Handle slider input
    zoomSlider.addEventListener('input', () => {
        if (!zoomEnabled) return;

        // Convert slider value (0-100) to scale (1 to maxZoom)
        const sliderValue = parseInt(zoomSlider.value);
        zoomScale = 1.0 + ((sliderValue / 100) * (maxZoom - 1));

        // Set the slider tooltip
        document.getElementById('zoomValue').textContent = `${Math.round(zoomScale * 100)}%`;



        // Redraw with new scale
        redraw();
    });

    // Mouse events for panning
    canvas.addEventListener('mousedown', (e) => {
        if (!zoomEnabled) return;
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!zoomEnabled || !isDragging) return;
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        redraw();
    });

    /**
     * Resets zoom and pan to original position
     * Resets the slider position and updates UI elements
     */
    function resetZoom() {
        zoomScale = 1.0;
        offsetX = 0;
        offsetY = 0;
        isDragging = false;

        // Update base dimensions from image-handler
        updateBaseDimensions();

        // Reset slider value to 0 (og size)
        if (zoomSlider) {
            zoomSlider.value = 0;
            document.getElementById('zoomValue').textContent = '100%';
        }

        // Redraw the image at original scale
        redraw();
    }

    /**
     * Enables or disables zoom functionality
     * @param {boolean} enabled - Whether zoom should be enabled
     */
    function setZoomEnabled(enabled) {
        zoomEnabled = enabled;
        if (zoomSlider) {
            zoomSlider.disabled = !enabled;
        }

    }

    // Listen for image loading and reset zoom settings
    img.addEventListener('load', () => {
        updateBaseDimensions();
        resetZoom();
    });

    return {
        resetZoom,
        setZoomEnabled,
        redraw
    };
}

export { setupZoomAndPan };

