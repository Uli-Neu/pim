/**
 * PIM System - Settings Button Handler
 * 
 * This module handles the settings buttons for category and status fields.
 */

const settingsButtonHandler = {
    /**
     * Initialize settings button handlers
     */
    init: function() {
        console.log('Initializing settings button handlers');
        
        // Initialize category settings button
        this.initCategorySettingsButton();
        
        // Initialize status settings button
        this.initStatusSettingsButton();
        
        console.log('Settings button handlers initialized');
    },
    
    /**
     * Initialize category settings button
     */
    initCategorySettingsButton: function() {
        // Updated selector to match the actual DOM structure
        const categorySettingsButton = document.querySelector('.form-group:has(#category-select) .manage-button');
        if (categorySettingsButton) {
            console.log('Category settings button found');
            categorySettingsButton.addEventListener('click', function(event) {
                event.preventDefault();
                
                // Show category management modal
                settingsButtonHandler.showCategoryManagementModal();
                
                // Show notification
                if (typeof NotificationHandler !== 'undefined') {
                    NotificationHandler.showInfo('Category management opened');
                }
            });
        } else {
            console.error('Category settings button not found');
        }
    },
    
    /**
     * Initialize status settings button
     */
    initStatusSettingsButton: function() {
        // Updated selector to match the actual DOM structure
        const statusSettingsButton = document.querySelector('.form-group:has(#status-select) .manage-button');
        if (statusSettingsButton) {
            console.log('Status settings button found');
            statusSettingsButton.addEventListener('click', function(event) {
                event.preventDefault();
                
                // Show status management modal
                settingsButtonHandler.showStatusManagementModal();
                
                // Show notification
                if (typeof NotificationHandler !== 'undefined') {
                    NotificationHandler.showInfo('Status management opened');
                }
            });
        } else {
            console.error('Status settings button not found');
        }
    },
    
    /**
     * Show category management modal
     */
    showCategoryManagementModal: function() {
        // Create modal if it doesn't exist
        let categoryModal = document.getElementById('category-management-modal');
        if (!categoryModal) {
            categoryModal = this.createCategoryManagementModal();
        }
        
        // Show modal
        categoryModal.style.display = 'block';
    },
    
    /**
     * Show status management modal
     */
    showStatusManagementModal: function() {
        // Create modal if it doesn't exist
        let statusModal = document.getElementById('status-management-modal');
        if (!statusModal) {
            statusModal = this.createStatusManagementModal();
        }
        
        // Show modal
        statusModal.style.display = 'block';
    },
    
    /**
     * Create category management modal
     */
    createCategoryManagementModal: function() {
        // Create modal element
        const modal = document.createElement('div');
        modal.id = 'category-management-modal';
        modal.className = 'modal';
        
        // Get current categories from select
        const categorySelect = document.getElementById('category-select');
        const categories = [];
        if (categorySelect) {
            for (let i = 0; i < categorySelect.options.length; i++) {
                categories.push(categorySelect.options[i].value);
            }
        }
        
        // Create modal content
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Manage Categories</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="new-category-input">New Category:</label>
                        <input type="text" id="new-category-input" class="form-control">
                        <button id="add-category-button" class="btn btn-primary">Add</button>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="category-list">
                                ${categories.map(category => `
                                    <tr>
                                        <td>${category}</td>
                                        <td class="action-buttons">
                                            <button class="edit-button"><i class="fas fa-edit"></i></button>
                                            <button class="delete-button"><i class="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-category-modal-button" class="btn btn-secondary">Close</button>
                </div>
            </div>
        `;
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeButton = modal.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        const closeModalButton = modal.querySelector('#close-category-modal-button');
        if (closeModalButton) {
            closeModalButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        const addCategoryButton = modal.querySelector('#add-category-button');
        if (addCategoryButton) {
            addCategoryButton.addEventListener('click', function() {
                const newCategoryInput = document.getElementById('new-category-input');
                if (newCategoryInput && newCategoryInput.value) {
                    // Add to select
                    if (categorySelect) {
                        const option = document.createElement('option');
                        option.value = newCategoryInput.value;
                        option.textContent = newCategoryInput.value;
                        categorySelect.appendChild(option);
                    }
                    
                    // Add to table
                    const categoryList = document.getElementById('category-list');
                    if (categoryList) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${newCategoryInput.value}</td>
                            <td class="action-buttons">
                                <button class="edit-button"><i class="fas fa-edit"></i></button>
                                <button class="delete-button"><i class="fas fa-trash"></i></button>
                            </td>
                        `;
                        categoryList.appendChild(row);
                        
                        // Add event listeners to new buttons
                        settingsButtonHandler.initCategoryRowButtons(row);
                    }
                    
                    // Clear input
                    newCategoryInput.value = '';
                    
                    // Show notification
                    if (typeof NotificationHandler !== 'undefined') {
                        NotificationHandler.showSuccess('Category added');
                    }
                }
            });
        }
        
        // Initialize row buttons
        const rows = modal.querySelectorAll('#category-list tr');
        rows.forEach(row => this.initCategoryRowButtons(row));
        
        return modal;
    },
    
    /**
     * Initialize category row buttons
     */
    initCategoryRowButtons: function(row) {
        const editButton = row.querySelector('.edit-button');
        if (editButton) {
            editButton.addEventListener('click', function() {
                const cell = row.querySelector('td:first-child');
                const currentValue = cell.textContent;
                
                // Replace with input
                cell.innerHTML = `<input type="text" class="form-control edit-category-input" value="${currentValue}">`;
                
                // Focus input
                const input = cell.querySelector('input');
                if (input) {
                    input.focus();
                    
                    // Add event listeners
                    input.addEventListener('keypress', function(event) {
                        if (event.key === 'Enter') {
                            const newValue = input.value;
                            
                            // Update cell
                            cell.textContent = newValue;
                            
                            // Update select option
                            const categorySelect = document.getElementById('category-select');
                            if (categorySelect) {
                                for (let i = 0; i < categorySelect.options.length; i++) {
                                    if (categorySelect.options[i].value === currentValue) {
                                        categorySelect.options[i].value = newValue;
                                        categorySelect.options[i].textContent = newValue;
                                        break;
                                    }
                                }
                            }
                            
                            // Show notification
                            if (typeof NotificationHandler !== 'undefined') {
                                NotificationHandler.showSuccess('Category updated');
                            }
                        }
                    });
                    
                    input.addEventListener('blur', function() {
                        const newValue = input.value;
                        
                        // Update cell
                        cell.textContent = newValue;
                        
                        // Update select option
                        const categorySelect = document.getElementById('category-select');
                        if (categorySelect) {
                            for (let i = 0; i < categorySelect.options.length; i++) {
                                if (categorySelect.options[i].value === currentValue) {
                                    categorySelect.options[i].value = newValue;
                                    categorySelect.options[i].textContent = newValue;
                                    break;
                                }
                            }
                        }
                        
                        // Show notification
                        if (typeof NotificationHandler !== 'undefined') {
                            NotificationHandler.showSuccess('Category updated');
                        }
                    });
                }
            });
        }
        
        const deleteButton = row.querySelector('.delete-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this category?')) {
                    const cell = row.querySelector('td:first-child');
                    const currentValue = cell.textContent;
                    
                    // Remove from select
                    const categorySelect = document.getElementById('category-select');
                    if (categorySelect) {
                        for (let i = 0; i < categorySelect.options.length; i++) {
                            if (categorySelect.options[i].value === currentValue) {
                                categorySelect.remove(i);
                                break;
                            }
                        }
                    }
                    
                    // Remove row
                    row.remove();
                    
                    // Show notification
                    if (typeof NotificationHandler !== 'undefined') {
                        NotificationHandler.showInfo('Category deleted');
                    }
                }
            });
        }
    },
    
    /**
     * Create status management modal
     */
    createStatusManagementModal: function() {
        // Create modal element
        const modal = document.createElement('div');
        modal.id = 'status-management-modal';
        modal.className = 'modal';
        
        // Get current statuses from select
        const statusSelect = document.getElementById('status-select');
        const statuses = [];
        if (statusSelect) {
            for (let i = 0; i < statusSelect.options.length; i++) {
                statuses.push(statusSelect.options[i].value);
            }
        }
        
        // Create modal content
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Manage Statuses</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="new-status-input">New Status:</label>
                        <input type="text" id="new-status-input" class="form-control">
                        <button id="add-status-button" class="btn btn-primary">Add</button>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="status-list">
                                ${statuses.map(status => `
                                    <tr>
                                        <td>${status}</td>
                                        <td class="action-buttons">
                                            <button class="edit-button"><i class="fas fa-edit"></i></button>
                                            <button class="delete-button"><i class="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-status-modal-button" class="btn btn-secondary">Close</button>
                </div>
            </div>
        `;
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeButton = modal.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        const closeModalButton = modal.querySelector('#close-status-modal-button');
        if (closeModalButton) {
            closeModalButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        const addStatusButton = modal.querySelector('#add-status-button');
        if (addStatusButton) {
            addStatusButton.addEventListener('click', function() {
                const newStatusInput = document.getElementById('new-status-input');
                if (newStatusInput && newStatusInput.value) {
                    // Add to select
                    if (statusSelect) {
                        const option = document.createElement('option');
                        option.value = newStatusInput.value;
                        option.textContent = newStatusInput.value;
                        statusSelect.appendChild(option);
                    }
                    
                    // Add to table
                    const statusList = document.getElementById('status-list');
                    if (statusList) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${newStatusInput.value}</td>
                            <td class="action-buttons">
                                <button class="edit-button"><i class="fas fa-edit"></i></button>
                                <button class="delete-button"><i class="fas fa-trash"></i></button>
                            </td>
                        `;
                        statusList.appendChild(row);
                        
                        // Add event listeners to new buttons
                        settingsButtonHandler.initStatusRowButtons(row);
                    }
                    
                    // Clear input
                    newStatusInput.value = '';
                    
                    // Show notification
                    if (typeof NotificationHandler !== 'undefined') {
                        NotificationHandler.showSuccess('Status added');
                    }
                }
            });
        }
        
        // Initialize row buttons
        const rows = modal.querySelectorAll('#status-list tr');
        rows.forEach(row => this.initStatusRowButtons(row));
        
        return modal;
    },
    
    /**
     * Initialize status row buttons
     */
    initStatusRowButtons: function(row) {
        const editButton = row.querySelector('.edit-button');
        if (editButton) {
            editButton.addEventListener('click', function() {
                const cell = row.querySelector('td:first-child');
                const currentValue = cell.textContent;
                
                // Replace with input
                cell.innerHTML = `<input type="text" class="form-control edit-status-input" value="${currentValue}">`;
                
                // Focus input
                const input = cell.querySelector('input');
                if (input) {
                    input.focus();
                    
                    // Add event listeners
                    input.addEventListener('keypress', function(event) {
                        if (event.key === 'Enter') {
                            const newValue = input.value;
                            
                            // Update cell
                            cell.textContent = newValue;
                            
                            // Update select option
                            const statusSelect = document.getElementById('status-select');
                            if (statusSelect) {
                                for (let i = 0; i < statusSelect.options.length; i++) {
                                    if (statusSelect.options[i].value === currentValue) {
                                        statusSelect.options[i].value = newValue;
                                        statusSelect.options[i].textContent = newValue;
                                        break;
                                    }
                                }
                            }
                            
                            // Show notification
                            if (typeof NotificationHandler !== 'undefined') {
                                NotificationHandler.showSuccess('Status updated');
                            }
                        }
                    });
                    
                    input.addEventListener('blur', function() {
                        const newValue = input.value;
                        
                        // Update cell
                        cell.textContent = newValue;
                        
                        // Update select option
                        const statusSelect = document.getElementById('status-select');
                        if (statusSelect) {
                            for (let i = 0; i < statusSelect.options.length; i++) {
                                if (statusSelect.options[i].value === currentValue) {
                                    statusSelect.options[i].value = newValue;
                                    statusSelect.options[i].textContent = newValue;
                                    break;
                                }
                            }
                        }
                        
                        // Show notification
                        if (typeof NotificationHandler !== 'undefined') {
                            NotificationHandler.showSuccess('Status updated');
                        }
                    });
                }
            });
        }
        
        const deleteButton = row.querySelector('.delete-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this status?')) {
                    const cell = row.querySelector('td:first-child');
                    const currentValue = cell.textContent;
                    
                    // Remove from select
                    const statusSelect = document.getElementById('status-select');
                    if (statusSelect) {
                        for (let i = 0; i < statusSelect.options.length; i++) {
                            if (statusSelect.options[i].value === currentValue) {
                                statusSelect.remove(i);
                                break;
                            }
                        }
                    }
                    
                    // Remove row
                    row.remove();
                    
                    // Show notification
                    if (typeof NotificationHandler !== 'undefined') {
                        NotificationHandler.showInfo('Status deleted');
                    }
                }
            });
        }
    }
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    settingsButtonHandler.init();
});
