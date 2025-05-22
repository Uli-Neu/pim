/**
 * Modal Manager - Handles modal dialogs for Add and Manage functionality
 */

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.modalManager = new ModalManager();
});

// Modal Manager class
class ModalManager {
    constructor() {
        this.createModalContainer();
        console.log('Modal Manager initialized');
    }

    // Create modal container
    createModalContainer() {
        // Check if container already exists
        if (document.getElementById('modal-container')) {
            return;
        }

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        modalContainer.className = 'modal-container';
        modalContainer.style.display = 'none';
        modalContainer.style.position = 'fixed';
        modalContainer.style.zIndex = '1000';
        modalContainer.style.left = '0';
        modalContainer.style.top = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalContainer.style.overflow = 'auto';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.id = 'modal-content';
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = '#fefefe';
        modalContent.style.margin = '5% auto';
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #888';
        modalContent.style.width = '80%';
        modalContent.style.maxWidth = '1000px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2)';

        // Add close button
        const closeButton = document.createElement('span');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.style.color = '#aaa';
        closeButton.style.float = 'right';
        closeButton.style.fontSize = '28px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => this.hideModal();

        // Add hover effect to close button
        closeButton.onmouseover = () => closeButton.style.color = '#000';
        closeButton.onmouseout = () => closeButton.style.color = '#aaa';

        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.id = 'modal-header';
        modalHeader.className = 'modal-header';
        modalHeader.style.borderBottom = '1px solid #ddd';
        modalHeader.style.paddingBottom = '10px';
        modalHeader.style.marginBottom = '20px';

        // Create modal title
        const modalTitle = document.createElement('h2');
        modalTitle.id = 'modal-title';
        modalTitle.className = 'modal-title';
        modalTitle.style.margin = '0';
        modalTitle.style.display = 'inline-block';

        // Create modal body
        const modalBody = document.createElement('div');
        modalBody.id = 'modal-body';
        modalBody.className = 'modal-body';
        modalBody.style.maxHeight = '60vh';
        modalBody.style.overflowY = 'auto';

        // Create modal footer
        const modalFooter = document.createElement('div');
        modalFooter.id = 'modal-footer';
        modalFooter.className = 'modal-footer';
        modalFooter.style.borderTop = '1px solid #ddd';
        modalFooter.style.paddingTop = '10px';
        modalFooter.style.marginTop = '20px';
        modalFooter.style.textAlign = 'right';

        // Add elements to modal
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modalContainer.appendChild(modalContent);

        // Add modal to body
        document.body.appendChild(modalContainer);

        // Close modal when clicking outside
        modalContainer.onclick = (event) => {
            if (event.target === modalContainer) {
                this.hideModal();
            }
        };
    }

