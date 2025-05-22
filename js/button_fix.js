/**
 * PIM System - Button Fix with Notifications
 * 
 * This script fixes the Clear and New button functionality
 * and adds proper notification feedback.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix for Clear button
    const clearButton = document.getElementById('clear-button');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            // Clear all form fields
            clearFormFields();
            
            // Show notification
            showNotification('Form cleared successfully', 'success');
        });
    }
    
    // Fix for New button
    const newButton = document.getElementById('new-button');
    if (newButton) {
        newButton.addEventListener('click', function() {
            // Clear all form fields and prepare for new entry
            clearFormFields();
            
            // Reset current product ID
            window.currentProductId = null;
            
            // Update navigation display
            updateNavigationDisplay();
            
            // Show notification
            showNotification('Ready for new product entry', 'success');
        });
    }
    
    // Helper function to clear all form fields
    function clearFormFields() {
        // Clear main form fields
        document.getElementById('model-input').value = '';
        document.getElementById('sku-input').value = '';
        document.getElementById('ean-input').value = '';
        
        // Reset category and status dropdowns to first option
        const categorySelect = document.getElementById('category-select');
        const statusSelect = document.getElementById('status-select');
        
        if (categorySelect) categorySelect.selectedIndex = 0;
        if (statusSelect) statusSelect.selectedIndex = 0;
        
        // Clear package contents
        const packageContentsTable = document.getElementById('package-contents-table');
        if (packageContentsTable && packageContentsTable.querySelector('tbody')) {
            packageContentsTable.querySelector('tbody').innerHTML = '';
        }
        
        // Clear image
        const productImage = document.getElementById('product-image');
        if (productImage) {
            productImage.src = 'img/placeholder.png';
        }
        
        // Clear all tab content fields
        clearTabContentFields();
        
        // Update progress bar
        updateProgressBar();
    }
    
    // Helper function to clear all tab content fields
    function clearTabContentFields() {
        // Get all input and textarea elements in tab content areas
        const tabContentInputs = document.querySelectorAll('.tab-content input, .tab-content textarea, .tab-content select');
        
        // Clear each field
        tabContentInputs.forEach(function(input) {
            input.value = '';
        });
        
        // Clear any tables in tabs
        const tabContentTables = document.querySelectorAll('.tab-content table tbody');
        tabContentTables.forEach(function(tbody) {
            tbody.innerHTML = '';
        });
    }
    
    // Helper function to update navigation display
    function updateNavigationDisplay() {
        const navigationSpan = document.querySelector('.record-navigation span');
        if (navigationSpan) {
            navigationSpan.textContent = 'No Records';
        }
    }
    
    console.log('Clear and New button functionality fixed with notifications');
});
