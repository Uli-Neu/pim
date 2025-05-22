/**
 * PIM System - Progress Calculator
 * Calculates completion percentage based on filled fields
 */

class ProgressCalculator {
    constructor() {
        this.totalFields = 0;
        this.filledFields = 0;
        this.fieldSelectors = [
            // Main form fields
            '#model-input',
            '#sku-input',
            '#ean-input',
            '#category-select',
            '#status-select',
            
            // Package contents (count items)
            '#package-contents-table tbody tr',
            
            // Properties tab
            '#properties-table tbody tr',
            
            // Languages tab
            '#languages-table tbody tr',
            
            // Status tab
            '#status-table tbody tr',
            
            // Packaging tab
            '#packaging-logistics-table tbody tr',
            
            // Address tab
            '#address-table tbody tr',
            
            // Category tab
            '#category-table tbody tr',
            
            // Compatible tab
            '#compatible-table tbody tr',
            
            // Serial tab
            '#serial-table tbody tr',
            
            // IMEI/MAC tab
            '#imei-mac-table tbody tr',
            
            // Software tab
            '#software-table tbody tr',
            
            // Manuals tab
            '#manuals-table tbody tr',
            
            // Accessories tab
            '#accessories-table tbody tr'
        ];
    }
    
    /**
     * Calculate the completion percentage
     * @returns {number} Percentage of filled fields
     */
    calculateCompletion() {
        this.countFields();
        
        if (this.totalFields === 0) {
            return 0;
        }
        
        return Math.round((this.filledFields / this.totalFields) * 100);
    }
    
    /**
     * Count total and filled fields
     */
    countFields() {
        this.totalFields = 0;
        this.filledFields = 0;
        
        // Count main form fields
        const mainFormFields = ['#model-input', '#sku-input', '#ean-input', '#category-select', '#status-select'];
        mainFormFields.forEach(selector => {
            const field = document.querySelector(selector);
            if (field) {
                this.totalFields++;
                if (field.value && field.value.trim() !== '') {
                    this.filledFields++;
                }
            }
        });
        
        // Count image
        this.totalFields++;
        if (document.querySelector('.image-placeholder img')) {
            this.filledFields++;
        }
        
        // Count table rows in all tabs
        const tableSelectors = [
            '#package-contents-table tbody tr',
            '#properties-table tbody tr',
            '#languages-table tbody tr',
            '#status-table tbody tr',
            '#packaging-logistics-table tbody tr',
            '#address-table tbody tr',
            '#category-table tbody tr',
            '#compatible-table tbody tr',
            '#serial-table tbody tr',
            '#imei-mac-table tbody tr',
            '#software-table tbody tr',
            '#manuals-table tbody tr',
            '#accessories-table tbody tr'
        ];
        
        tableSelectors.forEach(selector => {
            const rows = document.querySelectorAll(selector);
            // Each table should have at least one row
            this.totalFields++;
            
            if (rows.length > 0) {
                this.filledFields++;
            }
        });
    }
    
    /**
     * Update the progress bar in the UI
     */
    updateProgressBar() {
        const percentage = this.calculateCompletion();
        const progressBar = document.querySelector('.progress-bar');
        const percentageText = document.querySelector('.completion-text');
        
        if (progressBar && percentageText) {
            progressBar.style.width = `${percentage}%`;
            percentageText.textContent = `${percentage}%`;
        }
    }
}

// Initialize and export
const progressCalculator = new ProgressCalculator();
