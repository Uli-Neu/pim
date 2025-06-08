<?php
/**
 * PIM System - API Backend
 * 
 * Dieses Skript stellt die API-Endpunkte für das PIM-System bereit und
 * implementiert die Datenbankoperationen für alle Entitäten.
 */

// Konfiguration
$config = [
    'db_path' => __DIR__ . '/database/pim_database.sqlite',
    'debug' => true
];

// Initialisiere die Datenbank, falls sie nicht existiert
initDatabase($config['db_path']);

// Verarbeite die Anfrage
handleRequest();

/**
 * Initialisiert die Datenbank, falls sie nicht existiert
 * 
 * @param string $dbPath - Der Pfad zur Datenbank
 */
function initDatabase($dbPath) {
    // Stelle sicher, dass das Verzeichnis existiert
    $dbDir = dirname($dbPath);
    if (!file_exists($dbDir)) {
        mkdir($dbDir, 0755, true);
    }
    
    // Erstelle die Datenbank, falls sie nicht existiert
    if (!file_exists($dbPath)) {
        $db = new SQLite3($dbPath);
        
        // Erstelle die Tabellen
        $db->exec("
            -- Produkte
            CREATE TABLE products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model TEXT NOT NULL,
                sku TEXT NOT NULL UNIQUE,
                ean TEXT,
                category_id INTEGER,
                status_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            -- Package Contents
            CREATE TABLE package_contents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                item TEXT NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
            
            -- Properties
            CREATE TABLE properties (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                property_type_id INTEGER,
                name TEXT NOT NULL,
                value TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (property_type_id) REFERENCES property_types(id) ON DELETE SET NULL
            );
            
            -- Property Types
            CREATE TABLE property_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT
            );
            
            -- Languages
            CREATE TABLE languages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL
            );
            
            -- Product Languages
            CREATE TABLE product_languages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                language_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
            );
            
            -- Status Types
            CREATE TABLE status_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT
            );
            
            -- Status History
            CREATE TABLE status_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                status_id INTEGER NOT NULL,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER,
                notes TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (status_id) REFERENCES status_types(id) ON DELETE CASCADE
            );
            
            -- Packaging Logistics Fields
            CREATE TABLE packaging_logistics_fields (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                unit TEXT,
                options TEXT
            );
            
            -- Packaging Logistics Values
            CREATE TABLE packaging_logistics_values (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                field_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                value TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (field_id) REFERENCES packaging_logistics_fields(id) ON DELETE CASCADE
            );
            
            -- Addresses
            CREATE TABLE addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                name TEXT NOT NULL,
                street TEXT,
                city TEXT,
                zip TEXT,
                country TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
            
            -- Categories
            CREATE TABLE categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT
            );
            
            -- Product Categories
            CREATE TABLE product_categories (
                product_id INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                PRIMARY KEY (product_id, category_id),
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            );
            
            -- Compatible Products
            CREATE TABLE compatible_products (
                product_id INTEGER NOT NULL,
                compatible_id INTEGER NOT NULL,
                PRIMARY KEY (product_id, compatible_id),
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (compatible_id) REFERENCES products(id) ON DELETE CASCADE
            );
            
            -- Serial Numbers
            CREATE TABLE serial_numbers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                serial_number TEXT NOT NULL,
                production_date DATE,
                notes TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
            
            -- IMEI/MAC
            CREATE TABLE imei_mac (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                value TEXT NOT NULL,
                notes TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
            
            -- Software
            CREATE TABLE software (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                version TEXT NOT NULL,
                release_date DATE,
                notes TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
            
            -- User Manuals
            CREATE TABLE user_manuals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                language_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                file_path TEXT,
                version TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
            );
            
            -- Accessories
            CREATE TABLE accessories (
                product_id INTEGER NOT NULL,
                accessory_id INTEGER NOT NULL,
                PRIMARY KEY (product_id, accessory_id),
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (accessory_id) REFERENCES products(id) ON DELETE CASCADE
            );
            
            -- Users
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'reader',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            -- Trigger für updated_at
            CREATE TRIGGER update_products_timestamp
            AFTER UPDATE ON products
            BEGIN
                UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        ");
        
        // Füge Beispieldaten hinzu
        insertSampleData($db);
        
        $db->close();
    }
}

/**
 * Fügt Beispieldaten in die Datenbank ein
 * 
 * @param SQLite3 $db - Die Datenbankverbindung
 */
