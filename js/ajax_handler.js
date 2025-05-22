/**
 * PIM System - AJAX Handler
 * 
 * Dieses Skript stellt die Kommunikation zwischen Frontend und Backend her
 * und implementiert alle notwendigen AJAX-Aufrufe für das PIM-System.
 */

// Basis-URL für API-Aufrufe
const API_BASE_URL = 'api.php';

// AJAX-Handler-Klasse
class AjaxHandler {
    /**
     * Sendet eine AJAX-Anfrage
     * 
     * @param {string} method - HTTP-Methode (GET, POST, PUT, DELETE)
     * @param {string} endpoint - API-Endpunkt
     * @param {object} data - Zu sendende Daten (optional)
     * @returns {Promise} - Promise mit der Antwort
     */
    static async sendRequest(method, endpoint, data = null) {
        try {
            // Feedback-Anzeige starten
            this.showLoading();
            
            const url = `${API_BASE_URL}?endpoint=${endpoint}`;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }
            
            // Echter Fetch-Aufruf zur API
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Feedback-Anzeige beenden
            this.hideLoading();
            
            // Erfolgs-Feedback anzeigen
            if (method !== 'GET' && result.success) {
                this.showSuccessMessage(this.getSuccessMessageForAction(method, endpoint));
            } else if (!result.success) {
                this.showErrorMessage(result.message || 'Ein Fehler ist aufgetreten');
            }
            
            return result;
        } catch (error) {
            // Feedback-Anzeige beenden
            this.hideLoading();
            
            // Fehler-Feedback anzeigen
            this.showErrorMessage(error.message || 'Ein Fehler ist aufgetreten');
            
            // Fallback auf simulierte Daten für Demo-Zwecke
            console.warn('Fallback auf simulierte Daten:', error);
            return this.simulateBackendResponse(method, endpoint, data);
        }
    }
    
    /**
     * Zeigt die Lade-Animation an
     */
    static showLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
    }
    
    /**
     * Versteckt die Lade-Animation
     */
    static hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
    
    /**
     * Zeigt eine Erfolgsmeldung an
     * 
     * @param {string} message - Anzuzeigende Nachricht
     */
    static showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }
    
    /**
     * Zeigt eine Fehlermeldung an
     * 
     * @param {string} message - Anzuzeigende Nachricht
     */
    static showErrorMessage(message) {
        this.showMessage(message, 'error');
    }
    
    /**
     * Zeigt eine Informationsmeldung an
     * 
     * @param {string} message - Anzuzeigende Nachricht
     */
    static showInfoMessage(message) {
        this.showMessage(message, 'info');
    }
    
    /**
     * Zeigt eine Warnmeldung an
     * 
     * @param {string} message - Anzuzeigende Nachricht
     */
    static showWarningMessage(message) {
        this.showMessage(message, 'warning');
    }
    
    /**
     * Zeigt eine Nachricht an
     * 
     * @param {string} message - Anzuzeigende Nachricht
     * @param {string} type - Typ der Nachricht (success, error, info, warning)
     */
    static showMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        if (!messageContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const icon = document.createElement('span');
        icon.className = 'message-icon';
        
        switch (type) {
            case 'success':
                icon.innerHTML = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon.innerHTML = '<i class="fas fa-times-circle"></i>';
                break;
            case 'info':
                icon.innerHTML = '<i class="fas fa-info-circle"></i>';
                break;
            case 'warning':
                icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                break;
        }
        
        const text = document.createElement('span');
        text.className = 'message-text';
        text.textContent = message;
        
        messageContent.appendChild(icon);
        messageContent.appendChild(text);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'message-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', () => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageContainer.removeChild(messageElement);
            }, 500);
        });
        
        messageElement.appendChild(messageContent);
        messageElement.appendChild(closeButton);
        
        messageContainer.appendChild(messageElement);
        
        // Automatisches Ausblenden nach 5 Sekunden
        setTimeout(() => {
            if (messageContainer.contains(messageElement)) {
                messageElement.classList.add('fade-out');
                setTimeout(() => {
                    if (messageContainer.contains(messageElement)) {
                        messageContainer.removeChild(messageElement);
                    }
                }, 500);
            }
        }, 5000);
    }
    
    /**
     * Gibt eine Erfolgsmeldung basierend auf der Aktion zurück
     * 
     * @param {string} method - HTTP-Methode
     * @param {string} endpoint - API-Endpunkt
     * @returns {string} - Erfolgsmeldung
     */
    static getSuccessMessageForAction(method, endpoint) {
        let entityType = 'Element';
        
        // Bestimme den Entitätstyp basierend auf dem Endpunkt
        if (endpoint.includes('products')) {
            entityType = 'Produkt';
        } else if (endpoint.includes('properties')) {
            entityType = 'Eigenschaft';
        } else if (endpoint.includes('package-contents')) {
            entityType = 'Paketinhalt';
        } else if (endpoint.includes('languages')) {
            entityType = 'Sprachdaten';
        } else if (endpoint.includes('status')) {
            entityType = 'Status';
        } else if (endpoint.includes('packaging-logistics')) {
            entityType = 'Verpackungsdaten';
        } else if (endpoint.includes('addresses')) {
            entityType = 'Adresse';
        } else if (endpoint.includes('categories')) {
            entityType = 'Kategorie';
        } else if (endpoint.includes('compatible')) {
            entityType = 'Kompatibles Produkt';
        } else if (endpoint.includes('serial-numbers')) {
            entityType = 'Seriennummer';
        } else if (endpoint.includes('imei-mac')) {
            entityType = 'IMEI/MAC';
        } else if (endpoint.includes('software')) {
            entityType = 'Software';
        } else if (endpoint.includes('manuals')) {
            entityType = 'Handbuch';
        } else if (endpoint.includes('accessories')) {
            entityType = 'Zubehör';
        }
        
        // Bestimme die Aktion basierend auf der HTTP-Methode
        switch (method) {
            case 'POST':
                return `${entityType} erfolgreich erstellt`;
            case 'PUT':
                return `${entityType} erfolgreich aktualisiert`;
            case 'DELETE':
                return `${entityType} erfolgreich gelöscht`;
            default:
                return 'Operation erfolgreich';
        }
    }
    
    /**
     * Simuliert eine Backend-Antwort für Demo-Zwecke
     * 
     * @param {string} method - HTTP-Methode
     * @param {string} endpoint - API-Endpunkt
     * @param {object} data - Gesendete Daten
     * @returns {Promise} - Promise mit simulierter Antwort
     */
    static async simulateBackendResponse(method, endpoint, data) {
        // Simuliere Netzwerklatenz
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simuliere verschiedene Antworten basierend auf Endpunkt und Methode
        if (endpoint.includes('/products')) {
            if (method === 'GET') {
                if (endpoint.includes('/search/')) {
                    return this.simulateProductSearch(endpoint);
                } else if (endpoint.includes('/products/')) {
                    return this.simulateGetProduct(endpoint);
                } else {
                    return this.simulateGetAllProducts();
                }
            } else if (method === 'POST') {
                return this.simulateCreateProduct(data);
            } else if (method === 'PUT') {
                return this.simulateUpdateProduct(endpoint, data);
            } else if (method === 'DELETE') {
                return this.simulateDeleteProduct(endpoint);
            }
        }
        
        // Simuliere Tab-Endpunkte
        if (endpoint.includes('/properties')) {
            return this.simulatePropertiesEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/package-contents')) {
            return this.simulatePackageContentsEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/languages')) {
            return this.simulateLanguagesEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/status')) {
            return this.simulateStatusEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/packaging-logistics')) {
            return this.simulatePackagingLogisticsEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/addresses')) {
            return this.simulateAddressesEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/categories')) {
            return this.simulateCategoriesEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/compatible')) {
            return this.simulateCompatibleEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/serial-numbers')) {
            return this.simulateSerialNumbersEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/imei-mac')) {
            return this.simulateImeiMacEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/software')) {
            return this.simulateSoftwareEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/manuals')) {
            return this.simulateManualsEndpoint(method, endpoint, data);
        } else if (endpoint.includes('/accessories')) {
            return this.simulateAccessoriesEndpoint(method, endpoint, data);
        }
        
        // Standardantwort für nicht spezifizierte Endpunkte
        return {
            success: true,
            message: 'Operation erfolgreich',
            data: data || {}
        };
    }
    
    // Simulierte Produkt-Endpunkte
    
    static simulateGetAllProducts() {
        return {
            success: true,
            data: [
                {
                    id: 1,
                    model: 'Smartphone X1',
                    sku: 'SP-X1-001',
                    ean: '1234567890123',
                    category_id: 3,
                    status_id: 1,
                    completion: 75
                },
                {
                    id: 2,
                    model: 'Router R5',
                    sku: 'RT-R5-002',
                    ean: '2345678901234',
                    category_id: 2,
                    status_id: 1,
                    completion: 90
                },
                {
                    id: 3,
                    model: 'Tablet T3',
                    sku: 'TB-T3-003',
                    ean: '3456789012345',
                    category_id: 4,
                    status_id: 2,
                    completion: 45
                }
            ]
        };
    }
    
    static simulateGetProduct(endpoint) {
        const id = parseInt(endpoint.split('/').pop());
        
        const products = {
            1: {
                id: 1,
                model: 'Smartphone X1',
                sku: 'SP-X1-001',
                ean: '1234567890123',
                category_id: 3,
                status_id: 1,
                completion: 75
            },
            2: {
                id: 2,
                model: 'Router R5',
                sku: 'RT-R5-002',
                ean: '2345678901234',
                category_id: 2,
                status_id: 1,
                completion: 90
            },
            3: {
                id: 3,
                model: 'Tablet T3',
                sku: 'TB-T3-003',
                ean: '3456789012345',
                category_id: 4,
                status_id: 2,
                completion: 45
            }
        };
        
        if (products[id]) {
            return {
                success: true,
                data: products[id]
            };
        } else {
            throw new Error('Produkt nicht gefunden');
        }
    }
    
    static simulateProductSearch(endpoint) {
        const searchTerm = endpoint.split('/search/').pop();
        
        if (searchTerm === '*') {
            return this.simulateGetAllProducts();
        }
        
        const allProducts = this.simulateGetAllProducts().data;
        const filteredProducts = allProducts.filter(product => 
            product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.ean.includes(searchTerm)
        );
        
        return {
            success: true,
            data: filteredProducts
        };
    }
    
    static simulateCreateProduct(data) {
        return {
            success: true,
            message: 'Produkt erfolgreich erstellt',
            data: {
                id: 4,
                ...data,
                completion: 25
            }
        };
    }
    
    static simulateUpdateProduct(endpoint, data) {
        const id = parseInt(endpoint.split('/').pop());
        
        return {
            success: true,
            message: 'Produkt erfolgreich aktualisiert',
            data: {
                id: id,
                ...data
            }
        };
    }
    
    static simulateDeleteProduct(endpoint) {
        const id = parseInt(endpoint.split('/').pop());
        
        return {
            success: true,
            message: 'Produkt erfolgreich gelöscht',
            data: { id: id }
        };
    }
    
    // Simulierte Tab-Endpunkte
    
    static simulatePropertiesEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            if (endpoint.includes('/products/')) {
                return {
                    success: true,
                    data: [
                        { id: 1, product_id: 1, property_type_id: 1, name: 'Processor', value: 'Quad-core 2.0 GHz' },
                        { id: 2, product_id: 1, property_type_id: 2, name: 'RAM', value: '4 GB' },
                        { id: 3, product_id: 1, property_type_id: 3, name: 'Storage', value: '64 GB' }
                    ]
                };
            } else if (endpoint === '/api/property-types') {
                return {
                    success: true,
                    data: [
                        { id: 1, name: 'Processor', description: 'CPU type and speed' },
                        { id: 2, name: 'RAM', description: 'Memory size' },
                        { id: 3, name: 'Storage', description: 'Storage capacity' },
                        { id: 4, name: 'Display', description: 'Screen size and resolution' },
                        { id: 5, name: 'Battery', description: 'Battery capacity' }
                    ]
                };
            }
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Eigenschaft erfolgreich hinzugefügt',
                data: { id: 4, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Eigenschaft erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Eigenschaft erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulatePackageContentsEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, item: 'Main Device', quantity: 1 },
                    { id: 2, product_id: 1, item: 'Power Adapter', quantity: 1 },
                    { id: 3, product_id: 1, item: 'User Manual', quantity: 1 },
                    { id: 4, product_id: 1, item: 'USB Cable', quantity: 1 },
                    { id: 5, product_id: 1, item: 'Warranty Card', quantity: 1 },
                    { id: 6, product_id: 1, item: 'Quick Start Guide', quantity: 1 },
                    { id: 7, product_id: 1, item: 'Mounting Brackets', quantity: 2 },
                    { id: 8, product_id: 1, item: 'Screws', quantity: 4 }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Paketinhalt erfolgreich hinzugefügt',
                data: { id: 9, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Paketinhalt erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Paketinhalt erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateLanguagesEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            if (endpoint === '/api/languages') {
                return {
                    success: true,
                    data: [
                        { id: 1, code: 'en', name: 'English' },
                        { id: 2, code: 'de', name: 'Deutsch' },
                        { id: 3, code: 'fr', name: 'Français' },
                        { id: 4, code: 'es', name: 'Español' },
                        { id: 5, code: 'it', name: 'Italiano' }
                    ]
                };
            } else {
                return {
                    success: true,
                    data: [
                        { id: 1, product_id: 1, language_id: 1, name: 'Smartphone X1', description: 'High-end smartphone with advanced features' },
                        { id: 2, product_id: 1, language_id: 2, name: 'Smartphone X1', description: 'High-End-Smartphone mit fortschrittlichen Funktionen' }
                    ]
                };
            }
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Sprachdaten erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Sprachdaten erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Sprachdaten erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateStatusEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            if (endpoint === '/api/status-types') {
                return {
                    success: true,
                    data: [
                        { id: 1, name: 'Active', description: 'Product is active and available' },
                        { id: 2, name: 'In Development', description: 'Product is in development phase' },
                        { id: 3, name: 'End of Life', description: 'Product is no longer supported' },
                        { id: 4, name: 'Deleted', description: 'Product is marked as deleted' }
                    ]
                };
            } else {
                return {
                    success: true,
                    data: [
                        { id: 1, product_id: 1, status_id: 1, date: '2025-01-15', user_id: 1, notes: 'Initial release' },
                        { id: 2, product_id: 1, status_id: 1, date: '2025-03-20', user_id: 1, notes: 'Updated firmware' }
                    ]
                };
            }
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Status erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Status erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Status erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulatePackagingLogisticsEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, field: 'Weight', value: '150', unit: 'g' },
                    { id: 2, product_id: 1, field: 'Dimensions', value: '150 x 75 x 8', unit: 'mm' },
                    { id: 3, product_id: 1, field: 'Package Type', value: 'Retail', unit: '' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Verpackungsdaten erfolgreich hinzugefügt',
                data: { id: 4, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Verpackungsdaten erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Verpackungsdaten erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateAddressesEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, type: 'Manufacturer', name: 'Tech Industries', address: '123 Tech Street, Silicon Valley, CA' },
                    { id: 2, product_id: 1, type: 'Distributor', name: 'Global Distribution Inc.', address: '456 Logistics Ave, Distribution Center, NY' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Adresse erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Adresse erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Adresse erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateCategoriesEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, name: 'Electronics', description: 'Electronic devices' },
                    { id: 2, name: 'Networking', description: 'Networking equipment' },
                    { id: 3, name: 'Smartphone', description: 'Mobile phones' },
                    { id: 4, name: 'Tablet', description: 'Tablet computers' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Kategorie erfolgreich hinzugefügt',
                data: { id: 5, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Kategorie erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Kategorie erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateCompatibleEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, compatible_product_id: 2, model: 'Smartphone X2', sku: 'SP-X2-002' },
                    { id: 2, product_id: 1, compatible_product_id: 3, model: 'Tablet T3', sku: 'TB-T3-003' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Kompatibles Produkt erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Kompatibles Produkt erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Kompatibles Produkt erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateSerialNumbersEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, serial_number: 'SN12345678', production_date: '2025-01-15', notes: 'First batch' },
                    { id: 2, product_id: 1, serial_number: 'SN12345679', production_date: '2025-01-15', notes: 'First batch' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Seriennummer erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Seriennummer erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Seriennummer erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateImeiMacEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, type: 'IMEI', value: '123456789012345', notes: 'Primary IMEI' },
                    { id: 2, product_id: 1, type: 'MAC', value: '00:11:22:33:44:55', notes: 'WiFi MAC' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'IMEI/MAC erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'IMEI/MAC erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'IMEI/MAC erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateSoftwareEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, name: 'Operating System', version: '12.0', release_date: '2025-01-01', notes: 'Initial release' },
                    { id: 2, product_id: 1, name: 'Firmware', version: '1.2.3', release_date: '2025-01-05', notes: 'Stability improvements' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Software erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Software erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Software erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateManualsEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, language_id: 1, title: 'User Manual', version: '1.0', file: 'user_manual_en.pdf' },
                    { id: 2, product_id: 1, language_id: 2, title: 'Benutzerhandbuch', version: '1.0', file: 'user_manual_de.pdf' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Handbuch erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Handbuch erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Handbuch erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
    
    static simulateAccessoriesEndpoint(method, endpoint, data) {
        if (method === 'GET') {
            return {
                success: true,
                data: [
                    { id: 1, product_id: 1, model: 'Wireless Charger', sku: 'AC-WC-001' },
                    { id: 2, product_id: 1, model: 'Protective Case', sku: 'AC-PC-002' }
                ]
            };
        } else if (method === 'POST') {
            return {
                success: true,
                message: 'Zubehör erfolgreich hinzugefügt',
                data: { id: 3, ...data }
            };
        } else if (method === 'PUT') {
            return {
                success: true,
                message: 'Zubehör erfolgreich aktualisiert',
                data: data
            };
        } else if (method === 'DELETE') {
            return {
                success: true,
                message: 'Zubehör erfolgreich gelöscht'
            };
        }
        
        return { success: false, message: 'Nicht implementiert' };
    }
}
