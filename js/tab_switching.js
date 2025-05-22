/**
 * Tab Switching Functionality
 * Handles tab switching in the PIM system
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and tab panes
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Prevent default behavior
            event.preventDefault();
            
            // Get the tab to activate
            const tabToActivate = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to the clicked button
            this.classList.add('active');
            
            // Add active class to the corresponding tab pane
            const tabPane = document.getElementById(`${tabToActivate}-tab`);
            if (tabPane) {
                tabPane.classList.add('active');
                console.log(`Activated tab: ${tabToActivate}`);
            } else {
                console.error(`Tab pane not found: ${tabToActivate}-tab`);
            }
        });
    });
    
    // Initialize Add and Manage buttons for all tabs
    // Removed duplicate initialization as this is now handled by tab_buttons_handler.js
});

/**
 * Show a notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