    // Show modal with Add functionality
    showAddModal(title, columns, data) {
        const modalContainer = document.getElementById('modal-container');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalFooter = document.getElementById('modal-footer');

        // Set title
        modalTitle.textContent = title;

        // Clear body and footer
        modalBody.innerHTML = '';
        modalFooter.innerHTML = '';

        // Create search input
        const searchContainer = document.createElement('div');
        searchContainer.style.marginBottom = '15px';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.style.padding = '8px';
        searchInput.style.width = '100%';
        searchInput.style.boxSizing = 'border-box';
        searchInput.style.marginBottom = '10px';
        searchInput.style.border = '1px solid #ddd';
        searchInput.style.borderRadius = '4px';
        
        searchContainer.appendChild(searchInput);
        modalBody.appendChild(searchContainer);

        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.style.width = '100%';
        tableContainer.style.overflowX = 'auto';
        
        // Create table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '15px';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.backgroundColor = '#f2f2f2';
        
        // Add select all checkbox
        const selectAllCell = document.createElement('th');
        selectAllCell.style.padding = '10px';
        selectAllCell.style.textAlign = 'center';
        selectAllCell.style.border = '1px solid #ddd';
        
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'select-all';
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
        
        selectAllCell.appendChild(selectAllCheckbox);
        headerRow.appendChild(selectAllCell);
        
        // Add column headers
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.title;
            th.style.padding = '10px';
            th.style.textAlign = 'left';
            th.style.border = '1px solid #ddd';
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Add data rows
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.style.border = '1px solid #ddd';
            
            // Add hover effect
            tr.onmouseover = () => tr.style.backgroundColor = '#f5f5f5';
            tr.onmouseout = () => tr.style.backgroundColor = '';
            
            // Add checkbox cell
            const checkboxCell = document.createElement('td');
            checkboxCell.style.padding = '10px';
            checkboxCell.style.textAlign = 'center';
            checkboxCell.style.border = '1px solid #ddd';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.id = row.id;
            
            checkboxCell.appendChild(checkbox);
            tr.appendChild(checkboxCell);
            
            // Add data cells
            columns.forEach(column => {
                const td = document.createElement('td');
                td.textContent = row[column.field] || '';
                td.style.padding = '10px';
                td.style.border = '1px solid #ddd';
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        modalBody.appendChild(tableContainer);

        // Add search functionality
        searchInput.addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            
            rows.forEach(row => {
                let found = false;
                const cells = row.querySelectorAll('td');
                
                cells.forEach((cell, index) => {
                    if (index === 0) return; // Skip checkbox cell
                    if (cell.textContent.toLowerCase().includes(searchText)) {
                        found = true;
                    }
                });
                
                row.style.display = found ? '' : 'none';
            });
        });

        // Add buttons to footer
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.marginLeft = '10px';
        cancelButton.style.backgroundColor = '#f44336';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.onclick = () => this.hideModal();
        
        const addButton = document.createElement('button');
        addButton.textContent = 'Add Selected';
        addButton.style.padding = '8px 16px';
        addButton.style.marginLeft = '10px';
        addButton.style.backgroundColor = '#4CAF50';
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '4px';
        addButton.style.cursor = 'pointer';
        addButton.onclick = () => {
            const selectedIds = [];
            const checkboxes = table.querySelectorAll('tbody input[type="checkbox"]:checked');
            
            checkboxes.forEach(checkbox => {
                selectedIds.push(checkbox.dataset.id);
            });
            
            if (selectedIds.length === 0) {
                alert('Please select at least one item.');
                return;
            }
            
            alert(`Selected items: ${selectedIds.join(', ')}`);
            this.hideModal();
        };
        
        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(addButton);

        // Show modal
        modalContainer.style.display = 'block';
    }

