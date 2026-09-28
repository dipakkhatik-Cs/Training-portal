// CyberGuard Main Frontend JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log("CyberGuard Portal Frontend Initialized.");
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 400);
        }, 5000);
    });
});
