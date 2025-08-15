// cancellation-page.js - JavaScript for membership cancellation functionality

/**
 * Initialize cancellation page functionality
 * @function InitCancellationPage
 */
function InitCancellationPage() {
    const cancellationForm = document.getElementById('cancellationForm');
    const cancellationDateInput = document.getElementById('cancellationDate');
    
    // Only initialize if elements exist (page-specific functionality)
    if (!cancellationForm) return;
    
    // Set minimum date to today
    if (cancellationDateInput) {
        cancellationDateInput.min = new Date().toISOString().split('T')[0];
    }
    
    // Form submission handler
    cancellationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = cancellationForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#dc267f';
            } else {
                field.style.borderColor = '#e0e0e0';
            }
        });
        
        if (!isValid) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }
        
        // Here would normally be the form processing
        alert('Vielen Dank für Ihre Kündigung. Sie erhalten in Kürze eine Bestätigung per E-Mail.');
        
        // Reset form
        cancellationForm.reset();
        
        // Reset date minimum
        if (cancellationDateInput) {
            cancellationDateInput.min = new Date().toISOString().split('T')[0];
        }
    });
    
    // Real-time validation for email field
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#dc267f';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
    }
    
    // Clear validation styling on input
    const allInputs = cancellationForm.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderColor = '#e0e0e0';
        });
    });
}

export default InitCancellationPage;
