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
        
        // Check if notification container exists
        if (!document.querySelector('.notification-container')) {
            // Create notification container
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Check if loading overlay exists
        if (!document.querySelector('.loading-overlay')) {
            // Create loading overlay
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-message">Loading...</div>
            `;
            document.body.appendChild(overlay);
        }
        
        console.log('Notification handler initialized');
    },
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info, warning)
     * @param {number} duration - Duration in milliseconds
     */
    showNotification: function(message, type, duration) {
        // Get or create notification container
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Add icon based on type
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-times-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'info':
            default:
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        // Set notification content
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <div class="notification-close"><i class="fas fa-times"></i></div>
        `;
        
        // Add to container
        container.appendChild(notification);
        
        // Add event listener for close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.add('notification-hiding');
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Show notification with animation
        setTimeout(function() {
            notification.classList.add('notification-visible');
        }, 10);
        
        // Auto-hide notification after duration
        setTimeout(function() {
            if (notification.parentNode) {
                notification.classList.add('notification-hiding');
                setTimeout(function() {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, duration || 3000);
        
        console.log(`Notification shown: ${message} (${type})`);
    },
    
    /**
     * Show success notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showSuccess: function(message, duration) {
        this.showNotification(message, 'success', duration || 3000);
    },
    
    /**
     * Show error notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showError: function(message, duration) {
        this.showNotification(message, 'error', duration || 5000);
    },
    
    /**
     * Show info notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showInfo: function(message, duration) {
        this.showNotification(message, 'info', duration || 3000);
    },
    
    /**
     * Show warning notification
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    showWarning: function(message, duration) {
        this.showNotification(message, 'warning', duration || 4000);
    },
    
    /**
     * Show loading overlay
     */
    showLoading: function() {
        // Get or create loading overlay
        let overlay = document.querySelector('.loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-message">Loading...</div>
            `;
            document.body.appendChild(overlay);
        }
        
        // Show loading overlay
        overlay.classList.add('loading-visible');
    },
    
    /**
     * Hide loading overlay
     */
    hideLoading: function() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.remove('loading-visible');
        }
    }
};

// Initialize notification handler on page load
document.addEventListener('DOMContentLoaded', function() {
    NotificationHandler.init();
});
