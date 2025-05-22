/**
 * PIM System - Clear and New Button Fix
 * 
 * This script fixes the Clear and New button functionality by ensuring
 * only one event handler is active for each button and providing proper
 * notification feedback.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Clear and New button fix');
    
    // Remove any existing event listeners by cloning and replacing the buttons
    const clearButton = document.getElementById('clear-button');
    const newButton = document.getElementById('new-button');
    
    if (clearButton) {
        const newClearButton = clearButton.cloneNode(true);
        clearButton.parentNode.replaceChild(newClearButton, clearButton);
        
        // Add the correct event listener
        newClearButton.addEventListener('click', function() {
            console.log('Clear button clicked');
            
            // Use mainController's clearForm function
            if (typeof mainController !== 'undefined' && typeof mainController.clearForm === 'function') {
                mainController.clearForm();
            } else {
                // Fallback clear implementation
                clearFormFields();
            }
            
            // Show notification
            if (typeof NotificationHandler !== 'undefined') {
                NotificationHandler.showSuccess('Form cleared successfully');
            } else {
                showNotification('Form cleared successfully', 'success');
            }
        });
    }
    
    if (newButton) {
        const newNewButton = newButton.cloneNode(true);
        newButton.parentNode.replaceChild(newNewButton, newButton);
        
        // Add the correct event listener
        newNewButton.addEventListener('click', function() {
            console.log('New button clicked');
            
            // Use mainController's clearForm function
            if (typeof mainController !== 'undefined' && typeof mainController.clearForm === 'function') {
                mainController.clearForm();
                
                // Reset current product ID to indicate we're creating a new product
                localStorage.setItem('currentProductId', '0');
            } else {
                // Fallback clear implementation
                clearFormFields();
                
                // Reset current product ID
                localStorage.setItem('currentProductId', '0');
            }
            
            // Show notification
            if (typeof NotificationHandler !== 'undefined') {
                NotificationHandler.showInfo('Ready to create a new record');
            } else {
                showNotification('Ready to create a new record', 'info');
            }
        });
    }
    
    // Helper function to clear all form fields (fallback implementation)
    function clearFormFields() {
        // Clear main form fields
        const modelInput = document.getElementById('model-input');
        const skuInput = document.getElementById('sku-input');
        const eanInput = document.getElementById('ean-input');
        
        if (modelInput) modelInput.value = '';
        if (skuInput) skuInput.value = '';
        if (eanInput) eanInput.value = '';
        
        // Reset category and status dropdowns to first option
        const categorySelect = document.getElementById('category-select');
        const statusSelect = document.getElementById('status-select');
        
        if (categorySelect) categorySelect.selectedIndex = 0;
        if (statusSelect) statusSelect.selectedIndex = 0;
        
        // Clear package contents
        const packageContentsTable = document.querySelector('#package-contents-table tbody');
        if (packageContentsTable) {
            packageContentsTable.innerHTML = '';
        }
        
        // Clear image
        const productImage = document.querySelector('.product-image');
        if (productImage) {
            productImage.src = 'https://via.placeholder.com/150x200/ff0000/ffffff?text=No+Image';
            
            // Show placeholder text
            const placeholderTexts = document.querySelectorAll('.image-placeholder p');
            placeholderTexts.forEach(text => {
                text.style.display = 'block';
            });
        }
        
        // Update record count
        const recordCount = document.querySelector('.record-navigation span');
        if (recordCount) {
            recordCount.textContent = 'No Records';
        }
        
        // Update progress bar
        if (typeof progressCalculator !== 'undefined') {
            progressCalculator.updateProgressBar();
        }
    }
    
    // Helper function to show notification (fallback implementation)
    function showNotification(message, type) {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.textContent = message;
            notification.className = 'notification';
            notification.classList.add(type);
            notification.style.display = 'block';
            
            setTimeout(function() {
                notification.style.display = 'none';
            }, 3000);
        }
    }
    
    console.log('Clear and New button fix initialized');
});
