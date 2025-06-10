/**
 * AJAX Controller for the PIM System
 * Handles all communication with the backend API
 */

class AjaxController {
    constructor() {
        this.currentProductIndex = 0;
        this.products = [];
        this.baseUrl = 'db_interface.php';
        console.log('AJAX Controller initialized');
    }
    
    /**
     * Load all products
     */
    loadAllProducts() {
        const self = this;
        this.sendRequest('GET', '?action=get_all_products', null, function(response) {
            if (response.success) {
                self.products = response.data;
                self.updateRecordCounter();
                
                if (self.products.length > 0) {
                    self.loadProduct(0);
                    NotificationHandler.showSuccess('Products loaded successfully');
                } else {
                    NotificationHandler.showInfo('No products found');
                }
            } else {
                NotificationHandler.showError('Error loading products: ' + response.message);
            }
        });
    }
    
    /**
     * Load a specific product
     * @param {number} index - Index in the products array
     */
    loadProduct(index) {
        if (index >= 0 && index < this.products.length) {
            this.currentProductIndex = index;
            const product = this.products[index];
            
            // Update form fields
            document.getElementById('model').value = product.model || '';
            document.getElementById('sku').value = product.sku || '';
            document.getElementById('ean').value = product.ean || '';
            
            // Set category and status if available
            const categorySelect = document.getElementById('category');
            if (categorySelect && product.category_id) {
                categorySelect.value = product.category_id;
            }
            
            const statusSelect = document.getElementById('status');
            if (statusSelect && product.status_id) {
                statusSelect.value = product.status_id;
            }
            
            // Update record counter
            this.updateRecordCounter();
            
            // Load image if available
            if (product.image_path) {
                const imagePreview = document.getElementById('image-preview');
                if (imagePreview) {
                    imagePreview.innerHTML = `<img src="${product.image_path}" alt="Product Image" style="max-width: 100%; max-height: 100%;">`;
                }
            }
            
            // Update completion percentage
            const completionPercentage = product.completion_percentage || 0;
            document.getElementById('completion-percentage').textContent = completionPercentage + '%';
            document.querySelector('.progress-fill').style.width = completionPercentage + '%';
            
            // Load related data (package contents, properties, etc.)
            this.loadPackageContents(product.product_id);
            
            return true;
        } else {
            NotificationHandler.showWarning('Invalid product index');
            return false;
        }
    }
    
