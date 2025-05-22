# PIM System - API Endpoints

## Übersicht der benötigten Backend-Endpunkte

Dieses Dokument definiert alle API-Endpunkte, die für die vollständige Funktionalität des PIM-Systems benötigt werden.

## Produkt-Endpunkte

### 1. Produkt-Hauptdaten

- **GET /api/products** - Alle Produkte abrufen
- **GET /api/products/{id}** - Ein bestimmtes Produkt abrufen
- **GET /api/products/search/{term}** - Produkte nach Suchbegriff suchen
- **POST /api/products** - Neues Produkt erstellen
- **PUT /api/products/{id}** - Produkt aktualisieren
- **DELETE /api/products/{id}** - Produkt löschen

### 2. Package Contents

- **GET /api/products/{id}/package-contents** - Package Contents für ein Produkt abrufen
- **POST /api/products/{id}/package-contents** - Package Content-Element hinzufügen
- **PUT /api/products/{id}/package-contents/{contentId}** - Package Content-Element aktualisieren
- **DELETE /api/products/{id}/package-contents/{contentId}** - Package Content-Element löschen

## Tab-Endpunkte

### 1. Properties (Technische Eigenschaften)

- **GET /api/properties** - Alle Properties abrufen (unabhängig vom Produkt)
- **GET /api/products/{id}/properties** - Properties für ein bestimmtes Produkt abrufen
- **POST /api/products/{id}/properties** - Property zu einem Produkt hinzufügen
- **PUT /api/products/{id}/properties/{propertyId}** - Property aktualisieren
- **DELETE /api/products/{id}/properties/{propertyId}** - Property löschen
- **GET /api/property-types** - Alle Property-Typen abrufen
- **POST /api/property-types** - Neuen Property-Typ erstellen
- **PUT /api/property-types/{id}** - Property-Typ aktualisieren
- **DELETE /api/property-types/{id}** - Property-Typ löschen

### 2. Languages (Sprachen)

- **GET /api/products/{id}/languages** - Sprachdaten für ein Produkt abrufen
- **POST /api/products/{id}/languages** - Sprachdaten zu einem Produkt hinzufügen
- **PUT /api/products/{id}/languages/{languageId}** - Sprachdaten aktualisieren
- **DELETE /api/products/{id}/languages/{languageId}** - Sprachdaten löschen
- **GET /api/languages** - Alle verfügbaren Sprachen abrufen

### 3. Status

- **GET /api/products/{id}/status-history** - Statusverlauf für ein Produkt abrufen
- **POST /api/products/{id}/status-history** - Neuen Status zum Verlauf hinzufügen
- **GET /api/status-types** - Alle Status-Typen abrufen
- **POST /api/status-types** - Neuen Status-Typ erstellen
- **PUT /api/status-types/{id}** - Status-Typ aktualisieren
- **DELETE /api/status-types/{id}** - Status-Typ löschen

### 4. Packaging Logistics (Dynamische Felder)

- **GET /api/products/{id}/packaging-logistics** - Packaging Logistics für ein Produkt abrufen
- **POST /api/products/{id}/packaging-logistics** - Neues Packaging Logistics-Feld hinzufügen
- **PUT /api/products/{id}/packaging-logistics/{fieldId}** - Packaging Logistics-Feld aktualisieren
- **DELETE /api/products/{id}/packaging-logistics/{fieldId}** - Packaging Logistics-Feld löschen
- **GET /api/packaging-logistics/fields** - Alle verfügbaren Packaging Logistics-Feldtypen abrufen
- **POST /api/packaging-logistics/fields** - Neuen Feldtyp erstellen
- **PUT /api/packaging-logistics/fields/{id}** - Feldtyp aktualisieren
- **DELETE /api/packaging-logistics/fields/{id}** - Feldtyp löschen

### 5. Address

- **GET /api/products/{id}/addresses** - Adressen für ein Produkt abrufen
- **POST /api/products/{id}/addresses** - Adresse zu einem Produkt hinzufügen
- **PUT /api/products/{id}/addresses/{addressId}** - Adresse aktualisieren
- **DELETE /api/products/{id}/addresses/{addressId}** - Adresse löschen
- **GET /api/addresses** - Alle Adressen abrufen (unabhängig vom Produkt)

