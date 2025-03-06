// Image handling functionality
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();

/**
 * Loads and scales the image to fit the canvas
 * @returns {Object} Object containing scaled dimensions
 */
function loadAndScaleImage() {
    // Only proceed if image has been loaded
    if (!img.complete || !img.src) {
        return null;
    }

    // This makes it so there is space on the sides
    const maxWidth = window.innerWidth * 0.6; // Adjusted to fit your layout
    const maxHeight = window.innerHeight * 0.7;

    // Scale image while maintaining aspect ratio
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height);

    // Calculate new dimensions
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Set canvas size
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Draw image on canvas
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    return { width: scaledWidth, height: scaledHeight };
}

/**
 * Handles file upload by reading the file and setting the image source
 * @param {Event} event - The file input change event
 */
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// This saves the canvas content as an image
function downloadImage() {
    if (!img.src) {
        displayError("Please upload an image first");
        return;
    }

    const link = document.createElement("a");
    link.download = "image_with_grid.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

/**
 * Display an error message to the user
 * @param {string} message - The error message to display
 */
function displayError(message) {
    alert(message); // right not I just have a simple alert
}

export {
    img,
    canvas,
    ctx,
    loadAndScaleImage,
    handleImageUpload,
    downloadImage,
    displayError
};