// UI Controller - Handles button interactions and UI state
import { img, handleImageUpload, downloadImage } from './image-handler.js';
import { drawGrid, removeGrid } from './grid-handler.js';

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get UI elements
    const uploadInput = document.getElementById("upload");
    const applyGridBtn = document.getElementById("applyGridBtn");
    const removeGridBtn = document.getElementById("removeGridBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    // Create custom image upload handler to manage button states
    uploadInput.addEventListener("change", function (event) {
        // Reset button states when a new image is uploaded
        applyGridBtn.style.display = "block";
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";

        // Then handle the image upload
        handleImageUpload(event);
    });

    // Set up image onload event
    img.onload = function () {
        // Show the image on canvas when loaded
        removeGrid(); // This will draw the image without grid
        // Reset UI to initial state with apply grid button showing
        applyGridBtn.style.display = "block";
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";
        // Enable apply grid button when image is loaded
        applyGridBtn.disabled = false;
    };

    // Remove onclick attributes from HTML and use proper event listeners
    applyGridBtn.addEventListener("click", function () {
        if (drawGrid()) {
            applyGridBtn.style.display = "none";
            removeGridBtn.style.display = "block";
            downloadBtn.style.display = "block";
        }
    });

    removeGridBtn.addEventListener("click", function () {
        removeGrid();
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";
        applyGridBtn.style.display = "block";
    });

    downloadBtn.addEventListener("click", downloadImage);

    // Initial UI state setup
    initializeUI();

    // This will set up the initial UI State
    function initializeUI() {
        applyGridBtn.disabled = !img.complete || !img.src;
        removeGridBtn.style.display = "none";
        downloadBtn.style.display = "none";
    }
});