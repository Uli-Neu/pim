/**
 * PIM System - Initialization Script
 * 
 * This script ensures that all components are initialized after the DOM is fully loaded.
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing components');
    
    // Initialize notification handler first
    if (typeof NotificationHandler !== 'undefined') {
        NotificationHandler.init();
        console.log('NotificationHandler initialized');
    } else {
        console.error('NotificationHandler not found');
    }
    
    // Initialize main controller
    if (typeof mainController !== 'undefined') {
        mainController.init();
        console.log('mainController initialized');
    } else {
        console.error('mainController not found');
    }
    
    // Initialize button event handler
    if (typeof buttonEventHandler !== 'undefined') {
        buttonEventHandler.init();
        console.log('buttonEventHandler initialized');
    } else {
        console.error('buttonEventHandler not found');
    }
    
    // Initialize progress calculator
    if (typeof progressCalculator !== 'undefined') {
        progressCalculator.init();
        console.log('progressCalculator initialized');
    }
    
    console.log('All components initialized');
});
