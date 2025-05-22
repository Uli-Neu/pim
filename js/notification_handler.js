/**
 * PIM System - Notification Handler
 * 
 * This module handles notifications for the PIM system.
 */

const NotificationHandler = {
    /**
     * Initialize notification handler
     */
    init: function() {
        console.log('Initializing notification handler');
        this.notificationElement = document.querySelector('.notification');
        console.log('Notification handler initialized');
    },
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification: function(message, type, duration) {
        if (!this.notificationElement) {
            this.notificationElement = document.querySelector('.notification');
            if (!this.notificationElement) {
                console.error('Notification element not found');
                return;
            }
        }
        
        // Set notification type class
        this.notificationElement.className = 'notification';
        this.notificationElement.classList.add(type);
        
        // Set notification message
        this.notificationElement.textContent = message;
        
        // Show notification
        this.notificationElement.style.display = 'block';
        
        // Auto-hide notification after duration
        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = setTimeout(() => {
            this.hideNotification();
        }, duration || 3000);
        
        console.log(`Notification shown: ${message} (${type})`);
    },
    
    /**
     * Hide notification
     */
    hideNotification: function() {
        if (!this.notificationElement) {
            this.notificationElement = document.querySelector('.notification');
            if (!this.notificationElement) {
                console.error('Notification element not found');
                return;
            }
        }
        
        // Hide notification
        this.notificationElement.style.display = 'none';
    },
    
    /**
     * Show success notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showSuccess: function(message, duration) {
        this.showNotification(message, 'success', duration);
    },
    
    /**
     * Show error notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showError: function(message, duration) {
        this.showNotification(message, 'error', duration);
    },
    
    /**
     * Show info notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showInfo: function(message, duration) {
        this.showNotification(message, 'info', duration);
    },
    
    /**
     * Show warning notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showWarning: function(message, duration) {
        this.showNotification(message, 'warning', duration);
    }
};
