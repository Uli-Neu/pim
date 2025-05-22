// Local Storage Implementation for PIM System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize localStorage if not already set up
    if (!localStorage.getItem('pim_initialized')) {
        initializeLocalStorage();
    }
    
    // Load data from localStorage on page load
    loadAllDataFromLocalStorage();
    
    // Add event listeners for saving data
    addSaveEventListeners();
    
    // Function to initialize localStorage with default values
    function initializeLocalStorage() {
        // Main product data
        const defaultProduct = {
            model: '',
            sku: '',
            ean: '',
            category: '',
            status: '',
            image: ''
        };
        
        // Default tables data
        const defaultTables = {
            'properties-table': [],
            'languages-table': [],
            'status-table': [],
            'packaging-table': [],
            'address-table': [],
            'category-table': [],
            'compatible-table': [],
            'serial-table': [],
            'identifier-table': [],
            'software-table': [],
            'manuals-table': [],
            'accessories-table': [],
            'package-table': []
        };
        
        // Save defaults to localStorage
        localStorage.setItem('pim_product', JSON.stringify(defaultProduct));
        localStorage.setItem('pim_tables', JSON.stringify(defaultTables));
        localStorage.setItem('pim_initialized', 'true');
        
        console.log('PIM localStorage initialized with default values');
    }
    
    // Function to load all data from localStorage
    function loadAllDataFromLocalStorage() {
        // Load main product data
        loadProductData();
        
        // Load all tables data
        loadAllTablesData();
    }
    
    // Function to load main product data
    function loadProductData() {
        const productData = JSON.parse(localStorage.getItem('pim_product') || '{}');
        
        // Set values for main form fields
        setInputValue('model', productData.model);
        setInputValue('sku', productData.sku);
        setInputValue('ean', productData.ean);
        setSelectValue('category', productData.category);
        setSelectValue('status', productData.status);
        
        // Handle image if available
        if (productData.image) {
            const imagePreview = document.getElementById('image-preview');
            if (imagePreview) {
                imagePreview.innerHTML = '';
                imagePreview.style.backgroundImage = `url(${productData.image})`;
                imagePreview.style.backgroundSize = 'contain';
                imagePreview.style.backgroundPosition = 'center';
                imagePreview.style.backgroundRepeat = 'no-repeat';
            }
        }
    }
    
    // Helper function to set input value
    function setInputValue(id, value) {
        const input = document.getElementById(id);
        if (input && value !== undefined) {
            input.value = value;
        }
    }
    
    // Helper function to set select value
    function setSelectValue(id, value) {
        const select = document.getElementById(id);
        if (select && value !== undefined && value !== '') {
            select.value = value;
        }
    }
    
    // Function to load all tables data
    function loadAllTablesData() {
        const tablesData = JSON.parse(localStorage.getItem('pim_tables') || '{}');
        
        // Load data for each table
        for (const tableId in tablesData) {
            loadTableData(tableId, tablesData[tableId]);
        }
    }
    
    // Function to load data for a specific table
    function loadTableData(tableId, data) {
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
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon"><i class="fas fa-trash"></i></button>
            `;
            
            // Add event listeners for actions
            addRowActionListeners(newRow, tableId);
        });
    }
    
    // Function to add event listeners for row actions
    function addRowActionListeners(row, tableId) {
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
                switch (tableId) {
                    case 'properties-table':
                        editPropertyRow(row, currentValues);
                        break;
                    case 'packaging-table':
                        editPackagingRow(row, currentValues);
                        break;
                    case 'package-table':
                        editPackageItemRow(row, currentValues);
                        break;
                    default:
                        // Generic edit for other tables
                        editGenericRow(row, currentValues, tableId);
                }
            });
        }
        
        // Delete button
        const deleteBtn = row.querySelector('.fa-trash');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this item?')) {
                    row.remove();
                    saveTableToLocalStorage(tableId);
                    showNotification('Item deleted successfully');
                }
            });
        }
    }
    
    // Function to edit property row
    function editPropertyRow(row, currentValues) {
        const newName = prompt('Edit property name:', currentValues[0]);
        if (newName !== null) {
            const newValue = prompt('Edit property value:', currentValues[1]);
            if (newValue !== null) {
                row.cells[0].textContent = newName;
                row.cells[1].textContent = newValue;
                
                saveTableToLocalStorage('properties-table');
                showNotification('Property updated successfully');
            }
        }
    }
    
    // Function to edit packaging row
    function editPackagingRow(row, currentValues) {
        const newName = prompt('Edit field name:', currentValues[0]);
        if (newName !== null) {
            const newValue = prompt('Edit field value:', currentValues[1]);
            if (newValue !== null) {
                row.cells[0].textContent = newName;
                row.cells[1].textContent = newValue;
                
                saveTableToLocalStorage('packaging-table');
                showNotification('Packaging field updated successfully');
            }
        }
    }
    
    // Function to edit package item row
    function editPackageItemRow(row, currentValues) {
        const newName = prompt('Edit item name:', currentValues[0]);
        if (newName !== null) {
            const newQuantity = prompt('Edit quantity:', currentValues[1]);
            if (newQuantity !== null) {
                row.cells[0].textContent = newName;
                row.cells[1].textContent = newQuantity;
                
                saveTableToLocalStorage('package-table');
                showNotification('Package item updated successfully');
            }
        }
    }
    
    // Function to edit generic row
    function editGenericRow(row, currentValues, tableId) {
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
            saveTableToLocalStorage(tableId);
            showNotification('Item updated successfully');
        }
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
        
        // Get current tables data
        const tablesData = JSON.parse(localStorage.getItem('pim_tables') || '{}');
        
        // Update specific table data
        tablesData[tableId] = data;
        
        // Save back to localStorage
        localStorage.setItem('pim_tables', JSON.stringify(tablesData));
        
        console.log(`Table ${tableId} saved to localStorage`);
    }
    
    // Function to save main product data to localStorage
    function saveProductData() {
        const productData = {
            model: getInputValue('model'),
            sku: getInputValue('sku'),
            ean: getInputValue('ean'),
            category: getSelectValue('category'),
            status: getSelectValue('status'),
            image: getImagePreviewUrl()
        };
        
        localStorage.setItem('pim_product', JSON.stringify(productData));
        console.log('Product data saved to localStorage');
    }
    
    // Helper function to get input value
    function getInputValue(id) {
        const input = document.getElementById(id);
        return input ? input.value : '';
    }
    
    // Helper function to get select value
    function getSelectValue(id) {
        const select = document.getElementById(id);
        return select ? select.value : '';
    }
    
    // Helper function to get image preview URL
    function getImagePreviewUrl() {
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview && imagePreview.style.backgroundImage) {
            return imagePreview.style.backgroundImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
        }
        return '';
    }
    
    // Function to add save event listeners
    function addSaveEventListeners() {
        // Save button
        const saveBtn = document.getElementById('btn-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                saveProductData();
                saveAllTablesToLocalStorage();
                showNotification('All data saved successfully');
            });
        }
        
        // Update (Save Changes) button
        const updateBtn = document.getElementById('btn-update');
        if (updateBtn) {
            updateBtn.addEventListener('click', function() {
                saveProductData();
                saveAllTablesToLocalStorage();
                showNotification('Changes saved successfully');
            });
        }
        
        // Input fields change events
        const mainInputs = document.querySelectorAll('#model, #sku, #ean');
        mainInputs.forEach(input => {
            input.addEventListener('change', function() {
                saveProductData();
            });
        });
        
        // Select fields change events
        const mainSelects = document.querySelectorAll('#category, #status');
        mainSelects.forEach(select => {
            select.addEventListener('change', function() {
                saveProductData();
            });
        });
        
        // Image upload
        const uploadImageBtn = document.getElementById('btn-upload-image');
        const productImage = document.getElementById('product-image');
        
        if (uploadImageBtn && productImage) {
            uploadImageBtn.addEventListener('click', function() {
                productImage.click();
            });
            
            productImage.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imagePreview = document.getElementById('image-preview');
                        if (imagePreview) {
                            imagePreview.innerHTML = '';
                            imagePreview.style.backgroundImage = `url(${e.target.result})`;
                            imagePreview.style.backgroundSize = 'contain';
                            imagePreview.style.backgroundPosition = 'center';
                            imagePreview.style.backgroundRepeat = 'no-repeat';
                            
                            saveProductData();
                            showNotification('Image uploaded successfully');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    // Function to save all tables to localStorage
    function saveAllTablesToLocalStorage() {
        const tableIds = [
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
        ];
        
        tableIds.forEach(tableId => {
            saveTableToLocalStorage(tableId);
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
    
    // Clear button functionality
    const clearBtn = document.getElementById('btn-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all form fields? This will not delete saved data.')) {
                // Clear main form fields
                document.getElementById('model')?.value = '';
                document.getElementById('sku')?.value = '';
                document.getElementById('ean')?.value = '';
                document.getElementById('category')?.value = '';
                document.getElementById('status')?.value = '';
                
                // Clear image preview
                const imagePreview = document.getElementById('image-preview');
                if (imagePreview) {
                    imagePreview.style.backgroundImage = '';
                    imagePreview.innerHTML = `
                        <div class="placeholder-text">
                            <p>"Picture of model"</p>
                            <p>Insert an image here</p>
                            <p>preferably drag and drop</p>
                        </div>
                    `;
                }
                
                showNotification('Form cleared successfully');
            }
        });
    }
    
    // New button functionality
    const newBtn = document.getElementById('btn-new');
    if (newBtn) {
        newBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to create a new product? Unsaved changes will be lost.')) {
                // Clear form fields
                document.getElementById('model')?.value = '';
                document.getElementById('sku')?.value = '';
                document.getElementById('ean')?.value = '';
                document.getElementById('category')?.value = '';
                document.getElementById('status')?.value = '';
                
                // Clear image preview
                const imagePreview = document.getElementById('image-preview');
                if (imagePreview) {
                    imagePreview.style.backgroundImage = '';
                    imagePreview.innerHTML = `
                        <div class="placeholder-text">
                            <p>"Picture of model"</p>
                            <p>Insert an image here</p>
                            <p>preferably drag and drop</p>
                        </div>
                    `;
                }
                
                // Clear tables
                const tableIds = [
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
                ];
                
                tableIds.forEach(tableId => {
                    const table = document.getElementById(tableId);
                    if (table) {
                        const tbody = table.querySelector('tbody');
                        if (tbody) {
                            tbody.innerHTML = '';
                        }
                    }
                });
                
                showNotification('New product created');
            }
        });
    }
});
