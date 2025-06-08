-- PIM System - SQLite Datenbank-Erstellungsskript

-- Haupttabellen
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id INTEGER,
    description TEXT,
    FOREIGN KEY (parent_id) REFERENCES categories(category_id)
);

CREATE TABLE status_types (
    status_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id INTEGER PRIMARY KEY,
    model TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    ean TEXT,
    category_id INTEGER,
    status_id INTEGER,
    image_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_percentage INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (status_id) REFERENCES status_types(status_id)
);

-- Tab-bezogene Tabellen
CREATE TABLE package_contents (
    content_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE property_types (
    property_type_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    unit TEXT
);

CREATE TABLE properties (
    property_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    property_type_id INTEGER,
    value TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (property_type_id) REFERENCES property_types(property_type_id)
);

CREATE TABLE languages (
    language_id INTEGER PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE product_languages (
    product_language_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    language_id INTEGER,
    translation_status TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (language_id) REFERENCES languages(language_id)
);

CREATE TABLE product_status_history (
    status_history_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    status_id INTEGER,
    date DATE NOT NULL,
    notes TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (status_id) REFERENCES status_types(status_id)
);

CREATE TABLE packaging_fields (
    field_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    data_type TEXT NOT NULL,
    unit TEXT,
    is_system BOOLEAN DEFAULT 0
);

CREATE TABLE packaging_logistics (
    logistics_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    field_id INTEGER,
    value TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (field_id) REFERENCES packaging_fields(field_id)
);

CREATE TABLE address_types (
    address_type_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE addresses (
    address_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    address_type_id INTEGER,
    company TEXT NOT NULL,
    street TEXT,
    city TEXT NOT NULL,
    postal_code TEXT,
    country TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (address_type_id) REFERENCES address_types(address_type_id)
);

CREATE TABLE category_relations (
    relation_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    main_category_id INTEGER,
    sub_category_id INTEGER,
    description TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (main_category_id) REFERENCES categories(category_id),
    FOREIGN KEY (sub_category_id) REFERENCES categories(category_id)
);

CREATE TABLE compatibility_types (
    compatibility_type_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE compatible_products (
    compatible_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    compatible_product_id INTEGER,
    compatibility_type_id INTEGER,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (compatible_product_id) REFERENCES products(product_id),
    FOREIGN KEY (compatibility_type_id) REFERENCES compatibility_types(compatibility_type_id)
);

CREATE TABLE serial_ranges (
    range_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    range_start TEXT NOT NULL,
    range_end TEXT NOT NULL,
    batch TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE identifiers (
    identifier_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    type TEXT NOT NULL,
    range_start TEXT NOT NULL,
    range_end TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE software_types (
    software_type_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE software (
    software_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    software_type_id INTEGER,
    version TEXT NOT NULL,
    release_date DATE,
    download_url TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (software_type_id) REFERENCES software_types(software_type_id)
);

CREATE TABLE manual_types (
    manual_type_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE manuals (
    manual_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    manual_type_id INTEGER,
    language_id INTEGER,
    version TEXT NOT NULL,
    file_path TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (manual_type_id) REFERENCES manual_types(manual_type_id),
    FOREIGN KEY (language_id) REFERENCES languages(language_id)
);

CREATE TABLE accessory_types (
    accessory_type_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE accessories (
    accessory_id INTEGER PRIMARY KEY,
    product_id INTEGER,
    accessory_product_id INTEGER,
    accessory_type_id INTEGER,
    compatibility TEXT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (accessory_product_id) REFERENCES products(product_id),
    FOREIGN KEY (accessory_type_id) REFERENCES accessory_types(accessory_type_id)
);

-- Indizes für bessere Leistung
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_ean ON products(ean);
CREATE INDEX idx_products_model ON products(model);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status_id);
CREATE INDEX idx_package_contents_product ON package_contents(product_id);
CREATE INDEX idx_properties_product ON properties(product_id);
CREATE INDEX idx_properties_type ON properties(property_type_id);
CREATE INDEX idx_product_languages_product ON product_languages(product_id);
CREATE INDEX idx_product_languages_language ON product_languages(language_id);
CREATE INDEX idx_product_status_history_product ON product_status_history(product_id);
CREATE INDEX idx_packaging_logistics_product ON packaging_logistics(product_id);
CREATE INDEX idx_packaging_logistics_field ON packaging_logistics(field_id);
CREATE INDEX idx_addresses_product ON addresses(product_id);
CREATE INDEX idx_category_relations_product ON category_relations(product_id);
CREATE INDEX idx_compatible_products_product ON compatible_products(product_id);
CREATE INDEX idx_serial_ranges_product ON serial_ranges(product_id);
CREATE INDEX idx_identifiers_product ON identifiers(product_id);
CREATE INDEX idx_software_product ON software(product_id);
CREATE INDEX idx_manuals_product ON manuals(product_id);
CREATE INDEX idx_accessories_product ON accessories(product_id);

-- Trigger für automatische Aktualisierung von updated_at
CREATE TRIGGER update_products_timestamp
AFTER UPDATE ON products
BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE product_id = NEW.product_id;
END;

-- Basisdaten für Lookup-Tabellen
-- Status-Typen
INSERT INTO status_types (name, description) VALUES 
('Active', 'Product is currently active'),
('In Development', 'Product is in development phase'),
('End of Life', 'Product has reached end of life'),
('Deleted', 'Product has been deleted');

-- Sprachen
INSERT INTO languages (code, name) VALUES 
('EN', 'English'),
('DE', 'German'),
('FR', 'French'),
('ES', 'Spanish'),
('IT', 'Italian');

-- Adresstypen
INSERT INTO address_types (name) VALUES 
('Manufacturer'),
('Distributor'),
('Service Center'),
('Headquarters');

-- Kompatibilitätstypen
INSERT INTO compatibility_types (name) VALUES 
('Accessory For'),
('Works With'),
('Compatible With'),
('Replacement For');

-- Softwaretypen
INSERT INTO software_types (name) VALUES 
('Firmware'),
('Driver'),
('Application'),
('Utility');

-- Handbuchtypen
INSERT INTO manual_types (name) VALUES 
('User Guide'),
('Quick Start'),
('Technical Manual'),
('Service Manual');

-- Zubehörtypen
INSERT INTO accessory_types (name) VALUES 
('Case'),
('Display'),
('Power'),
('Cable'),
('Adapter');

-- Standard-Packaging-Felder
INSERT INTO packaging_fields (name, data_type, unit, is_system) VALUES 
('Length', 'number', 'cm', 1),
('Width', 'number', 'cm', 1),
('Height', 'number', 'cm', 1),
('Weight', 'number', 'g', 1),
('Packaging Material', 'text', NULL, 1);

-- Eigenschaftstypen
INSERT INTO property_types (name, data_type, unit) VALUES 
('Processor', 'text', NULL),
('RAM', 'number', 'GB'),
('Storage', 'number', 'GB'),
('Display Size', 'number', 'inch'),
('Battery Capacity', 'number', 'mAh'),
('Operating System', 'text', NULL),
('Connectivity', 'text', NULL),
('Color', 'text', NULL);
