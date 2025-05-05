import { img, canvas, ctx, handleImageUpload, setImageFromUrl, downloadImage, loadAndScaleImage } from './image-handler.js';
import { drawGrid, removeGrid } from './grid-handler.js';
import { setupZoomAndPan } from './zoom-feature.js';
import { updatePaperInstructions } from './paper-transport.js';
import { initPaperDownload } from './paper-download.js';
import { initSampleImageSelector } from './sample-image-selector.js';

// Wait for DOM to be loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get UI elements
    const uploadInput = document.getElementById("upload");
    const applyGridBtn = document.getElementById("applyGridBtn");
    const removeGridBtn = document.getElementById("removeGridBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const zoomSliderContainer = document.getElementById("zoomSliderContainer");
    const gridSizeInput = document.getElementById('gridSize');
    const resetZoomBtn = document.getElementById("resetZoomBtn");
    const maxZoomLabel = zoomSliderContainer
        .querySelector('.slider-labels span:last-child');

    // Initialize the paper download functionality
    initPaperDownload();

    // Initialize the sample image selector
    initSampleImageSelector((imageUrl) => {
        // Reset button states when new image is selected
        applyGridBtn.style.display = "block";
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";
        zoomSliderContainer.style.display = "none";
        resetZoomBtn.style.display = "none";

        // Disable zoom functionality and reset zoom settings
        zoomController.setZoomEnabled(false);
        zoomController.resetZoom();

        // Load the selected sample image
        setImageFromUrl(imageUrl);
    });

    // initialize that zoo m label right away
    maxZoomLabel.textContent = `${gridSizeInput.value}x`;

    // keep label in sync whenever theres a new grid
    gridSizeInput.addEventListener("input", () => {
        maxZoomLabel.textContent = `${gridSizeInput.value}x`;
    });

    // Setup zoom and pan functionality
    const zoomController = setupZoomAndPan();

    // Initially disable zoom until grid is applied
    zoomController.setZoomEnabled(false);

    // Create image upload handler to manage button states
    uploadInput.addEventListener("change", function (event) {
        // Reset button states when new image is uploaded
        applyGridBtn.style.display = "block";
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";
        zoomSliderContainer.style.display = "none";
        resetZoomBtn.style.display = "none";

        // Disable zoom functionality and reset zoom settings
        zoomController.setZoomEnabled(false);
        zoomController.resetZoom();

        // Reset sample image selection
        document.querySelectorAll('.sample-image-card').forEach(card => {
            card.classList.remove('active');
        });

        // Then handle the image upload
        handleImageUpload(event);
    });

    // Set up image onload event
    img.onload = function () {
        // Show the image on canvas when loaded
        loadAndScaleImage(); // This will draw the image without grid

        // Reset UI to initial state with apply grid button showing
        applyGridBtn.style.display = "block";
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";
        zoomSliderContainer.style.display = "none";
        resetZoomBtn.style.display = "none";

        // Disable zoom functionality
        zoomController.setZoomEnabled(false);

        // Enable apply grid button when image is loaded
        applyGridBtn.disabled = false;

        // Update paper instructions when image loads
        updatePaperInstructions();
    };

    //event listeners
    applyGridBtn.addEventListener("click", function () {
        if (drawGrid()) {
            // update the UI
            applyGridBtn.style.display = "none";
            removeGridBtn.style.display = "block";
            downloadBtn.style.display = "block";
            zoomSliderContainer.style.display = "block";
            resetZoomBtn.style.display = "none";

            // enable zoom functionality
            zoomController.setZoomEnabled(true);

            // Update paper instructions when grid is applied
            updatePaperInstructions();
        }
    });

    removeGridBtn.addEventListener("click", function () {
        removeGrid();
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";
        applyGridBtn.style.display = "block";
        zoomSliderContainer.style.display = "none";
        resetZoomBtn.style.display = "none";

        // Disable zoom functionality and reset zoom when removing grid
        zoomController.setZoomEnabled(false);
        zoomController.resetZoom();

        // Update paper instructions when grid is removed
        updatePaperInstructions();
    });

    document.getElementById('zoomSlider').addEventListener('input', function () {
        resetZoomBtn.style.display = "block";
    });

    resetZoomBtn.addEventListener("click", function () {
        zoomController.resetZoom();
        drawGrid();
        resetZoomBtn.style.display = "none";
    });

    downloadBtn.addEventListener("click", downloadImage);

    // event listener for grid size changes so update paper instructions
    document.getElementById('gridSize').addEventListener('input', function () {
        // If the grid is visible, update the paper instructions
        if (removeGridBtn.style.display === "block") {
            updatePaperInstructions();
        }
    });

    // Initial UI setup
    initializeUI();

    /**
     * Sets up the initial UI state when website loads
     * Disables buttons that require an image to be loaded first
     */
    function initializeUI() {
        applyGridBtn.disabled = !img.complete || !img.src;
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";
        zoomSliderContainer.style.display = "none";
        resetZoomBtn.style.display = "none";
        zoomController.setZoomEnabled(false);
    }
});