<?php
/**
 * PIM System - Database Interface
 * 
 * This file provides the interface between the frontend and the database.
 * It implements all CRUD operations for the PIM system.
 * Supports both SQLite and MySQL databases.
 */

class Database {
    private $db;
    private $lastError;
    private $dbType;

    /**
     * Constructor - establishes connection to the database
     * Tries MySQL first, then falls back to SQLite
     */
    public function __construct($dbPath = null) {
        if ($dbPath === null) {
            // Use database file in the bundled "database" directory by default
            $dbPath = __DIR__ . '/database/pim_database.sqlite';
        }
        // Try MySQL connection first
        try {
            $this->db = new PDO('mysql:host=localhost;dbname=pim_database;charset=utf8', 'root', 'MMindthe131!!');
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->dbType = 'mysql';
            return;
        } catch (PDOException $e) {
            // MySQL connection failed, try SQLite as fallback
            try {
                // Ensure directory exists
                $dir = dirname($dbPath);
                if (!file_exists($dir)) {
                    mkdir($dir, 0777, true);
                }

                $initialize = !file_exists($dbPath);
                $this->db = new PDO('sqlite:' . $dbPath);
                $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->db->exec('PRAGMA foreign_keys = ON;');

                // Initialize database if necessary
                $needInit = $initialize;
                if (!$needInit) {
                    $check = $this->db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")->fetch();
                    $needInit = !$check;
                }
                if ($needInit) {
                    $sqlFile = __DIR__ . '/create_database.sql';
                    if (file_exists($sqlFile)) {
                        $sql = file_get_contents($sqlFile);
                        $this->db->exec($sql);
                    }
                }

                $this->dbType = 'sqlite';
                return;
            } catch (PDOException $e2) {
                $this->lastError = $e2->getMessage();
                die("Database connection failed: " . $this->lastError);
            }
        }
    }

    /**
     * Get the last error message
     */
    public function getLastError() {
        return $this->lastError;
    }

