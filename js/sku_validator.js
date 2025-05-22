/**
 * PIM System - SKU Uniqueness Validator
 * 
 * This script adds SKU uniqueness validation to the PIM system.
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    console.log('SKU uniqueness validator loaded');
    
    // Override save button click handler to add SKU uniqueness validation
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        const originalClickHandler = saveButton.onclick;
        
        saveButton.onclick = function(event) {
            console.log('Save button clicked - checking SKU uniqueness');
            
            // Get current SKU value
            const skuInput = document.getElementById('sku-input');
            if (!skuInput) {
                console.error('SKU input not found');
                return;
            }
            
            const skuValue = skuInput.value.trim();
            if (!skuValue) {
                NotificationHandler.showWarning('SKU is required');
                return;
            }
            
            // Get current product ID
            const currentProductId = parseInt(localStorage.getItem('currentProductId')) || 0;
            
            // Check if SKU already exists in another product
            const products = JSON.parse(localStorage.getItem('pimProducts')) || [];
            const existingSku = products.find(product => 
                product.sku === skuValue && product.id !== currentProductId
            );
            
            if (existingSku) {
                // Show confirmation dialog
                if (confirm('A product with this SKU already exists. Are you sure you want to create another one with the same SKU?')) {
                    // User confirmed, proceed with save
                    if (originalClickHandler) {
                        originalClickHandler.call(this, event);
                    } else {
                        // Fallback if original handler is missing
                        if (currentProductId > 0) {
                            mainController.updateRecord();
                        } else {
                            mainController.saveRecord();
                        }
                    }
                } else {
                    // User cancelled, do not save
                    NotificationHandler.showInfo('Save cancelled');
                }
            } else {
                // No duplicate SKU, proceed with save
                if (originalClickHandler) {
                    originalClickHandler.call(this, event);
                } else {
                    // Fallback if original handler is missing
                    if (currentProductId > 0) {
                        mainController.updateRecord();
                    } else {
                        mainController.saveRecord();
                    }
                }
            }
        };
    } else {
        console.error('Save button not found');
    }
});
