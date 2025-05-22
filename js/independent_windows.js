// Independent Windows JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Independent window modal elements
    const independentWindowModal = document.getElementById('independent-window-modal');
    const independentWindowTitle = document.getElementById('independent-window-title');
    const independentWindowBody = document.getElementById('independent-window-body');
    const closeIndependentWindow = independentWindowModal.querySelector('.close-modal');
    const cancelIndependentBtn = document.getElementById('btn-cancel-independent');
    const saveIndependentBtn = document.getElementById('btn-save-independent');
    
    // Open window buttons
    const openPropertiesWindowBtn = document.getElementById('btn-open-properties-window');
    const openLanguagesWindowBtn = document.getElementById('btn-open-languages-window');
    const openStatusWindowBtn = document.getElementById('btn-open-status-window');
    const openPackagingWindowBtn = document.getElementById('btn-open-packaging-window');
    const openAddressWindowBtn = document.getElementById('btn-open-address-window');
    const openCategoryWindowBtn = document.getElementById('btn-open-category-window');
    const openCompatibleWindowBtn = document.getElementById('btn-open-compatible-window');
    const openSerialWindowBtn = document.getElementById('btn-open-serial-window');
    const openImeiWindowBtn = document.getElementById('btn-open-imei-window');
    const openSoftwareWindowBtn = document.getElementById('btn-open-software-window');
    const openManualsWindowBtn = document.getElementById('btn-open-manuals-window');
    const openAccessoriesWindowBtn = document.getElementById('btn-open-accessories-window');
    
    // Function to open independent window modal
    function openIndependentWindow(title, content) {
        independentWindowTitle.textContent = title;
        independentWindowBody.innerHTML = content;
        independentWindowModal.style.display = 'flex';
    }
    
    // Function to close independent window modal
    function closeIndependentWindow() {
        independentWindowModal.style.display = 'none';
    }
    
    // Event listeners for closing modal
    closeIndependentWindow.addEventListener('click', closeIndependentWindow);
    cancelIndependentBtn.addEventListener('click', closeIndependentWindow);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === independentWindowModal) {
            closeIndependentWindow();
        }
    });
    
    // Properties independent window
    openPropertiesWindowBtn?.addEventListener('click', function() {
        openIndependentWindow('Properties Management', `
            <div class="independent-window-container">
                <div class="filter-section">
                    <h4>Filter Properties</h4>
                    <div class="form-group">
                        <label for="parent-id">Parent Product ID:</label>
                        <div class="input-with-search">
                            <input type="text" id="parent-id" name="parent-id" placeholder="Enter product ID or leave empty for all">
                            <button class="field-search-btn"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="property-filter">Filter by Property:</label>
                        <input type="text" id="property-filter" name="property-filter" placeholder="Filter by property name">
                    </div>
                    <button id="btn-apply-property-filter" class="btn">Apply Filter</button>
                    <button id="btn-clear-property-filter" class="btn">Clear Filter</button>
                </div>
                
                <div class="data-section">
                    <h4>Properties List</h4>
                    <div class="table-toolbar">
                        <button id="btn-add-independent-property" class="btn"><i class="fas fa-plus"></i> Add Property</button>
                        <button id="btn-import-properties" class="btn"><i class="fas fa-file-import"></i> Import</button>
                        <button id="btn-export-properties" class="btn"><i class="fas fa-file-export"></i> Export</button>
                    </div>
                    <table class="independent-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Parent Product ID</th>
                                <th>Property</th>
                                <th>Value</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>PROP001</td>
                                <td>PROD001</td>
                                <td>Processor</td>
                                <td>Quad-core 2.0 GHz</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>PROP002</td>
                                <td>PROD001</td>
                                <td>RAM</td>
                                <td>4 GB</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>PROP003</td>
                                <td>PROD001</td>
                                <td>Storage</td>
                                <td>64 GB</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>PROP004</td>
                                <td>PROD002</td>
                                <td>Processor</td>
                                <td>Octa-core 2.4 GHz</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>PROP005</td>
                                <td>PROD002</td>
                                <td>RAM</td>
                                <td>8 GB</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination">
                        <button class="btn-icon"><i class="fas fa-chevron-left"></i></button>
                        <span>Page 1 of 3</span>
                        <button class="btn-icon"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                
                <div class="edit-section">
                    <h4>Add/Edit Property</h4>
                    <div class="form-group">
                        <label for="property-id">Property ID:</label>
                        <input type="text" id="property-id" name="property-id" placeholder="Auto-generated if new">
                    </div>
                    <div class="form-group">
                        <label for="property-parent-id">Parent Product ID:</label>
                        <div class="input-with-search">
                            <input type="text" id="property-parent-id" name="property-parent-id" required>
                            <button class="field-search-btn"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="property-name">Property Name:</label>
                        <input type="text" id="property-name" name="property-name" required>
                    </div>
                    <div class="form-group">
                        <label for="property-value">Property Value:</label>
                        <input type="text" id="property-value" name="property-value" required>
                    </div>
                    <div class="form-actions">
                        <button id="btn-save-property" class="btn btn-primary">Save Property</button>
                        <button id="btn-cancel-property-edit" class="btn">Cancel</button>
                    </div>
                </div>
            </div>
        `);
        
        // Add event listeners for the independent window
        document.getElementById('btn-add-independent-property')?.addEventListener('click', function() {
            // Clear form fields and prepare for new entry
            document.getElementById('property-id').value = '';
            document.getElementById('property-parent-id').value = '';
            document.getElementById('property-name').value = '';
            document.getElementById('property-value').value = '';
            
            // Focus on the first field
            document.getElementById('property-parent-id').focus();
        });
        
        document.getElementById('btn-save-property')?.addEventListener('click', function() {
            const propertyId = document.getElementById('property-id').value;
            const parentId = document.getElementById('property-parent-id').value;
            const propertyName = document.getElementById('property-name').value;
            const propertyValue = document.getElementById('property-value').value;
            
            if (!parentId || !propertyName || !propertyValue) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Here we would normally save to database, but for demo we'll just show an alert
            alert(`Property ${propertyId ? 'updated' : 'added'}: ${propertyName} = ${propertyValue} for product ${parentId}`);
            
            // In a real application, we would refresh the table with updated data
        });
        
        // Add event listeners for edit buttons in the table
        document.querySelectorAll('.independent-table .fa-edit').forEach(function(editBtn) {
            editBtn.addEventListener('click', function() {
                const row = this.closest('tr');
                const cells = row.cells;
                
                // Populate form with data from the selected row
                document.getElementById('property-id').value = cells[0].textContent;
                document.getElementById('property-parent-id').value = cells[1].textContent;
                document.getElementById('property-name').value = cells[2].textContent;
                document.getElementById('property-value').value = cells[3].textContent;
                
                // Scroll to edit section
                document.querySelector('.edit-section').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Add event listeners for delete buttons in the table
        document.querySelectorAll('.independent-table .fa-trash').forEach(function(deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                const row = this.closest('tr');
                const propertyId = row.cells[0].textContent;
                
                if (confirm(`Are you sure you want to delete property ${propertyId}?`)) {
                    // Here we would normally delete from database, but for demo we'll just remove the row
                    row.remove();
                    alert(`Property ${propertyId} deleted`);
                }
            });
        });
    });
    
    // Packaging Logistics independent window
    openPackagingWindowBtn?.addEventListener('click', function() {
        openIndependentWindow('Packaging Logistics Management', `
            <div class="independent-window-container">
                <div class="filter-section">
                    <h4>Filter Packaging Fields</h4>
                    <div class="form-group">
                        <label for="packaging-parent-id">Parent Product ID:</label>
                        <div class="input-with-search">
                            <input type="text" id="packaging-parent-id" name="packaging-parent-id" placeholder="Enter product ID or leave empty for all">
                            <button class="field-search-btn"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="packaging-filter">Filter by Field:</label>
                        <input type="text" id="packaging-filter" name="packaging-filter" placeholder="Filter by field name">
                    </div>
                    <button id="btn-apply-packaging-filter" class="btn">Apply Filter</button>
                    <button id="btn-clear-packaging-filter" class="btn">Clear Filter</button>
                </div>
                
                <div class="data-section">
                    <h4>Packaging Fields List</h4>
                    <div class="table-toolbar">
                        <button id="btn-add-independent-packaging" class="btn"><i class="fas fa-plus"></i> Add Field</button>
                        <button id="btn-import-packaging" class="btn"><i class="fas fa-file-import"></i> Import</button>
                        <button id="btn-export-packaging" class="btn"><i class="fas fa-file-export"></i> Export</button>
                    </div>
                    <table class="independent-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Parent Product ID</th>
                                <th>Field</th>
                                <th>Value</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>PACK001</td>
                                <td>PROD001</td>
                                <td>Length (cm)</td>
                                <td>25.5</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>PACK002</td>
                                <td>PROD001</td>
                                <td>Width (cm)</td>
                                <td>15.2</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>PACK003</td>
                                <td>PROD001</td>
                                <td>Height (cm)</td>
                                <td>5.8</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>PACK004</td>
                                <td>PROD002</td>
                                <td>Length (cm)</td>
                                <td>18.3</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>PACK005</td>
                                <td>PROD002</td>
                                <td>Width (cm)</td>
                                <td>9.7</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pagination">
                        <button class="btn-icon"><i class="fas fa-chevron-left"></i></button>
                        <span>Page 1 of 2</span>
                        <button class="btn-icon"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                
                <div class="edit-section">
                    <h4>Add/Edit Packaging Field</h4>
                    <div class="form-group">
                        <label for="packaging-field-id">Field ID:</label>
                        <input type="text" id="packaging-field-id" name="packaging-field-id" placeholder="Auto-generated if new">
                    </div>
                    <div class="form-group">
                        <label for="packaging-field-parent-id">Parent Product ID:</label>
                        <div class="input-with-search">
                            <input type="text" id="packaging-field-parent-id" name="packaging-field-parent-id" required>
                            <button class="field-search-btn"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="packaging-field-name">Field Name:</label>
                        <input type="text" id="packaging-field-name" name="packaging-field-name" required>
                    </div>
                    <div class="form-group">
                        <label for="packaging-field-value">Field Value:</label>
                        <input type="text" id="packaging-field-value" name="packaging-field-value" required>
                    </div>
                    <div class="form-actions">
                        <button id="btn-save-packaging-field" class="btn btn-primary">Save Field</button>
                        <button id="btn-cancel-packaging-edit" class="btn">Cancel</button>
                    </div>
                </div>
            </div>
        `);
        
        // Similar event listeners as for Properties window
        document.getElementById('btn-add-independent-packaging')?.addEventListener('click', function() {
            document.getElementById('packaging-field-id').value = '';
            document.getElementById('packaging-field-parent-id').value = '';
            document.getElementById('packaging-field-name').value = '';
            document.getElementById('packaging-field-value').value = '';
            
            document.getElementById('packaging-field-parent-id').focus();
        });
        
        document.getElementById('btn-save-packaging-field')?.addEventListener('click', function() {
            const fieldId = document.getElementById('packaging-field-id').value;
            const parentId = document.getElementById('packaging-field-parent-id').value;
            const fieldName = document.getElementById('packaging-field-name').value;
            const fieldValue = document.getElementById('packaging-field-value').value;
            
            if (!parentId || !fieldName || !fieldValue) {
                alert('Please fill in all required fields');
                return;
            }
            
            alert(`Packaging field ${fieldId ? 'updated' : 'added'}: ${fieldName} = ${fieldValue} for product ${parentId}`);
        });
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.independent-table .fa-edit').forEach(function(editBtn) {
            editBtn.addEventListener('click', function() {
                const row = this.closest('tr');
                const cells = row.cells;
                
                document.getElementById('packaging-field-id').value = cells[0].textContent;
                document.getElementById('packaging-field-parent-id').value = cells[1].textContent;
                document.getElementById('packaging-field-name').value = cells[2].textContent;
                document.getElementById('packaging-field-value').value = cells[3].textContent;
                
                document.querySelector('.edit-section').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        document.querySelectorAll('.independent-table .fa-trash').forEach(function(deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                const row = this.closest('tr');
                const fieldId = row.cells[0].textContent;
                
                if (confirm(`Are you sure you want to delete packaging field ${fieldId}?`)) {
                    row.remove();
                    alert(`Packaging field ${fieldId} deleted`);
                }
            });
        });
    });
    
    // Add similar implementations for other tabs
    // For brevity, we'll just implement the open window functionality for the remaining tabs
    
    openLanguagesWindowBtn?.addEventListener('click', function() {
        openIndependentWindow('Languages Management', `
            <div class="independent-window-container">
                <div class="filter-section">
                    <h4>Filter Languages</h4>
                    <div class="form-group">
                        <label for="language-parent-id">Parent Product ID:</label>
                        <div class="input-with-search">
                            <input type="text" id="language-parent-id" name="language-parent-id" placeholder="Enter product ID or leave empty for all">
                            <button class="field-search-btn"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <button id="btn-apply-language-filter" class="btn">Apply Filter</button>
                    <button id="btn-clear-language-filter" class="btn">Clear Filter</button>
                </div>
                
                <div class="data-section">
                    <h4>Languages List</h4>
                    <div class="table-toolbar">
                        <button id="btn-add-independent-language" class="btn"><i class="fas fa-plus"></i> Add Language</button>
                    </div>
                    <table class="independent-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Parent Product ID</th>
                                <th>Language Code</th>
                                <th>Language Name</th>
                                <th>Translation Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>LANG001</td>
                                <td>PROD001</td>
                                <td>EN</td>
                                <td>English</td>
                                <td>Complete</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>LANG002</td>
                                <td>PROD001</td>
                                <td>DE</td>
                                <td>German</td>
                                <td>Partial</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="edit-section">
                    <h4>Add/Edit Language</h4>
                    <div class="form-group">
                        <label for="language-id">Language ID:</label>
                        <input type="text" id="language-id" name="language-id" placeholder="Auto-generated if new">
                    </div>
                    <div class="form-group">
                        <label for="language-parent-id-edit">Parent Product ID:</label>
                        <div class="input-with-search">
                            <input type="text" id="language-parent-id-edit" name="language-parent-id-edit" required>
                            <button class="field-search-btn"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <!-- Additional fields for language management -->
                </div>
            </div>
        `);
    });
    
    // Add CSS for independent windows
    document.querySelector('head').insertAdjacentHTML('beforeend', `
    <style>
        .independent-window-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-height: 70vh;
            overflow-y: auto;
        }
        
        .filter-section,
        .data-section,
        .edit-section {
            background-color: #f9f9f9;
            border-radius: 4px;
            padding: 1rem;
            border: 1px solid var(--border-color);
        }
        
        .filter-section h4,
        .data-section h4,
        .edit-section h4 {
            margin-top: 0;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        
        .independent-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
        }
        
        .independent-table th,
        .independent-table td {
            padding: 0.5rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        .independent-table th {
            background-color: var(--light-color);
            font-weight: 600;
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .modal-large {
            width: 90%;
            max-width: 1200px;
        }
    </style>
    `);
});