    /**
     * Create a new product
     */
    public function createProduct($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO products (model, sku, ean, category_id, status_id, image_path)
                VALUES (:model, :sku, :ean, :category_id, :status_id, :image_path)
            ");
            
            $stmt->bindParam(':model', $data['model']);
            $stmt->bindParam(':sku', $data['sku']);
            $stmt->bindParam(':ean', $data['ean']);
            $stmt->bindParam(':category_id', $data['category_id']);
            $stmt->bindParam(':status_id', $data['status_id']);
            $stmt->bindParam(':image_path', $data['image_path']);
            
            $stmt->execute();
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get a product by ID
     */
    public function getProduct($productId) {
        try {
            $stmt = $this->db->prepare("
                SELECT p.*, c.name as category_name, s.name as status_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN status_types s ON p.status_id = s.status_id
                WHERE p.product_id = :product_id
            ");
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Update a product
     */
    public function updateProduct($productId, $data) {
        try {
            $stmt = $this->db->prepare("
                UPDATE products
                SET model = :model,
                    sku = :sku,
                    ean = :ean,
                    category_id = :category_id,
                    status_id = :status_id,
                    image_path = :image_path
                WHERE product_id = :product_id
            ");
            
            $stmt->bindParam(':model', $data['model']);
            $stmt->bindParam(':sku', $data['sku']);
            $stmt->bindParam(':ean', $data['ean']);
            $stmt->bindParam(':category_id', $data['category_id']);
            $stmt->bindParam(':status_id', $data['status_id']);
            $stmt->bindParam(':image_path', $data['image_path']);
            $stmt->bindParam(':product_id', $productId);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Delete a product
     */
    public function deleteProduct($productId) {
        try {
            $stmt = $this->db->prepare("DELETE FROM products WHERE product_id = :product_id");
            $stmt->bindParam(':product_id', $productId);
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Search products
     */
    public function searchProducts($searchTerm, $field = null) {
        try {
            $sql = "
                SELECT p.*, c.name as category_name, s.name as status_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN status_types s ON p.status_id = s.status_id
                WHERE 1=1
            ";
            
            $params = [];
            
            if ($field) {
                // Search in specific field
                $sql .= " AND p.$field LIKE :search_term";
                $params[':search_term'] = "%$searchTerm%";
            } else {
                // Search in all fields
                $sql .= " AND (p.model LIKE :search_term OR p.sku LIKE :search_term OR p.ean LIKE :search_term)";
                $params[':search_term'] = "%$searchTerm%";
            }
            
            $stmt = $this->db->prepare($sql);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get all products
     */
    public function getAllProducts() {
        try {
            $stmt = $this->db->prepare("
                SELECT p.*, c.name as category_name, s.name as status_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN status_types s ON p.status_id = s.status_id
                ORDER BY p.product_id DESC
            ");
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get package contents for a product
     */
    public function getPackageContents($productId) {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM package_contents
                WHERE product_id = :product_id
            ");
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Add package content item
     */
    public function addPackageContent($productId, $item, $quantity) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO package_contents (product_id, item, quantity)
                VALUES (:product_id, :item, :quantity)
            ");
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->bindParam(':item', $item);
            $stmt->bindParam(':quantity', $quantity);
            
            $stmt->execute();
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Update package content item
     */
    public function updatePackageContent($contentId, $item, $quantity) {
        try {
            $stmt = $this->db->prepare("
                UPDATE package_contents
                SET item = :item, quantity = :quantity
                WHERE content_id = :content_id
            ");
            
            $stmt->bindParam(':item', $item);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->bindParam(':content_id', $contentId);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Delete package content item
     */
    public function deletePackageContent($contentId) {
        try {
            $stmt = $this->db->prepare("
                DELETE FROM package_contents
                WHERE content_id = :content_id
            ");
            
            $stmt->bindParam(':content_id', $contentId);
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get properties for a product
     */
    public function getProperties($productId) {
        try {
            $stmt = $this->db->prepare("
                SELECT p.*, pt.name as property_name, pt.unit
                FROM properties p
                JOIN property_types pt ON p.property_type_id = pt.property_type_id
                WHERE p.product_id = :product_id
            ");
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Add property
     */
    public function addProperty($productId, $propertyTypeId, $value) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO properties (product_id, property_type_id, value)
                VALUES (:product_id, :property_type_id, :value)
            ");
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->bindParam(':property_type_id', $propertyTypeId);
            $stmt->bindParam(':value', $value);
            
            $stmt->execute();
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Update property
     */
    public function updateProperty($propertyId, $value) {
        try {
            $stmt = $this->db->prepare("
                UPDATE properties
                SET value = :value
                WHERE property_id = :property_id
            ");
            
            $stmt->bindParam(':value', $value);
            $stmt->bindParam(':property_id', $propertyId);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Delete property
     */
    public function deleteProperty($propertyId) {
        try {
            $stmt = $this->db->prepare("
                DELETE FROM properties
                WHERE property_id = :property_id
            ");
            
            $stmt->bindParam(':property_id', $propertyId);
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get packaging logistics data for a product
     */
    public function getPackagingLogistics($productId) {
        try {
            $stmt = $this->db->prepare("
                SELECT pl.*, pf.name, pf.data_type, pf.unit
                FROM packaging_logistics pl
                JOIN packaging_fields pf ON pl.field_id = pf.field_id
                WHERE pl.product_id = :product_id
            ");
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Add packaging logistics field value
     */
    public function addPackagingLogistics($productId, $fieldId, $value) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO packaging_logistics (product_id, field_id, value)
                VALUES (:product_id, :field_id, :value)
            ");
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->bindParam(':field_id', $fieldId);
            $stmt->bindParam(':value', $value);
            
            $stmt->execute();
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Update packaging logistics field value
     */
    public function updatePackagingLogistics($logisticsId, $value) {
        try {
            $stmt = $this->db->prepare("
                UPDATE packaging_logistics
                SET value = :value
                WHERE logistics_id = :logistics_id
            ");
            
            $stmt->bindParam(':value', $value);
            $stmt->bindParam(':logistics_id', $logisticsId);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Delete packaging logistics field value
     */
    public function deletePackagingLogistics($logisticsId) {
        try {
            $stmt = $this->db->prepare("
                DELETE FROM packaging_logistics
                WHERE logistics_id = :logistics_id
            ");
            
            $stmt->bindParam(':logistics_id', $logisticsId);
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Add new packaging field
     */
    public function addPackagingField($name, $dataType, $unit = null) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO packaging_fields (name, data_type, unit, is_system)
                VALUES (:name, :data_type, :unit, 0)
            ");
            
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':data_type', $dataType);
            $stmt->bindParam(':unit', $unit);
            
            $stmt->execute();
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Update packaging field
     */
    public function updatePackagingField($fieldId, $name, $dataType, $unit = null) {
        try {
            $stmt = $this->db->prepare("
                UPDATE packaging_fields
                SET name = :name, data_type = :data_type, unit = :unit
                WHERE field_id = :field_id AND is_system = 0
            ");
            
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':data_type', $dataType);
            $stmt->bindParam(':unit', $unit);
            $stmt->bindParam(':field_id', $fieldId);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Delete packaging field
     */
    public function deletePackagingField($fieldId) {
        try {
            $stmt = $this->db->prepare("
                DELETE FROM packaging_fields
                WHERE field_id = :field_id AND is_system = 0
            ");
            
            $stmt->bindParam(':field_id', $fieldId);
            return $stmt->execute();
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get all packaging fields
     */
    public function getAllPackagingFields() {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM packaging_fields
                ORDER BY is_system DESC, name ASC
            ");
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get all categories
     */
    public function getAllCategories() {
        try {
            $stmt = $this->db->prepare("
                SELECT c1.*, c2.name as parent_name
                FROM categories c1
                LEFT JOIN categories c2 ON c1.parent_id = c2.category_id
                ORDER BY c1.name ASC
            ");
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get all status types
     */
    public function getAllStatusTypes() {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM status_types
                ORDER BY name ASC
            ");
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Get all property types
     */
    public function getAllPropertyTypes() {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM property_types
                ORDER BY name ASC
            ");
            
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }

    /**
     * Calculate completion percentage for a product
     */
    public function calculateCompletionPercentage($productId) {
        try {
            // Get total number of possible fields
            $totalFields = 5; // Base fields: model, sku, ean, category, status
            
            // Count filled base fields
            $stmt = $this->db->prepare("
                SELECT 
                    (CASE WHEN model != '' THEN 1 ELSE 0 END) +
                    (CASE WHEN sku != '' THEN 1 ELSE 0 END) +
                    (CASE WHEN ean != '' THEN 1 ELSE 0 END) +
                    (CASE WHEN category_id IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN status_id IS NOT NULL THEN 1 ELSE 0 END) as filled_base_fields,
                    (CASE WHEN image_path IS NOT NULL THEN 1 ELSE 0 END) as has_image
                FROM products
                WHERE product_id = :product_id
            ");
            
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            $baseResult = $stmt->fetch(PDO::FETCH_ASSOC);
            $filledBaseFields = $baseResult['filled_base_fields'];
            $hasImage = $baseResult['has_image'];
            
            // Count package contents
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count FROM package_contents
                WHERE product_id = :product_id
            ");
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            $packageContentsCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Count properties
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count FROM properties
                WHERE product_id = :product_id
            ");
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            $propertiesCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Count packaging logistics
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count FROM packaging_logistics
                WHERE product_id = :product_id
            ");
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            $packagingLogisticsCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Add additional fields to total
            $totalFields += 1; // Image
            $totalFields += ($packageContentsCount > 0) ? $packageContentsCount : 1;
            $totalFields += ($propertiesCount > 0) ? $propertiesCount : 1;
            $totalFields += ($packagingLogisticsCount > 0) ? $packagingLogisticsCount : 1;
            
            // Calculate filled fields
            $filledFields = $filledBaseFields + ($hasImage ? 1 : 0) + $packageContentsCount + $propertiesCount + $packagingLogisticsCount;
            
            // Calculate percentage
            $percentage = round(($filledFields / $totalFields) * 100);
            
            // Update product
            $stmt = $this->db->prepare("
                UPDATE products
                SET completion_percentage = :percentage
                WHERE product_id = :product_id
            ");
            
            $stmt->bindParam(':percentage', $percentage);
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();
            
            return $percentage;
        } catch (PDOException $e) {
            $this->lastError = $e->getMessage();
            return false;
        }
    }
}

/**
 * API endpoint handler
 */
if (isset($_GET['action'])) {
    header('Content-Type: application/json');
    $db = new Database();
    $response = ['success' => false, 'message' => '', 'data' => null];
    
    switch ($_GET['action']) {
        case 'get_product':
            if (isset($_GET['id'])) {
                $product = $db->getProduct($_GET['id']);
                if ($product) {
                    $response['success'] = true;
                    $response['data'] = $product;
                } else {
                    $response['message'] = 'Product not found or ' . $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing product ID';
            }
            break;
            
        case 'get_all_products':
            $products = $db->getAllProducts();
            if ($products !== false) {
                $response['success'] = true;
                $response['data'] = $products;
            } else {
                $response['message'] = $db->getLastError();
            }
            break;
            
        case 'search_products':
            if (isset($_GET['term'])) {
                $field = isset($_GET['field']) ? $_GET['field'] : null;
                $products = $db->searchProducts($_GET['term'], $field);
                if ($products !== false) {
                    $response['success'] = true;
                    $response['data'] = $products;
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing search term';
            }
            break;
            
        case 'get_package_contents':
            if (isset($_GET['product_id'])) {
                $contents = $db->getPackageContents($_GET['product_id']);
                if ($contents !== false) {
                    $response['success'] = true;
                    $response['data'] = $contents;
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing product ID';
            }
            break;
            
        case 'get_properties':
            if (isset($_GET['product_id'])) {
                $properties = $db->getProperties($_GET['product_id']);
                if ($properties !== false) {
                    $response['success'] = true;
                    $response['data'] = $properties;
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing product ID';
            }
            break;
            
        case 'get_packaging_logistics':
            if (isset($_GET['product_id'])) {
                $logistics = $db->getPackagingLogistics($_GET['product_id']);
                if ($logistics !== false) {
                    $response['success'] = true;
                    $response['data'] = $logistics;
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing product ID';
            }
            break;
            
        case 'get_all_categories':
            $categories = $db->getAllCategories();
            if ($categories !== false) {
                $response['success'] = true;
                $response['data'] = $categories;
            } else {
                $response['message'] = $db->getLastError();
            }
            break;
            
        case 'get_all_status_types':
            $statusTypes = $db->getAllStatusTypes();
            if ($statusTypes !== false) {
                $response['success'] = true;
                $response['data'] = $statusTypes;
            } else {
                $response['message'] = $db->getLastError();
            }
            break;
            
        case 'get_all_property_types':
            $propertyTypes = $db->getAllPropertyTypes();
            if ($propertyTypes !== false) {
                $response['success'] = true;
                $response['data'] = $propertyTypes;
            } else {
                $response['message'] = $db->getLastError();
            }
            break;
            
        case 'get_all_packaging_fields':
            $packagingFields = $db->getAllPackagingFields();
            if ($packagingFields !== false) {
                $response['success'] = true;
                $response['data'] = $packagingFields;
            } else {
                $response['message'] = $db->getLastError();
            }
            break;
            
        default:
            $response['message'] = 'Unknown action';
    }
    
    echo json_encode($response);
    exit;
}

/**
 * POST request handler for create/update/delete operations
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    $db = new Database();
    $response = ['success' => false, 'message' => '', 'data' => null];
    
    switch ($_POST['action']) {
        case 'create_product':
            $requiredFields = ['model', 'sku'];
            $missingFields = [];
            
            foreach ($requiredFields as $field) {
                if (!isset($_POST[$field]) || empty($_POST[$field])) {
                    $missingFields[] = $field;
                }
            }
            
            if (empty($missingFields)) {
                $data = [
                    'model' => $_POST['model'],
                    'sku' => $_POST['sku'],
                    'ean' => isset($_POST['ean']) ? $_POST['ean'] : null,
                    'category_id' => isset($_POST['category_id']) ? $_POST['category_id'] : null,
                    'status_id' => isset($_POST['status_id']) ? $_POST['status_id'] : null,
                    'image_path' => isset($_POST['image_path']) ? $_POST['image_path'] : null
                ];
                
                $productId = $db->createProduct($data);
                if ($productId) {
                    $response['success'] = true;
                    $response['data'] = ['product_id' => $productId];
                    $response['message'] = 'Product created successfully';
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields: ' . implode(', ', $missingFields);
            }
            break;
            
        case 'update_product':
            if (isset($_POST['product_id'])) {
                $data = [
                    'model' => $_POST['model'],
                    'sku' => $_POST['sku'],
                    'ean' => isset($_POST['ean']) ? $_POST['ean'] : null,
                    'category_id' => isset($_POST['category_id']) ? $_POST['category_id'] : null,
                    'status_id' => isset($_POST['status_id']) ? $_POST['status_id'] : null,
                    'image_path' => isset($_POST['image_path']) ? $_POST['image_path'] : null
                ];
                
                $result = $db->updateProduct($_POST['product_id'], $data);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Product updated successfully';
                    
                    // Recalculate completion percentage
                    $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                    $response['data'] = ['completion_percentage' => $percentage];
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing product ID';
            }
            break;
            
        case 'delete_product':
            if (isset($_POST['product_id'])) {
                $result = $db->deleteProduct($_POST['product_id']);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Product deleted successfully';
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing product ID';
            }
            break;
            
        case 'add_package_content':
            if (isset($_POST['product_id']) && isset($_POST['item']) && isset($_POST['quantity'])) {
                $contentId = $db->addPackageContent($_POST['product_id'], $_POST['item'], $_POST['quantity']);
                if ($contentId) {
                    $response['success'] = true;
                    $response['data'] = ['content_id' => $contentId];
                    $response['message'] = 'Package content added successfully';
                    
                    // Recalculate completion percentage
                    $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                    $response['data']['completion_percentage'] = $percentage;
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields';
            }
            break;
            
        case 'update_package_content':
            if (isset($_POST['content_id']) && isset($_POST['item']) && isset($_POST['quantity'])) {
                $result = $db->updatePackageContent($_POST['content_id'], $_POST['item'], $_POST['quantity']);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Package content updated successfully';
                    
                    // Recalculate completion percentage if product_id is provided
                    if (isset($_POST['product_id'])) {
                        $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                        $response['data'] = ['completion_percentage' => $percentage];
                    }
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields';
            }
            break;
            
        case 'delete_package_content':
            if (isset($_POST['content_id'])) {
                $result = $db->deletePackageContent($_POST['content_id']);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Package content deleted successfully';
                    
                    // Recalculate completion percentage if product_id is provided
                    if (isset($_POST['product_id'])) {
                        $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                        $response['data'] = ['completion_percentage' => $percentage];
                    }
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing content ID';
            }
            break;
            
        case 'add_property':
            if (isset($_POST['product_id']) && isset($_POST['property_type_id']) && isset($_POST['value'])) {
                $propertyId = $db->addProperty($_POST['product_id'], $_POST['property_type_id'], $_POST['value']);
                if ($propertyId) {
                    $response['success'] = true;
                    $response['data'] = ['property_id' => $propertyId];
                    $response['message'] = 'Property added successfully';
                    
                    // Recalculate completion percentage
                    $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                    $response['data']['completion_percentage'] = $percentage;
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields';
            }
            break;
            
        case 'update_property':
            if (isset($_POST['property_id']) && isset($_POST['value'])) {
                $result = $db->updateProperty($_POST['property_id'], $_POST['value']);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Property updated successfully';
                    
                    // Recalculate completion percentage if product_id is provided
                    if (isset($_POST['product_id'])) {
                        $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                        $response['data'] = ['completion_percentage' => $percentage];
                    }
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields';
            }
            break;
            
        case 'delete_property':
            if (isset($_POST['property_id'])) {
                $result = $db->deleteProperty($_POST['property_id']);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Property deleted successfully';
                    
                    // Recalculate completion percentage if product_id is provided
                    if (isset($_POST['product_id'])) {
                        $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                        $response['data'] = ['completion_percentage' => $percentage];
                    }
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing property ID';
            }
            break;
            
        case 'add_packaging_logistics':
            if (isset($_POST['product_id']) && isset($_POST['field_id']) && isset($_POST['value'])) {
                $logisticsId = $db->addPackagingLogistics($_POST['product_id'], $_POST['field_id'], $_POST['value']);
                if ($logisticsId) {
                    $response['success'] = true;
                    $response['data'] = ['logistics_id' => $logisticsId];
                    $response['message'] = 'Packaging logistics added successfully';
                    
                    // Recalculate completion percentage
                    $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                    $response['data']['completion_percentage'] = $percentage;
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields';
            }
            break;
            
        case 'update_packaging_logistics':
            if (isset($_POST['logistics_id']) && isset($_POST['value'])) {
                $result = $db->updatePackagingLogistics($_POST['logistics_id'], $_POST['value']);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Packaging logistics updated successfully';
                    
                    // Recalculate completion percentage if product_id is provided
                    if (isset($_POST['product_id'])) {
                        $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                        $response['data'] = ['completion_percentage' => $percentage];
                    }
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields';
            }
            break;
            
        case 'delete_packaging_logistics':
            if (isset($_POST['logistics_id'])) {
                $result = $db->deletePackagingLogistics($_POST['logistics_id']);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Packaging logistics deleted successfully';
                    
                    // Recalculate completion percentage if product_id is provided
                    if (isset($_POST['product_id'])) {
                        $percentage = $db->calculateCompletionPercentage($_POST['product_id']);
                        $response['data'] = ['completion_percentage' => $percentage];
                    }
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing logistics ID';
            }
            break;
            
        case 'add_packaging_field':
            if (isset($_POST['name']) && isset($_POST['data_type'])) {
                $unit = isset($_POST['unit']) ? $_POST['unit'] : null;
                $fieldId = $db->addPackagingField($_POST['name'], $_POST['data_type'], $unit);
                if ($fieldId) {
                    $response['success'] = true;
                    $response['data'] = ['field_id' => $fieldId];
                    $response['message'] = 'Packaging field added successfully';
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields';
            }
            break;
            
        case 'update_packaging_field':
            if (isset($_POST['field_id']) && isset($_POST['name']) && isset($_POST['data_type'])) {
                $unit = isset($_POST['unit']) ? $_POST['unit'] : null;
                $result = $db->updatePackagingField($_POST['field_id'], $_POST['name'], $_POST['data_type'], $unit);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Packaging field updated successfully';
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing required fields';
            }
            break;
            
        case 'delete_packaging_field':
            if (isset($_POST['field_id'])) {
                $result = $db->deletePackagingField($_POST['field_id']);
                if ($result) {
                    $response['success'] = true;
                    $response['message'] = 'Packaging field deleted successfully';
                } else {
                    $response['message'] = $db->getLastError();
                }
            } else {
                $response['message'] = 'Missing field ID';
            }
            break;
            
        default:
            $response['message'] = 'Unknown action';
    }
    
    echo json_encode($response);
    exit;
}
