/**
 * Local Storage Manager for PIM System
 * 
 * This module handles all local storage operations for the PIM system,
 * including initialization, data loading, saving, and UI synchronization.
 */

// Create a self-executing function to avoid polluting the global namespace
(function() {
    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        LocalStorageManager.init();
    });

    // LocalStorageManager object
    const LocalStorageManager = {
        // Storage keys
        KEYS: {
            INITIALIZED: 'pim_initialized',
            PRODUCT: 'pim_product',
            TABLES: 'pim_tables'
        },
        
        // Table IDs
        TABLE_IDS: [
            'properties-table',
            'languages-table',
            'status-table',
            'packaging-table',
            'address-table',
            'category-table',
            'compatible-table',
            'serial-table',
            'identifier-table',
            'software-table',
            'manuals-table',
            'accessories-table',
            'package-table'
        ],
        
        /**
         * Initialize the local storage manager
         */
        init: function() {
            console.log('Initializing LocalStorageManager...');
            
            // Check if localStorage is already initialized
            if (!localStorage.getItem(this.KEYS.INITIALIZED)) {
                this.initializeLocalStorage();
            }
            
            // Load data from localStorage
            this.loadAllDataFromLocalStorage();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('LocalStorageManager initialized successfully');
        },
        
        /**
         * Initialize localStorage with default values
         */
        initializeLocalStorage: function() {
            // Default product data structure
            const defaultProduct = {
                model: '',
                sku: '',
                ean: '',
                category: '',
                status: '',
                image: ''
            };
            
            // Default tables data structure
            const defaultTables = {};
            this.TABLE_IDS.forEach(tableId => {
                defaultTables[tableId] = [];
            });
            
            // Save defaults to localStorage
            localStorage.setItem(this.KEYS.PRODUCT, JSON.stringify(defaultProduct));
            localStorage.setItem(this.KEYS.TABLES, JSON.stringify(defaultTables));
            localStorage.setItem(this.KEYS.INITIALIZED, 'true');
            
            console.log('PIM localStorage initialized with default values');
        },
        
        /**
         * Load all data from localStorage
         */
        loadAllDataFromLocalStorage: function() {
            this.loadProductData();
            this.loadAllTablesData();
        },
        
        /**
         * Load main product data from localStorage
         */
        loadProductData: function() {
            try {
                const productData = JSON.parse(localStorage.getItem(this.KEYS.PRODUCT) || '{}');
                
                // Set values for main form fields
                this.setInputValue('model', productData.model);
                this.setInputValue('sku', productData.sku);
                this.setInputValue('ean', productData.ean);
                this.setSelectValue('category', productData.category);
                this.setSelectValue('status', productData.status);
                
                // Handle image if available
                this.setProductImage(productData.image);
            } catch (error) {
                console.error('Error loading product data:', error);
                this.showNotification('Error loading product data', 'error');
            }
        },
        
        /**
         * Set product image in the UI
         * @param {string} imageUrl - URL of the image
         */
        setProductImage: function(imageUrl) {
            if (!imageUrl) return;
            
            const imagePreview = document.getElementById('image-preview');
            if (imagePreview) {
                imagePreview.innerHTML = '';
                imagePreview.style.backgroundImage = `url(${imageUrl})`;
                imagePreview.style.backgroundSize = 'contain';
                imagePreview.style.backgroundPosition = 'center';
                imagePreview.style.backgroundRepeat = 'no-repeat';
            }
        },
        
        /**
         * Helper function to set input value
         * @param {string} id - Element ID
         * @param {string} value - Value to set
         */
        setInputValue: function(id, value) {
            const input = document.getElementById(id);
            if (input && value !== undefined) {
                input.value = value;
            }
        },
        
        /**
         * Helper function to set select value
         * @param {string} id - Element ID
         * @param {string} value - Value to set
         */
        setSelectValue: function(id, value) {
            const select = document.getElementById(id);
            if (select && value !== undefined && value !== '') {
                select.value = value;
            }
        },
        
        /**
         * Load all tables data from localStorage
         */
        loadAllTablesData: function() {
            try {
                const tablesData = JSON.parse(localStorage.getItem(this.KEYS.TABLES) || '{}');
                
                // Load data for each table
                Object.keys(tablesData).forEach(tableId => {
                    this.loadTableData(tableId, tablesData[tableId]);
                });
            } catch (error) {
                console.error('Error loading tables data:', error);
                this.showNotification('Error loading tables data', 'error');
            }
        },
        
        /**
         * Load data for a specific table
         * @param {string} tableId - Table ID
         * @param {Array} data - Table data
         */
        loadTableData: function(tableId, data) {
            const table = document.getElementById(tableId);
            if (!table || !data || !Array.isArray(data)) return;
            
            const tbody = table.querySelector('tbody');
            if (!tbody) return;
            
            // Clear existing rows
            tbody.innerHTML = '';
            
            // Add rows from data
            data.forEach(rowData => {
                const newRow = tbody.insertRow();
                
                // Add data cells
                rowData.forEach((cellData, index) => {
                    const cell = newRow.insertCell();
                    cell.textContent = cellData;
                });
                
                // Add actions cell
                const actionsCell = newRow.insertCell();
                actionsCell.innerHTML = `
                    <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" title="Delete"><i class="fas fa-trash"></i></button>
                `;
                
                // Add event listeners for actions
                this.addRowActionListeners(newRow, tableId);
            });
        },
        
        /**
         * Add event listeners for row actions
         * @param {HTMLElement} row - Table row
         * @param {string} tableId - Table ID
         */
        addRowActionListeners: function(row, tableId) {
            const self = this;
            
            // Edit button
            const editBtn = row.querySelector('.fa-edit');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    const cells = row.cells;
                    const cellCount = cells.length - 1; // Exclude actions cell
                    
                    // Get current values
                    const currentValues = [];
                    for (let i = 0; i < cellCount; i++) {
                        currentValues.push(cells[i].textContent);
                    }
                    
                    // Edit based on table type
                    self.editTableRow(row, currentValues, tableId);
                });
            }
            
            // Delete button
            const deleteBtn = row.querySelector('.fa-trash');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this item?')) {
                        row.remove();
                        self.saveTableToLocalStorage(tableId);
                        self.showNotification('Item deleted successfully');
                    }
                });
            }
        },
        
        /**
         * Edit a table row based on table type
         * @param {HTMLElement} row - Table row
         * @param {Array} currentValues - Current cell values
         * @param {string} tableId - Table ID
         */
        editTableRow: function(row, currentValues, tableId) {
            // Determine which edit function to use based on table ID
            switch (tableId) {
                case 'properties-table':
                    this.editPropertyRow(row, currentValues);
                    break;
                case 'packaging-table':
                    this.editPackagingRow(row, currentValues);
                    break;
                case 'package-table':
                    this.editPackageItemRow(row, currentValues);
                    break;
                default:
                    // Generic edit for other tables
                    this.editGenericRow(row, currentValues, tableId);
            }
        },
        
        /**
         * Edit property row
         * @param {HTMLElement} row - Table row
         * @param {Array} currentValues - Current cell values
         */
        editPropertyRow: function(row, currentValues) {
            const newName = prompt('Edit property name:', currentValues[0]);
            if (newName !== null) {
                const newValue = prompt('Edit property value:', currentValues[1]);
                if (newValue !== null) {
                    row.cells[0].textContent = newName;
                    row.cells[1].textContent = newValue;
                    
                    this.saveTableToLocalStorage('properties-table');
                    this.showNotification('Property updated successfully');
                }
            }
        },
        
        /**
         * Edit packaging row
         * @param {HTMLElement} row - Table row
         * @param {Array} currentValues - Current cell values
         */
        editPackagingRow: function(row, currentValues) {
            const newName = prompt('Edit field name:', currentValues[0]);
            if (newName !== null) {
                const newValue = prompt('Edit field value:', currentValues[1]);
                if (newValue !== null) {
                    row.cells[0].textContent = newName;
                    row.cells[1].textContent = newValue;
                    
                    this.saveTableToLocalStorage('packaging-table');
                    this.showNotification('Packaging field updated successfully');
                }
            }
        },
        
        /**
         * Edit package item row
         * @param {HTMLElement} row - Table row
         * @param {Array} currentValues - Current cell values
         */
        editPackageItemRow: function(row, currentValues) {
            const newName = prompt('Edit item name:', currentValues[0]);
            if (newName !== null) {
                const newQuantity = prompt('Edit quantity:', currentValues[1]);
                if (newQuantity !== null) {
                    row.cells[0].textContent = newName;
                    row.cells[1].textContent = newQuantity;
                    
                    this.saveTableToLocalStorage('package-table');
                    this.showNotification('Package item updated successfully');
                }
            }
        },
        
        /**
         * Edit generic row
         * @param {HTMLElement} row - Table row
         * @param {Array} currentValues - Current cell values
         * @param {string} tableId - Table ID
         */
        editGenericRow: function(row, currentValues, tableId) {
            let updated = false;
            
            for (let i = 0; i < currentValues.length; i++) {
                const newValue = prompt(`Edit value for column ${i+1}:`, currentValues[i]);
                if (newValue !== null) {
                    row.cells[i].textContent = newValue;
                    updated = true;
                } else {
                    break; // User cancelled
                }
            }
            
            if (updated) {
                this.saveTableToLocalStorage(tableId);
                this.showNotification('Item updated successfully');
            }
        },
        
        /**
         * Save table data to localStorage
         * @param {string} tableId - Table ID
         */
        saveTableToLocalStorage: function(tableId) {
            try {
                const table = document.getElementById(tableId);
                if (!table) return;
                
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                const data = rows.map(row => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    return cells.slice(0, -1).map(cell => cell.textContent); // Exclude actions column
                });
                
                // Get current tables data
                const tablesData = JSON.parse(localStorage.getItem(this.KEYS.TABLES) || '{}');
                
                // Update specific table data
                tablesData[tableId] = data;
                
                // Save back to localStorage
                localStorage.setItem(this.KEYS.TABLES, JSON.stringify(tablesData));
                
                console.log(`Table ${tableId} saved to localStorage`);
            } catch (error) {
                console.error(`Error saving table ${tableId}:`, error);
                this.showNotification(`Error saving table data`, 'error');
            }
        },
        
        /**
         * Save main product data to localStorage
         */
        saveProductData: function() {
            try {
                const productData = {
                    model: this.getInputValue('model'),
                    sku: this.getInputValue('sku'),
                    ean: this.getInputValue('ean'),
                    category: this.getSelectValue('category'),
                    status: this.getSelectValue('status'),
                    image: this.getImagePreviewUrl()
                };
                
                localStorage.setItem(this.KEYS.PRODUCT, JSON.stringify(productData));
                console.log('Product data saved to localStorage');
            } catch (error) {
                console.error('Error saving product data:', error);
                this.showNotification('Error saving product data', 'error');
            }
        },
        
        /**
         * Helper function to get input value
         * @param {string} id - Element ID
         * @returns {string} Input value
         */
        getInputValue: function(id) {
            const input = document.getElementById(id);
            return input ? input.value : '';
        },
        
        /**
         * Helper function to get select value
         * @param {string} id - Element ID
         * @returns {string} Select value
         */
        getSelectValue: function(id) {
            const select = document.getElementByI
(Content truncated due to size limit. Use line ranges to read in chunks)