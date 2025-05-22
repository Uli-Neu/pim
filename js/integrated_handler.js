/**
 * PIM System - Integrated Search and Save Handler
 * 
 * This module handles centralized search functionality and integrated save operations
 * that work across the main form and all child tabs.
 */

const integratedHandler = {
    /**
     * Initialize the integrated handler
     */
    init: function() {
        // Set up event listeners for main buttons
        document.getElementById('btn-save').addEventListener('click', this.saveAllData);
        document.getElementById('btn-update').addEventListener('click', this.saveAllData);
        document.getElementById('search-button').addEventListener('click', this.performSearch);
        document.getElementById('btn-clear').addEventListener('click', this.clearAllData);
        
        // Set up property management buttons
        document.getElementById('btn-manage-property-types').addEventListener('click', this.openPropertyTypesManager);
        document.getElementById('btn-open-properties').addEventListener('click', this.openPropertiesWindow);
        
        console.log('Integrated handler initialized');
    },
    
    /**
     * Save all data from main form and tabs
     */
    saveAllData: function() {
        // Collect data from main form
        const mainFormData = {
            model: document.getElementById('model-input').value,
            sku: document.getElementById('sku-input').value,
            ean: document.getElementById('ean-input').value,
            category: document.getElementById('category-select').value,
            status: document.getElementById('status-select').value
        };
        
        // Collect data from package contents
        const packageItems = [];
        const packageRows = document.querySelectorAll('#package-contents-table tbody tr');
        packageRows.forEach(row => {
            packageItems.push({
                item: row.cells[0].textContent,
                quantity: row.cells[1].textContent
            });
        });
        
        // Collect data from active tab
        const activeTabId = document.querySelector('.tab-button.active').id.replace('tab-', '');
        const tabData = integratedHandler.collectTabData(activeTabId);
        
        // Combine all data
        const allData = {
            mainForm: mainFormData,
            packageContents: packageItems,
            activeTab: {
                id: activeTabId,
                data: tabData
            }
        };
        
        console.log('Saving all data:', allData);
        
        // In a real application, this would send data to the server
        // For now, we'll just show a success notification
        showNotification('All data saved successfully', 'success');
        
        // Update progress bar to reflect saved state
        progressCalculator.updateProgressBar();
    },
    
    /**
     * Collect data from a specific tab
     */
    collectTabData: function(tabId) {
        const tabData = [];
        const tableId = tabId === 'properties' ? 'properties-table' : 
                        tabId === 'languages' ? 'languages-table' :
                        tabId === 'status' ? 'status-table' :
                        tabId === 'packaging' ? 'packaging-logistics-table' :
                        tabId === 'address' ? 'address-table' :
                        tabId === 'category' ? 'category-table' :
                        tabId === 'compatible' ? 'compatible-table' :
                        tabId === 'serial' ? 'serial-table' :
                        tabId === 'imei-mac' ? 'imei-mac-table' :
                        tabId === 'software' ? 'software-table' :
                        tabId === 'manuals' ? 'manuals-table' :
                        tabId === 'accessories' ? 'accessories-table' : null;
        
        if (tableId) {
            const rows = document.querySelectorAll(`#${tableId} tbody tr`);
            rows.forEach(row => {
                const rowData = {};
                // Get all cells except the last one (actions)
                for (let i = 0; i < row.cells.length - 1; i++) {
                    rowData[`col${i}`] = row.cells[i].textContent;
                }
                tabData.push(rowData);
            });
        }
        
        return tabData;
    },
    
    /**
     * Perform centralized search across all fields
     */
    performSearch: function() {
        const searchInput = document.getElementById('search-input').value;
        
        // If search is empty, load all records
        if (!searchInput || searchInput.trim() === '' || searchInput === '*') {
            showNotification('Loading all records', 'info');
            // In a real application, this would fetch all records from the server
            return;
        }
        
        // Collect search criteria from all filled fields
        const searchCriteria = {};
        
        // Main form fields
        if (document.getElementById('model-input').value) {
            searchCriteria.model = document.getElementById('model-input').value;
        }
        
        if (document.getElementById('sku-input').value) {
            searchCriteria.sku = document.getElementById('sku-input').value;
        }
        
        if (document.getElementById('ean-input').value) {
            searchCriteria.ean = document.getElementById('ean-input').value;
        }
        
        if (document.getElementById('category-select').value) {
            searchCriteria.category = document.getElementById('category-select').value;
        }
        
        if (document.getElementById('status-select').value) {
            searchCriteria.status = document.getElementById('status-select').value;
        }
        
        // If no specific fields are filled, search across all fields with the search input
        if (Object.keys(searchCriteria).length === 0) {
            searchCriteria.global = searchInput;
        }
        
        console.log('Searching with criteria:', searchCriteria);
        
        // In a real application, this would send the search criteria to the server
        // For now, we'll just show a success notification
        showNotification(`Searching for records matching criteria`, 'info');
    },
    
    /**
     * Clear all data from main form and tabs
     */
    clearAllData: function() {
        // Clear main form fields
        document.getElementById('model-input').value = '';
        document.getElementById('sku-input').value = '';
        document.getElementById('ean-input').value = '';
        document.getElementById('category-select').selectedIndex = 0;
        document.getElementById('status-select').selectedIndex = 0;
        
        // Clear search input
        document.getElementById('search-input').value = '';
        
        // Clear package contents
        document.querySelector('#package-contents-table tbody').innerHTML = '';
        
        // Clear active tab
        const activeTabId = document.querySelector('.tab-button.active').id.replace('tab-', '');
        const tableId = activeTabId === 'properties' ? 'properties-table' : 
                        activeTabId === 'languages' ? 'languages-table' :
                        activeTabId === 'status' ? 'status-table' :
                        activeTabId === 'packaging' ? 'packaging-logistics-table' :
                        activeTabId === 'address' ? 'address-table' :
                        activeTabId === 'category' ? 'category-table' :
                        activeTabId === 'compatible' ? 'compatible-table' :
                        activeTabId === 'serial' ? 'serial-table' :
                        activeTabId === 'imei-mac' ? 'imei-mac-table' :
                        activeTabId === 'software' ? 'software-table' :
                        activeTabId === 'manuals' ? 'manuals-table' :
                        activeTabId === 'accessories' ? 'accessories-table' : null;
        
        if (tableId) {
            document.querySelector(`#${tableId} tbody`).innerHTML = '';
        }
        
        showNotification('All data cleared', 'info');
        
        // Update progress bar to reflect cleared state
        progressCalculator.updateProgressBar();
    },
    
    /**
     * Open property types manager window
     */
    openPropertyTypesManager: function() {
        // Create modal dialog
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Manage Property Types</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Property Type</th>
                                    <th>Data Type</th>
                                    <th>Unit</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Weight</td>
                                    <td>Number</td>
                                    <td>g</td>
                                    <td class="action-buttons">
                                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Dimensions</td>
                                    <td>Text</td>
                                    <td>mm</td>
                                    <td class="action-buttons">
                                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Color</td>
                                    <td>Text</td>
                                    <td></td>
                                    <td class="action-buttons">
                                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-primary"><i class="fas fa-plus"></i> Add Property Type</button>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary">Save Changes</button>
                    <button class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to close button
        modal.querySelector('.close').addEventListener('click', function() {
            modal.remove();
        });
        
        // Add event listener to cancel button
        modal.querySelector('.btn-secondary').addEventListener('click', function() {
            modal.remove();
        });
        
        // Add event listener to save button
        modal.querySelector('.btn-primary').addEventListener('click', function() {
            showNotification('Property types saved', 'success');
            modal.remove();
        });
        
        showNotification('Property types manager opened', 'info');
    },
    
    /**
     * Open properties window (independent window without parent record dependency)
     */
    openPropertiesWindow: function() {
        // Create modal dialog
        const modal = document.createElement('div');
        modal.className = 'modal modal-large';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Properties Management</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="parent-product">Parent Product:</label>
                        <select id="parent-product" class="form-control">
                            <option value="">-- Independent Mode --</option>
                            <option value="1">Smartphone X1 (SP-X1-001)</option>
                            <option value="2">Tablet Y1 (TB-Y1-001)</option>
                            <option value="3">Laptop Z1 (LP-Z1-001)</option>
                        </select>
                    </div>
                    
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Property</th>
                                    <th>Value</th>
                                    <th>Product</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Weight</td>
                                    <td>250g</td>
                                    <td>Smartphone X1</td>
                                    <td class="action-buttons">
                                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Dimensions</td>
                                    <td>150x75x8mm</td>
                                    <td>Smartphone X1</td>
                                    <td class="action-buttons">
                                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Color</td>
                                    <td>Black</td>
                                    <td>Smartphone X1</td>
                                    <td class="action-buttons">
                                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Weight</td>
                                    <td>450g</td>
                                    <td>Tablet Y1</td>
                                    <td class="action-buttons">
                                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-primary"><i class="fas fa-plus"></i> Add Property</button>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary">Save Changes</button>
                    <button class="btn btn-secondary">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to close button
        modal.querySelector('.close').addEventListener('click', function() {
            modal.remove();
        });
        
        // Add event listener to close button
        modal.querySelector('.btn-secondary').addEventListener('click', function() {
            modal.remove();
        });
        
        // Add event listener to save button
        modal.querySelector('.btn-primary').addEventListener('click', function() {
            showNotification('Properties saved', 'success');
            modal.remove();
        });
        
        showNotification('Properties management window opened', 'info');
    }
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    integratedHandler.init();
});
