const sampleImages = [
    {
        title: "Cat",
        url: "preImage/Cat.jpg",
        description: "Cat"
    },
    {
        title: "Dino",
        url: "preImage/Dino.jpg",
        description: "Dino"
    },
    {
        title: "Still Life",
        url: "preImage/Dog.jpg",
        description: "Dog"
    }
];

/**
 * Initializes the sample image selector
 * Creates UI elements for sample image selection
 * @param {function} onImageSelect 
 */
function initSampleImageSelector(onImageSelect) {
    const sampleContainer = document.getElementById('sampleImagesContainer');

    if (!sampleContainer) {
        console.error('Sample images container not found');
        return;
    }

    // Create sample image elements
    sampleImages.forEach(image => {
        const sampleCard = document.createElement('div');
        sampleCard.className = 'sample-image-card';

        const imageThumb = document.createElement('div');
        imageThumb.className = 'sample-image-thumb';
        imageThumb.style.backgroundImage = `url(${image.url})`;

        const imageTitle = document.createElement('div');
        imageTitle.className = 'sample-image-title';
        imageTitle.textContent = image.title;

        // Add click 
        sampleCard.appendChild(imageThumb);
        sampleCard.appendChild(imageTitle);
        sampleCard.setAttribute('title', image.description);

        sampleCard.addEventListener('click', () => {
            // Set active state on selected image
            document.querySelectorAll('.sample-image-card').forEach(card => {
                card.classList.remove('active');
            });
            sampleCard.classList.add('active');

            // Call the callback with the selected image URL
            onImageSelect(image.url);
        });

        sampleContainer.appendChild(sampleCard);
    });
}

/**
 * Loads a sample image from URL
 * @param {string} imageUrl - URL of the sample image
 * @param {Image} imgElement - Image element to load the sample into
 * @returns {Promise} - Promise that resolves when the image is loaded
 */
function loadSampleImage(imageUrl, imgElement) {
    return new Promise((resolve, reject) => {
        if (!imgElement) {
            reject(new Error('Image element not provided'));
            return;
        }

        // Set onload handler
        imgElement.onload = () => {
            resolve(imgElement);
        };

        // Set onerror handler
        imgElement.onerror = () => {
            reject(new Error(`Failed to load image: ${imageUrl}`));
        };

        // Set image source
        imgElement.src = imageUrl;
    });
}

export { initSampleImageSelector, loadSampleImage };