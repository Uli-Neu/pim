// Management Modals JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Management modal elements
    const managementModal = document.getElementById('management-modal');
    const managementModalTitle = document.getElementById('management-modal-title');
    const managementModalBody = document.getElementById('management-modal-body');
    const closeManagementModal = managementModal.querySelector('.close-modal');
    const cancelManagementBtn = document.getElementById('btn-cancel-management');
    const saveManagementBtn = document.getElementById('btn-save-management');
    
    // Management buttons
    const manageCategoriesBtn = document.getElementById('btn-manage-categories');
    const manageStatusBtn = document.getElementById('btn-manage-status');
    const managePropertyTypesBtn = document.getElementById('btn-manage-property-types');
    const manageLanguagesBtn = document.getElementById('btn-manage-languages');
    const managePackagingFieldsBtn = document.getElementById('btn-manage-packaging-fields');
    const manageAddressTypesBtn = document.getElementById('btn-manage-address-types');
    const manageCompatibilityTypesBtn = document.getElementById('btn-manage-compatibility-types');
    const manageSoftwareTypesBtn = document.getElementById('btn-manage-software-types');
    const manageManualTypesBtn = document.getElementById('btn-manage-manual-types');
    
    // Function to open management modal
    function openManagementModal(title, content) {
        managementModalTitle.textContent = title;
        managementModalBody.innerHTML = content;
        managementModal.style.display = 'flex';
    }
    
    // Function to close management modal
    function closeManagementModal() {
        managementModal.style.display = 'none';
    }
    
    // Event listeners for closing modal
    closeManagementModal.addEventListener('click', closeManagementModal);
    cancelManagementBtn.addEventListener('click', closeManagementModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === managementModal) {
            closeManagementModal();
        }
    });
    
    // Category management
    manageCategoriesBtn?.addEventListener('click', function() {
        openManagementModal('Manage Categories', `
            <p>Manage product categories for the current product model.</p>
            <div class="management-form">
                <table class="management-table">
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Parent Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Modem</td>
                            <td>-</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Router</td>
                            <td>-</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Smartphone</td>
                            <td>-</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Tablet</td>
                            <td>-</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Accessory</td>
                            <td>-</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>DSL Modem</td>
                            <td>Modem</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Cable Modem</td>
                            <td>Modem</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group">
                    <label for="new-category">New Category:</label>
                    <input type="text" id="new-category" name="new-category">
                </div>
                <div class="form-group">
                    <label for="parent-category">Parent Category:</label>
                    <select id="parent-category" name="parent-category">
                        <option value="">None (Top Level)</option>
                        <option value="modem">Modem</option>
                        <option value="router">Router</option>
                        <option value="smartphone">Smartphone</option>
                        <option value="tablet">Tablet</option>
                        <option value="accessory">Accessory</option>
                    </select>
                </div>
                <button id="btn-add-new-category" class="btn"><i class="fas fa-plus"></i> Add Category</button>
            </div>
        `);
        
        // Add event listener for the Add Category button
        document.getElementById('btn-add-new-category')?.addEventListener('click', function() {
            const newCategory = document.getElementById('new-category').value;
            const parentCategory = document.getElementById('parent-category').value;
            
            if (newCategory && newCategory.trim() !== '') {
                alert(`New category "${newCategory}" would be added${parentCategory ? ' under ' + parentCategory : ' as top level'}`);
            } else {
                alert('Please enter a category name');
            }
        });
    });
    
    // Status management
    manageStatusBtn?.addEventListener('click', function() {
        openManagementModal('Manage Status Types', `
            <p>Manage product status types.</p>
            <div class="management-form">
                <table class="management-table">
                    <thead>
                        <tr>
                            <th>Status Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Active</td>
                            <td>Product is currently active</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>In Development</td>
                            <td>Product is in development phase</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>End of Life</td>
                            <td>Product has reached end of life</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Deleted</td>
                            <td>Product has been deleted</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group">
                    <label for="new-status">New Status:</label>
                    <input type="text" id="new-status" name="new-status">
                </div>
                <div class="form-group">
                    <label for="status-description">Description:</label>
                    <input type="text" id="status-description" name="status-description">
                </div>
                <button id="btn-add-new-status" class="btn"><i class="fas fa-plus"></i> Add Status</button>
            </div>
        `);
        
        // Add event listener for the Add Status button
        document.getElementById('btn-add-new-status')?.addEventListener('click', function() {
            const newStatus = document.getElementById('new-status').value;
            const statusDescription = document.getElementById('status-description').value;
            
            if (newStatus && newStatus.trim() !== '') {
                alert(`New status "${newStatus}" would be added with description: ${statusDescription}`);
            } else {
                alert('Please enter a status name');
            }
        });
    });
    
    // Property types management
    managePropertyTypesBtn?.addEventListener('click', function() {
        openManagementModal('Manage Property Types', `
            <p>Manage technical property types for products.</p>
            <div class="management-form">
                <table class="management-table">
                    <thead>
                        <tr>
                            <th>Property Name</th>
                            <th>Data Type</th>
                            <th>Unit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Processor</td>
                            <td>Text</td>
                            <td>-</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>RAM</td>
                            <td>Number</td>
                            <td>GB</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Storage</td>
                            <td>Number</td>
                            <td>GB</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Battery Capacity</td>
                            <td>Number</td>
                            <td>mAh</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group">
                    <label for="new-property-type">New Property Type:</label>
                    <input type="text" id="new-property-type" name="new-property-type">
                </div>
                <div class="form-group">
                    <label for="property-data-type">Data Type:</label>
                    <select id="property-data-type" name="property-data-type">
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="property-unit">Unit (optional):</label>
                    <input type="text" id="property-unit" name="property-unit">
                </div>
                <button id="btn-add-new-property-type" class="btn"><i class="fas fa-plus"></i> Add Property Type</button>
            </div>
        `);
        
        // Add event listener for the Add Property Type button
        document.getElementById('btn-add-new-property-type')?.addEventListener('click', function() {
            const newPropertyType = document.getElementById('new-property-type').value;
            const propertyDataType = document.getElementById('property-data-type').value;
            const propertyUnit = document.getElementById('property-unit').value;
            
            if (newPropertyType && newPropertyType.trim() !== '') {
                alert(`New property type "${newPropertyType}" would be added with data type: ${propertyDataType}${propertyUnit ? ' and unit: ' + propertyUnit : ''}`);
            } else {
                alert('Please enter a property type name');
            }
        });
    });
    
    // Add event listeners for other management buttons with similar patterns
    manageLanguagesBtn?.addEventListener('click', function() {
        openManagementModal('Manage Languages', `
            <p>Manage available languages for product information.</p>
            <div class="management-form">
                <table class="management-table">
                    <thead>
                        <tr>
                            <th>Language Code</th>
                            <th>Language Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>EN</td>
                            <td>English</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>DE</td>
                            <td>German</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>FR</td>
                            <td>French</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group">
                    <label for="new-language-code">Language Code:</label>
                    <input type="text" id="new-language-code" name="new-language-code" maxlength="2">
                </div>
                <div class="form-group">
                    <label for="new-language-name">Language Name:</label>
                    <input type="text" id="new-language-name" name="new-language-name">
                </div>
                <button id="btn-add-new-language" class="btn"><i class="fas fa-plus"></i> Add Language</button>
            </div>
        `);
    });
    
    managePackagingFieldsBtn?.addEventListener('click', function() {
        openManagementModal('Manage Packaging Field Types', `
            <p>Manage field types for packaging logistics.</p>
            <div class="management-form">
                <table class="management-table">
                    <thead>
                        <tr>
                            <th>Field Name</th>
                            <th>Data Type</th>
                            <th>Unit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Length</td>
                            <td>Number</td>
                            <td>cm</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Width</td>
                            <td>Number</td>
                            <td>cm</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td>Number</td>
                            <td>cm</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td>Number</td>
                            <td>g</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>Packaging Material</td>
                            <td>Text</td>
                            <td>-</td>
                            <td>
                                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group">
                    <label for="new-packaging-field">New Field Name:</label>
                    <input type="text" id="new-packaging-field" name="new-packaging-field">
                </div>
                <div class="form-group">
                    <label for="packaging-data-type">Data Type:</label>
                    <select id="packaging-data-type" name="packaging-data-type">
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="packaging-unit">Unit (optional):</label>
                    <input type="text" id="packaging-unit" name="packaging-unit">
                </div>
                <button id="btn-add-new-packaging-field" class="btn"><i class="fas fa-plus"></i> Add Field Type</button>
            </div>
        `);
    });
    
    // Add CSS for management modals
    document.querySelector('head').insertAdjacentHTML('beforeend', `
    <style>
        .management-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .management-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
        }
        
        .management-table th,
        .management-table td {
            padding: 0.5rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        .management-table th {
            background-color: var(--light-color);
            font-weight: 600;
        }
        
        .btn-manage {
            background-color: transparent;
            color: var(--primary-color);
            border: none;
            padding: 0.2rem 0.5rem;
            cursor: pointer;
            font-size: 0.8rem;
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
        }
        
        .btn-manage:hover {
            text-decoration: underline;
        }
        
        .table-toolbar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
    </style>
    `);
});
