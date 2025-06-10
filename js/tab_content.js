// Implementiere die restlichen Tabs für die Untertabellen

// Address Tab - Refactored to Table View
const addressTab = document.getElementById('address-tab');
if (addressTab) addressTab.innerHTML = `
    <h3>Address Management</h3>
    <p>Manage address information for this product.</p>
    <div class="address-container">
        <div class="table-toolbar">
            <button id="btn-add-address" class="btn"><i class="fas fa-plus"></i> Add Address</button>
            <button id="btn-manage-addresses" class="btn"><i class="fas fa-cog"></i> Manage Addresses</button>
        </div>
        <div class="table-container">
            <table id="address-table" class="data-table">
                <thead>
                    <tr>
                        <th>Address Type</th>
                        <th>Company Name</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Contact Person</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Manufacturer</td>
                        <td>TechCorp Inc.</td>
                        <td>San Francisco</td>
                        <td>USA</td>
                        <td>John Smith</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Distributor</td>
                        <td>Global Distribution Ltd.</td>
                        <td>London</td>
                        <td>UK</td>
                        <td>Emma Johnson</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Service Center</td>
                        <td>Tech Support GmbH</td>
                        <td>Berlin</td>
                        <td>Germany</td>
                        <td>Hans Mueller</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// Category Tab - Refactored to Table View
const categoryTab = document.getElementById('category-tab');
if (categoryTab) categoryTab.innerHTML = `
    <h3>Category Management</h3>
    <p>Manage product categories and subcategories.</p>
    <div class="category-container">
        <div class="table-toolbar">
            <button id="btn-add-category" class="btn"><i class="fas fa-plus"></i> Add Category</button>
            <button id="btn-manage-categories" class="btn"><i class="fas fa-cog"></i> Manage Categories</button>
        </div>
        <div class="table-container">
            <table id="category-table" class="data-table">
                <thead>
                    <tr>
                        <th>Main Category</th>
                        <th>Sub Category</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Modem</td>
                        <td>DSL Modem</td>
                        <td>High-speed DSL modems for home use</td>
                        <td>Active</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Router</td>
                        <td>Wireless Router</td>
                        <td>Wi-Fi 6 compatible routers</td>
                        <td>Active</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Smartphone</td>
                        <td>Android Phone</td>
                        <td>Latest Android smartphones</td>
                        <td>Active</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// Packaging Logistics Tab - Refactored to Table View
const packagingTab = document.getElementById('packaging-tab');
if (packagingTab) packagingTab.innerHTML = `
    <h3>Packaging Logistics</h3>
    <p>Manage packaging and logistics information for this product.</p>
    <div class="packaging-container">
        <div class="table-toolbar">
            <button id="btn-add-packaging" class="btn"><i class="fas fa-plus"></i> Add Packaging Info</button>
            <button id="btn-manage-packaging" class="btn"><i class="fas fa-cog"></i> Manage Packaging Types</button>
        </div>
        <div class="table-container">
            <table id="packaging-table" class="data-table">
                <thead>
                    <tr>
                        <th>Package Type</th>
                        <th>Dimensions (cm)</th>
                        <th>Weight (kg)</th>
                        <th>Units per Carton</th>
                        <th>Barcode</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Retail Box</td>
                        <td>20 x 15 x 5</td>
                        <td>0.5</td>
                        <td>1</td>
                        <td>978020137962</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Master Carton</td>
                        <td>60 x 45 x 30</td>
                        <td>6.0</td>
                        <td>12</td>
                        <td>978020137979</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Pallet</td>
                        <td>120 x 80 x 150</td>
                        <td>150.0</td>
                        <td>300</td>
                        <td>978020137986</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// Compatible Tab
const compatibleTab = document.getElementById('compatible-tab');
if (compatibleTab) compatibleTab.innerHTML = `
    <h3>Compatibility Management</h3>
    <p>Manage compatible products and accessories.</p>
    <div class="compatible-container">
        <div class="table-toolbar">
            <button id="btn-add-compatible" class="btn"><i class="fas fa-plus"></i> Add Compatible Product</button>
            <button id="btn-manage-compatibility" class="btn"><i class="fas fa-cog"></i> Manage Compatibility Types</button>
        </div>
        <div class="table-container">
            <table id="compatible-table" class="data-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Type</th>
                        <th>SKU</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Power Adapter XYZ</td>
                        <td>Accessory For</td>
                        <td>ACC-PA-001</td>
                        <td>Standard power adapter</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Battery Pack 2000mAh</td>
                        <td>Accessory For</td>
                        <td>ACC-BP-002</td>
                        <td>Extended battery</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Charging Cable Type-C</td>
                        <td>Works With</td>
                        <td>ACC-CC-003</td>
                        <td>Fast charging cable</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// Serial Number Tab
