/**
 * PIM System - Navigation Fix
 * 
 * This script fixes navigation issues in the PIM system.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation fix script loaded');
    
    // Fix navigation buttons
    fixNavigationButtons();
    
    // Fix package content buttons
    fixPackageContentButtons();
});

/**
 * Fix navigation buttons
 */
function fixNavigationButtons() {
    // Ensure navigation buttons have correct IDs and event listeners
    const prevButton = document.getElementById('prev-record-button');
    const nextButton = document.getElementById('next-record-button');
    
    if (prevButton) {
        // Remove any existing event listeners by cloning and replacing
        const newPrevButton = prevButton.cloneNode(true);
        prevButton.parentNode.replaceChild(newPrevButton, prevButton);
        
        // Add new event listener
        newPrevButton.addEventListener('click', function() {
            console.log('Previous button clicked');
            if (typeof mainController !== 'undefined') {
                mainController.loadPreviousRecord();
            } else {
                console.error('mainController is undefined');
            }
        });
        console.log('Previous button event listener attached');
    } else {
        console.error('Previous button not found');
    }
    
    if (nextButton) {
        // Remove any existing event listeners by cloning and replacing
        const newNextButton = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNextButton, nextButton);
        
        // Add new event listener
        newNextButton.addEventListener('click', function() {
            console.log('Next button clicked');
            if (typeof mainController !== 'undefined') {
                mainController.loadNextRecord();
            } else {
                console.error('mainController is undefined');
            }
        });
        console.log('Next button event listener attached');
    } else {
        console.error('Next button not found');
    }
}

/**
 * Fix package content buttons
 */
function fixPackageContentButtons() {
    // Fix add item button
    const addItemButton = document.getElementById('add-item-button');
    if (addItemButton) {
        // Remove any existing event listeners by cloning and replacing
        const newAddItemButton = addItemButton.cloneNode(true);
        addItemButton.parentNode.replaceChild(newAddItemButton, addItemButton);
        
        // Add new event listener
        newAddItemButton.addEventListener('click', function() {
            console.log('Add item button clicked');
            // Show add item modal
            const addItemModal = document.getElementById('add-item-modal');
            if (addItemModal) {
                addItemModal.style.display = 'block';
                console.log('Add item modal displayed');
            } else {
                console.error('Add item modal not found');
            }
        });
        console.log('Add item button event listener attached');
    } else {
        console.error('Add item button not found');
    }
    
    // Fix add item form
    const addItemForm = document.getElementById('add-item-form');
    if (addItemForm) {
        // Remove any existing event listeners by cloning and replacing
        const newAddItemForm = addItemForm.cloneNode(true);
        addItemForm.parentNode.replaceChild(newAddItemForm, addItemForm);
        
        // Add new event listener
        newAddItemForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Add item form submitted');
            
            // Get form values
            const itemInput = document.getElementById('item-input');
            const quantityInput = document.getElementById('quantity-input');
            
            if (itemInput && quantityInput) {
                const item = itemInput.value;
                const quantity = parseInt(quantityInput.value);
                
                if (item && quantity) {
                    // Add item to table
                    const table = document.querySelector('#package-contents-table tbody');
                    if (table) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item}</td>
                            <td>${quantity}</td>
                            <td class="action-buttons">
                                <button class="edit-button"><i class="fas fa-edit"></i></button>
                                <button class="delete-button"><i class="fas fa-trash"></i></button>
                            </td>
                        `;
                        
                        table.appendChild(row);
                        console.log('Item added to table');
                        
                        // Add event listeners to new buttons
                        const editButton = row.querySelector('.edit-button');
                        const deleteButton = row.querySelector('.delete-button');
                        
                        if (editButton) {
                            editButton.addEventListener('click', function() {
                                console.log('Edit button clicked');
                                // Show edit item modal
                                const editItemModal = document.getElementById('edit-item-modal');
                                if (editItemModal) {
                                    editItemModal.style.display = 'block';
                                    
                                    // Set form values
                                    const editItemInput = document.getElementById('edit-item-input');
                                    const editQuantityInput = document.getElementById('edit-quantity-input');
                                    
                                    if (editItemInput && editQuantityInput) {
                                        editItemInput.value = item;
                                        editQuantityInput.value = quantity;
                                        
                                        // Store row reference for later use
                                        editItemModal.dataset.row = Array.from(row.parentNode.children).indexOf(row);
                                    }
                                }
                            });
                        }
                        
                        if (deleteButton) {
                            deleteButton.addEventListener('click', function() {
                                console.log('Delete button clicked');
                                if (confirm('Are you sure you want to delete this item?')) {
                                    row.remove();
                                    console.log('Item deleted');
                                    
                                    // Show notification
                                    if (typeof NotificationHandler !== 'undefined') {
                                        NotificationHandler.showInfo('Item deleted');
                                    }
                                }
                            });
                        }
                        
                        // Clear form
                        itemInput.value = '';
                        quantityInput.value = '1';
                        
                        // Hide modal
                        const addItemModal = document.getElementById('add-item-modal');
                        if (addItemModal) {
                            addItemModal.style.display = 'none';
                        }
                        
                        // Update progress bar
                        if (typeof progressCalculator !== 'undefined') {
                            progressCalculator.updateProgressBar();
                        }
                        
                        // Show notification
                        if (typeof NotificationHandler !== 'undefined') {
                            NotificationHandler.showSuccess('Item added successfully');
                        }
                    } else {
                        console.error('Package contents table not found');
                    }
                } else {
                    console.error('Item or quantity is empty');
                }
            } else {
                console.error('Item input or quantity input not found');
            }
        });
        console.log('Add item form event listener attached');
    } else {
        console.error('Add item form not found');
    }
    
    // Fix cancel add item button
    const cancelAddItemButton = document.getElementById('cancel-add-item-button');
    if (cancelAddItemButton) {
        // Remove any existing event listeners by cloning and replacing
        const newCancelAddItemButton = cancelAddItemButton.cloneNode(true);
        cancelAddItemButton.parentNode.replaceChild(newCancelAddItemButton, cancelAddItemButton);
        
        // Add new event listener
        newCancelAddItemButton.addEventListener('click', function() {
            console.log('Cancel add item button clicked');
            // Hide modal
            const addItemModal = document.getElementById('add-item-modal');
            if (addItemModal) {
                addItemModal.style.display = 'none';
                console.log('Add item modal hidden');
            } else {
                console.error('Add item modal not found');
            }
        });
        console.log('Cancel add item button event listener attached');
    } else {
        console.error('Cancel add item button not found');
    }
    
    // Fix modal close buttons
    const closeButtons = document.querySelectorAll('.modal .close');
    closeButtons.forEach(function(button) {
        // Remove any existing event listeners by cloning and replacing
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new event listener
        newButton.addEventListener('click', function() {
            console.log('Modal close button clicked');
            // Find parent modal
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                console.log('Modal hidden');
            } else {
                console.error('Parent modal not found');
            }
        });
    });
    console.log('Modal close buttons event listeners attached');
}
