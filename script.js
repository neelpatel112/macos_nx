function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

function initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop .icon');
    
    icons.forEach(icon => {
        icon.addEventListener('dblclick', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                alert(`Opening ${this.querySelector('span').textContent}`);
            }, 100);
        });
        
        icon.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            console.log('Right clicked:', this.querySelector('span').textContent);
        });
    });
}

function initSystem() {
    updateTime();
    setInterval(updateTime, 60000);
    
    initDesktopIcons();
    
    // Initialize Window Manager
    if (window.WindowManager) {
        console.log('Window Manager loaded');
    }
    
    // Initialize System Preferences
    if (window.SystemPreferences) {
        console.log('System Preferences loaded');
    }
    
    // Global shortcut for System Preferences
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + Space for Spotlight (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
            e.preventDefault();
            console.log('Spotlight search activated');
        }
        
        // Cmd/Ctrl + , for System Preferences
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            if (window.SystemPreferences && !window.SystemPreferences.isOpen) {
                window.SystemPreferences.open();
            }
        }
    });
    
    console.log('macOS Web Emulator fully initialized');
}

document.addEventListener('DOMContentLoaded', initSystem);