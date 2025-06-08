/**
 * PIM System - Main Controller
 * 
 * This module handles the main controller functionality for the PIM system,
 * including CRUD operations, search, and data management.
 */

const mainController = {
    /**
     * Initialize the main controller
     */
    init: function() {
        console.log('Initializing main controller');
        
        // Initialize API connection
        this.apiBaseUrl = 'api.php';
        
        // Initialize data storage
        this.initStorage();
        
        // Initialize tab navigation
        this.initTabNavigation();
        
        // Initialize progress calculator
        if (typeof progressCalculator !== 'undefined') {
            progressCalculator.init();
        }
        
        // Load initial data
        this.loadInitialData();
        
        console.log('Main controller initialized');
    },
    
    /**
     * Initialize data storage
     */
    initStorage: function() {
        // Check if localStorage is available
        if (typeof(Storage) !== "undefined") {
            // Initialize products array if it doesn't exist
            if (!localStorage.getItem('pimProducts')) {
                localStorage.setItem('pimProducts', JSON.stringify([]));
                console.log('Created empty pimProducts array in localStorage');
            }
            
            // Initialize current product ID if it doesn't exist
            if (!localStorage.getItem('currentProductId')) {
                localStorage.setItem('currentProductId', '0');
                console.log('Set currentProductId to 0 in localStorage');
            }
            
            // Debug: Check localStorage contents after initialization
            const products = JSON.parse(localStorage.getItem('pimProducts')) || [];
            console.log('After initStorage - Products in localStorage:', products.length);
            
            console.log('Local storage initialized');
        } else {
            console.error('Local storage is not available');
            NotificationHandler.showError('Local storage is not available. The application may not function correctly.');
        }
    },
    
    /**
     * Initialize tab navigation
     */
    initTabNavigation: function() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Hide all tab contents
                tabContents.forEach(function(content) {
                    content.style.display = 'none';
                });
                
                // Show corresponding tab content
                const tabId = button.id.replace('tab-', '');
                const tabContent = document.getElementById(tabId + '-content');
                if (tabContent) {
                    tabContent.style.display = 'block';
                }
            });
        });
    },
    
    /**
     * Load initial data
     */
    loadInitialData: function() {
        // Load products from API
        this.fetchFromAPI('GET', 'products')
            .then(response => {
                if (response.success && response.data && response.data.length > 0) {
                    this.products = response.data;
                    console.log('loadInitialData - Products loaded from API:', this.products.length);
                    
                    // Load the last product
                    const lastProductIndex = this.products.length - 1;
                    this.loadProduct(this.products[lastProductIndex]);
                    
                    // Update current product ID
                    localStorage.setItem('currentProductId', this.products[lastProductIndex].id.toString());
                    console.log('Loaded last product with ID:', this.products[lastProductIndex].id);
                } else {
                    // Form is already empty, no need to create a default product
                    this.clearForm();
                    console.log('No products found in API, form cleared');
                }
                
                // Update record count
                this.updateRecordCount();
            })
            .catch(error => {
                console.error('Error loading products from API:', error);
                
                // Fallback to local storage
                const products = this.getProducts();
                console.log('Fallback to localStorage - Products found:', products.length);
                
                if (products.length > 0) {
                    // Load the last product
                    const lastProductIndex = products.length - 1;
                    this.loadProduct(products[lastProductIndex]);
                    
                    // Update current product ID
                    localStorage.setItem('currentProductId', products[lastProductIndex].id.toString());
                    console.log('Loaded last product with ID:', products[lastProductIndex].id);
                } else {
                    // Form is already empty
                    this.clearForm();
                    console.log('No products found, form cleared');
                }
                
                // Update record count
                this.updateRecordCount();
                
                // Show error notification
                NotificationHandler.showError('Failed to load products from server. Using local data.');
            });
            
        // Load categories from API
        this.fetchFromAPI('GET', 'categories')
            .then(response => {
                if (response.success && response.data) {
                    this.populateCategorySelect(response.data);
                }
            })
            .catch(error => {
                console.error('Error loading categories from API:', error);
            });
            
        // Load status types from API
        this.fetchFromAPI('GET', 'status-types')
            .then(response => {
                if (response.success && response.data) {
                    this.populateStatusSelect(response.data);
                }
            })
            .catch(error => {
                console.error('Error loading status types from API:', error);
            });
    },
    
    /**
     * Fetch data from API
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {string} endpoint - API endpoint
     * @param {object} data - Data to send (for POST and PUT)
     * @returns {Promise} - Promise with API response
     */
    fetchFromAPI: function(method, endpoint, data = null) {
        return new Promise((resolve, reject) => {
            // Build URL
            let url = this.apiBaseUrl;
            
            // If endpoint is not empty, add it to URL
            if (endpoint) {
                url += '/' + endpoint;
            }
            
            // Build request options
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            // Add body for POST and PUT requests
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }
            
            // Show loading indicator
            if (typeof NotificationHandler !== 'undefined') {
                NotificationHandler.showLoading();
            }
            
            // Make fetch request
            fetch(url, options)
                .then(response => {
                    // Hide loading indicator
                    if (typeof NotificationHandler !== 'undefined') {
                        NotificationHandler.hideLoading();
                    }
                    
                    // Check if response is OK
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    // Parse response as JSON
                    return response.json();
                })
                .then(data => {
                    // Resolve with data
                    resolve(data);
                })
                .catch(error => {
                    // Hide loading indicator
                    if (typeof NotificationHandler !== 'undefined') {
                        NotificationHandler.hideLoading();
                    }
                    
                    // Reject with error
                    reject(error);
                });
        });
    },
    
    /**
     * Populate category select with options from API
     * @param {Array} categories - Categories data from API
     */
    populateCategorySelect: function(categories) {
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            // Clear select options
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            
            // Add options for each category
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id || category.category_id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
            
            console.log('Category select populated with', categories.length, 'options');
        }
    },
    
    /**
     * Populate status select with options from API
     * @param {Array} statuses - Status types data from API
     */
    populateStatusSelect: function(statuses) {
        const statusSelect = document.getElementById('status');
        if (statusSelect) {
            // Clear select options
            statusSelect.innerHTML = '<option value="">Select Status</option>';
            
            // Add options for each status
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status.id || status.status_id;
                option.textContent = status.name;
                statusSelect.appendChild(option);
            });
            
            console.log('Status select populated with', statuses.length, 'options');
        }
    },
    
    /**
     * Get all products
     */
    getProducts: function() {
        if (typeof(Storage) !== "undefined") {
            try {
                const productsJson = localStorage.getItem('pimProducts');
                const products = JSON.parse(productsJson) || [];
                console.log('Retrieved products from localStorage:', products.length);
                return products;
            } catch (e) {
                console.error('Error parsing products from localStorage:', e);
                NotificationHandler.showError('Error loading products. Please try refreshing the page.');
                return [];
            }
        }
        return [];
    },
    
    /**
     * Save a product
     */
    saveProduct: function(product) {
        if (typeof(Storage) !== "undefined") {
            try {
                // Get current products from localStorage
                let products = [];
                try {
                    const productsJson = localStorage.getItem('pimProducts');
                    products = JSON.parse(productsJson) || [];
                } catch (e) {
                    console.error('Error parsing products from localStorage, starting with empty array:', e);
                    products = [];
                }
                
                console.log('Before save - Products in localStorage:', products.length);
                
                // Check if product already exists
                const existingProductIndex = products.findIndex(p => p.id === product.id);
                
                if (existingProductIndex !== -1) {
                    // Update existing product
                    products[existingProductIndex] = product;
                    console.log('Updated existing product at index:', existingProductIndex);
                } else {
                    // Add new product
                    products.push(product);
                    console.log('Added new product, total count:', products.length);
                }
                
                // Save products to localStorage
                const productsJson = JSON.stringify(products);
                localStorage.setItem('pimProducts', productsJson);
                
                // Update current product ID
                localStorage.setItem('currentProductId', product.id.toString());
                
                // Debug: Verify localStorage after save
                const savedProducts = JSON.parse(localStorage.getItem('pimProducts')) || [];
                console.log('After save - Products in localStorage:', savedProducts.length);
                
                console.log('Product saved:', product);
                console.log('Total products after save:', products.length);
                return true;
            } catch (e) {
                console.error('Error saving product to localStorage:', e);
                NotificationHandler.showError('Error saving product. Please try again.');
                return false;
            }
        }
        
        NotificationHandler.showError('Local storage is not available. Cannot save product.');
        return false;
    },
    
    /**
     * Load a product
     * @param {Object} product - Product object to load
     * @param {boolean} fullLoad - Whether to load all related data
     */
    loadProduct: function(product, fullLoad = true) {
        if (!product) {
            this.clearForm();
            return;
        }
        
        // Save current product ID
        this.currentProductId = product.id;
        
        // Set form values
        document.getElementById('model').value = product.model || '';
        document.getElementById('sku').value = product.sku || '';
        document.getElementById('ean').value = product.ean || '';
        
        // Set category
        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            categorySelect.value = product.category_id || '';
        }
        
        // Set status
        const statusSelect = document.getElementById('status');
        if (statusSelect) {
            statusSelect.value = product.status_id || '';
        }
        
        // Set image if available
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            if (product.image_path) {
                imagePreview.innerHTML = `<img src="${product.image_path}" alt="Product Image" style="max-width: 100%; max-height: 100%;">`;
            } else {
                imagePreview.innerHTML = `
                    <div class="placeholder-text">
                        <p>"Picture of model"</p>
                        <p>Insert an image here</p>
                        <p>preferably drag and drop</p>
                    </div>
                `;
            }
        }
        
        // Update progress
        if (product.completion_percentage !== undefined) {
            const completionPercentage = document.getElementById('completion-percentage');
            const progressFill = document.querySelector('.progress-fill');
            
            if (completionPercentage) {
                completionPercentage.textContent = product.completion_percentage + '%';
            }
            
            if (progressFill) {
                progressFill.style.width = product.completion_percentage + '%';
            }
        } else if (typeof progressCalculator !== 'undefined') {
            progressCalculator.updateProgressBar();
        }
        
        // If fullLoad is true, load related data from API
        if (fullLoad) {
            // Load package contents
            this.fetchFromAPI('GET', `products/${product.id}/package-contents`)
                .then(response => {
                    if (response.success && response.data) {
                        this.loadPackageContents(response.data);
                    }
                })
                .catch(error => {
                    console.error('Error loading package contents:', error);
                    
                    // Fallback to local data
                    this.loadPackageContents(product.packageContents || []);
                });
            
            // Load properties
            this.fetchFromAPI('GET', `products/${product.id}/properties`)
                .then(response => {
                    if (response.success && response.data) {
                        this.loadProperties(response.data);
                    }
                })
                .catch(error => {
                    console.error('Error loading properties:', error);
                    
                    // Fallback to local data
                    this.loadProperties(product.properties || []);
                });
        } else {
            // Use local data
            this.loadPackageContents(product.packageContents || []);
            this.loadProperties(product.properties || []);
        }
        
        console.log('Product loaded:', product);
    },
    
    /**
     * Load package contents
     */
    loadPackageContents: function(packageContents) {
        const table = document.querySelector('#package-contents-table tbody');
        if (table) {
            // Clear existing rows
            table.innerHTML = '';
            
            // Add rows for each package content
            packageContents.forEach(function(content) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${content.item}</td>
                    <td>${content.quantity}</td>
                    <td class="action-buttons">
                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                table.appendChild(row);
            });
            
            // Reinitialize edit and delete buttons
            if (typeof buttonEventHandler !== 'undefined') {
                buttonEventHandler.initEditDeleteButtons();
            }
        }
    },
    
    /**
     * Load properties
     */
    loadProperties: function(properties) {
        const table = document.querySelector('#properties-content .data-table tbody');
        if (table) {
            // Clear existing rows
            table.innerHTML = '';
            
            // Add rows for each property
            properties.forEach(function(prop) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${prop.property}</td>
                    <td>${prop.value}</td>
                    <td class="action-buttons">
                        <button class="edit-button"><i class="fas fa-edit"></i></button>
                        <button class="delete-button"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                table.appendChild(row);
            });
            
            // Reinitialize edit and delete buttons
            if (typeof buttonEventHandler !== 'undefined') {
                buttonEventHandler.initEditDeleteButtons();
            }
        }
    },
    
    /**
     * Update record count
     */
    updateRecordCount: function() {
        const products = this.getProducts();
        const currentProductId = parseInt(localStorage.getItem('currentProductId')) || 0;
        
        // Find current product index
        let currentProductIndex = products.findIndex(p => p.id === currentProductId);
        
        // If product not found, default to last product or 0
        if (currentProductIndex === -1) {
            currentProductIndex = products.length > 0 ? products.length - 1 : 0;
        }
        
        // Update record count display
        const recordCount = document.querySelector('.record-navigation span');
        if (recordCount) {
            if (products.length > 0) {
                recordCount.textContent = `Record ${currentProductIndex + 1} of ${products.length}`;
                console.log(`Updated record count: Record ${currentProductIndex + 1} of ${products.length}`);
            } else {
                recordCount.textContent = 'No Records';
                console.log('Updated record count: No Records');
            }
        }
    },
    
    /**
     * Clear form
     */
    clearForm: function() {
        // Clear form values
        document.getElementById('model-input').value = '';
        document.getElementById('sku-input').value = '';
        document.getElementById('ean-input').value = '';
        
        // Reset category
        const categorySelect = document.getElementById('category-select');
        if (categorySelect) {
            categorySelect.selectedIndex = 0;
        }
        
        // Reset status
        const statusSelect = document.getElementById('status-select');
        if (statusSelect) {
            statusSelect.selectedIndex = 0;
        }
        
        // Clear image
        const productImage = document.querySelector('.product-image');
        if (productImage) {
            productImage.src = 'https://via.placeholder.com/150x200/ff0000/ffffff?text=No+Image';
            
            // Show placeholder text
            const placeholderTexts = document.querySelectorAll('.image-placeholder p');
            placeholderTexts.forEach(text => {
                text.style.display = 'block';
            });
        }
        
        // Clear package contents
        const packageContentsTable = document.querySelector('#package-contents-table tbody');
        if (packageContentsTable) {
            packageContentsTable.innerHTML = '';
        }
        
        // Clear properties
        const propertiesTable = document.querySelector('#properties-content .data-table tbody');
        if (propertiesTable) {
            propertiesTable.innerHTML = '';
        }
        
        // Reset current product ID to indicate we're creating a new product
        localStorage.setItem('currentProductId', '0');
        
        // Update record count
        this.updateRecordCount();
        
        // Update progress bar
        if (typeof progressCalculator !== 'undefined') {
            progressCalculator.updateProgressBar();
        }
        
        console.log('Form cleared');
        NotificationHandler.showInfo('Form cleared. Ready for new entry.');
    },
    
    /**
     * Check if SKU already exists
     * @param {string} sku - The SKU to check
     * @param {number} currentProductId - The ID of the current product (to exclude from check)
     * @returns {boolean} - True if SKU exists, false otherwise
     */
    skuExists: function(sku, currentProductId) {
        if (!sku) return false;
        
        const products = this.getProducts();
        return products.some(p => p.sku === sku && p.id !== currentProductId);
    },
    
    /**
     * Save record
     */
    saveRecord: function() {
        // Get form values
        const model = document.getElementById('model-input').value;
        const sku = document.getElementById('sku-input').value;
        const ean = document.getElementById('ean-input').value;
        
        // Validate required fields
        if (!model) {
            NotificationHandler.showError('Model is required');
            return;
        }
        
        // Get current product ID
        const currentProductId = parseInt(localStorage.getItem('currentProductId')) || 0;
        
        // Check if SKU already exists
        if (sku && this.skuExists(sku, currentProductId)) {
            if (!confirm('A product with this SKU already exists. Are you sure you want to create another one?')) {
                return;
            }
        }
        
        // Get category
        const categorySelect = document.getElementById('category-select');
        const category = categorySelect ? categorySelect.options[categorySelect.selectedIndex].value : '';
        
        // Get status
        const statusSelect = document.getElementById('status-select');
        const status = statusSelect ? statusSelect.options[statusSelect.selectedIndex].value : '';
        
        // Get image
        const productImage = document.querySelector('.product-image');
        const image = productImage && productImage.src !== 'https://via.placeholder.com/150x200/ff0000/ffffff?text=No+Image' ? 
                      productImage.src : '';
        
        // Get package contents
        const packageContents = [];
        const packageContentRows = document.querySelectorAll('#package-contents-table tbody tr');
        packageContentRows.forEach(function(row) {
            const item = row.querySelector('td:first-child').textContent;
            const quantity = parseInt(row.querySelector('td:nth-child(2)').textContent);
            
            packageContents.push({
                item: item,
                quantity: quantity
            });
        });
        
        // Get properties
        const properties = [];
        const propertyRows = document.querySelectorAll('#properties-content .data-table tbody tr');
        propertyRows.forEach(function(row) {
            const property = row.querySelector('td:first-child').textContent;
            const value = row.querySelector('td:nth-child(2)').textContent;
            
            properties.push({
                property: property,
                value: value
            });
        });
        
        // Create product object with a new ID
        const product = {
            id: Date.now(), // Use timestamp as ID to ensure uniqueness
            model: model,
            sku: sku,
            ean: ean,
            category: category,
            status: status,
            image: image,
            packageContents: packageContents,
            properties: properties
        };
        
        console.log('Saving product:', product);
        
        // Save product
        if (this.saveProduct(product)) {
            NotificationHandler.showSuccess('Product saved successfully');
            
            // Update record count
            this.updateRecordCount();
        } else {
            NotificationHandler.showError('Failed to save product');
        }
    },
    
    /**
     * Update record
     */
    updateRecord: function() {
        // Get current product ID
        const currentProductId = parseInt(localStorage.getItem('currentProductId')) || 0;
        
        // If currentProductId is 0, we're creating a new product
        if (currentProductId === 0) {
            this.saveRecord();
            return;
        }
        
        // Get form values
        const model = document.getElementById('model-input').value;
        const sku = document.getElementById('sku-input').value;
        const ean = document.getElementById('ean-input').value;
        
        // Validate required fields
        if (!model) {
            NotificationHandler.showError('Model is required');
            return;
        }
        
        // Check if SKU already exists
        if (sku && this.skuExists(sku, currentProductId)) {
            if (!confirm('A product with this SKU already exists. Are you sure you want to update with this SKU?')) {
                return;
            }
        }
        
        // Get category
        const categorySelect = document.getElementById('category-select');
        const category = categorySelect ? categorySelect.options[categorySelect.selectedIndex].value : '';
        
        // Get status
        const statusSelect = document.getElementById('status-select');
        const status = statusSelect ? statusSelect.options[statusSelect.selectedIndex].value : '';
        
        // Get image
        const productImage = document.querySelector('.product-image');
        const image = productImage && productImage.src !== 'https://via.placeholder.com/150x200/ff0000/ffffff?text=No+Image' ? 
                      productImage.src : '';
        
        // Get package contents
        const packageContents = [];
        const packageContentRows = document.querySelectorAll('#package-contents-table tbody tr');
        packageContentRows.forEach(function(row) {
            const item = row.querySelector('td:first-child').textContent;
            const quantity = parseInt(row.querySelector('td:nth-child(2)').textContent);
            
            packageContents.push({
                item: item,
                quantity: quantity
            });
        });
        
        // Get properties
        const properties = [];
        const propertyRows = document.querySelectorAll('#properties-content .data-table tbody tr');
        propertyRows.forEach(function(row) {
            const property = row.querySelector('td:first-child').textContent;
            const value = row.querySelector('td:nth-child(2)').textContent;
            
            properties.push({
                property: property,
                value: value
            });
        });
        
        // Create product object
        const product = {
            id: currentProductId,
            model: model,
            sku: sku,
            ean: ean,
            category: category,
            status: status,
            image: image,
            packageContents: packageContents,
            properties: properties
        };
        
        console.log('Updating product:', product);
        
        // Save product
        if (this.saveProduct(product)) {
            NotificationHandler.showSuccess('Product updated successfully');
            
            // Update record count
            this.updateRecordCount();
        } else {
            NotificationHandler.showError('Failed to update product');
        }
    },
    
    /**
     * Load last record
     */
    loadLastRecord: function() {
        const products = this.getProducts();
        
        if (products.length > 0) {
            // Load the last product
            this.loadProduct(products[products.length - 1]);
            
            // Update current product ID
            localStorage.setItem('currentProductId', products[products.length - 1].id.toString());
            
            // Update record count
            this.updateRecordCount();
            
            NotificationHandler.showInfo('Loaded last record');
        } else {
            NotificationHandler.showInfo('No records found');
            this.clearForm();
        }
    },
    
    /**
     * Load previous record
     */
    loadPreviousRecord: function() {
        const products = this.getProducts();
        const currentProductId = parseInt(localStorage.getItem('currentProductId')) || 0;
        
        // Find current product index
        let currentProductIndex = products.findIndex(p => p.id === currentProductId);
        
        // If product not found or it's the first product, do nothing
        if (currentProductIndex <= 0) {
            NotificationHandler.showInfo('This is the first record');
            return;
        }
        
        // Load previous product
        this.loadProduct(products[currentProductIndex - 1]);
        
        // Update current product ID
        localStorage.setItem('currentProductId', products[currentProductIndex - 1].id.toString());
        
        // Update record count
        this.updateRecordCount();
        
        NotificationHandler.showInfo('Loaded previous record');
    },
    
    /**
     * Load next record
     */
    loadNextRecord: function() {
        const products = this.getProducts();
        const currentProductId = parseInt(localStorage.getItem('currentProductId')) || 0;
        
        // Find current product index
        let currentProductIndex = products.findIndex(p => p.id === currentProductId);
        
        // If product not found or it's the last product, do nothing
        if (currentProductIndex === -1 || currentProductIndex >= products.length - 1) {
            NotificationHandler.showInfo('This is the last record');
            return;
        }
        
        // Load next product
        this.loadProduct(products[currentProductIndex + 1]);
        
        // Update current product ID
        localStorage.setItem('currentProductId', products[currentProductIndex + 1].id.toString());
        
        // Update record count
        this.updateRecordCount();
        
        NotificationHandler.showInfo('Loaded next record');
    },
    
    /**
     * Search records
     */
    searchRecords: function() {
        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        if (!searchTerm) {
            NotificationHandler.showInfo('Please enter a search term');
            return;
        }
        
        const products = this.getProducts();
        
        // Filter products by search term
        const filteredProducts = products.filter(function(product) {
            return (
                (product.model && product.model.toLowerCase().includes(searchTerm)) ||
                (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
                (product.ean && product.ean.toLowerCase().includes(searchTerm)) ||
                (product.category && product.category.toLowerCase().includes(searchTerm)) ||
                (product.status && product.status.toLowerCase().includes(searchTerm))
            );
        });
        
        if (filteredProducts.length > 0) {
            // Load the first matching product
            this.loadProduct(filteredProducts[0]);
            
            // Update current product ID
            localStorage.setItem('currentProductId', filteredProducts[0].id.toString());
            
            // Update record count
            this.updateRecordCount();
            
            NotificationHandler.showSuccess(`Found ${filteredProducts.length} matching records`);
        } else {
            NotificationHandler.showInfo('No matching records found');
        }
    }
};