const serialTab = document.getElementById('serial-tab');
if (serialTab) serialTab.innerHTML = `
    <h3>Serial Number Management</h3>
    <p>Manage serial number ranges for this product.</p>
    <div class="serial-container">
        <div class="table-toolbar">
            <button id="btn-add-serial-range" class="btn"><i class="fas fa-plus"></i> Add Serial Range</button>
            <button id="btn-manage-serial-formats" class="btn"><i class="fas fa-cog"></i> Manage Serial Formats</button>
        </div>
        <div class="table-container">
            <table id="serial-table" class="data-table">
                <thead>
                    <tr>
                        <th>Prefix</th>
                        <th>Range Start</th>
                        <th>Range End</th>
                        <th>Production Date</th>
                        <th>Batch</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>SN-</td>
                        <td>10000</td>
                        <td>19999</td>
                        <td>2025-01-15</td>
                        <td>B001</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>SN-</td>
                        <td>20000</td>
                        <td>29999</td>
                        <td>2025-02-20</td>
                        <td>B002</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// IMEI/MAC Tab
const imeiTab = document.getElementById('imei-tab');
if (imeiTab) imeiTab.innerHTML = `
    <h3>IMEI/MAC Management</h3>
    <p>Manage IMEI or MAC addresses for this product.</p>
    <div class="imei-container">
        <div class="table-toolbar">
            <button id="btn-add-identifier" class="btn"><i class="fas fa-plus"></i> Add IMEI/MAC Range</button>
            <button id="btn-manage-identifiers" class="btn"><i class="fas fa-cog"></i> Manage Identifier Types</button>
        </div>
        <div class="table-container">
            <table id="identifier-table" class="data-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Prefix</th>
                        <th>Range Start</th>
                        <th>Range End</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>IMEI</td>
                        <td>35901</td>
                        <td>1234567890</td>
                        <td>1234569999</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>MAC</td>
                        <td>00:1A:2B</td>
                        <td>3C:4D:5E:00:00</td>
                        <td>3C:4D:5E:FF:FF</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// Software Tab
const softwareTab = document.getElementById('software-tab');
if (softwareTab) softwareTab.innerHTML = `
    <h3>Software Management</h3>
    <p>Manage software versions and paths for this product.</p>
    <div class="software-container">
        <div class="table-toolbar">
            <button id="btn-add-software" class="btn"><i class="fas fa-plus"></i> Add Software</button>
            <button id="btn-manage-software-types" class="btn"><i class="fas fa-cog"></i> Manage Software Types</button>
        </div>
        <div class="table-container">
            <table id="software-table" class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Version</th>
                        <th>Type</th>
                        <th>Release Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Main Firmware</td>
                        <td>1.2.3</td>
                        <td>Firmware</td>
                        <td>2025-01-10</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            <button class="btn-icon"><i class="fas fa-download"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Windows Driver</td>
                        <td>2.0.5</td>
                        <td>Driver</td>
                        <td>2025-01-15</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            <button class="btn-icon"><i class="fas fa-download"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Configuration Utility</td>
                        <td>3.1.0</td>
                        <td>Utility</td>
                        <td>2025-02-01</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                            <button class="btn-icon"><i class="fas fa-download"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// Languages Tab
const languagesTab = document.getElementById('languages-tab');
if (languagesTab) languagesTab.innerHTML = `
    <h3>Language Support</h3>
    <p>Manage language support for this product.</p>
    <div class="languages-container">
        <div class="table-toolbar">
            <button id="btn-add-language" class="btn"><i class="fas fa-plus"></i> Add Language</button>
            <button id="btn-manage-languages" class="btn"><i class="fas fa-cog"></i> Manage Languages</button>
        </div>
        <div class="table-container">
            <table id="languages-table" class="data-table">
                <thead>
                    <tr>
                        <th>Language</th>
                        <th>Code</th>
                        <th>Documentation</th>
                        <th>Interface</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>English</td>
                        <td>EN</td>
                        <td>Yes</td>
                        <td>Yes</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>German</td>
                        <td>DE</td>
                        <td>Yes</td>
                        <td>Yes</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>French</td>
                        <td>FR</td>
                        <td>Yes</td>
                        <td>Yes</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// Status Tab
const statusTab = document.getElementById('status-tab');
if (statusTab) statusTab.innerHTML = `
    <h3>Status History</h3>
    <p>Track status changes for this product.</p>
    <div class="status-container">
        <div class="table-toolbar">
            <button id="btn-add-status" class="btn"><i class="fas fa-plus"></i> Add Status</button>
            <button id="btn-manage-statuses" class="btn"><i class="fas fa-cog"></i> Manage Statuses</button>
        </div>
        <div class="table-container">
            <table id="status-table" class="data-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Changed By</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>In Development</td>
                        <td>2024-10-15</td>
                        <td>John Smith</td>
                        <td>Initial development started</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Testing</td>
                        <td>2025-01-10</td>
                        <td>Emma Johnson</td>
                        <td>Entered QA testing phase</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Active</td>
                        <td>2025-02-20</td>
                        <td>Michael Brown</td>
                        <td>Released to production</td>
                        <td>
                            <button class="btn-icon"><i class="fas fa-edit"></i></button>
                            <button class="btn-icon"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
`;
}

// Add CSS for table views
document.head.insertAdjacentHTML('beforeend', `
<style>
.table-toolbar {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
}

.table-toolbar button {
    margin-right: 10px;
}

.table-container {
    width: 100%;
    overflow-x: auto;
    margin-bottom: 20px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
}

.data-table th, .data-table td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

.data-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.data-table tr:hover {
    background-color: #f5f5f5;
}

.data-table .btn-icon {
    padding: 5px 8px;
    margin-right: 5px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #333;
}

.data-table .btn-icon:hover {
    color: #007bff;
}

.data-table .btn-icon .fa-edit {
    color: #2196F3;
}

.data-table .btn-icon .fa-trash {
    color: #f44336;
}

.data-table .btn-icon .fa-download {
    color: #4CAF50;
}
</style>
`);
