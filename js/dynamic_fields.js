// Enhanced Dynamic Fields JavaScript with reliable delete functionality

document.addEventListener('DOMContentLoaded', function() {
    // Function to add delete functionality to any element
    function addDeleteFunctionality(element, confirmMessage = 'Are you sure you want to delete this item?') {
        const deleteButtons = element.querySelectorAll('.fa-trash');
        
        deleteButtons.forEach(button => {
            // Remove any existing event listeners to prevent duplicates
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new event listener
            newButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                
                if (confirm(confirmMessage)) {
                    // Find the closest parent element to remove
                    const parentToRemove = this.closest('tr') || this.closest('.form-group') || this.closest('.dynamic-field');
                    
                    if (parentToRemove) {
                        // Store information about the deleted item for potential undo
                        const deletedItemInfo = {
                            type: parentToRemove.tagName,
                            parentId: parentToRemove.parentNode.id,
                            html: parentToRemove.outerHTML,
                            timestamp: new Date().getTime()
                        };
                        
                        // Store in localStorage for potential recovery
                        const deletedItems = JSON.parse(localStorage.getItem('deletedItems') || '[]');
                        deletedItems.push(deletedItemInfo);
                        localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
                        
                        // Remove the element
                        parentToRemove.remove();
                        
                        // Update progress if needed
                        if (typeof updateProgress === 'function') {
                            updateProgress();
                        }
                        
                        // Show success message
                        showNotification('Item deleted successfully');
                    } else {
                        console.error('Could not find parent element to delete');
                        showNotification('Error: Could not delete item', 'error');
                    }
                }
            });
        });
    }
    
    // Function to show notification
    function showNotification(message, type = 'success') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            document.body.appendChild(notification);
            
            // Add CSS for notification
            document.head.insertAdjacentHTML('beforeend', `
                <style>
                    #notification {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        padding: 10px 20px;
                        border-radius: 4px;
                        color: white;
                        font-weight: bold;
                        z-index: 9999;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }
                    #notification.show {
                        opacity: 1;
                    }
                    #notification.success {
                        background-color: #4CAF50;
                    }
                    #notification.error {
                        background-color: #F44336;
                    }
                    #notification.warning {
                        background-color: #FF9800;
                    }
                </style>
            `);
        }
        
        // Set notification content and style
        notification.textContent = message;
        notification.className = type;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Function to add a new property to the properties table
    function addNewProperty() {
        const propertyName = prompt('Enter property name:');
        if (!propertyName || propertyName.trim() === '') return;
        
        const propertyValue = prompt('Enter property value:');
        if (propertyValue === null) return;
        
        const propertiesTable = document.getElementById('properties-table').getElementsByTagName('tbody')[0];
        const newRow = propertiesTable.insertRow();
        
        newRow.innerHTML = `
            <td>${propertyName}</td>
            <td>${propertyValue}</td>
            <td>
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add delete functionality to the new row
        addDeleteFunctionality(newRow, `Are you sure you want to delete the property "${propertyName}"?`);
        
        // Add edit functionality to the new row
        const editButton = newRow.querySelector('.fa-edit');
        editButton.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.cells;
            
            const newName = prompt('Edit property name:', cells[0].textContent);
            if (newName !== null) {
                const newValue = prompt('Edit property value:', cells[1].textContent);
                if (newValue !== null) {
                    cells[0].textContent = newName;
                    cells[1].textContent = newValue;
                    
                    // Save to localStorage
                    saveTableToLocalStorage('properties-table');
                    
                    showNotification('Property updated successfully');
                }
            }
        });
        
        // Save to localStorage
        saveTableToLocalStorage('properties-table');
        
        // Update progress
        if (typeof updateProgress === 'function') {
            updateProgress();
        }
        
        showNotification('New property added successfully');
    }
    
    // Function to add a new packaging field to the packaging table
    function addNewPackagingField() {
        const fieldName = prompt('Enter field name:');
        if (!fieldName || fieldName.trim() === '') return;
        
        const fieldValue = prompt('Enter field value:');
        if (fieldValue === null) return;
        
        const packagingTable = document.getElementById('packaging-table').getElementsByTagName('tbody')[0];
        const newRow = packagingTable.insertRow();
        
        newRow.innerHTML = `
            <td>${fieldName}</td>
            <td>${fieldValue}</td>
            <td>
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add delete functionality to the new row
        addDeleteFunctionality(newRow, `Are you sure you want to delete the field "${fieldName}"?`);
        
        // Add edit functionality to the new row
        const editButton = newRow.querySelector('.fa-edit');
        editButton.addEventListener('click', function() {
            const row = this.closest('tr');
            const cells = row.cells;
            
            const newName = prompt('Edit field name:', cells[0].textContent);
            if (newName !== null) {
                const newValue = prompt('Edit field value:', cells[1].textContent);
                if (newValue !== null) {
                    cells[0].textContent = newName;
                    cells[1].textContent = newValue;
                    
                    // Save to localStorage
                    saveTableToLocalStorage('packaging-table');
                    
                    showNotification('Field updated successfully');
                }
            }
        });
        
        // Save to localStorage
        saveTableToLocalStorage('packaging-table');
        
        // Update progress
        if (typeof updateProgress === 'function') {
            updateProgress();
        }
        
        showNotification('New packaging field added successfully');
    }
    
    // Function to save table data to localStorage
    function saveTableToLocalStorage(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const data = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            return cells.slice(0, -1).map(cell => cell.textContent); // Exclude actions column
        });
        
        localStorage.setItem(`table_${tableId}`, JSON.stringify(data));
    }
    
    // Function to load table data from localStorage
    function loadTableFromLocalStorage(tableId) {
        const savedData = localStorage.getItem(`table_${tableId}`);
        if (!savedData) return;
        
        const data = JSON.parse(savedData);
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows
        
        data.forEach(rowData => {
            const newRow = tbody.insertRow();
            
            // Add data cells
            rowData.forEach(cellData => {
                const cell = newRow.insertCell();
                cell.textContent = cellData;
            });
            
            // Add actions cell
            const actionsCell = newRow.insertCell();
            actionsCell.innerHTML = `
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon"><i class="fas fa-trash"></i></button>
            `;
            
            // Add delete functionality
            addDeleteFunctionality(newRow);
        });
    }
    
    // Add event listeners for adding new properties and packaging fields
    const addPropertyBtn = document.getElementById('btn-add-property');
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', addNewProperty);
    }
    
    const addPackagingFieldBtn = document.getElementById('btn-add-packaging-field');
    if (addPackagingFieldBtn) {
        addPackagingFieldBtn.addEventListener('click', addNewPackagingField);
    }
    
    // Add delete functionality to all existing tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        addDeleteFunctionality(table);
    });
    
    // Load saved data from localStorage
    loadTableFromLocalStorage('properties-table');
    loadTableFromLocalStorage('packaging-table');
    
    // Add delete functionality to package table
    const packageTable = document.getElementById('package-table');
    if (packageTable) {
        addDeleteFunctionality(packageTable);
        
        // Add new package item functionality
        const addPackageItemBtn = document.getElementById('btn-add-package-item');
        if (addPackageItemBtn) {
            addPackageItemBtn.addEventListener('click', function() {
                const itemName = prompt('Enter item name:');
                if (!itemName || itemName.trim() === '') return;
                
                const quantity = prompt('Enter quantity:', '1');
                if (quantity === null) return;
                
                const tbody = packageTable.querySelector('tbody');
                const newRow = tbody.insertRow();
                
                newRow.innerHTML = `
                    <td>${itemName}</td>
                    <td>${quantity}</td>
                    <td>
                        <button class="btn-icon"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                // Add delete functionality to the new row
                addDeleteFunctionality(newRow, `Are you sure you want to delete the item "${itemName}"?`);
                
                // Save to localStorage
                saveTableToLocalStorage('package-table');
                
                showNotification('New package item added successfully');
            });
        }
    }
    
    // Update progress function
    window.updateProgress = function() {
        // Count total fields and filled fields
        const allInputs = document.querySelectorAll('input, select, textarea');
        const totalFields = allInputs.length;
        let filledFields = 0;
        
        allInputs.forEach(input => {
            if (input.value && input.value.trim() !== '') {
                filledFields++;
            }
        });
        
        // Count table rows as filled fields
        const tables = document.querySelectorAll('table tbody');
        tables.forEach(tbody => {
            const rows = tbody.querySelectorAll('tr');
            filledFields += rows.length;
        });
        
        // Calculate percentage
        const percentage = Math.round((filledFields / (totalFields + 20)) * 100); // Adding 20 as a base for tables
        
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        const percentageText = document.getElementById('completion-percentage');
        
        if (progressFill && percentageText) {
            progressFill.style.width = `${percentage}%`;
            percentageText.textContent = `${percentage}%`;
        }
    };
    
    // Initial progress update
    if (typeof updateProgress === 'function') {
        updateProgress();
    }
});
