// member-site.js - JavaScript für das digitale Mitgliedsformular

document.addEventListener('DOMContentLoaded', function() {
    const membershipForm = document.getElementById('membershipForm');
    const submitBtn = document.querySelector('.submit-btn');
    const resetBtn = document.querySelector('.reset-btn');
    
    if (!membershipForm) return;

    // Formular-Validierung
    function validateForm() {
        const requiredFields = membershipForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // E-Mail Validierung
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value && !emailRegex.test(email.value)) {
            isValid = false;
            email.classList.add('error');
        }
        
        // Datum Validierung (nicht in der Zukunft)
        const geburtsdatum = document.getElementById('geburtsdatum');
        if (geburtsdatum.value) {
            const selectedDate = new Date(geburtsdatum.value);
            const today = new Date();
            if (selectedDate > today) {
                isValid = false;
                geburtsdatum.classList.add('error');
            }
        }
        
        return isValid;
    }

    // Live-Validierung bei Eingabe
    membershipForm.addEventListener('input', function(e) {
        if (e.target.hasAttribute('required')) {
            if (e.target.value.trim()) {
                e.target.classList.remove('error');
            }
        }
    });

    // Formular senden
    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Bitte füllen Sie alle Pflichtfelder korrekt aus.');
            return;
        }
        
        // Loading-State aktivieren
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet...';
        
        // Formulardaten sammeln
        const formData = new FormData(membershipForm);
        
        // Hier würde normalerweise die Daten an einen Server gesendet werden
        // Für die Demo simulieren wir eine erfolgreiche Übertragung
        setTimeout(() => {
            showSuccessMessage();
            membershipForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Mitgliedsantrag senden';
        }, 2000);
    });

    // Erfolgs-Message anzeigen
    function showSuccessMessage() {
        // Erstelle Success-Overlay
        const successOverlay = document.createElement('div');
        successOverlay.className = 'success-overlay';
        successOverlay.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h3>Antrag erfolgreich gesendet!</h3>
                <p>Vielen Dank für Ihren Mitgliedsantrag. Wir werden Ihre Daten prüfen und uns innerhalb von 2-3 Werktagen bei Ihnen melden.</p>
                <button class="success-close">Schließen</button>
            </div>
        `;
        
        document.body.appendChild(successOverlay);
        
        // CSS für Success-Overlay hinzufügen (falls nicht im SCSS vorhanden)
        if (!document.querySelector('#success-overlay-styles')) {
            const style = document.createElement('style');
            style.id = 'success-overlay-styles';
            style.textContent = `
                .success-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }
                
                .success-content {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    text-align: center;
                    max-width: 500px;
                    margin: 20px;
                    animation: slideIn 0.3s ease;
                }
                
                .success-icon {
                    width: 80px;
                    height: 80px;
                    background: #28a745;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin: 0 auto 20px auto;
                }
                
                .success-content h3 {
                    color: #0e79bf;
                    margin-bottom: 15px;
                    font-size: 1.5rem;
                }
                
                .success-content p {
                    color: #666;
                    margin-bottom: 25px;
                    line-height: 1.6;
                }
                
                .success-close {
                    background: #0e79bf;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .success-close:hover {
                    background: #005fa3;
                    transform: translateY(-2px);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Close-Handler
        successOverlay.querySelector('.success-close').addEventListener('click', () => {
            successOverlay.remove();
        });
        
        // Click outside to close
        successOverlay.addEventListener('click', (e) => {
            if (e.target === successOverlay) {
                successOverlay.remove();
            }
        });
    }

    // Reset-Button
    resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Möchten Sie wirklich alle Eingaben löschen?')) {
            membershipForm.reset();
            // Alle Error-Klassen entfernen
            membershipForm.querySelectorAll('.error').forEach(field => {
                field.classList.remove('error');
            });
        }
    });

    // PLZ-basierte Ortserkennung (vereinfacht)
    const plzField = document.getElementById('plz');
    const ortField = document.getElementById('ort');
    
    plzField.addEventListener('blur', function() {
        const plz = this.value.trim();
        
        // Einfache PLZ-Ort-Zuordnung für die Region
        const plzOrt = {
            '03172': 'Guben',
            '03159': 'Döbern',
            '03205': 'Calau',
            '03222': 'Lübbenau',
            '03149': 'Forst',
            // Weitere PLZ können hier hinzugefügt werden
        };
        
        if (plzOrt[plz] && !ortField.value) {
            ortField.value = plzOrt[plz];
        }
    });

    // Mitgliedschaftsoptionen Styling
    const membershipOptions = document.querySelectorAll('.membership-option');
    membershipOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Alle anderen Optionen deselektieren (visuell)
            membershipOptions.forEach(opt => opt.classList.remove('selected'));
            // Diese Option als ausgewählt markieren
            this.classList.add('selected');
        });
    });

    // Datum-Felder mit vernünftigen Defaults
    const aufnahmeDatum = document.getElementById('aufnahme-datum');
    if (aufnahmeDatum) {
        // Standard auf nächsten Monatsersten setzen
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        aufnahmeDatum.value = nextMonth.toISOString().split('T')[0];
        aufnahmeDatum.min = today.toISOString().split('T')[0];
    }

    // Geburtsdatum Maximum auf heute setzen
    const geburtsdatum = document.getElementById('geburtsdatum');
    if (geburtsdatum) {
        const today = new Date();
        geburtsdatum.max = today.toISOString().split('T')[0];
    }
});
