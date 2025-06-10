// PIM System - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding tab pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Image upload functionality
    const imagePreview = document.getElementById('image-preview');
    const uploadButton = document.getElementById('btn-upload-image');
    const fileInput = document.getElementById('product-image');

    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Product Image" style="max-width: 100%; max-height: 100%;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Drag and drop for image upload
    if (imagePreview) {
        imagePreview.addEventListener('dragover', (e) => {
            e.preventDefault();
            imagePreview.style.borderColor = 'var(--primary-color)';
        });

        imagePreview.addEventListener('dragleave', () => {
            imagePreview.style.borderColor = 'var(--border-color)';
        });

        imagePreview.addEventListener('drop', (e) => {
            e.preventDefault();
            imagePreview.style.borderColor = 'var(--border-color)';

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                fileInput.files = e.dataTransfer.files;
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Product Image" style="max-width: 100%; max-height: 100%;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Modal functionality
    const modal = document.getElementById('add-item-modal');
    const addPackageItemBtn = document.getElementById('btn-add-package-item');
    const addPropertyBtn = document.getElementById('btn-add-property');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('btn-cancel-add');
    const confirmBtn = document.getElementById('btn-confirm-add');

    function openModal() {
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    if (addPackageItemBtn) {
        addPackageItemBtn.addEventListener('click', openModal);
    }
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', openModal);
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Add new package item
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const itemName = document.getElementById('item-name').value;
            const itemQuantity = document.getElementById('item-quantity').value;

            if (itemName && itemQuantity) {
                const packageTable = document.getElementById('package-table').getElementsByTagName('tbody')[0];
                const newRow = packageTable.insertRow();

                newRow.innerHTML = `
                    <td>${itemName}</td>
                    <td>${itemQuantity}</td>
                    <td>
                        <button class="btn-icon"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon"><i class="fas fa-trash"></i></button>
                    </td>
                `;

                // Clear form and close modal
                document.getElementById('item-name').value = '';
                document.getElementById('item-quantity').value = '1';
                closeModal();

                // Update progress
                updateProgress();
            }
        });
    }

    // Dynamic field addition for Packaging Logistics
    const addPackagingFieldBtn = document.getElementById('btn-add-packaging-field');
    const dynamicFieldsContainer = document.querySelector('.dynamic-fields');

    if (addPackagingFieldBtn && dynamicFieldsContainer) {
        addPackagingFieldBtn.addEventListener('click', () => {
            const fieldName = prompt('Enter field name:');
            if (fieldName) {
                const fieldId = 'field-' + fieldName.toLowerCase().replace(/\s+/g, '-');

                const fieldDiv = document.createElement('div');
                fieldDiv.className = 'form-group';
                fieldDiv.innerHTML = `
                    <label for="${fieldId}">${fieldName}:</label>
                    <input type="text" id="${fieldId}" name="${fieldId}">
                `;

                dynamicFieldsContainer.appendChild(fieldDiv);

                // Update progress
                updateProgress();
            }
        });
    }

    // Progress bar functionality
    function updateProgress() {
        const totalFields = document.querySelectorAll('input, select, textarea').length;
        const filledFields = Array.from(document.querySelectorAll('input, select, textarea'))
            .filter(field => field.value.trim() !== '').length;

        const percentage = Math.round((filledFields / totalFields) * 100);

        document.getElementById('completion-percentage').textContent = percentage + '%';
        document.querySelector('.progress-fill').style.width = percentage + '%';
    }

    // Initialize progress
    updateProgress();

    // Add event listeners to all input fields to update progress
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('change', updateProgress);
        field.addEventListener('input', updateProgress);
    });

    // CRUD operations
    const saveBtn = document.getElementById('btn-save');
    const clearBtn = document.getElementById('btn-clear');
    const lastRecordBtn = document.getElementById('btn-last');
    const updateBtn = document.getElementById('btn-update');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');

    // Save button
    saveBtn.addEventListener('click', () => {
        alert('Product data saved successfully!');
        updateProgress();
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all fields?')) {
            document.querySelectorAll('input, select, textarea').forEach(field => {
                field.value = '';
            });
            imagePreview.innerHTML = `
                <div class="placeholder-text">
                    <p>"Picture of model"</p>
                    <p>Insert an image here</p>
                    <p>preferably drag and drop</p>
                </div>
            `;
            updateProgress();
        }
    });

    // Last record button
    lastRecordBtn.addEventListener('click', () => {
        alert('Last record loaded!');
    });

    // Update button
    updateBtn.addEventListener('click', () => {
        alert('Data updated successfully!');
    });

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        alert('Previous record loaded!');
    });

    nextBtn.addEventListener('click', () => {
        alert('Next record loaded!');
    });

    // Search functionality
    const searchBtn = document.getElementById('btn-search');
    const globalSearch = document.getElementById('global-search');

    searchBtn.addEventListener('click', () => {
        const searchTerm = globalSearch.value.trim();
        if (searchTerm) {
            alert(`Searching for: ${searchTerm}`);
        } else {
            alert('Please enter a search term');
        }
    });

    // Field-specific search buttons
    document.querySelectorAll('.field-search-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = e.target.closest('.input-with-search').querySelector('input, select');
            const fieldName = input.closest('.form-group').querySelector('label').textContent;
            const searchTerm = input.value.trim();

            if (searchTerm) {
                alert(`Searching for ${fieldName} ${searchTerm}`);
            } else {
                alert(`Please enter a search term for ${fieldName}`);
            }
        });
    });

    // Show warning for duplicate SKU (demo purpose)
    const modelInput = document.getElementById('model');
    modelInput.addEventListener('input', () => {
        const warning = document.querySelector('.field-warning');
        if (modelInput.value.trim() === 'ABC123') {
            warning.style.display = 'block';
        } else {
            warning.style.display = 'none';
        }
    });
});