    // Show management window
    showManagementWindow(title, columns, data) {
        const modalContainer = document.getElementById('modal-container');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalFooter = document.getElementById('modal-footer');
        
        // Set title
        modalTitle.textContent = title;
        
        // Clear body and footer
        modalBody.innerHTML = '';
        modalFooter.innerHTML = '';
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.style.marginBottom = '15px';
        toolbar.style.display = 'flex';
        toolbar.style.justifyContent = 'space-between';
        
        // Create left toolbar section
        const leftToolbar = document.createElement('div');
        
        // Create New button
        const newButton = document.createElement('button');
        newButton.textContent = 'New';
        newButton.style.padding = '8px 16px';
        newButton.style.marginRight = '10px';
        newButton.style.backgroundColor = '#4CAF50';
        newButton.style.color = 'white';
        newButton.style.border = 'none';
        newButton.style.borderRadius = '4px';
        newButton.style.cursor = 'pointer';
        newButton.onclick = () => {
            this.showEditForm(title, columns, {}, 'new');
        };
        
        // Create Save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.padding = '8px 16px';
        saveButton.style.marginRight = '10px';
        saveButton.style.backgroundColor = '#2196F3';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = () => {
            // Show success notification
            this.showNotification('Changes saved successfully');
        };
        
        leftToolbar.appendChild(newButton);
        leftToolbar.appendChild(saveButton);
        
        // Create right toolbar section
        const rightToolbar = document.createElement('div');
        
        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.style.padding = '8px';
        searchInput.style.width = '200px';
        searchInput.style.border = '1px solid #ddd';
        searchInput.style.borderRadius = '4px';
        
        // Create search button
        const searchButton = document.createElement('button');
        searchButton.textContent = 'Search';
        searchButton.style.padding = '8px 16px';
        searchButton.style.marginLeft = '10px';
        searchButton.style.backgroundColor = '#607D8B';
        searchButton.style.color = 'white';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '4px';
        searchButton.style.cursor = 'pointer';
        searchButton.onclick = () => {
            const searchText = searchInput.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            
            rows.forEach(row => {
                let found = false;
                const cells = row.querySelectorAll('td');
                
                cells.forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(searchText)) {
                        found = true;
                    }
                });
                
                row.style.display = found ? '' : 'none';
            });
        };
        
        rightToolbar.appendChild(searchInput);
        rightToolbar.appendChild(searchButton);
        
        toolbar.appendChild(leftToolbar);
        toolbar.appendChild(rightToolbar);
        modalBody.appendChild(toolbar);
        
        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.style.width = '100%';
        tableContainer.style.overflowX = 'auto';
        
        // Create table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '15px';
        
        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.backgroundColor = '#f2f2f2';
        
        // Add column headers
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.title;
            th.style.padding = '10px';
            th.style.textAlign = 'left';
            th.style.border = '1px solid #ddd';
            headerRow.appendChild(th);
        });
        
        // Add actions header
        const actionsHeader = document.createElement('th');
        actionsHeader.textContent = 'Actions';
        actionsHeader.style.padding = '10px';
        actionsHeader.style.textAlign = 'center';
        actionsHeader.style.border = '1px solid #ddd';
        headerRow.appendChild(actionsHeader);
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // Add data rows
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.style.border = '1px solid #ddd';
            
            // Add hover effect
            tr.onmouseover = () => tr.style.backgroundColor = '#f5f5f5';
            tr.onmouseout = () => tr.style.backgroundColor = '';
            
            // Add data cells
            columns.forEach(column => {
                const td = document.createElement('td');
                td.textContent = row[column.field] || '';
                td.style.padding = '10px';
                td.style.border = '1px solid #ddd';
                tr.appendChild(td);
            });
            
            // Add actions cell
            const actionsCell = document.createElement('td');
            actionsCell.style.padding = '10px';
            actionsCell.style.textAlign = 'center';
            actionsCell.style.border = '1px solid #ddd';
            
            // Create edit button
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.title = 'Edit';
            editButton.style.padding = '5px 10px';
            editButton.style.marginRight = '5px';
            editButton.style.backgroundColor = '#2196F3';
            editButton.style.color = 'white';
            editButton.style.border = 'none';
            editButton.style.borderRadius = '4px';
            editButton.style.cursor = 'pointer';
            editButton.onclick = () => {
                this.showEditForm(title, columns, row, 'edit');
            };
            
            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.title = 'Delete';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.backgroundColor = '#f44336';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '4px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = () => {
                if (confirm(`Are you sure you want to delete item with ID: ${row.id}?`)) {
                    tr.remove();
                    this.showNotification(`Item with ID: ${row.id} deleted.`);
                }
            };
            
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            tr.appendChild(actionsCell);
            
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        modalBody.appendChild(tableContainer);
        
        // Add close button to footer
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '8px 16px';
        closeButton.style.marginLeft = '10px';
        closeButton.style.backgroundColor = '#607D8B';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => this.hideModal();
        
        modalFooter.appendChild(closeButton);
        
        // Show modal
        modalContainer.style.display = 'block';
    }
    
    // Show edit form for new or existing item
    showEditForm(title, columns, data, mode) {
        const modalContainer = document.getElementById('modal-container');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalFooter = document.getElementById('modal-footer');
        
        // Set title based on mode
        const formTitle = mode === 'new' ? `New item functionality` : `Edit item with ID: ${data.id}`;
        modalTitle.textContent = formTitle;
        
        // Clear body and footer
        modalBody.innerHTML = '';
        modalFooter.innerHTML = '';
        
        // Create form
        const form = document.createElement('form');
        form.id = 'edit-form';
        form.style.width = '100%';
        
        // Add form fields
        columns.forEach(column => {
            const formGroup = document.createElement('div');
            formGroup.style.marginBottom = '15px';
            
            const label = document.createElement('label');
            label.textContent = column.title + ':';
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.fontWeight = 'bold';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.name = column.field;
            input.value = data[column.field] || '';
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.boxSizing = 'border-box';
            input.style.border = '1px solid #ddd';
            input.style.borderRadius = '4px';
            
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            form.appendChild(formGroup);
        });
        
        modalBody.appendChild(form);
        
        // Add buttons to footer
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.marginLeft = '10px';
        cancelButton.style.backgroundColor = '#f44336';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.onclick = () => {
            // Return to management window
            this.showManagementWindow(title, columns, this.getTableData(title));
        };
        
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.padding = '8px 16px';
        saveButton.style.marginLeft = '10px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = () => {
            // Get form data
            const formData = {};
            columns.forEach(column => {
                const input = form.querySelector(`input[name="${column.field}"]`);
                formData[column.field] = input.value;
            });
            
            // Add ID if editing
            if (mode === 'edit') {
                formData.id = data.id;
            } else {
                // Generate new ID for new item
                formData.id = this.generateId();
            }
            
            // Save data
            this.saveData(title, formData, mode);
            
            // Show success notification
            const message = mode === 'new' ? 'New item added successfully' : 'Item updated successfully';
            this.showNotification(message);
            
            // Return to management window
            this.showManagementWindow(title, columns, this.getTableData(title));
        };
        
        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(saveButton);
        
        // Show modal
        modalContainer.style.display = 'block';
    }
    
    // Generate unique ID
    generateId() {
        return Math.floor(Math.random() * 1000) + 1;
    }
    
    // Get table data for a specific title
    getTableData(title) {
        // This would normally fetch data from a database or API
        // For demo purposes, we'll return mock data
        
        if (title === 'Manage Languages') {
            return [
                { id: 1, code: 'EN', name: 'English', status: 'Active' },
                { id: 2, code: 'DE', name: 'German', status: 'Active' },
                { id: 3, code: 'FR', name: 'French', status: 'Active' },
                { id: 4, code: 'ES', name: 'Spanish', status: 'Inactive' },
                { id: 5, code: 'IT', name: 'Italian', status: 'Inactive' }
            ];
        } else if (title === 'Manage Categories') {
            return [
                { id: 1, name: 'Modem', description: 'Network devices', status: 'Active' },
                { id: 2, name: 'Router', description: 'Network devices', status: 'Active' },
                { id: 3, name: 'Smartphone', description: 'Mobile devices', status: 'Active' },
                { id: 4, name: 'Tablet', description: 'Mobile devices', status: 'Active' },
                { id: 5, name: 'Accessory', description: 'Additional items', status: 'Active' }
            ];
        } else if (title === 'Manage Statuses') {
            return [
                { id: 1, name: 'Active', description: 'Product is active', color: 'green' },
                { id: 2, name: 'In Development', description: 'Product is being developed', color: 'blue' },
                { id: 3, name: 'End of Life', description: 'Product is discontinued', color: 'orange' },
                { id: 4, name: 'Deleted', description: 'Product is deleted', color: 'red' }
            ];
        }
        
        return [];
    }
    
    // Save data
    saveData(title, data, mode) {
        // This would normally save data to a database or API
        // For demo purposes, we'll just log it
        console.log(`Saving ${mode} data for ${title}:`, data);
    }
    
    // Show notification
    showNotification(message) {
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
        notification.style.backgroundColor = '#4CAF50';
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

    // Hide modal
    hideModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.style.display = 'none';
    }
}
