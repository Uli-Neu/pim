/**
 * Main controller for button events in the PIM system
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all buttons in the main window
    initializeMainButtons();
    
    // Initialize tab buttons
    initializeTabButtons();
});

/**
 * Initialize all buttons in the main window
 */
function initializeMainButtons() {
    // New button
    const newButton = document.getElementById('btn-new');
    if (newButton) {
        newButton.addEventListener('click', function() {
            // Clear all form fields
            clearFormFields();
            showNotification('New record created');
        });
    }
    
    // Save button
    const saveButton = document.getElementById('btn-save');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Simulate saving data
            showNotification('Record saved successfully');
        });
    }
    
    // Clear button
    const clearButton = document.getElementById('btn-clear');
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all fields?')) {
                clearFormFields();
                showNotification('Form cleared');
            }
        });
    }
    
    // Last Record button
    const lastButton = document.getElementById('btn-last');
    if (lastButton) {
        lastButton.addEventListener('click', function() {
            // Simulate loading last record
            showNotification('Last record loaded');
        });
    }
    
    // Update button
    const updateButton = document.getElementById('btn-update');
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            // Simulate updating record
            showNotification('Record updated successfully');
        });
    }
    
    // Previous button
    const prevButton = document.getElementById('btn-prev');
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            // Simulate loading previous record
            showNotification('Previous record loaded');
        });
    }
    
    // Next button
    const nextButton = document.getElementById('btn-next');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // Simulate loading next record
            showNotification('Next record loaded');
        });
    }
    
    // Search button
    const searchButton = document.getElementById('btn-search');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.getElementById('global-search');
            if (searchInput && searchInput.value.trim() !== '') {
                // Simulate search
                showNotification(`Searching for: ${searchInput.value}`);
            } else {
                showNotification('Please enter a search term', 'warning');
            }
        });
    }
    
    // Category Manage button
    const manageCategoryButton = document.getElementById('btn-manage-category');
    if (manageCategoryButton) {
        manageCategoryButton.addEventListener('click', function() {
            if (window.modalManager) {
                const columns = [
                    { field: 'id', title: 'ID' },
                    { field: 'name', title: 'Category Name' },
                    { field: 'description', title: 'Description' },
                    { field: 'status', title: 'Status' }
                ];
                
                const data = [
                    { id: 1, name: 'Modem', description: 'Network devices', status: 'Active' },
                    { id: 2, name: 'Router', description: 'Network devices', status: 'Active' },
                    { id: 3, name: 'Smartphone', description: 'Mobile devices', status: 'Active' },
                    { id: 4, name: 'Tablet', description: 'Mobile devices', status: 'Active' },
                    { id: 5, name: 'Accessory', description: 'Additional items', status: 'Active' }
                ];
                
                window.modalManager.showManagementWindow('Manage Categories', columns, data);
            }
        });
    }
    
    // Status Manage button
    const manageStatusButton = document.getElementById('btn-manage-status');
    if (manageStatusButton) {
        manageStatusButton.addEventListener('click', function() {
            if (window.modalManager) {
                const columns = [
                    { field: 'id', title: 'ID' },
                    { field: 'name', title: 'Status Name' },
                    { field: 'description', title: 'Description' },
                    { field: 'color', title: 'Color' }
                ];
                
                const data = [
                    { id: 1, name: 'Active', description: 'Product is active', color: 'green' },
                    { id: 2, name: 'In Development', description: 'Product is being developed', color: 'blue' },
                    { id: 3, name: 'End of Life', description: 'Product is discontinued', color: 'orange' },
                    { id: 4, name: 'Deleted', description: 'Product is deleted', color: 'red' }
                ];
                
                window.modalManager.showManagementWindow('Manage Statuses', columns, data);
            }
        });
    }
    
    // Upload Image button
    const uploadImageButton = document.getElementById('btn-upload-image');
    if (uploadImageButton) {
        uploadImageButton.addEventListener('click', function() {
            const fileInput = document.getElementById('product-image');
            if (fileInput) {
                fileInput.click();
            }
        });
    }
    
    // Handle file input change
    const fileInput = document.getElementById('product-image');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imagePreview = document.getElementById('image-preview');
                    if (imagePreview) {
                        imagePreview.innerHTML = `<img src="${event.target.result}" alt="Product Image">`;
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
}

