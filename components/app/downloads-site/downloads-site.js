// Downloads Site JavaScript
// Functionality for download tracking, file size checks, etc.

document.addEventListener('DOMContentLoaded', function() {
    // Add download tracking
    const downloadButtons = document.querySelectorAll('.download-button');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const fileName = this.href.split('/').pop();
            
            // Optional: Add download analytics tracking here
            console.log(`Download started: ${fileName}`);
            
            // Optional: Show download notification
            showDownloadNotification(fileName);
        });
    });
});

function showDownloadNotification(fileName) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg class="icon">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#download"></use>
            </svg>
            <span>Download gestartet: ${fileName}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success, #28a745);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