    /**
     * Load package contents for a product
     * @param {number} productId - Product ID
     */
    loadPackageContents(productId) {
        const self = this;
        this.sendRequest('GET', '?action=get_package_contents&product_id=' + productId, null, function(response) {
            if (response.success) {
                const packageTable = document.getElementById('package-table').getElementsByTagName('tbody')[0];
                packageTable.innerHTML = '';
                
                response.data.forEach(item => {
                    const newRow = packageTable.insertRow();
                    newRow.innerHTML = `
                        <td>${item.item}</td>
                        <td>${item.quantity}</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                });
            }
        });
    }
    
    /**
     * Save current product
     */
    saveProduct() {
        const model = document.getElementById('model').value.trim();
        const sku = document.getElementById('sku').value.trim();
        const ean = document.getElementById('ean').value.trim();
        const categoryId = document.getElementById('category').value;
        const statusId = document.getElementById('status').value;
        
        if (!model || !sku) {
            NotificationHandler.showWarning('Model and SKU are required');
            return false;
        }
        
        const formData = new FormData();
        formData.append('model', model);
        formData.append('sku', sku);
        formData.append('ean', ean);
        
        if (categoryId) {
            formData.append('category_id', categoryId);
        }
        
        if (statusId) {
            formData.append('status_id', statusId);
        }
        
        const self = this;
        
        // If editing existing product
        if (this.products.length > 0 && this.currentProductIndex >= 0) {
            const currentProduct = this.products[this.currentProductIndex];
            if (currentProduct && currentProduct.product_id) {
                formData.append('action', 'update_product');
                formData.append('product_id', currentProduct.product_id);
            } else {
                formData.append('action', 'create_product');
            }
        } else {
            formData.append('action', 'create_product');
        }
        
        // Use XMLHttpRequest directly for FormData
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.baseUrl, true);
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        NotificationHandler.showSuccess(response.message || 'Product saved successfully');
                        
                        // Reload all products to get updated list
                        self.loadAllProducts();
                    } else {
                        NotificationHandler.showError('Error saving product: ' + response.message);
                    }
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    NotificationHandler.showError('Invalid response from server');
                }
            } else {
                NotificationHandler.showError('Server error: ' + xhr.status);
            }
        };
        
        xhr.onerror = function() {
            NotificationHandler.showError('Network error');
        };
        
        xhr.send(formData);
    }
    
    /**
     * Create a new product (clear form)
     */
    newProduct() {
        // Clear all form fields
        document.querySelectorAll('input:not([type="file"]), select, textarea').forEach(field => {
            field.value = '';
        });
        
        // Clear image preview
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = `
                <div class="placeholder-text">
                    <p>"Picture of model"</p>
                    <p>Insert an image here</p>
                    <p>preferably drag and drop</p>
                </div>
            `;
        }
        
        // Clear package contents table
        const packageTable = document.getElementById('package-table').getElementsByTagName('tbody')[0];
        if (packageTable) {
            packageTable.innerHTML = '';
        }
        
        this.currentProductIndex = -1; // No product selected
        this.updateRecordCounter();
        NotificationHandler.showInfo('New product form ready');
    }
    
    /**
     * Load next product
     */
    nextProduct() {
        if (this.products.length === 0) {
            NotificationHandler.showInfo('No products available');
            return false;
        }
        
        let nextIndex = this.currentProductIndex + 1;
        if (nextIndex >= this.products.length) {
            nextIndex = 0; // Wrap around to first product
        }
        
        return this.loadProduct(nextIndex);
    }
    
    /**
     * Load previous product
     */
    prevProduct() {
        if (this.products.length === 0) {
            NotificationHandler.showInfo('No products available');
            return false;
        }
        
        let prevIndex = this.currentProductIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.products.length - 1; // Wrap around to last product
        }
        
        return this.loadProduct(prevIndex);
    }
    
    /**
     * Load last record
     */
    loadLastRecord() {
        if (this.products.length === 0) {
            NotificationHandler.showInfo('No products available');
            return false;
        }
        
        return this.loadProduct(this.products.length - 1);
    }
    
    /**
     * Update record counter display
     */
    updateRecordCounter() {
        const counter = document.getElementById('record-counter');
        if (counter) {
            let text = 'No Records';
            
            if (this.products.length > 0) {
                const currentRecord = this.currentProductIndex + 1;
                text = `Record ${currentRecord} of ${this.products.length}`;
            }
            
            counter.textContent = text;
        }
    }
    
    /**
     * Search products
     * @param {string} term - Search term
     */
    searchProducts(term) {
        const self = this;
        this.sendRequest('GET', '?action=search_products&term=' + encodeURIComponent(term), null, function(response) {
            if (response.success) {
                self.products = response.data;
                self.updateRecordCounter();
                
                if (self.products.length > 0) {
                    self.loadProduct(0);
                    NotificationHandler.showSuccess(`Found ${self.products.length} products`);
                } else {
                    NotificationHandler.showInfo('No products found matching your search');
                }
            } else {
                NotificationHandler.showError('Error searching products: ' + response.message);
            }
        });
    }
    
    /**
     * Send AJAX request
     * @param {string} method - HTTP method
     * @param {string} url - API endpoint
     * @param {object} data - Request data
     * @param {function} callback - Callback function
     */
    sendRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, this.baseUrl + url, true);
        
        if (method !== 'GET') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    callback(response);
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    callback({
                        success: false,
                        message: 'Invalid response from server'
                    });
                }
            } else {
                callback({
                    success: false,
                    message: 'Server error: ' + xhr.status
                });
            }
        };
        
        xhr.onerror = function() {
            callback({
                success: false,
                message: 'Network error'
            });
        };
        
        if (data && method !== 'GET') {
            // Convert data object to URL-encoded string
            const formData = new URLSearchParams();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            xhr.send(formData.toString());
        } else {
            xhr.send();
        }
    }
}

// Initialize AJAX controller on page load
document.addEventListener('DOMContentLoaded', function() {
    window.ajaxController = new AjaxController();
    
    // Initialize event handlers for buttons
    initializeAjaxButtonHandlers();
    
    // Load all products
    window.ajaxController.loadAllProducts();
});

/**
 * Initialize event handlers for buttons
 */
function initializeAjaxButtonHandlers() {
    // New button
    const newButton = document.getElementById('btn-new');
    if (newButton) {
        newButton.addEventListener('click', function() {
            window.ajaxController.newProduct();
        });
    }
    
    // Save button
    const saveButton = document.getElementById('btn-save');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            window.ajaxController.saveProduct();
        });
    }
    
    // Last Record button
    const lastButton = document.getElementById('btn-last');
    if (lastButton) {
        lastButton.addEventListener('click', function() {
            window.ajaxController.loadLastRecord();
        });
    }
    
    // Update button
    const updateButton = document.getElementById('btn-update');
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            window.ajaxController.loadAllProducts();
        });
    }
    
    // Previous button
    const prevButton = document.getElementById('btn-prev');
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            window.ajaxController.prevProduct();
        });
    }
    
    // Next button
    const nextButton = document.getElementById('btn-next');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            window.ajaxController.nextProduct();
        });
    }
    
    // Search button
    const searchButton = document.getElementById('btn-search');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchInput = document.getElementById('global-search');
            if (searchInput && searchInput.value.trim() !== '') {
                window.ajaxController.searchProducts(searchInput.value.trim());
            } else {
                NotificationHandler.showWarning('Please enter a search term');
            }
        });
    }
}