function insertSampleData($db) {
    // Kategorien
    $db->exec("
        INSERT INTO categories (name, description) VALUES
        ('Modem', 'Internet modems'),
        ('Router', 'Network routers'),
        ('Smartphone', 'Mobile phones'),
        ('Tablet', 'Tablet computers'),
        ('Accessory', 'Device accessories')
    ");
    
    // Status-Typen
    $db->exec("
        INSERT INTO status_types (name, description) VALUES
        ('Active', 'Product is active and available'),
        ('In Development', 'Product is in development phase'),
        ('End of Life', 'Product is no longer supported'),
        ('Deleted', 'Product is marked as deleted')
    ");
    
    // Property-Typen
    $db->exec("
        INSERT INTO property_types (name, description) VALUES
        ('Processor', 'CPU type and speed'),
        ('RAM', 'Memory size'),
        ('Storage', 'Storage capacity'),
        ('Display', 'Screen size and resolution'),
        ('Battery', 'Battery capacity')
    ");
    
    // Sprachen
    $db->exec("
        INSERT INTO languages (code, name) VALUES
        ('en', 'English'),
        ('de', 'Deutsch'),
        ('fr', 'Français'),
        ('es', 'Español'),
        ('it', 'Italiano')
    ");
    
    // Packaging Logistics Felder
    $db->exec("
        INSERT INTO packaging_logistics_fields (name, type, unit, options) VALUES
        ('Weight', 'number', 'g', NULL),
        ('Dimensions', 'text', 'mm', NULL),
        ('Package Type', 'select', NULL, 'Retail,Bulk,OEM'),
        ('Barcode Type', 'select', NULL, 'EAN-13,UPC,QR Code')
    ");
    
    // Benutzer
    $db->exec("
        INSERT INTO users (username, password, role) VALUES
        ('admin', '" . password_hash('admin', PASSWORD_DEFAULT) . "', 'admin')
    ");
    
    // Produkte
    $db->exec("
        INSERT INTO products (model, sku, ean, category_id, status_id) VALUES
        ('Smartphone X1', 'SP-X1-001', '1234567890123', 3, 1),
        ('Router R5', 'RT-R5-002', '2345678901234', 2, 1),
        ('Tablet T3', 'TB-T3-003', '3456789012345', 4, 2)
    ");
    
    // Package Contents
    $db->exec("
        INSERT INTO package_contents (product_id, item, quantity) VALUES
        (1, 'Main Device', 1),
        (1, 'Power Adapter', 1),
        (1, 'User Manual', 1),
        (1, 'USB Cable', 1),
        (1, 'Warranty Card', 1),
        (1, 'Quick Start Guide', 1),
        (1, 'Mounting Brackets', 2),
        (1, 'Screws', 4)
    ");
    
    // Properties
    $db->exec("
        INSERT INTO properties (product_id, property_type_id, name, value) VALUES
        (1, 1, 'Processor', 'Quad-core 2.0 GHz'),
        (1, 2, 'RAM', '4 GB'),
        (1, 3, 'Storage', '64 GB')
    ");
}

/**
 * Verarbeitet die API-Anfrage
 */
function handleRequest() {
    // Setze Header für JSON-Antwort
    header('Content-Type: application/json');
    
    // Hole die Anfragemethode
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Hole den Anfragepfad
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $path = trim($path, '/');
    $path = str_replace('api/', '', $path);
    
    // Hole die Anfrageparameter
    $params = explode('/', $path);
    
    // Hole den Request-Body für POST und PUT
    $body = null;
    if ($method === 'POST' || $method === 'PUT') {
        $body = json_decode(file_get_contents('php://input'), true);
    }
    
    // Verarbeite die Anfrage basierend auf dem Pfad
    try {
        // Produkt-Endpunkte
        if ($params[0] === 'products') {
            if (count($params) === 1) {
                // /products
                if ($method === 'GET') {
                    // Alle Produkte abrufen
                    $response = getAllProducts();
                } elseif ($method === 'POST') {
                    // Neues Produkt erstellen
                    $response = createProduct($body);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } elseif (count($params) === 2) {
                if ($params[1] === 'search') {
                    // /products/search
                    throw new Exception('Suchbegriff fehlt', 400);
                } else {
                    // /products/{id}
                    $productId = intval($params[1]);
                    
                    if ($method === 'GET') {
                        // Produkt abrufen
                        $response = getProduct($productId);
                    } elseif ($method === 'PUT') {
                        // Produkt aktualisieren
                        $response = updateProduct($productId, $body);
                    } elseif ($method === 'DELETE') {
                        // Produkt löschen
                        $response = deleteProduct($productId);
                    } else {
                        throw new Exception('Methode nicht erlaubt', 405);
                    }
                }
            } elseif (count($params) === 3 && $params[1] === 'search') {
                // /products/search/{term}
                $searchTerm = $params[2];
                
                if ($method === 'GET') {
                    // Produkte suchen
                    $response = searchProducts($searchTerm);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } elseif (count($params) === 3) {
                // /products/{id}/{entity}
                $productId = intval($params[1]);
                $entity = $params[2];
                
                if ($method === 'GET') {
                    // Entität abrufen
                    $response = getProductEntity($productId, $entity);
                } elseif ($method === 'POST') {
                    // Entität erstellen
                    $response = createProductEntity($productId, $entity, $body);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } elseif (count($params) === 4) {
                // /products/{id}/{entity}/{entityId}
                $productId = intval($params[1]);
                $entity = $params[2];
                $entityId = intval($params[3]);
                
                if ($method === 'GET') {
                    // Spezifische Entität abrufen
                    $response = getProductEntityItem($productId, $entity, $entityId);
                } elseif ($method === 'PUT') {
                    // Entität aktualisieren
                    $response = updateProductEntity($productId, $entity, $entityId, $body);
                } elseif ($method === 'DELETE') {
                    // Entität löschen
                    $response = deleteProductEntity($productId, $entity, $entityId);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // Kategorien-Endpunkte
        elseif ($params[0] === 'categories') {
            if (count($params) === 1) {
                // /categories
                if ($method === 'GET') {
                    // Alle Kategorien abrufen
                    $response = getAllCategories();
                } elseif ($method === 'POST') {
                    // Neue Kategorie erstellen
                    $response = createCategory($body);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } elseif (count($params) === 2) {
                // /categories/{id}
                $categoryId = intval($params[1]);
                
                if ($method === 'GET') {
                    // Kategorie abrufen
                    $response = getCategory($categoryId);
                } elseif ($method === 'PUT') {
                    // Kategorie aktualisieren
                    $response = updateCategory($categoryId, $body);
                } elseif ($method === 'DELETE') {
                    // Kategorie löschen
                    $response = deleteCategory($categoryId);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // Status-Typen-Endpunkte
        elseif ($params[0] === 'status-types') {
            if (count($params) === 1) {
                // /status-types
                if ($method === 'GET') {
                    // Alle Status-Typen abrufen
                    $response = getAllStatusTypes();
                } elseif ($method === 'POST') {
                    // Neuen Status-Typ erstellen
                    $response = createStatusType($body);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } elseif (count($params) === 2) {
                // /status-types/{id}
                $statusTypeId = intval($params[1]);
                
                if ($method === 'GET') {
                    // Status-Typ abrufen
                    $response = getStatusType($statusTypeId);
                } elseif ($method === 'PUT') {
                    // Status-Typ aktualisieren
                    $response = updateStatusType($statusTypeId, $body);
                } elseif ($method === 'DELETE') {
                    // Status-Typ löschen
                    $response = deleteStatusType($statusTypeId);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // Property-Typen-Endpunkte
        elseif ($params[0] === 'property-types') {
            if (count($params) === 1) {
                // /property-types
                if ($method === 'GET') {
                    // Alle Property-Typen abrufen
                    $response = getAllPropertyTypes();
                } elseif ($method === 'POST') {
                    // Neuen Property-Typ erstellen
                    $response = createPropertyType($body);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } elseif (count($params) === 2) {
                // /property-types/{id}
                $propertyTypeId = intval($params[1]);
                
                if ($method === 'GET') {
                    // Property-Typ abrufen
                    $response = getPropertyType($propertyTypeId);
                } elseif ($method === 'PUT') {
                    // Property-Typ aktualisieren
                    $response = updatePropertyType($propertyTypeId, $body);
                } elseif ($method === 'DELETE') {
                    // Property-Typ löschen
                    $response = deletePropertyType($propertyTypeId);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // Sprachen-Endpunkte
        elseif ($params[0] === 'languages') {
            if (count($params) === 1) {
                // /languages
                if ($method === 'GET') {
                    // Alle Sprachen abrufen
                    $response = getAllLanguages();
                } elseif ($method === 'POST') {
                    // Neue Sprache erstellen
                    $response = createLanguage($body);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } elseif (count($params) === 2) {
                // /languages/{id}
                $languageId = intval($params[1]);
                
                if ($method === 'GET') {
                    // Sprache abrufen
                    $response = getLanguage($languageId);
                } elseif ($method === 'PUT') {
                    // Sprache aktualisieren
                    $response = updateLanguage($languageId, $body);
                } elseif ($method === 'DELETE') {
                    // Sprache löschen
                    $response = deleteLanguage($languageId);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // Packaging Logistics Felder-Endpunkte
        elseif ($params[0] === 'packaging-logistics' && isset($params[1]) && $params[1] === 'fields') {
            if (count($params) === 2) {
                // /packaging-logistics/fields
                if ($method === 'GET') {
                    // Alle Packaging Logistics Felder abrufen
                    $response = getAllPackagingLogisticsFields();
                } elseif ($method === 'POST') {
                    // Neues Packaging Logistics Feld erstellen
                    $response = createPackagingLogisticsField($body);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } elseif (count($params) === 3) {
                // /packaging-logistics/fields/{id}
                $fieldId = intval($params[2]);
                
                if ($method === 'GET') {
                    // Packaging Logistics Feld abrufen
                    $response = getPackagingLogisticsField($fieldId);
                } elseif ($method === 'PUT') {
                    // Packaging Logistics Feld aktualisieren
                    $response = updatePackagingLogisticsField($fieldId, $body);
                } elseif ($method === 'DELETE') {
                    // Packaging Logistics Feld löschen
                    $response = deletePackagingLogisticsField($fieldId);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // Authentifizierungs-Endpunkte
        elseif ($params[0] === 'auth') {
            if (count($params) === 2) {
                if ($params[1] === 'login') {
                    // /auth/login
                    if ($method === 'POST') {
                        // Benutzeranmeldung
                        $response = login($body);
                    } else {
                        throw new Exception('Methode nicht erlaubt', 405);
                    }
                } elseif ($params[1] === 'logout') {
                    // /auth/logout
                    if ($method === 'POST') {
                        // Benutzerabmeldung
                        $response = logout();
                    } else {
                        throw new Exception('Methode nicht erlaubt', 405);
                    }
                } else {
                    throw new Exception('Ungültiger Pfad', 404);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // System-Endpunkte
        elseif ($params[0] === 'system') {
            if (count($params) === 2) {
                if ($params[1] === 'status') {
                    // /system/status
                    if ($method === 'GET') {
                        // Systemstatus abrufen
                        $response = getSystemStatus();
                    } else {
                        throw new Exception('Methode nicht erlaubt', 405);
                    }
                } elseif ($params[1] === 'version') {
                    // /system/version
                    if ($method === 'GET') {
                        // API-Version abrufen
                        $response = getApiVersion();
                    } else {
                        throw new Exception('Methode nicht erlaubt', 405);
                    }
                } else {
                    throw new Exception('Ungültiger Pfad', 404);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // SAP-Schnittstelle
        elseif ($params[0] === 'sap') {
            if (count($params) === 3 && $params[1] === 'inventory') {
                // /sap/inventory/{productId}
                $productId = intval($params[2]);
                
                if ($method === 'GET') {
                    // Lagerbestand aus SAP abrufen
                    $response = getSapInventory($productId);
                } else {
                    throw new Exception('Methode nicht erlaubt', 405);
                }
            } else {
                throw new Exception('Ungültiger Pfad', 404);
            }
        }
        // Unbekannter Endpunkt
        else {
            throw new Exception('Ungültiger Pfad', 404);
        }
    } catch (Exception $e) {
        // Fehlerbehandlung
        $response = [
            'success' => false,
            'message' => $e->getMessage(),
            'code' => $e->getCode()
        ];
        
        http_response_code($e->getCode() ?: 500);
    }
    
    // Sende die Antwort
    echo json_encode($response);
}

/**
 * Öffnet eine Datenbankverbindung
 * 
 * @param string $dbPath - Der Pfad zur Datenbank
 * @return SQLite3 - Die Datenbankverbindung
 */
function openDatabase($dbPath) {
    return new SQLite3($dbPath);
}

/**
 * Berechnet den Füllstand der Produktdaten
 * 
 * @param int $productId - Die Produkt-ID
 * @param SQLite3 $db - Die Datenbankverbindung
 * @return int - Der Füllstand in Prozent
 */
function calculateCompletion($productId, $db) {
    // Zähle die Anzahl der ausgefüllten Felder
    $product = $db->querySingle("SELECT * FROM products WHERE id = $productId", true);
    $filledFields = 0;
    $totalFields = 0;
    
    // Hauptfelder
    $fields = ['model', 'sku', 'ean', 'category_id', 'status_id'];
    foreach ($fields as $field) {
        $totalFields++;
        if (!empty($product[$field])) {
            $filledFields++;
        }
    }
    
    // Package Contents
    $packageContentsCount = $db->querySingle("SELECT COUNT(*) FROM package_contents WHERE product_id = $productId");
    $totalFields++;
    if ($packageContentsCount > 0) {
        $filledFields++;
    }
    
    // Properties
    $propertiesCount = $db->querySingle("SELECT COUNT(*) FROM properties WHERE product_id = $productId");
    $totalFields++;
    if ($propertiesCount > 0) {
        $filledFields++;
    }
    
    // Languages
    $languagesCount = $db->querySingle("SELECT COUNT(*) FROM product_languages WHERE product_id = $productId");
    $totalFields++;
    if ($languagesCount > 0) {
        $filledFields++;
    }
    
    // Status History
    $statusHistoryCount = $db->querySingle("SELECT COUNT(*) FROM status_history WHERE product_id = $productId");
    $totalFields++;
    if ($statusHistoryCount > 0) {
        $filledFields++;
    }
    
    // Packaging Logistics
    $packagingLogisticsCount = $db->querySingle("SELECT COUNT(*) FROM packaging_logistics_values WHERE product_id = $productId");
    $totalFields++;
    if ($packagingLogisticsCount > 0) {
        $filledFields++;
    }
    
    // Addresses
    $addressesCount = $db->querySingle("SELECT COUNT(*) FROM addresses WHERE product_id = $productId");
    $totalFields++;
    if ($addressesCount > 0) {
        $filledFields++;
    }
    
    // Categories
    $categoriesCount = $db->querySingle("SELECT COUNT(*) FROM product_categories WHERE product_id = $productId");
    $totalFields++;
    if ($categoriesCount > 0) {
        $filledFields++;
    }
    
    // Compatible Products
    $compatibleCount = $db->querySingle("SELECT COUNT(*) FROM compatible_products WHERE product_id = $productId");
    $totalFields++;
    if ($compatibleCount > 0) {
        $filledFields++;
    }
    
    // Serial Numbers
    $serialNumbersCount = $db->querySingle("SELECT COUNT(*) FROM serial_numbers WHERE product_id = $productId");
    $totalFields++;
    if ($serialNumbersCount > 0) {
        $filledFields++;
    }
    
    // IMEI/MAC
    $imeiMacCount = $db->querySingle("SELECT COUNT(*) FROM imei_mac WHERE product_id = $productId");
    $totalFields++;
    if ($imeiMacCount > 0) {
        $filledFields++;
    }
    
    // Software
    $softwareCount = $db->querySingle("SELECT COUNT(*) FROM software WHERE product_id = $productId");
    $totalFields++;
    if ($softwareCount > 0) {
        $filledFields++;
    }
    
    // User Manuals
    $manualsCount = $db->querySingle("SELECT COUNT(*) FROM user_manuals WHERE product_id = $productId");
    $totalFields++;
    if ($manualsCount > 0) {
        $filledFields++;
    }
    
    // Accessories
    $accessoriesCount = $db->querySingle("SELECT COUNT(*) FROM accessories WHERE product_id = $productId");
    $totalFields++;
    if ($accessoriesCount > 0) {
        $filledFields++;
    }
    
    // Berechne den Prozentsatz
    return round(($filledFields / $totalFields) * 100);
}

/**
 * Ruft alle Produkte ab
 * 
 * @return array - Die Antwort
 */
function getAllProducts() {
    global $config;
    $db = openDatabase($config['db_path']);
    
    $result = $db->query('SELECT * FROM products ORDER BY id');
    $products = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $row['completion'] = calculateCompletion($row['id'], $db);
        $products[] = $row;
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $products
    ];
}

/**
 * Ruft ein Produkt ab
 * 
 * @param int $id - Die Produkt-ID
 * @return array - Die Antwort
 */
function getProduct($id) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    $product = $db->querySingle("SELECT * FROM products WHERE id = $id", true);
    
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    $product['completion'] = calculateCompletion($id, $db);
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $product
    ];
}

/**
 * Erstellt ein neues Produkt
 * 
 * @param array $data - Die Produktdaten
 * @return array - Die Antwort
 */
function createProduct($data) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Validiere Pflichtfelder
    if (empty($data['model']) || empty($data['sku'])) {
        $db->close();
        throw new Exception('Model und SKU sind Pflichtfelder', 400);
    }
    
    // Prüfe, ob SKU bereits existiert
    $existingSku = $db->querySingle("SELECT id FROM products WHERE sku = '" . SQLite3::escapeString($data['sku']) . "'");
    if ($existingSku) {
        $db->close();
        throw new Exception('SKU existiert bereits', 400);
    }
    
    // Erstelle das Produkt
    $model = SQLite3::escapeString($data['model']);
    $sku = SQLite3::escapeString($data['sku']);
    $ean = isset($data['ean']) ? SQLite3::escapeString($data['ean']) : '';
    $categoryId = isset($data['category_id']) ? intval($data['category_id']) : 'NULL';
    $statusId = isset($data['status_id']) ? intval($data['status_id']) : 'NULL';
    
    $db->exec("
        INSERT INTO products (model, sku, ean, category_id, status_id)
        VALUES ('$model', '$sku', '$ean', $categoryId, $statusId)
    ");
    
    $productId = $db->lastInsertRowID();
    
    // Füge Status-History hinzu, falls Status gesetzt ist
    if ($statusId !== 'NULL') {
        $db->exec("
            INSERT INTO status_history (product_id, status_id, notes)
            VALUES ($productId, $statusId, 'Initial status')
        ");
    }
    
    $product = $db->querySingle("SELECT * FROM products WHERE id = $productId", true);
    $product['completion'] = calculateCompletion($productId, $db);
    
    $db->close();
    
    return [
        'success' => true,
        'message' => 'Produkt erfolgreich erstellt',
        'data' => $product
    ];
}

/**
 * Aktualisiert ein Produkt
 * 
 * @param int $id - Die Produkt-ID
 * @param array $data - Die Produktdaten
 * @return array - Die Antwort
 */
function updateProduct($id, $data) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Prüfe, ob das Produkt existiert
    $product = $db->querySingle("SELECT * FROM products WHERE id = $id", true);
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    // Validiere Pflichtfelder
    if (empty($data['model']) || empty($data['sku'])) {
        $db->close();
        throw new Exception('Model und SKU sind Pflichtfelder', 400);
    }
    
    // Prüfe, ob SKU bereits existiert (außer für dieses Produkt)
    $existingSku = $db->querySingle("SELECT id FROM products WHERE sku = '" . SQLite3::escapeString($data['sku']) . "' AND id != $id");
    if ($existingSku) {
        $db->close();
        throw new Exception('SKU existiert bereits', 400);
    }
    
    // Aktualisiere das Produkt
    $model = SQLite3::escapeString($data['model']);
    $sku = SQLite3::escapeString($data['sku']);
    $ean = isset($data['ean']) ? SQLite3::escapeString($data['ean']) : '';
    $categoryId = isset($data['category_id']) ? intval($data['category_id']) : 'NULL';
    $statusId = isset($data['status_id']) ? intval($data['status_id']) : 'NULL';
    
    $db->exec("
        UPDATE products
        SET model = '$model', sku = '$sku', ean = '$ean', category_id = $categoryId, status_id = $statusId
        WHERE id = $id
    ");
    
    // Füge Status-History hinzu, falls Status geändert wurde
    if ($statusId !== 'NULL' && $statusId != $product['status_id']) {
        $db->exec("
            INSERT INTO status_history (product_id, status_id, notes)
            VALUES ($id, $statusId, 'Status updated')
        ");
    }
    
    $updatedProduct = $db->querySingle("SELECT * FROM products WHERE id = $id", true);
    $updatedProduct['completion'] = calculateCompletion($id, $db);
    
    $db->close();
    
    return [
        'success' => true,
        'message' => 'Produkt erfolgreich aktualisiert',
        'data' => $updatedProduct
    ];
}

/**
 * Löscht ein Produkt
 * 
 * @param int $id - Die Produkt-ID
 * @return array - Die Antwort
 */
function deleteProduct($id) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Prüfe, ob das Produkt existiert
    $product = $db->querySingle("SELECT * FROM products WHERE id = $id", true);
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    // Lösche das Produkt
    $db->exec("DELETE FROM products WHERE id = $id");
    
    $db->close();
    
    return [
        'success' => true,
        'message' => 'Produkt erfolgreich gelöscht',
        'data' => ['id' => $id]
    ];
}

/**
 * Sucht nach Produkten
 * 
 * @param string $term - Der Suchbegriff
 * @return array - Die Antwort
 */
function searchProducts($term) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Wenn der Suchbegriff ein Stern ist, gib alle Produkte zurück
    if ($term === '*') {
        return getAllProducts();
    }
    
    $term = SQLite3::escapeString($term);
    $result = $db->query("
        SELECT * FROM products
        WHERE model LIKE '%$term%' OR sku LIKE '%$term%' OR ean LIKE '%$term%'
        ORDER BY id
    ");
    
    $products = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $row['completion'] = calculateCompletion($row['id'], $db);
        $products[] = $row;
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $products
    ];
}

/**
 * Ruft eine Entität eines Produkts ab
 * 
 * @param int $productId - Die Produkt-ID
 * @param string $entity - Die Entität
 * @return array - Die Antwort
 */
function getProductEntity($productId, $entity) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Prüfe, ob das Produkt existiert
    $product = $db->querySingle("SELECT * FROM products WHERE id = $productId", true);
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    $data = [];
    
    switch ($entity) {
        case 'package-contents':
            $result = $db->query("SELECT * FROM package_contents WHERE product_id = $productId ORDER BY id");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'properties':
            $result = $db->query("SELECT * FROM properties WHERE product_id = $productId ORDER BY id");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'languages':
            $result = $db->query("
                SELECT pl.*, l.code, l.name as language_name
                FROM product_languages pl
                JOIN languages l ON pl.language_id = l.id
                WHERE pl.product_id = $productId
                ORDER BY pl.id
            ");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'status-history':
            $result = $db->query("
                SELECT sh.*, st.name as status_name
                FROM status_history sh
                JOIN status_types st ON sh.status_id = st.id
                WHERE sh.product_id = $productId
                ORDER BY sh.date DESC
            ");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'packaging-logistics':
            $result = $db->query("
                SELECT plv.*, plf.name as field_name, plf.type, plf.unit
                FROM packaging_logistics_values plv
                JOIN packaging_logistics_fields plf ON plv.field_id = plf.id
                WHERE plv.product_id = $productId
                ORDER BY plv.id
            ");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'addresses':
            $result = $db->query("SELECT * FROM addresses WHERE product_id = $productId ORDER BY id");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'categories':
            $result = $db->query("
                SELECT c.*
                FROM categories c
                JOIN product_categories pc ON c.id = pc.category_id
                WHERE pc.product_id = $productId
                ORDER BY c.id
            ");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'compatible':
            $result = $db->query("
                SELECT p.id, p.model, p.sku
                FROM products p
                JOIN compatible_products cp ON p.id = cp.compatible_id
                WHERE cp.product_id = $productId
                ORDER BY p.id
            ");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'serial-numbers':
            $result = $db->query("SELECT * FROM serial_numbers WHERE product_id = $productId ORDER BY id");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'imei-mac':
            $result = $db->query("SELECT * FROM imei_mac WHERE product_id = $productId ORDER BY id");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'software':
            $result = $db->query("SELECT * FROM software WHERE product_id = $productId ORDER BY id");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'manuals':
            $result = $db->query("
                SELECT um.*, l.code, l.name as language_name
                FROM user_manuals um
                JOIN languages l ON um.language_id = l.id
                WHERE um.product_id = $productId
                ORDER BY um.id
            ");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'accessories':
            $result = $db->query("
                SELECT p.id, p.model, p.sku
                FROM products p
                JOIN accessories a ON p.id = a.accessory_id
                WHERE a.product_id = $productId
                ORDER BY p.id
            ");
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $data[] = $row;
            }
            break;
        
        case 'completion':
            $completion = calculateCompletion($productId, $db);
            $data = ['completion' => $completion];
            break;
        
        default:
            $db->close();
            throw new Exception('Ungültige Entität', 400);
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $data
    ];
}

/**
 * Erstellt eine Entität für ein Produkt
 * 
 * @param int $productId - Die Produkt-ID
 * @param string $entity - Die Entität
 * @param array $data - Die Entitätsdaten
 * @return array - Die Antwort
 */
function createProductEntity($productId, $entity, $data) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Prüfe, ob das Produkt existiert
    $product = $db->querySingle("SELECT * FROM products WHERE id = $productId", true);
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    $entityId = null;
    $message = '';
    
    switch ($entity) {
        case 'package-contents':
            // Validiere Pflichtfelder
            if (empty($data['item'])) {
                $db->close();
                throw new Exception('Item ist ein Pflichtfeld', 400);
            }
            
            $item = SQLite3::escapeString($data['item']);
            $quantity = isset($data['quantity']) ? intval($data['quantity']) : 1;
            
            $db->exec("
                INSERT INTO package_contents (product_id, item, quantity)
                VALUES ($productId, '$item', $quantity)
            ");
            
            $entityId = $db->lastInsertRowID();
            $message = 'Package Content erfolgreich hinzugefügt';
            
            // Hole die erstellte Entität
            $data = $db->querySingle("SELECT * FROM package_contents WHERE id = $entityId", true);
            break;
        
        case 'properties':
            // Validiere Pflichtfelder
            if (empty($data['name'])) {
                $db->close();
                throw new Exception('Name ist ein Pflichtfeld', 400);
            }
            
            $name = SQLite3::escapeString($data['name']);
            $value = isset($data['value']) ? SQLite3::escapeString($data['value']) : '';
            $propertyTypeId = isset($data['property_type_id']) ? intval($data['property_type_id']) : 'NULL';
            
            $db->exec("
                INSERT INTO properties (product_id, property_type_id, name, value)
                VALUES ($productId, $propertyTypeId, '$name', '$value')
            ");
            
            $entityId = $db->lastInsertRowID();
            $message = 'Property erfolgreich hinzugefügt';
            
            // Hole die erstellte Entität
            $data = $db->querySingle("SELECT * FROM properties WHERE id = $entityId", true);
            break;
        
        case 'languages':
            // Validiere Pflichtfelder
            if (empty($data['language_id']) || empty($data['name'])) {
                $db->close();
                throw new Exception('Language ID und Name sind Pflichtfelder', 400);
            }
            
            $languageId = intval($data['language_id']);
            $name = SQLite3::escapeString($data['name']);
            $description = isset($data['description']) ? SQLite3::escapeString($data['description']) : '';
            
            // Prüfe, ob die Sprache existiert
            $language = $db->querySingle("SELECT * FROM languages WHERE id = $languageId", true);
            if (!$language) {
                $db->close();
                throw new Exception('Sprache nicht gefunden', 404);
            }
            
            $db->exec("
                INSERT INTO product_languages (product_id, language_id, name, description)
                VALUES ($productId, $languageId, '$name', '$description')
            ");
            
            $entityId = $db->lastInsertRowID();
            $message = 'Sprachdaten erfolgreich hinzugefügt';
            
            // Hole die erstellte Entität
            $data = $db->querySingle("
                SELECT pl.*, l.code, l.name as language_name
                FROM product_languages pl
                JOIN languages l ON pl.language_id = l.id
                WHERE pl.id = $entityId
            ", true);
            break;
        
        // Weitere Entitäten hier implementieren...
        
        default:
            $db->close();
            throw new Exception('Ungültige Entität', 400);
    }
    
    $db->close();
    
    return [
        'success' => true,
        'message' => $message,
        'data' => $data
    ];
}

/**
 * Aktualisiert eine Entität eines Produkts
 * 
 * @param int $productId - Die Produkt-ID
 * @param string $entity - Die Entität
 * @param int $entityId - Die Entitäts-ID
 * @param array $data - Die Entitätsdaten
 * @return array - Die Antwort
 */
function updateProductEntity($productId, $entity, $entityId, $data) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Prüfe, ob das Produkt existiert
    $product = $db->querySingle("SELECT * FROM products WHERE id = $productId", true);
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    $message = '';
    
    switch ($entity) {
        case 'package-contents':
            // Prüfe, ob die Entität existiert
            $packageContent = $db->querySingle("SELECT * FROM package_contents WHERE id = $entityId AND product_id = $productId", true);
            if (!$packageContent) {
                $db->close();
                throw new Exception('Package Content nicht gefunden', 404);
            }
            
            // Validiere Pflichtfelder
            if (empty($data['item'])) {
                $db->close();
                throw new Exception('Item ist ein Pflichtfeld', 400);
            }
            
            $item = SQLite3::escapeString($data['item']);
            $quantity = isset($data['quantity']) ? intval($data['quantity']) : 1;
            
            $db->exec("
                UPDATE package_contents
                SET item = '$item', quantity = $quantity
                WHERE id = $entityId AND product_id = $productId
            ");
            
            $message = 'Package Content erfolgreich aktualisiert';
            
            // Hole die aktualisierte Entität
            $data = $db->querySingle("SELECT * FROM package_contents WHERE id = $entityId", true);
            break;
        
        case 'properties':
            // Prüfe, ob die Entität existiert
            $property = $db->querySingle("SELECT * FROM properties WHERE id = $entityId AND product_id = $productId", true);
            if (!$property) {
                $db->close();
                throw new Exception('Property nicht gefunden', 404);
            }
            
            // Validiere Pflichtfelder
            if (empty($data['name'])) {
                $db->close();
                throw new Exception('Name ist ein Pflichtfeld', 400);
            }
            
            $name = SQLite3::escapeString($data['name']);
            $value = isset($data['value']) ? SQLite3::escapeString($data['value']) : '';
            $propertyTypeId = isset($data['property_type_id']) ? intval($data['property_type_id']) : 'NULL';
            
            $db->exec("
                UPDATE properties
                SET name = '$name', value = '$value', property_type_id = $propertyTypeId
                WHERE id = $entityId AND product_id = $productId
            ");
            
            $message = 'Property erfolgreich aktualisiert';
            
            // Hole die aktualisierte Entität
            $data = $db->querySingle("SELECT * FROM properties WHERE id = $entityId", true);
            break;
        
        // Weitere Entitäten hier implementieren...
        
        default:
            $db->close();
            throw new Exception('Ungültige Entität', 400);
    }
    
    $db->close();
    
    return [
        'success' => true,
        'message' => $message,
        'data' => $data
    ];
}

/**
 * Löscht eine Entität eines Produkts
 * 
 * @param int $productId - Die Produkt-ID
 * @param string $entity - Die Entität
 * @param int $entityId - Die Entitäts-ID
 * @return array - Die Antwort
 */
function deleteProductEntity($productId, $entity, $entityId) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Prüfe, ob das Produkt existiert
    $product = $db->querySingle("SELECT * FROM products WHERE id = $productId", true);
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    $message = '';
    
    switch ($entity) {
        case 'package-contents':
            // Prüfe, ob die Entität existiert
            $packageContent = $db->querySingle("SELECT * FROM package_contents WHERE id = $entityId AND product_id = $productId", true);
            if (!$packageContent) {
                $db->close();
                throw new Exception('Package Content nicht gefunden', 404);
            }
            
            $db->exec("DELETE FROM package_contents WHERE id = $entityId AND product_id = $productId");
            $message = 'Package Content erfolgreich gelöscht';
            break;
        
        case 'properties':
            // Prüfe, ob die Entität existiert
            $property = $db->querySingle("SELECT * FROM properties WHERE id = $entityId AND product_id = $productId", true);
            if (!$property) {
                $db->close();
                throw new Exception('Property nicht gefunden', 404);
            }
            
            $db->exec("DELETE FROM properties WHERE id = $entityId AND product_id = $productId");
            $message = 'Property erfolgreich gelöscht';
            break;
        
        // Weitere Entitäten hier implementieren...
        
        default:
            $db->close();
            throw new Exception('Ungültige Entität', 400);
    }
    
    $db->close();
    
    return [
        'success' => true,
        'message' => $message
    ];
}

/**
 * Ruft eine spezifische Entität eines Produkts ab
 * 
 * @param int $productId - Die Produkt-ID
 * @param string $entity - Die Entität
 * @param int $entityId - Die Entitäts-ID
 * @return array - Die Antwort
 */
function getProductEntityItem($productId, $entity, $entityId) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Prüfe, ob das Produkt existiert
    $product = $db->querySingle("SELECT * FROM products WHERE id = $productId", true);
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    $data = null;
    
    switch ($entity) {
        case 'package-contents':
            $data = $db->querySingle("SELECT * FROM package_contents WHERE id = $entityId AND product_id = $productId", true);
            break;
        
        case 'properties':
            $data = $db->querySingle("SELECT * FROM properties WHERE id = $entityId AND product_id = $productId", true);
            break;
        
        // Weitere Entitäten hier implementieren...
        
        default:
            $db->close();
            throw new Exception('Ungültige Entität', 400);
    }
    
    if (!$data) {
        $db->close();
        throw new Exception('Entität nicht gefunden', 404);
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $data
    ];
}

/**
 * Ruft alle Kategorien ab
 * 
 * @return array - Die Antwort
 */
function getAllCategories() {
    global $config;
    $db = openDatabase($config['db_path']);
    
    $result = $db->query('SELECT * FROM categories ORDER BY id');
    $categories = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $categories[] = $row;
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $categories
    ];
}

/**
 * Ruft alle Status-Typen ab
 * 
 * @return array - Die Antwort
 */
function getAllStatusTypes() {
    global $config;
    $db = openDatabase($config['db_path']);
    
    $result = $db->query('SELECT * FROM status_types ORDER BY id');
    $statusTypes = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $statusTypes[] = $row;
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $statusTypes
    ];
}

/**
 * Ruft alle Property-Typen ab
 * 
 * @return array - Die Antwort
 */
function getAllPropertyTypes() {
    global $config;
    $db = openDatabase($config['db_path']);
    
    $result = $db->query('SELECT * FROM property_types ORDER BY id');
    $propertyTypes = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $propertyTypes[] = $row;
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $propertyTypes
    ];
}

/**
 * Ruft alle Sprachen ab
 * 
 * @return array - Die Antwort
 */
function getAllLanguages() {
    global $config;
    $db = openDatabase($config['db_path']);
    
    $result = $db->query('SELECT * FROM languages ORDER BY id');
    $languages = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $languages[] = $row;
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $languages
    ];
}

/**
 * Ruft alle Packaging Logistics Felder ab
 * 
 * @return array - Die Antwort
 */
function getAllPackagingLogisticsFields() {
    global $config;
    $db = openDatabase($config['db_path']);
    
    $result = $db->query('SELECT * FROM packaging_logistics_fields ORDER BY id');
    $fields = [];
    
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $fields[] = $row;
    }
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $fields
    ];
}

/**
 * Führt die Benutzeranmeldung durch
 * 
 * @param array $data - Die Anmeldedaten
 * @return array - Die Antwort
 */
function login($data) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Validiere Pflichtfelder
    if (empty($data['username']) || empty($data['password'])) {
        $db->close();
        throw new Exception('Benutzername und Passwort sind Pflichtfelder', 400);
    }
    
    $username = SQLite3::escapeString($data['username']);
    $user = $db->querySingle("SELECT * FROM users WHERE username = '$username'", true);
    
    if (!$user || !password_verify($data['password'], $user['password'])) {
        $db->close();
        throw new Exception('Ungültige Anmeldedaten', 401);
    }
    
    // Erstelle eine Session
    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];
    
    $db->close();
    
    return [
        'success' => true,
        'message' => 'Anmeldung erfolgreich',
        'data' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role']
        ]
    ];
}

/**
 * Führt die Benutzerabmeldung durch
 * 
 * @return array - Die Antwort
 */
function logout() {
    // Beende die Session
    session_start();
    session_destroy();
    
    return [
        'success' => true,
        'message' => 'Abmeldung erfolgreich'
    ];
}

/**
 * Ruft den Systemstatus ab
 * 
 * @return array - Die Antwort
 */
function getSystemStatus() {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Zähle die Anzahl der Produkte
    $productCount = $db->querySingle("SELECT COUNT(*) FROM products");
    
    // Prüfe die Datenbankverbindung
    $dbStatus = $db ? 'OK' : 'Fehler';
    
    // Prüfe den Festplattenspeicher
    $diskFree = disk_free_space('/');
    $diskTotal = disk_total_space('/');
    $diskUsage = round(($diskTotal - $diskFree) / $diskTotal * 100, 2);
    
    // Prüfe die Systemauslastung
    $load = sys_getloadavg();
    
    $db->close();
    
    return [
        'success' => true,
        'data' => [
            'database' => $dbStatus,
            'product_count' => $productCount,
            'disk_usage' => $diskUsage . '%',
            'system_load' => $load[0],
            'php_version' => PHP_VERSION,
            'server_time' => date('Y-m-d H:i:s')
        ]
    ];
}

/**
 * Ruft die API-Version ab
 * 
 * @return array - Die Antwort
 */
function getApiVersion() {
    return [
        'success' => true,
        'data' => [
            'version' => '1.0.0',
            'name' => 'PIM System API',
            'description' => 'API für das Product Information Management System'
        ]
    ];
}

/**
 * Ruft den Lagerbestand aus SAP ab
 * 
 * @param int $productId - Die Produkt-ID
 * @return array - Die Antwort
 */
function getSapInventory($productId) {
    global $config;
    $db = openDatabase($config['db_path']);
    
    // Prüfe, ob das Produkt existiert
    $product = $db->querySingle("SELECT * FROM products WHERE id = $productId", true);
    if (!$product) {
        $db->close();
        throw new Exception('Produkt nicht gefunden', 404);
    }
    
    // Simuliere SAP-Daten
    $inventory = [
        'product_id' => $productId,
        'sku' => $product['sku'],
        'quantity' => rand(10, 1000),
        'location' => 'Warehouse ' . chr(rand(65, 90)),
        'last_updated' => date('Y-m-d H:i:s', time() - rand(0, 86400))
    ];
    
    $db->close();
    
    return [
        'success' => true,
        'data' => $inventory
    ];
}
