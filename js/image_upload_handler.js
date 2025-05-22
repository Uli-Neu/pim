/**
 * PIM System - Image Upload Handler
 * 
 * This module handles image upload functionality including drag and drop
 * and button click upload.
 */

const imageUploadHandler = {
    /**
     * Initialize the image upload handler
     */
    init: function() {
        // Set up event listeners for upload button
        const uploadButton = document.getElementById('upload-image-btn') || document.querySelector('.upload-image-btn');
        if (uploadButton) {
            uploadButton.addEventListener('click', this.triggerFileInput.bind(this));
            console.log('Upload button event listener attached');
        } else {
            console.error('Upload button not found');
        }
        
        // Create hidden file input
        this.createFileInput();
        
        // Set up drag and drop for image placeholder
        const imagePlaceholder = document.querySelector('.image-placeholder');
        if (imagePlaceholder) {
            imagePlaceholder.addEventListener('dragover', this.handleDragOver);
            imagePlaceholder.addEventListener('dragleave', this.handleDragLeave);
            imagePlaceholder.addEventListener('drop', this.handleDrop);
            imagePlaceholder.addEventListener('click', this.triggerFileInput.bind(this));
            console.log('Image placeholder event listeners attached');
        } else {
            console.error('Image placeholder not found');
        }
        
        console.log('Image upload handler initialized');
    },
    
    /**
     * Create hidden file input for image upload
     */
    createFileInput: function() {
        // Check if file input already exists
        let fileInput = document.getElementById('hidden-file-input');
        if (!fileInput) {
            fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'hidden-file-input';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            // Add event listener for file selection
            fileInput.addEventListener('change', function(event) {
                if (event.target.files && event.target.files[0]) {
                    imageUploadHandler.handleFileSelect(event.target.files[0]);
                }
            });
            console.log('Hidden file input created');
        }
    },
    
    /**
     * Trigger file input click
     */
    triggerFileInput: function() {
        console.log('Triggering file input click');
        const fileInput = document.getElementById('hidden-file-input');
        if (fileInput) {
            fileInput.click();
        } else {
            console.error('Hidden file input not found');
            this.createFileInput();
            document.getElementById('hidden-file-input').click();
        }
    },
    
    /**
     * Handle drag over event
     */
    handleDragOver: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.add('drag-over');
        console.log('Drag over event handled');
    },
    
    /**
     * Handle drag leave event
     */
    handleDragLeave: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.remove('drag-over');
        console.log('Drag leave event handled');
    },
    
    /**
     * Handle drop event
     */
    handleDrop: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.classList.remove('drag-over');
        console.log('Drop event handled');
        
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            imageUploadHandler.handleFileSelect(event.dataTransfer.files[0]);
        }
    },
    
    /**
     * Handle file selection
     */
    handleFileSelect: function(file) {
        console.log('File selected:', file.name);
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        // Read file as data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            // Update image in placeholder
            const productImage = document.querySelector('.product-image');
            if (productImage) {
                productImage.src = e.target.result;
                productImage.style.display = 'block';
                
                // Hide placeholder text
                const placeholderTexts = document.querySelectorAll('.image-placeholder p');
                placeholderTexts.forEach(text => {
                    text.style.display = 'none';
                });
                
                showNotification('Image uploaded successfully', 'success');
                
                // Update progress bar
                if (typeof progressCalculator !== 'undefined') {
                    progressCalculator.updateProgressBar();
                }
            } else {
                console.error('Product image element not found');
            }
        };
        
        reader.readAsDataURL(file);
    }
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    imageUploadHandler.init();
});

// Also initialize when window loads to ensure all elements are available
window.addEventListener('load', function() {
    imageUploadHandler.init();
});
