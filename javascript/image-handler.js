const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();


/**
 * Shows welcome instructions when no image is loaded
 * steps to use the website
 */
function showWelcomeInstructions() {
    // Set canvas to a default size
    canvas.width = 500;
    canvas.height = 350;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Welcome header
    ctx.fillStyle = '#480ca8';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to GridDraw!', canvas.width / 2, 60);

    // Instructions
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('Get started with these simple steps:', canvas.width / 2, 100);

    // Step by step instructions
    const steps = [
        '1. Upload an image or select a sample below',
        '2. Adjust your grid settings (count, thickness, color)',
        '3. Click "Apply Grid" to add a grid overlay',
        '4. Use the zoom slider to see details',
        '5. Download your grid-enhanced image'
    ];

    let y = 140;
    steps.forEach(step => {
        ctx.fillText(step, canvas.width / 2, y);
        y += 30;
    });

    // Footer message
    ctx.fillStyle = '#666';
    ctx.font = 'italic 14px Arial, sans-serif';
    ctx.fillText('Perfect for drawing, art transfers, and design!', canvas.width / 2, 290);
}

/**
 * Loads and scales the image to fit the canvas
 * @returns {Object} Object containing scaled dimensions
 */
function loadAndScaleImage() {
    // Only proceed if image has been loaded
    if (!img.complete || !img.src) {
        showWelcomeInstructions(); // Show welcome message if no image
        return null;
    }

    // This makes it so there is space on the sides
    const maxWidth = window.innerWidth * 0.6;
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

/**
 * Sets image source directly from URL
 * Used for loading sample images
 * @param {string} imageUrl - URL of image to load
 */
function setImageFromUrl(imageUrl) {
    if (imageUrl) {
        img.src = imageUrl;
    }
}

/**
 * Downloads the current canvas content as PNG image
 * Shows an error if no image is loaded
 */
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
    alert(message); // right now I just have a simple alert
}

// Initialize welcome message when the page loads
document.addEventListener("DOMContentLoaded", function () {
    showWelcomeInstructions();
});

export {
    img,
    canvas,
    ctx,
    loadAndScaleImage,
    handleImageUpload,
    setImageFromUrl,
    downloadImage,
    displayError
};