/**
 * Initialize tab buttons
 */
function initializeTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            const tabPane = document.getElementById(tabId + '-tab');
            if (tabPane) {
                tabPane.classList.add('active');
            } else {
                console.error(`Tab pane with ID "${tabId}-tab" not found`);
            }
        });
    });
    
    // Initialize manage buttons in tabs
    initializeTabManageButtons();
}

/**
 * Initialize manage buttons in tabs
 */
function initializeTabManageButtons() {
    // Languages tab
    // Fix selector to match actual button ID
    const manageLanguagesButton = document.getElementById('btn-manage-languages');
    if (manageLanguagesButton) {
        manageLanguagesButton.addEventListener('click', function() {
            if (window.modalManager) {
                const columns = [
                    { field: 'id', title: 'ID' },
                    { field: 'code', title: 'Language Code' },
                    { field: 'name', title: 'Language Name' },
                    { field: 'status', title: 'Status' }
                ];
                
                const data = [
                    { id: 1, code: 'EN', name: 'English', status: 'Active' },
                    { id: 2, code: 'DE', name: 'German', status: 'Active' },
                    { id: 3, code: 'FR', name: 'French', status: 'Active' },
                    { id: 4, code: 'ES', name: 'Spanish', status: 'Inactive' },
                    { id: 5, code: 'IT', name: 'Italian', status: 'Inactive' }
                ];
                
                window.modalManager.showManagementWindow('Manage Languages', columns, data);
            }
        });
    }
    
    // Properties tab
    // Fix selector to match actual button ID
    const managePropertiesButton = document.getElementById('btn-manage-properties');
    if (managePropertiesButton) {
        managePropertiesButton.addEventListener('click', function() {
            if (window.modalManager) {
                const columns = [
                    { field: 'id', title: 'ID' },
                    { field: 'name', title: 'Property Name' },
                    { field: 'type', title: 'Property Type' },
                    { field: 'required', title: 'Required' }
                ];
                
                const data = [
                    { id: 1, name: 'Weight', type: 'Number', required: 'Yes' },
                    { id: 2, name: 'Dimensions', type: 'Text', required: 'Yes' },
                    { id: 3, name: 'Color', type: 'Text', required: 'No' },
                    { id: 4, name: 'Material', type: 'Text', required: 'No' },
                    { id: 5, name: 'Warranty', type: 'Number', required: 'Yes' }
                ];
                
                window.modalManager.showManagementWindow('Manage Properties', columns, data);
            }
        });
    }
    
    // Add Property button
    const addPropertyButton = document.querySelector('#properties-tab .add-button');
    if (addPropertyButton) {
        addPropertyButton.addEventListener('click', function() {
            if (window.modalManager) {
                const columns = [
                    { field: 'name', title: 'Property Name' },
                    { field: 'value', title: 'Value' }
                ];
                
                window.modalManager.showEditForm('Add Property', columns, {}, 'new');
            }
        });
    }
}

/**
 * Clear all form fields
 */
function clearFormFields() {
    const inputs = document.querySelectorAll('input:not([type="file"]), select, textarea');
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Clear image preview
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview) {
        imagePreview.innerHTML = `
            <div class="placeholder-text">
                <p>"Picture of model"</p>
                <p>Insert an image here</p>
                <p>preferably drag and drop</p>
            </div>
        `;
    }
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, info, warning, error)
 */
function showNotification(message, type = 'success') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '2000';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'info':
            notification.style.backgroundColor = '#2196F3';
            break;
        case 'warning':
            notification.style.backgroundColor = '#FF9800';
            break;
        case 'error':
            notification.style.backgroundColor = '#F44336';
            break;
        default:
            notification.style.backgroundColor = '#4CAF50';
    }
    
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.minWidth = '250px';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    
    // Add message
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.float = 'right';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '10px';
    closeButton.onclick = () => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    };
    
    notification.insertBefore(closeButton, notification.firstChild);
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