### 6. Category

- **GET /api/categories** - Alle Kategorien abrufen
- **POST /api/categories** - Neue Kategorie erstellen
- **PUT /api/categories/{id}** - Kategorie aktualisieren
- **DELETE /api/categories/{id}** - Kategorie löschen
- **GET /api/products/{id}/categories** - Kategorien für ein Produkt abrufen
- **POST /api/products/{id}/categories/{categoryId}** - Kategorie zu einem Produkt hinzufügen
- **DELETE /api/products/{id}/categories/{categoryId}** - Kategorie von einem Produkt entfernen

### 7. Compatible

- **GET /api/products/{id}/compatible** - Kompatible Produkte abrufen
- **POST /api/products/{id}/compatible/{compatibleId}** - Kompatibles Produkt hinzufügen
- **DELETE /api/products/{id}/compatible/{compatibleId}** - Kompatibles Produkt entfernen

### 8. Serial No.

- **GET /api/products/{id}/serial-numbers** - Seriennummern für ein Produkt abrufen
- **POST /api/products/{id}/serial-numbers** - Seriennummer zu einem Produkt hinzufügen
- **PUT /api/products/{id}/serial-numbers/{serialId}** - Seriennummer aktualisieren
- **DELETE /api/products/{id}/serial-numbers/{serialId}** - Seriennummer löschen

### 9. IMEI/MAC

- **GET /api/products/{id}/imei-mac** - IMEI/MAC-Adressen für ein Produkt abrufen
- **POST /api/products/{id}/imei-mac** - IMEI/MAC-Adresse zu einem Produkt hinzufügen
- **PUT /api/products/{id}/imei-mac/{imeiMacId}** - IMEI/MAC-Adresse aktualisieren
- **DELETE /api/products/{id}/imei-mac/{imeiMacId}** - IMEI/MAC-Adresse löschen

### 10. Software

- **GET /api/products/{id}/software** - Software für ein Produkt abrufen
- **POST /api/products/{id}/software** - Software zu einem Produkt hinzufügen
- **PUT /api/products/{id}/software/{softwareId}** - Software aktualisieren
- **DELETE /api/products/{id}/software/{softwareId}** - Software löschen

### 11. User Manuals

- **GET /api/products/{id}/manuals** - Benutzerhandbücher für ein Produkt abrufen
- **POST /api/products/{id}/manuals** - Benutzerhandbuch zu einem Produkt hinzufügen
- **PUT /api/products/{id}/manuals/{manualId}** - Benutzerhandbuch aktualisieren
- **DELETE /api/products/{id}/manuals/{manualId}** - Benutzerhandbuch löschen

### 12. Accessories

- **GET /api/products/{id}/accessories** - Zubehör für ein Produkt abrufen
- **POST /api/products/{id}/accessories/{accessoryId}** - Zubehör zu einem Produkt hinzufügen
- **DELETE /api/products/{id}/accessories/{accessoryId}** - Zubehör von einem Produkt entfernen

## Verwaltungs-Endpunkte

### 1. Benutzer und Authentifizierung

- **POST /api/auth/login** - Benutzeranmeldung
- **POST /api/auth/logout** - Benutzerabmeldung
- **GET /api/users** - Alle Benutzer abrufen
- **POST /api/users** - Neuen Benutzer erstellen
- **PUT /api/users/{id}** - Benutzer aktualisieren
- **DELETE /api/users/{id}** - Benutzer löschen

### 2. Fortschrittsanzeige

- **GET /api/products/{id}/completion** - Füllstand der Produktdaten abrufen

### 3. SAP-Schnittstelle

- **GET /api/sap/inventory/{productId}** - Lagerbestand aus SAP abrufen

## Allgemeine Endpunkte

- **GET /api/system/status** - Systemstatus abrufen
- **GET /api/system/version** - API-Version abrufen
