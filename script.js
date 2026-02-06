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
        // Double click to open
        icon.addEventListener('dblclick', function() {
            const appName = this.querySelector('span').textContent;
            
            // System Preferences
            if (appName.includes('System Preferences')) {
                if (window.SystemPreferences) {
                    window.SystemPreferences.open();
                }
            }
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
        
        // Right click context menu
        icon.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            console.log('Right clicked:', this.querySelector('span').textContent);
        });
    });
}

function initSystem() {
    // Update time
    updateTime();
    setInterval(updateTime, 60000);
    
    // Initialize desktop icons
    initDesktopIcons();
    
    // System keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + , for System Preferences
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            if (window.SystemPreferences) {
                if (!window.SystemPreferences.isOpen) {
                    window.SystemPreferences.open();
                } else {
                    window.SystemPreferences.bringToFront();
                }
            }
        }
        
        // Cmd/Ctrl + Space for Spotlight (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
            e.preventDefault();
            console.log('Spotlight search activated');
        }
    });
    
    console.log('macOS Web Emulator initialized');
}

document.addEventListener('DOMContentLoaded', initSystem);