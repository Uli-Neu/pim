/**
 * Tab Buttons Setup - Adds and configures Add and Manage buttons in all tabs
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for tabs to be fully rendered
    setTimeout(function() {
        // Setup Add and Manage buttons in all tabs
        setupTabButtons();
    }, 500);
});

// Setup Add and Manage buttons in all tabs
function setupTabButtons() {
    // Get all tab content containers based on the actual DOM structure
    const tabIds = [
        'properties-tab',
        'languages-tab',
        'status-tab',
        'packaging-tab',
        'address-tab',
        'category-tab',
        'compatible-tab',
        'serial-tab',
        'imei-tab',
        'software-tab',
        'manuals-tab',
        'accessories-tab'
    ];
    
    tabIds.forEach(function(tabId) {
        const tabContent = document.getElementById(tabId);
        if (!tabContent) {
            console.log('Tab content not found for ID:', tabId);
            return;
        }
        
        // Get the tab name from the ID
        const tabName = tabId.replace('-tab', '');
        
        // Create button container if it doesn't exist
        let buttonContainer = tabContent.querySelector('.tab-buttons-container');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'tab-buttons-container';
            buttonContainer.style.marginBottom = '15px';
            buttonContainer.style.marginTop = '10px';
            
            // Insert at the beginning of the tab content
            if (tabContent.firstChild) {
                tabContent.insertBefore(buttonContainer, tabContent.firstChild);
            } else {
                tabContent.appendChild(buttonContainer);
            }
        }
        
        // Clear existing buttons
        buttonContainer.innerHTML = '';
        
        // Create Add button
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-add';
        addButton.id = 'btn-add-' + tabName;
        addButton.innerHTML = '<i class="fas fa-plus"></i> Add ' + getTabName(tabName);
        addButton.style.marginRight = '10px';
        addButton.style.padding = '5px 10px';
        addButton.style.backgroundColor = '#4CAF50';
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.borderRadius = '4px';
        addButton.style.cursor = 'pointer';
        
        // Create Manage button
        const manageButton = document.createElement('button');
        manageButton.className = 'btn btn-manage';
        manageButton.id = 'btn-manage-' + tabName;
        manageButton.innerHTML = '<i class="fas fa-cog"></i> Manage ' + getTabName(tabName);
        manageButton.style.padding = '5px 10px';
        manageButton.style.backgroundColor = '#2196F3';
        manageButton.style.color = 'white';
        manageButton.style.border = 'none';
        manageButton.style.borderRadius = '4px';
        manageButton.style.cursor = 'pointer';
        
        // Add buttons to container
        buttonContainer.appendChild(addButton);
        buttonContainer.appendChild(manageButton);
        
        // Add event listeners
        addButton.addEventListener('click', function() {
            handleAddButtonClick(tabName);
        });
        
        manageButton.addEventListener('click', function() {
            handleManageButtonClick(tabName);
        });
    });
    
    console.log('Tab buttons setup complete');
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

// Handle Add button click
function handleAddButtonClick(tabId) {
    console.log('Add button clicked for tab:', tabId);
    alert('Add functionality for ' + getTabName(tabId) + ' will be implemented soon.');
}

// Handle Manage button click
function handleManageButtonClick(tabId) {
    console.log('Manage button clicked for tab:', tabId);
    alert('Management functionality for ' + getTabName(tabId) + ' will be implemented soon.');
}
