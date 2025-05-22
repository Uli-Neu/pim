/**
 * PIM System - Debug Helper
 * 
 * This script adds debug functionality to help identify and fix issues with notifications and save functionality.
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    console.log('Debug helper loaded');
    
    // Add debug button to test notifications
    const debugButton = document.createElement('button');
    debugButton.textContent = 'Test Notifications';
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.style.padding = '5px 10px';
    debugButton.style.backgroundColor = '#007bff';
    debugButton.style.color = 'white';
    debugButton.style.border = 'none';
    debugButton.style.borderRadius = '4px';
    
    debugButton.addEventListener('click', function() {
        console.log('Testing notifications');
        
        // Test if NotificationHandler exists
        if (typeof NotificationHandler !== 'undefined') {
            console.log('NotificationHandler found');
            
            // Test success notification
            NotificationHandler.showSuccess('Success notification test');
            
            // Test localStorage
            try {
                localStorage.setItem('test', 'test');
                const test = localStorage.getItem('test');
                console.log('localStorage test:', test);
                
                // Test product storage
                const products = JSON.parse(localStorage.getItem('pimProducts')) || [];
                console.log('Current products in localStorage:', products);
                
                // Add debug info to notification
                setTimeout(() => {
                    NotificationHandler.showInfo(`Found ${products.length} products in localStorage`);
                }, 2000);
            } catch (e) {
                console.error('localStorage test failed:', e);
                NotificationHandler.showError('localStorage test failed: ' + e.message);
            }
        } else {
            console.error('NotificationHandler not found');
            alert('NotificationHandler not found');
        }
    });
    
    document.body.appendChild(debugButton);
    
    // Override save button click handler to add debug logging
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        const originalClickHandler = saveButton.onclick;
        
        saveButton.onclick = function(event) {
            console.log('Save button clicked');
            
            // Check if mainController exists
            if (typeof mainController !== 'undefined') {
                console.log('mainController found');
                
                // Check if saveRecord method exists
                if (typeof mainController.saveRecord === 'function') {
                    console.log('saveRecord method found');
                    
                    // Call original click handler if it exists
                    if (originalClickHandler) {
                        console.log('Calling original click handler');
                        originalClickHandler.call(this, event);
                    } else {
                        console.log('No original click handler found, calling saveRecord directly');
                        
                        // Get current product ID
                        const currentProductId = parseInt(localStorage.getItem('currentProductId')) || 0;
                        
                        if (currentProductId > 0) {
                            console.log('Updating existing record with ID:', currentProductId);
                            mainController.updateRecord();
                        } else {
                            console.log('Creating new record');
                            mainController.saveRecord();
                        }
                        
                        // Force notification
                        setTimeout(() => {
                            NotificationHandler.showSuccess('Product saved successfully');
                        }, 500);
                    }
                    
                    // Check localStorage after save
                    setTimeout(() => {
                        const products = JSON.parse(localStorage.getItem('pimProducts')) || [];
                        console.log('Products after save:', products);
                        
                        // Update record count display
                        const recordCount = document.querySelector('.record-navigation span');
                        if (recordCount) {
                            if (products.length > 0) {
                                recordCount.textContent = `Record ${products.length} of ${products.length}`;
                                console.log(`Updated record count: Record ${products.length} of ${products.length}`);
                            } else {
                                recordCount.textContent = 'No Records';
                                console.log('Updated record count: No Records');
                            }
                        }
                    }, 1000);
                } else {
                    console.error('saveRecord method not found');
                    NotificationHandler.showError('saveRecord method not found');
                }
            } else {
                console.error('mainController not found');
                NotificationHandler.showError('mainController not found');
            }
        };
    } else {
        console.error('Save button not found');
    }
});
