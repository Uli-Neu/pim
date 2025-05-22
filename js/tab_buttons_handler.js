/**
 * Tab Buttons Handler - Implements functionality for Add and Manage buttons in tabs
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for tabs to be fully rendered
    setTimeout(function() {
        // Setup event handlers for Add and Manage buttons
        setupButtonHandlers();
    }, 500);
});

// Setup event handlers for Add and Manage buttons
function setupButtonHandlers() {
    // Get all Add buttons
    const addButtons = document.querySelectorAll('[id^="btn-add-"]');
    
    // Get all Manage buttons
    const manageButtons = document.querySelectorAll('[id^="btn-manage-"]');
    
    // Add event listeners to Add buttons
    addButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const tabId = button.id.replace('btn-add-', '');
            handleAddButtonClick(tabId);
        });
    });
    
    // Add event listeners to Manage buttons
    manageButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const tabId = button.id.replace('btn-manage-', '');
            handleManageButtonClick(tabId);
        });
    });
    
    console.log('Button handlers setup complete');
}

// Handle Add button click
function handleAddButtonClick(tabId) {
    console.log('Add button clicked for tab:', tabId);
    
    // Get modal manager
    const modalManager = window.modalManager;
    if (!modalManager) {
        console.error('Modal manager not found');
        alert('Modal manager not found');
        return;
    }
    
    // Get tab name
    const tabName = getTabName(tabId);
    
    // Define columns based on tab ID
    const columns = getColumnsForTab(tabId);
    
    // Get sample data for tab
    const data = getSampleDataForTab(tabId);
    
    // Show modal
    modalManager.showAddModal(`Add ${tabName}`, columns, data);
}

// Handle Manage button click
function handleManageButtonClick(tabId) {
    console.log('Manage button clicked for tab:', tabId);
    
    // Get modal manager
    const modalManager = window.modalManager;
    if (!modalManager) {
        console.error('Modal manager not found');
        alert('Modal manager not found');
        return;
    }
    
    // Get tab name
    const tabName = getTabName(tabId);
    
    // Define columns based on tab ID
    const columns = getColumnsForTab(tabId);
    
    // Get sample data for tab
    const data = getSampleDataForTab(tabId);
    
    // Show management window
    modalManager.showManagementWindow(`Manage ${tabName}`, columns, data);
}

// Get tab name from tab ID
function getTabName(tabId) {
    const tabMap = {
        'properties': 'Property',
        'languages': 'Language',
        'status': 'Status',
        'packaging': 'Packaging',
        'address': 'Address',
        'category': 'Category',
        'compatible': 'Compatible Product',
        'serial': 'Serial Number',
        'imei': 'IMEI/MAC',
        'software': 'Software',
        'manuals': 'User Manual',
        'accessories': 'Accessory'
    };
    
    return tabMap[tabId] || tabId.charAt(0).toUpperCase() + tabId.slice(1);
}

// Get columns for tab
function getColumnsForTab(tabId) {
    // Define columns based on tab ID
    const columnMap = {
        'properties': [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Name' },
            { field: 'description', title: 'Description' },
            { field: 'dataType', title: 'Data Type' }
        ],
        'languages': [
            { field: 'id', title: 'ID' },
            { field: 'code', title: 'Language Code' },
            { field: 'name', title: 'Language Name' },
            { field: 'status', title: 'Status' }
        ],
        'status': [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Status Name' },
            { field: 'description', title: 'Description' },
            { field: 'active', title: 'Active' }
        ],
        'packaging': [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Package Name' },
            { field: 'dimensions', title: 'Dimensions' },
            { field: 'weight', title: 'Weight' }
        ],
        'address': [
            { field: 'id', title: 'ID' },
            { field: 'type', title: 'Address Type' },
            { field: 'street', title: 'Street' },
            { field: 'city', title: 'City' },
            { field: 'country', title: 'Country' }
        ],
        'category': [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Category Name' },
            { field: 'parent', title: 'Parent Category' },
            { field: 'active', title: 'Active' }
        ],
        'compatible': [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Product Name' },
            { field: 'sku', title: 'SKU' },
            { field: 'type', title: 'Type' }
        ],
        'serial': [
            { field: 'id', title: 'ID' },
            { field: 'number', title: 'Serial Number' },
            { field: 'date', title: 'Production Date' },
            { field: 'status', title: 'Status' }
        ],
        'imei': [
            { field: 'id', title: 'ID' },
            { field: 'imei', title: 'IMEI/MAC' },
            { field: 'type', title: 'Type' },
            { field: 'status', title: 'Status' }
        ],
        'software': [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Software Name' },
            { field: 'version', title: 'Version' },
            { field: 'type', title: 'Type' }
        ],
        'manuals': [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Manual Name' },
            { field: 'language', title: 'Language' },
            { field: 'format', title: 'Format' }
        ],
        'accessories': [
            { field: 'id', title: 'ID' },
            { field: 'name', title: 'Accessory Name' },
            { field: 'sku', title: 'SKU' },
            { field: 'type', title: 'Type' }
        ]
    };
    
    return columnMap[tabId] || [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' },
        { field: 'description', title: 'Description' }
    ];
}

// Get sample data for tab
function getSampleDataForTab(tabId) {
    // Define sample data based on tab ID
    const dataMap = {
        'properties': [
            { id: '1', name: 'Processor', description: 'CPU type and speed', dataType: 'Text' },
            { id: '2', name: 'RAM', description: 'Memory size', dataType: 'Number' },
            { id: '3', name: 'Storage', description: 'Storage capacity', dataType: 'Number' },
            { id: '4', name: 'Display', description: 'Screen size and resolution', dataType: 'Text' },
            { id: '5', name: 'Battery', description: 'Battery capacity', dataType: 'Number' }
        ],
        'languages': [
            { id: '1', code: 'EN', name: 'English', status: 'Active' },
            { id: '2', code: 'DE', name: 'German', status: 'Active' },
            { id: '3', code: 'FR', name: 'French', status: 'Active' },
            { id: '4', code: 'ES', name: 'Spanish', status: 'Inactive' },
            { id: '5', code: 'IT', name: 'Italian', status: 'Inactive' }
        ],
        'status': [
            { id: '1', name: 'Active', description: 'Product is active', active: 'Yes' },
            { id: '2', name: 'In Development', description: 'Product is in development', active: 'No' },
            { id: '3', name: 'End of Life', description: 'Product is discontinued', active: 'No' },
            { id: '4', name: 'Deleted', description: 'Product is deleted', active: 'No' }
        ],
        'packaging': [
            { id: '1', name: 'Retail Box', dimensions: '200x150x50 mm', weight: '0.5 kg' },
            { id: '2', name: 'Bulk Package', dimensions: '500x400x300 mm', weight: '5 kg' },
            { id: '3', name: 'Pallet', dimensions: '1200x800x150 mm', weight: '100 kg' }
        ],
        'address': [
            { id: '1', type: 'Headquarters', street: '123 Main St', city: 'New York', country: 'USA' },
            { id: '2', type: 'Factory', street: '456 Production Ave', city: 'Chicago', country: 'USA' },
            { id: '3', type: 'Warehouse', street: '789 Storage Blvd', city: 'Los Angeles', country: 'USA' }
        ],
        'category': [
            { id: '1', name: 'Electronics', parent: 'None', active: 'Yes' },
            { id: '2', name: 'Smartphones', parent: 'Electronics', active: 'Yes' },
            { id: '3', name: 'Tablets', parent: 'Electronics', active: 'Yes' },
            { id: '4', name: 'Accessories', parent: 'Electronics', active: 'Yes' }
        ],
        'compatible': [
            { id: '1', name: 'Smartphone X', sku: 'SP-X-001', type: 'Smartphone' },
            { id: '2', name: 'Tablet Y', sku: 'TB-Y-001', type: 'Tablet' },
            { id: '3', name: 'Laptop Z', sku: 'LP-Z-001', type: 'Laptop' }
        ],
        'serial': [
            { id: '1', number: 'SN12345678', date: '2023-01-15', status: 'Active' },
            { id: '2', number: 'SN23456789', date: '2023-02-20', status: 'Active' },
            { id: '3', number: 'SN34567890', date: '2023-03-25', status: 'Inactive' }
        ],
        'imei': [
            { id: '1', imei: '123456789012345', type: 'IMEI', status: 'Active' },
            { id: '2', imei: '234567890123456', type: 'IMEI', status: 'Active' },
            { id: '3', imei: 'AA:BB:CC:DD:EE:FF', type: 'MAC', status: 'Active' }
        ],
        'software': [
            { id: '1', name: 'Operating System', version: '15.0', type: 'OS' },
            { id: '2', name: 'Firmware', version: '2.5', type: 'Firmware' },
            { id: '3', name: 'App Suite', version: '3.2', type: 'Application' }
        ],
        'manuals': [
            { id: '1', name: 'User Guide', language: 'English', format: 'PDF' },
            { id: '2', name: 'Quick Start Guide', language: 'English', format: 'PDF' },
            { id: '3', name: 'Technical Manual', language: 'English', format: 'PDF' }
        ],
        'accessories': [
            { id: '1', name: 'Charger', sku: 'ACC-CH-001', type: 'Power' },
            { id: '2', name: 'Case', sku: 'ACC-CS-001', type: 'Protection' },
            { id: '3', name: 'Headphones', sku: 'ACC-HP-001', type: 'Audio' }
        ]
    };
    
    return dataMap[tabId] || [
        { id: '1', name: 'Sample 1', description: 'Sample description 1' },
        { id: '2', name: 'Sample 2', description: 'Sample description 2' },
        { id: '3', name: 'Sample 3', description: 'Sample description 3' }
    ];
}
